/**
 * /api/ask — Vector RAG streaming endpoint
 *
 * Flow:
 *  1. Receive { messages, section } from the useChat hook
 *  2. Extract the latest user question
 *  3. Embed the question with OpenAI text-embedding-3-small
 *  4. Run cosine similarity search against pre-computed embeddings in SQLite
 *  5. Inject top-5 retrieved chunks as context into the system prompt
 *  6. Stream the response via Vercel AI SDK + OpenAI gpt-4o-mini
 *
 * Runtime: Node.js (required for better-sqlite3 native bindings)
 */

import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import OpenAI from 'openai'
import { searchByVector } from '@/lib/db'
import { type CoreMessage } from 'ai'

export const runtime = 'nodejs'

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ---- Allowed origins ----
// NEXT_PUBLIC_SITE_URL should be set in the Vercel dashboard (e.g. https://yoursite.com).
// Same-origin browser requests don't send an Origin header, so we only block
// requests that explicitly carry an Origin from an unknown domain.
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean) as string[]

function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true // same-origin browser requests omit the header
  return ALLOWED_ORIGINS.includes(origin)
}

// ---- System prompt ----
const SYSTEM_PROMPT = `
You are Chibu's delightfully charming AI assistant on Chibuzor Ojukwu's portfolio website.
Chibuzor (everyone calls him Chibu) is a Senior Backend Engineer with 7+ years of experience.

Your personality:
- Warm, confident, and occasionally witty — you might drop a well-timed tech pun
- Speak naturally, like a knowledgeable friend who knows Chibu really well
- Keep answers concise (2–4 short paragraphs max) — recruiters are busy people!
- Always anchor your responses in the factual context provided below
- If asked something outside your context, be honest: "That's not in my knowledge base, but here's what I do know..."
- If a recruiter asks about availability or hiring: "P.S. Chibu is actively exploring new senior engineering opportunities! 🚀"
- Occasionally surface an impressive specific metric (e.g. 50K events/sec, $15K/month savings)

Important: Never fabricate specific numbers, companies, or dates not found in the retrieved context.
`.trim()

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json()
    const messages: CoreMessage[] = body.messages

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Extract the latest user question
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
    const question =
      typeof lastUserMessage?.content === 'string' ? lastUserMessage.content : ''

    if (!question || question.length > 600) {
      return new Response(JSON.stringify({ error: 'Invalid question' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // ---- Step 1: Embed the question ----
    const embedResponse = await openaiClient.embeddings.create({
      model: 'text-embedding-3-small',
      input: question,
      dimensions: 1536,
    })
    const queryVector = new Float32Array(embedResponse.data[0].embedding)

    // ---- Step 2: Vector similarity search (always global) ----
    // With vector search, cosine similarity handles relevance naturally.
    // Section filtering is not needed — the closest chunks will always be the
    // right ones regardless of which section the user is currently browsing.
    const docs = searchByVector(queryVector, undefined, 5)

    const retrievedContext =
      docs.length > 0
        ? docs
            .map(d => `[${d.section.toUpperCase()}] ${d.title}\n${d.content}`)
            .join('\n\n---\n\n')
        : 'No specific context found — answer from general knowledge about the portfolio.'

    const systemWithContext = `${SYSTEM_PROMPT}\n\n---\nRETRIEVED CONTEXT:\n${retrievedContext}\n---`

    // ---- Step 3: Stream response ----
    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: systemWithContext,
      messages,
      maxTokens: 600,
      temperature: 0.75,
    })

    return result.toDataStreamResponse()
  } catch (err) {
    console.error('[/api/ask] Error:', err)
    return new Response(
      JSON.stringify({ error: 'Something went wrong. The AI had a brief existential crisis.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

