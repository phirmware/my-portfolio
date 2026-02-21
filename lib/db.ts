/**
 * Vector RAG retrieval module
 *
 * Loads pre-computed embeddings from data/embeddings.json and finds the top-k
 * most semantically similar chunks using cosine similarity.
 *
 * No native addons — works anywhere Node.js runs (Vercel, local, etc.)
 */

import path from 'path'
import fs from 'fs'

export interface Document {
  id: number
  section: string
  title: string
  content: string
}

interface CachedRow {
  id: number
  section: string
  title: string
  content: string
  vector: Float32Array
}

let _cache: CachedRow[] | null = null

function getCache(): CachedRow[] {
  if (_cache) return _cache

  const jsonPath = process.env.DB_PATH ?? path.join(process.cwd(), 'data', 'embeddings.json')
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as Array<{
    id: number
    section: string
    title: string
    content: string
    embedding: number[]
  }>

  _cache = raw.map(row => ({
    id: row.id,
    section: row.section,
    title: row.title,
    content: row.content,
    vector: new Float32Array(row.embedding),
  }))

  return _cache
}

function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

/**
 * Finds the top-k most semantically similar chunks to the given query vector.
 */
export function searchByVector(
  queryVector: Float32Array,
  section?: string,
  topK = 5
): Document[] {
  const rows = getCache()

  return rows
    .filter(row => !section || section === 'all' || row.section === section)
    .map(row => ({ row, score: cosineSimilarity(queryVector, row.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(({ row }) => ({
      id: row.id,
      section: row.section,
      title: row.title,
      content: row.content,
    }))
}
