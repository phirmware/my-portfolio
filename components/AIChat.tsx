'use client'

import { useChat } from 'ai/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Send, Bot, User, Sparkles, RotateCcw } from 'lucide-react'

const SUGGESTED_QUESTIONS = [
  "What's Chibuzor's background?",
  'Tell me a fun fact about his work experience',
  'What makes him stand out as a backend engineer?',
  'What AWS services has he worked with?',
  'Tell me about his AI/LLM experience',
  'What was his biggest technical achievement?',
  "Is he available for hire?",
  'Describe his open source contributions',
]

interface AIChatProps {
  initialQuestion?: string
  activeSection?: string
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

export default function AIChat({ initialQuestion, activeSection }: AIChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [section, setSection] = useState(activeSection ?? 'all')
  const initialized = useRef(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, reload, setMessages } = useChat({
    api: '/api/ask',
    // Pass the active section with every request so the RAG can scope its search
    body: { section },
  })

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle an initial question passed from a project card hover
  useEffect(() => {
    if (initialQuestion && !initialized.current) {
      initialized.current = true
      setInput(initialQuestion)
      // Slight delay to let the component mount and scroll to the section
      setTimeout(() => {
        const form = document.getElementById('ai-chat-form') as HTMLFormElement | null
        form?.requestSubmit()
      }, 400)
    }
  }, [initialQuestion, setInput])

  // Update section context when prop changes
  useEffect(() => {
    if (activeSection) setSection(activeSection)
  }, [activeSection])

  function handleSuggestedQuestion(q: string) {
    setInput(q)
    inputRef.current?.focus()
  }

  return (
    <section id="ai-chat" className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-cyan-400 dark:text-cyan-400 text-cyan-600 uppercase tracking-widest">
            // ai assistant
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Ask Me Anything
          </h2>
          <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-500 max-w-lg mx-auto">
            Powered by RAG — the AI searches my resume and project data to give
            grounded, factual answers with a dash of personality.
          </p>
        </div>

        {/* Suggested questions */}
        <div className="mb-6">
          <p className="text-xs text-slate-500 dark:text-slate-600 font-mono mb-3">
            try asking →
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map(q => (
              <motion.button
                key={q}
                onClick={() => handleSuggestedQuestion(q)}
                className="px-3 py-1.5 text-xs rounded-full border border-white/10 dark:border-white/10 border-slate-200
                           bg-white/3 dark:bg-white/3 bg-slate-50
                           text-slate-500 dark:text-slate-400 text-slate-600
                           hover:border-cyan-400/40 hover:text-cyan-500 dark:hover:text-cyan-400
                           transition-all duration-200"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                {q}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div className="glass-card rounded-2xl overflow-hidden border border-white/8 dark:border-white/8 border-slate-200">
          {/* Chat top bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 dark:border-white/5 border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono text-slate-500 dark:text-slate-500">chibu-ai · online</span>
            </div>
            {messages.length > 0 && (
              <motion.button
                onClick={() => { setMessages([]); initialized.current = false }}
                className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </motion.button>
            )}
          </div>

          {/* Messages */}
          <div className="h-80 sm:h-96 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full gap-3 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/20 to-violet-500/20
                                border border-cyan-400/30 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Hi! I&apos;m Chibu&apos;s AI assistant. Ask me anything about his background,
                  projects, or experience. I promise to keep it interesting! ✨
                </p>
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-violet-500 to-indigo-600'
                        : 'bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-400/30'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'chat-bubble-user text-white rounded-tr-sm'
                        : 'bg-white/5 dark:bg-white/5 bg-slate-50 border border-white/8 dark:border-white/8 border-slate-200 text-slate-700 dark:text-slate-300 rounded-tl-sm'
                    } ${
                      // Add typing cursor to last AI message if still loading
                      message.role === 'assistant' &&
                      isLoading &&
                      idx === messages.length - 1
                        ? 'typing-cursor'
                        : ''
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="bg-white/5 dark:bg-white/5 bg-slate-50 border border-white/8 dark:border-white/8 border-slate-200 rounded-xl rounded-tl-sm">
                  <TypingDots />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/5 dark:border-white/5 border-slate-100 p-4">
            <form
              id="ai-chat-form"
              onSubmit={handleSubmit}
              className="flex items-center gap-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Ask something about Chibuzor..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm
                           bg-white/5 dark:bg-white/5 bg-slate-50
                           border border-white/10 dark:border-white/10 border-slate-200
                           text-slate-900 dark:text-white placeholder-slate-600 dark:placeholder-slate-600
                           focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20
                           disabled:opacity-50 transition-colors duration-200"
                maxLength={500}
              />
              <motion.button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600
                           text-white disabled:opacity-40 disabled:cursor-not-allowed
                           hover:from-cyan-400 hover:to-violet-500 transition-all duration-200
                           shadow-lg shadow-cyan-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
            <p className="text-xs text-slate-600 dark:text-slate-700 mt-2 text-center">
              Answers are grounded in Chibuzor&apos;s actual resume data via RAG lookup.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
