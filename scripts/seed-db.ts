/**
 * Seed Script — semantic chunking + vector embedding pipeline
 *
 * Reads knowledge-base.md, splits it into semantic chunks, embeds each chunk
 * using OpenAI text-embedding-3-small, and stores everything in a JSON file.
 *
 * Run:  npm run seed
 * Auto: runs as "prebuild" but skips if data/embeddings.json already exists
 *       (so Vercel uses the committed file without calling OpenAI at build time).
 *
 * Requires OPENAI_API_KEY in .env.local (or environment).
 */

import path from 'path'
import fs from 'fs'
import OpenAI from 'openai'

// Load .env.local manually (tsx doesn't auto-load it)
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length && !key.startsWith('#')) {
      process.env[key.trim()] = rest.join('=').trim()
    }
  }
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const DATA_DIR = path.join(process.cwd(), 'data')
const JSON_PATH = path.join(DATA_DIR, 'embeddings.json')
const KB_PATH = path.join(process.cwd(), 'knowledge-base.md')

const EMBED_MODEL = 'text-embedding-3-small'
const EMBED_DIMS = 1536

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

// Skip if already seeded — lets Vercel use the committed file without
// needing OPENAI_API_KEY at build time.
if (fs.existsSync(JSON_PATH)) {
  const existing = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8')) as unknown[]
  console.log(`✅  ${existing.length} chunks already in embeddings.json — skipping seed.`)
  process.exit(0)
}

// ---- Semantic chunker ----
const MAX_CHARS = 1200

interface Chunk {
  section: string
  title: string
  content: string
}

function chunkMarkdown(markdown: string): Chunk[] {
  const chunks: Chunk[] = []

  // Split on ## or ### headings
  const sections = markdown.split(/\n(?=#{1,3} )/)

  for (const raw of sections) {
    const lines = raw.trim().split('\n')
    const headingLine = lines[0] ?? ''
    const body = lines.slice(1).join('\n').trim()

    const headingMatch = headingLine.match(/^#{1,3}\s+(.+)/)
    if (!headingMatch) continue

    const heading = headingMatch[1].trim()
    const sectionLabel = deriveSection(heading)
    const fullChunk = `${heading}\n\n${body}`

    if (fullChunk.length <= MAX_CHARS) {
      chunks.push({ section: sectionLabel, title: heading, content: fullChunk })
    } else {
      const paragraphs = body.split(/\n\n+/)
      let buffer = heading + '\n\n'

      for (const para of paragraphs) {
        if ((buffer + para).length > MAX_CHARS && buffer.trim() !== heading) {
          chunks.push({ section: sectionLabel, title: heading, content: buffer.trim() })
          buffer = heading + ' (continued)\n\n'
        }
        buffer += para + '\n\n'
      }
      if (buffer.trim()) {
        chunks.push({ section: sectionLabel, title: heading, content: buffer.trim() })
      }
    }
  }

  return chunks
}

function deriveSection(heading: string): string {
  const h = heading.toLowerCase()
  if (h.includes('background') || h.includes('origin') || h.includes('personal')) return 'background'
  if (h.includes('why backend') || h.includes('infrastructure')) return 'background'
  if (h.includes('tizeti')) return 'experience'
  if (h.includes('stubenefits')) return 'experience'
  if (h.includes('outlier')) return 'experience'
  if (h.includes('mindera')) return 'experience'
  if (h.includes('startup') || h.includes('co-found')) return 'projects'
  if (h.includes('ai') || h.includes('llm') || h.includes('pivot')) return 'ai'
  if (h.includes('philosophy') || h.includes('working style')) return 'about'
  if (h.includes('looking') || h.includes('next')) return 'contact'
  if (h.includes('skills') || h.includes('quick reference')) return 'skills'
  if (h.includes('quick facts') || h.includes('contact')) return 'contact'
  if (h.includes('career')) return 'experience'
  return 'about'
}

// ---- Embed a batch of texts ----
async function embedBatch(texts: string[]): Promise<Float32Array[]> {
  const response = await openai.embeddings.create({
    model: EMBED_MODEL,
    input: texts,
    dimensions: EMBED_DIMS,
  })
  return response.data
    .sort((a, b) => a.index - b.index)
    .map(item => new Float32Array(item.embedding))
}

// ---- Main ----
async function main() {
  console.log('📖  Reading knowledge-base.md...')
  const markdown = fs.readFileSync(KB_PATH, 'utf-8')

  console.log('✂️   Chunking into semantic segments...')
  const chunks = chunkMarkdown(markdown)
  console.log(`    → ${chunks.length} chunks`)

  console.log(`🔢  Embedding with ${EMBED_MODEL}...`)

  const BATCH = 50
  const allEmbeddings: Float32Array[] = []

  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH)
    const texts = batch.map(c => `${c.title}\n\n${c.content}`)
    const embeddings = await embedBatch(texts)
    allEmbeddings.push(...embeddings)
    process.stdout.write(`    → embedded ${Math.min(i + BATCH, chunks.length)}/${chunks.length}\r`)
  }
  console.log()

  console.log('💾  Writing embeddings.json...')
  const documents = chunks.map((chunk, i) => ({
    id: i + 1,
    section: chunk.section,
    title: chunk.title,
    content: chunk.content,
    embedding: Array.from(allEmbeddings[i]),
  }))

  fs.writeFileSync(JSON_PATH, JSON.stringify(documents))
  console.log(`✅  Saved ${documents.length} chunks to ${JSON_PATH}`)
}

main().catch(err => {
  console.error('❌  Seed failed:', err.message)
  process.exit(1)
})
