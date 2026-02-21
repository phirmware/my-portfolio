import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Ensure the embeddings JSON is included in Vercel's serverless function bundle
  outputFileTracingIncludes: {
    '/api/ask': ['./data/embeddings.json'],
  },
}

export default nextConfig
