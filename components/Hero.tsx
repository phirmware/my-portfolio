'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Github, Linkedin, Mail, ChevronDown, Zap } from 'lucide-react'

const TYPEWRITER_PHRASES = [
  'Senior Backend Engineer',
  'Distributed Systems Architect',
  'LLM & RAG Engineer',
  'Open Source Contributor',
  'Cloud Infrastructure Expert',
]

const TECH_PILLS = ['Node.js', 'TypeScript', 'Golang', 'AWS', 'RAG/LLM', 'Terraform', 'Kubernetes']

function useTypewriter(phrases: string[], speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[phraseIndex]
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          if (charIndex < current.length) {
            setDisplayed(current.slice(0, charIndex + 1))
            setCharIndex(c => c + 1)
          } else {
            setTimeout(() => setDeleting(true), pause)
          }
        } else {
          if (charIndex > 0) {
            setDisplayed(current.slice(0, charIndex - 1))
            setCharIndex(c => c - 1)
          } else {
            setDeleting(false)
            setPhraseIndex(i => (i + 1) % phrases.length)
          }
        }
      },
      deleting ? speed / 2 : speed
    )
    return () => clearTimeout(timeout)
  }, [charIndex, deleting, phraseIndex, phrases, speed, pause])

  return displayed
}

export default function Hero({ onOpenChat }: { onOpenChat: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const typewritten = useTypewriter(TYPEWRITER_PHRASES)

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ---- Background ---- */}
      <div className="absolute inset-0 bg-[#080b14] dark:bg-[#080b14] bg-sky-50 transition-colors duration-500" />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-100 dark:opacity-100" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ x: [0, -25, 0], y: [0, 25, 0], scale: [1, 0.9, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/3 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ x: [0, 15, 0], y: [0, 30, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* ---- Content ---- */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                             border border-cyan-400/30 bg-cyan-400/5 text-cyan-400 text-xs font-mono
                             dark:text-cyan-400 text-cyan-600">
              <Zap className="w-3 h-3" />
              Available for senior engineering roles
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight"
          >
            <span className="block text-white dark:text-white text-slate-900 leading-none">
              CHIBUZOR
            </span>
            <span className="block gradient-text leading-none mt-1">OJUKWU</span>
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            variants={itemVariants}
            className="h-8 flex items-center justify-center"
          >
            <span className="text-lg sm:text-xl md:text-2xl font-mono text-slate-400 dark:text-slate-400 text-slate-500">
              {typewritten}
              <span className="animate-blink text-cyan-400">|</span>
            </span>
          </motion.div>

          {/* Summary */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-sm sm:text-base text-slate-400 dark:text-slate-400 text-slate-600 leading-relaxed"
          >
            7+ years architecting distributed systems and cloud-native infrastructure.
            Now building AI/LLM pipelines that actually work in production.
            Based in Leicester, UK.
          </motion.p>

          {/* Tech pills */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 max-w-lg">
            {TECH_PILLS.map(tech => (
              <motion.span
                key={tech}
                className="px-3 py-1 text-xs rounded-full bg-white/5 dark:bg-white/5 border border-white/10
                           text-slate-300 dark:text-slate-300 text-slate-600 font-mono"
                whileHover={{ scale: 1.08, borderColor: 'rgba(34,211,238,0.4)' }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <motion.a
              href="#projects"
              className="px-6 py-3 rounded-full font-semibold text-sm text-white
                         bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500
                         transition-all duration-300 shadow-lg shadow-cyan-500/20"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34,211,238,0.35)' }}
              whileTap={{ scale: 0.97 }}
            >
              View My Work
            </motion.a>
            <motion.button
              onClick={onOpenChat}
              className="px-6 py-3 rounded-full font-semibold text-sm border border-violet-400/50
                         text-violet-300 dark:text-violet-300 text-violet-700
                         hover:bg-violet-400/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              ✨ Ask AI About Me
            </motion.button>
          </motion.div>

          {/* Social links */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mt-2">
            {[
              { href: 'https://github.com/phirmware', icon: Github, label: 'GitHub' },
              { href: 'https://linkedin.com/in/phirmware', icon: Linkedin, label: 'LinkedIn' },
              { href: 'mailto:chibuzorojukwu@gmail.com', icon: Mail, label: 'Email' },
            ].map(({ href, icon: Icon, label }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400
                           hover:text-white hover:border-white/30 transition-all duration-200"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-xs text-slate-600 dark:text-slate-600 font-mono">scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-600" />
        </motion.div>
      </motion.div>
    </section>
  )
}
