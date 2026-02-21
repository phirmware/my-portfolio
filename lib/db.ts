/**
 * Vector RAG retrieval module
 *
 * Loads pre-computed embeddings from SQLite and finds the top-k most
 * semantically similar chunks to a query vector using cosine similarity.
 *
 * Why in-process cosine similarity instead of a vector extension?
 *  - No native SQLite extensions to compile/install (works on Vercel out of the box)
 *  - The portfolio database is small (<100 chunks) so a full scan is ~1ms
 *  - Embeddings are loaded once and cached in the module for the lifetime
 *    of the serverless container (warm invocations are free)
 */

import Database from 'better-sqlite3'
import path from 'path'

export interface Document {
  id: number
  section: string
  title: string
  content: string
}

// ---- SQLite connection (singleton, read-only) ----
let _db: ReturnType<typeof Database> | null = null

function getDb() {
  if (!_db) {
    const dbPath = process.env.DB_PATH ?? path.join(process.cwd(), 'data', 'portfolio.db')
    _db = new Database(dbPath, { readonly: true })
  }
  return _db
}

// ---- In-memory embedding cache ----
// Loaded once per cold start, reused across warm invocations
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

  const db = getDb()
  const rows = db
    .prepare('SELECT id, section, title, content, embedding FROM documents')
    .all() as { id: number; section: string; title: string; content: string; embedding: Buffer }[]

  _cache = rows.map(row => ({
    id: row.id,
    section: row.section,
    title: row.title,
    content: row.content,
    // Deserialise BLOB → Float32Array
    vector: new Float32Array(
      row.embedding.buffer,
      row.embedding.byteOffset,
      row.embedding.byteLength / 4
    ),
  }))

  return _cache
}

// ---- Cosine similarity ----
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
 *
 * @param queryVector  - Embedding of the user's question (Float32Array, 1536-dim)
 * @param section      - Optional section filter (e.g. 'experience', 'ai')
 * @param topK         - Number of chunks to return (default 5)
 */
export function searchByVector(
  queryVector: Float32Array,
  section?: string,
  topK = 5
): Document[] {
  const rows = getCache()

  const scored = rows
    .filter(row => !section || section === 'all' || row.section === section)
    .map(row => ({ row, score: cosineSimilarity(queryVector, row.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)

  return scored.map(({ row }) => ({
    id: row.id,
    section: row.section,
    title: row.title,
    content: row.content,
  }))
}
