import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Prevent bundling of native modules — let Node.js require() them at runtime
  serverExternalPackages: ['better-sqlite3'],

  // Ensure the SQLite database file is included in Vercel's serverless function bundle
  outputFileTracingIncludes: {
    '/api/ask': ['./data/**'],
  },
}

export default nextConfig
