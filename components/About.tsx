'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { resumeData } from '@/lib/resume-data'
import { Calendar, MapPin, Briefcase, TrendingUp, MessageCircle } from 'lucide-react'

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="text-center mb-16">
      <span className="text-xs font-mono text-cyan-400 dark:text-cyan-400 text-cyan-600 uppercase tracking-widest">
        {label}
      </span>
      <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
        {title}
      </h2>
      <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
    </div>
  )
}

function SkillPill({ skill, delay }: { skill: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.08, y: -2 }}
      className="inline-block px-3 py-1 text-xs rounded-full
                 bg-white/5 dark:bg-white/5 bg-slate-100
                 border border-white/10 dark:border-white/10 border-slate-200
                 text-slate-600 dark:text-slate-300 font-mono
                 hover:border-cyan-400/40 hover:text-cyan-500 dark:hover:text-cyan-400
                 transition-all duration-200 cursor-default"
    >
      {skill}
    </motion.span>
  )
}

function ExperienceCard({
  job,
  index,
  onAskQuestion,
}: {
  job: (typeof resumeData.experience)[number]
  index: number
  onAskQuestion: (question: string, section: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      id={`exp-${job.id}`}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 pb-8 last:pb-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Timeline line */}
      <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gradient-to-b from-cyan-400/40 to-transparent last:hidden" />

      {/* Timeline dot */}
      <motion.div
        className="absolute left-0 top-1.5 w-5 h-5 rounded-full border-2 border-cyan-400 bg-slate-950 dark:bg-slate-950"
        animate={inView ? { scale: [0, 1.2, 1], borderColor: ['#22d3ee', '#a78bfa', '#22d3ee'] } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      />

      <div className="glass-card rounded-xl p-5 hover:border-cyan-400/20 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">{job.title}</h3>
            <p className="text-sm font-medium" style={{ color: job.color }}>{job.company}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {job.location}
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500 font-mono shrink-0">
            <Calendar className="w-3 h-3" /> {job.period}
          </span>
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5">
          {job.techStack.split(',').slice(0, 6).map(t => (
            <span key={t} className="px-2 py-0.5 text-xs rounded bg-white/5 dark:bg-white/5 bg-slate-100
                                     border border-white/8 dark:border-white/8 border-slate-200
                                     text-slate-500 dark:text-slate-500 font-mono">
              {t.trim()}
            </span>
          ))}
        </div>

        {/* AI questions — slides in below on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="pt-3 mt-3 border-t border-white/5 space-y-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <MessageCircle className="w-3.5 h-3.5" style={{ color: job.color }} />
                  <span className="text-xs font-mono uppercase tracking-wider" style={{ color: job.color }}>
                    Ask AI about this role
                  </span>
                </div>
                {job.aiQuestions.map(q => (
                  <motion.button
                    key={q}
                    onClick={() => onAskQuestion(q, `exp-${job.id}`)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs
                               bg-white/5 border border-white/10 text-slate-300
                               hover:bg-white/10 hover:text-white transition-all duration-150"
                    style={{ borderColor: `${job.color}20` }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span style={{ color: job.color }} className="mr-1">›</span> {q}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function About({ onAskQuestion }: { onAskQuestion: (question: string, section: string) => void }) {
  const skillsRef = useRef<HTMLDivElement>(null)
  const inView = useInView(skillsRef, { once: true, margin: '-100px' })

  return (
    <section id="about" className="py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      <SectionHeader label="// background" title="About Me" />

      <div className="grid lg:grid-cols-2 gap-16 mb-20">
        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            {resumeData.summary}
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
            <MapPin className="w-4 h-4 text-cyan-400" />
            {resumeData.contact.location}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            {resumeData.stats.map(stat => (
              <motion.div
                key={stat.label}
                className="glass-card rounded-xl p-4 text-center"
                whileHover={{ scale: 1.03 }}
              >
                <div className="text-2xl font-black gradient-text">{stat.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills */}
        <div ref={skillsRef} className="space-y-5">
          {inView &&
            Object.entries(resumeData.skills).map(([category, skills], catIdx) => (
              <div key={category}>
                <h4 className="text-xs font-mono text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-2">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(skills as string[]).map((skill, i) => (
                    <SkillPill key={skill} skill={skill} delay={catIdx * 0.05 + i * 0.03} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Experience Timeline */}
      <div>
        <div className="flex items-center gap-3 mb-10">
          <Briefcase className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Work History</h3>
        </div>
        <div className="space-y-2">
          {resumeData.experience.map((job, i) => (
            <ExperienceCard key={job.id} job={job} index={i} onAskQuestion={onAskQuestion} />
          ))}
        </div>
      </div>

      {/* Education */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 glass-card rounded-xl p-5 flex items-center gap-4"
      >
        <TrendingUp className="w-8 h-8 text-violet-400 shrink-0" />
        <div>
          <p className="font-semibold text-slate-900 dark:text-white text-sm">{resumeData.education.degree}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500">{resumeData.education.university}</p>
        </div>
      </motion.div>
    </section>
  )
}
