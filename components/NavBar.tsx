'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ThemeToggle from './ThemeToggle'

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export default function NavBar({ onOpenChat }: { onOpenChat: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const { scrollY } = useScroll()
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1])

  // Close mobile menu on scroll
  useEffect(() => {
    const unsub = scrollY.on('change', v => { if (v > 10) setIsOpen(false) })
    return unsub
  }, [scrollY])

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(8, 11, 20, 0.7)',
      }}
    >
      {/* bottom border that fades in on scroll */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-white/10"
        style={{ opacity: borderOpacity }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="#"
            className="font-mono text-sm font-semibold gradient-text"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            chibu.dev
          </motion.a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white dark:hover:text-white
                           transition-colors duration-200 relative group"
                whileHover={{ y: -1 }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r
                                 from-cyan-400 to-violet-400 scale-x-0 group-hover:scale-x-100
                                 transition-transform duration-200 origin-left" />
              </motion.a>
            ))}
            <ThemeToggle />
            <motion.button
              onClick={onOpenChat}
              className="px-4 py-1.5 text-sm rounded-full border border-violet-400/40
                         text-violet-300 dark:text-violet-300 hover:bg-violet-400/10 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✨ Ask AI
            </motion.button>
            <motion.a
              href="mailto:chibuzorojukwu@gmail.com"
              className="px-4 py-1.5 text-sm rounded-full border border-cyan-400/40
                         text-cyan-400 hover:bg-cyan-400/10 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Hire Me
            </motion.a>
          </nav>

          {/* Mobile: theme + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(o => !o)}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-5 flex flex-col gap-1.5">
                <motion.span
                  className="block h-px bg-current"
                  animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block h-px bg-current"
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block h-px bg-current"
                  animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="md:hidden overflow-hidden border-t border-white/5"
        style={{ background: 'rgba(8, 11, 20, 0.95)' }}
      >
        <nav className="flex flex-col px-4 py-4 gap-4">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors py-1 border-b border-white/5"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { setIsOpen(false); onOpenChat() }}
            className="text-violet-400 font-medium text-left py-1"
          >
            ✨ Ask AI
          </button>
          <a
            href="mailto:chibuzorojukwu@gmail.com"
            className="text-cyan-400 font-medium mt-2"
          >
            Hire Me →
          </a>
        </nav>
      </motion.div>
    </motion.header>
  )
}
