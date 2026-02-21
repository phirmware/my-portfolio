# Chibuzor Ojukwu — Portfolio

A visually stunning, AI-powered one-page portfolio built with **Next.js 15**, **Tailwind CSS**, **Framer Motion**, and a **RAG-powered AI assistant** backed by SQLite FTS5.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set your Anthropic API key
cp .env.example .env.local
# Edit .env.local and add: ANTHROPIC_API_KEY=your_key_here

# 3. Seed the database (auto-runs on build too)
npm run seed

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push this repo to GitHub (include `data/portfolio.db` — it's the knowledge base)
2. Import the repo in [vercel.com](https://vercel.com)
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy — the `prebuild` script regenerates the database automatically on Vercel

## How the AI Works

```
User question
     ↓
FTS5 search on portfolio.db (SQLite full-text search)
     ↓
Top 5 relevant chunks retrieved as context
     ↓
Claude claude-3-5-haiku-20241022 generates a streamed response
     ↓
Real-time streaming displayed in the chat UI
```

## Project Structure

```
app/
  layout.tsx          Root layout with ThemeProvider
  page.tsx            Main page — coordinates section → AI chat state
  globals.css         Global styles, CSS variables, animations
  api/ask/route.ts    Streaming RAG endpoint (Node.js runtime)

components/
  NavBar.tsx          Sticky nav with scroll-aware blur + mobile menu
  Hero.tsx            Full-viewport hero with animated orbs + typewriter
  About.tsx           Bio, skills grid, experience timeline
  Projects.tsx        Project cards with hover AI-question overlays
  AIChat.tsx          Streaming chat interface with suggested questions
  Contact.tsx         Contact links + footer
  ThemeToggle.tsx     Dark/light mode toggle

lib/
  resume-data.ts      Single source of truth for all portfolio content
  db.ts               SQLite RAG retrieval (FTS5 full-text search)

scripts/
  seed-db.ts          Populates data/portfolio.db from resume-data.ts

data/
  portfolio.db        Pre-seeded SQLite database (committed to git)
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Required. Get from [console.anthropic.com](https://console.anthropic.com) |
| `DB_PATH` | Optional. Defaults to `./data/portfolio.db` |
