'use client'

import { useChat } from 'ai/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Send, Bot, User, X, RotateCcw, MessageCircle, Sparkles } from 'lucide-react'
import { useRateLimit, MAX_QUESTIONS } from '@/hooks/useRateLimit'
import { resumeData } from '@/lib/resume-data'

// ---- Context entry shape ----
interface ContextEntry {
  label: string
  color: string
  questions: [string, string, string]
}

// ---- Static section contexts ----
const SECTION_CONTEXT: Record<string, ContextEntry> = {
  hero: {
    label: 'Home',
    color: '#22d3ee',
    questions: [
      'Give me the 30-second pitch on Chibuzor',
      'Is he available for hire?',
      'What makes him stand out?',
    ],
  },
  about: {
    label: 'About',
    color: '#818cf8',
    questions: [
      'How many years of experience does he have?',
      'What cloud platforms has he worked on?',
      'Tell me about his AI & LLM work',
    ],
  },
  projects: {
    label: 'Projects',
    color: '#a78bfa',
    questions: [
      'What was the Event-Driven Framework for?',
      'Tell me about his open source contributions',
      "What's his most impactful project?",
    ],
  },
  contact: {
    label: 'Contact',
    color: '#34d399',
    questions: [
      'Is he open to new opportunities?',
      'Where is he based?',
      'What kind of roles is he looking for?',
    ],
  },
}

// ---- Dynamically add one entry per company from resume data ----
// Key: "exp-{job.id}" — matches the id="" attributes on each experience card
resumeData.experience.forEach(job => {
  SECTION_CONTEXT[`exp-${job.id}`] = {
    label: job.company,
    color: job.color,
    questions: job.aiQuestions as [string, string, string],
  }
})

interface FloatingAIChatProps {
  isOpen: boolean
  onToggle: () => void
  activeSection: string
  pendingQuestion?: string
  onClearPendingQuestion?: () => void
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-cyan-400"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

function RateLimitedInput({ secondsLeft }: { secondsLeft: number }) {
  const progress = ((60 - secondsLeft) / 60) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 space-y-3 text-center"
    >
      {/* Fun blocked message */}
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl"
      >
        🤖
      </motion.div>
      <p className="text-xs text-slate-400 leading-relaxed">
        <span className="text-white font-semibold">Whoa, easy there!</span> Even AI assistants need
        a breather after {MAX_QUESTIONS} questions. I&apos;ll be back in{' '}
        <span className="text-cyan-400 font-bold tabular-nums">{secondsLeft}s</span> ⏳
      </p>

      {/* Countdown progress bar */}
      <div className="h-1 rounded-full bg-white/8 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'linear' }}
        />
      </div>

      <p className="text-xs text-slate-600">
        Pro tip: use this time to scroll through the projects section 👆
      </p>
    </motion.div>
  )
}

export default function FloatingAIChat({
  isOpen,
  onToggle,
  activeSection,
  pendingQuestion,
  onClearPendingQuestion,
}: FloatingAIChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pendingHandled = useRef(false)

  const { isBlocked, secondsLeft, questionsLeft, increment } = useRateLimit()

  const ctx: ContextEntry = SECTION_CONTEXT[activeSection] ?? SECTION_CONTEXT['hero']

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, setMessages } =
    useChat({
      api: '/api/ask',
      body: { section: activeSection },
    })

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle a pending question piped in from a project card
  useEffect(() => {
    if (pendingQuestion && !pendingHandled.current) {
      pendingHandled.current = true
      setInput(pendingQuestion)
      setTimeout(() => {
        document.getElementById('floating-chat-form')?.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true })
        )
      }, 300)
    }
    if (!pendingQuestion) pendingHandled.current = false
  }, [pendingQuestion, setInput])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && !isBlocked) setTimeout(() => inputRef.current?.focus(), 350)
  }, [isOpen, isBlocked])

  // Wrapped submit — checks rate limit before sending
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isBlocked || !input.trim() || isLoading) return
    increment()
    handleSubmit(e)
  }

  function handleContextQuestion(q: string) {
    if (isBlocked) return
    setInput(q)
    inputRef.current?.focus()
  }

  const unreadCount = messages.filter(m => m.role === 'assistant').length

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      {/* ---- Chat panel ---- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-[calc(100vw-2rem)] max-w-sm sm:max-w-96 rounded-2xl overflow-hidden
                       shadow-2xl shadow-black/50 border border-white/10 flex flex-col"
            style={{
              background: 'rgba(10, 13, 25, 0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              transformOrigin: 'bottom right',
              // Cap height so the panel never overflows the viewport on short phones.
              // dvh accounts for mobile browser chrome (address bar, tab bar).
              maxHeight: 'calc(100dvh - 5rem)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3
                            bg-gradient-to-r from-cyan-500/10 to-violet-500/10
                            border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-sm font-semibold text-white">Chibu AI</span>
                <span className="text-xs text-slate-500 font-mono">· online</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Questions-left indicator */}
                {!isBlocked && (
                  <span className="text-xs text-slate-600 font-mono">
                    {questionsLeft}/{MAX_QUESTIONS} left
                  </span>
                )}
                {messages.length > 0 && (
                  <button
                    onClick={() => {
                      setMessages([])
                      onClearPendingQuestion?.()
                      pendingHandled.current = false
                    }}
                    className="p-1 text-slate-600 hover:text-slate-400 transition-colors"
                    title="Reset chat"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={onToggle}
                  className="p-1 text-slate-600 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Section context bar — updates as user scrolls/browses */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="px-4 py-3 border-b border-white/5 space-y-2"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" style={{ color: ctx.color }} />
                  <span className="text-xs font-mono text-slate-500">
                    Browsing:{' '}
                    <span className="font-semibold" style={{ color: ctx.color }}>
                      {ctx.label}
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ctx.questions.map(q => (
                    <button
                      key={q}
                      onClick={() => handleContextQuestion(q)}
                      disabled={isBlocked}
                      className="px-2.5 py-1 text-xs rounded-full border transition-all duration-150
                                 bg-white/3 text-slate-400 hover:text-white hover:bg-white/8
                                 disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ borderColor: `${ctx.color}30` }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Messages — flex-1 + min-h-0 lets this shrink when the panel hits
                its max-height, keeping the input always visible at the bottom.
                overscroll-contain stops the page from scrolling when the chat
                reaches the top/bottom of its own scroll on mobile. */}
            <div
              className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3"
              style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
            >
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full gap-2 text-center"
                >
                  <Bot className="w-8 h-8 text-slate-700" />
                  <p className="text-xs text-slate-600 leading-relaxed max-w-[220px]">
                    Ask me anything about Chibuzor — background, projects, skills, or just say hi!
                  </p>
                </motion.div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((message, idx) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex items-end gap-2 ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-violet-500 to-indigo-600'
                          : 'bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-400/30'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-cyan-400" />
                      )}
                    </div>
                    <div
                      className={`max-w-[78%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-cyan-600 to-violet-600 text-white rounded-br-sm'
                          : 'bg-white/5 border border-white/8 text-slate-300 rounded-bl-sm'
                      } ${
                        message.role === 'assistant' && isLoading && idx === messages.length - 1
                          ? 'typing-cursor'
                          : ''
                      }`}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-cyan-400" />
                  </div>
                  <div className="bg-white/5 border border-white/8 rounded-xl rounded-bl-sm">
                    <TypingDots />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area — swaps to rate-limit UI when blocked */}
            <div className="border-t border-white/5">
              <AnimatePresence mode="wait">
                {isBlocked ? (
                  <motion.div
                    key="blocked"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <RateLimitedInput secondsLeft={secondsLeft} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-3"
                  >
                    <form id="floating-chat-form" onSubmit={onSubmit} className="flex items-center gap-2">
                      <input
                        ref={inputRef}
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask something..."
                        disabled={isLoading}
                        className="flex-1 px-3 py-2 rounded-xl text-xs
                                   bg-white/5 border border-white/8 text-white placeholder-slate-600
                                   focus:outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/15
                                   disabled:opacity-50 transition-colors"
                        maxLength={500}
                      />
                      <motion.button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white
                                   disabled:opacity-40 disabled:cursor-not-allowed
                                   hover:from-cyan-400 hover:to-violet-500 transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Send className="w-3.5 h-3.5" />
                      </motion.button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Floating toggle button ---- */}
      <motion.button
        onClick={onToggle}
        className="relative w-14 h-14 rounded-full flex items-center justify-center
                   bg-gradient-to-br from-cyan-500 to-violet-600
                   shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50
                   transition-shadow duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread response badge */}
        {!isOpen && unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-400 text-slate-900
                       text-xs font-bold flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}

        {/* Pulse ring when closed */}
        {!isOpen && (
          <motion.span
            className="absolute inset-0 rounded-full bg-violet-500/40"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.button>
    </div>
  )
}
