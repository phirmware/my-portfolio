'use client'

import { useCallback, useState } from 'react'
import NavBar from '@/components/NavBar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import FloatingAIChat from '@/components/FloatingAIChat'
import { useActiveSection } from '@/hooks/useActiveSection'

// Includes both top-level section IDs and individual experience card IDs.
// IntersectionObserver picks whichever element is most visible — small cards
// naturally win over large sections when fully in view (ratio closer to 1.0).
const SECTION_IDS = [
  'hero',
  'about',
  'projects',
  'contact',
  'exp-mindera',
  'exp-outlier',
  'exp-stubenefits',
  'exp-tizeti',
]

export default function Home() {
  const [aiOpen, setAiOpen] = useState(true)
  const [pendingQuestion, setPendingQuestion] = useState<string | undefined>()

  // Tracks the section currently most visible in the viewport —
  // works via IntersectionObserver so it works on mobile (no mouse needed)
  const activeSection = useActiveSection(SECTION_IDS, 'hero')

  // Section param is ignored — FloatingAIChat tracks section via IntersectionObserver
  const handleAskQuestion = useCallback((question: string, _section?: string) => {
    setPendingQuestion(question)
    setAiOpen(true)
  }, [])

  const handleOpenChat = useCallback(() => setAiOpen(true), [])

  return (
    <main className="min-h-screen bg-[#080b14] dark:bg-[#080b14] bg-slate-50 transition-colors duration-500">
      <NavBar onOpenChat={handleOpenChat} />

      <Hero onOpenChat={handleOpenChat} />

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <About />

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <Projects onAskQuestion={handleAskQuestion} />

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <Contact />

      {/* Floating AI chat — always visible, section-aware via IntersectionObserver */}
      <FloatingAIChat
        isOpen={aiOpen}
        onToggle={() => setAiOpen(o => !o)}
        activeSection={activeSection}
        pendingQuestion={pendingQuestion}
        onClearPendingQuestion={() => setPendingQuestion(undefined)}
      />
    </main>
  )
}
