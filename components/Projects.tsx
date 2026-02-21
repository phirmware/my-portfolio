'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { resumeData, type Project } from '@/lib/resume-data'
import { ExternalLink, MessageCircle, Sparkles } from 'lucide-react'

interface ProjectCardProps {
  project: Project
  onAskQuestion: (question: string, section: string) => void
}

function ProjectCard({ project, onAskQuestion }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden gradient-border glass-card cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Gradient top bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${project.color.replace('/20', '')}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${project.accentColor}18`, border: `1px solid ${project.accentColor}30` }}
          >
            <Sparkles className="w-5 h-5" style={{ color: project.accentColor }} />
          </div>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="mt-1 text-slate-400 hover:text-white transition-colors duration-150"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2 leading-snug">
          {project.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.map(t => (
            <span
              key={t}
              className="px-2 py-0.5 text-xs rounded font-mono
                         bg-white/5 dark:bg-white/5 border border-white/8 dark:border-white/8
                         text-slate-500 dark:text-slate-500"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Impact */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
          style={{ background: `${project.accentColor}10`, border: `1px solid ${project.accentColor}20` }}
        >
          <span style={{ color: project.accentColor }}>⚡</span>
          <span className="text-slate-500 dark:text-slate-400">{project.impact}</span>
        </div>
      </div>

      {/* AI Questions overlay — slides up on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-0 rounded-2xl flex flex-col justify-end"
            style={{
              background: 'linear-gradient(to top, rgba(8,11,20,0.97) 60%, transparent 100%)',
            }}
          >
            <div className="p-5 space-y-2">
              <div className="flex items-center gap-1.5 mb-3">
                <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs text-cyan-400 font-mono uppercase tracking-wider">
                  Ask AI about this
                </span>
              </div>
              {project.questions.map(q => (
                <motion.button
                  key={q}
                  onClick={e => {
                    e.stopPropagation()
                    onAskQuestion(q, 'projects')
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs
                             bg-white/5 border border-white/10 text-slate-300
                             hover:bg-white/10 hover:border-cyan-400/30 hover:text-white
                             transition-all duration-150"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-cyan-400 mr-1">›</span> {q}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface ProjectsSectionProps {
  onAskQuestion: (question: string, section: string) => void
}

export default function Projects({ onAskQuestion }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-cyan-400 dark:text-cyan-400 text-cyan-600 uppercase tracking-widest">
            // notable work
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Projects & Open Source
          </h2>
          <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-500 max-w-md mx-auto">
            Hover over a card to ask the AI contextual questions about each project.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumeData.projects.map(project => (
            <ProjectCard key={project.id} project={project} onAskQuestion={onAskQuestion} />
          ))}
        </div>

        {/* Leadership highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 glass-card rounded-2xl p-6"
        >
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-white text-xs">✦</span>
            Technical Leadership & Impact
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {resumeData.leadership.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-2 text-xs text-slate-500 dark:text-slate-400"
              >
                <span className="text-cyan-400 shrink-0 mt-0.5">▸</span>
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
