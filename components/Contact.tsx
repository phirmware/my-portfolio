'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, MapPin } from 'lucide-react'
import { resumeData } from '@/lib/resume-data'

const LINKS = [
  {
    icon: Mail,
    label: 'Email',
    value: resumeData.contact.email,
    href: `mailto:${resumeData.contact.email}`,
    color: '#22d3ee',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: `linkedin.com/in/${resumeData.contact.linkedinHandle}`,
    href: resumeData.contact.linkedin,
    color: '#818cf8',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: `github.com/${resumeData.contact.githubHandle}`,
    href: resumeData.contact.github,
    color: '#a78bfa',
  },
]

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-mono text-cyan-400 dark:text-cyan-400 text-cyan-600 uppercase tracking-widest">
            // get in touch
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Let&apos;s Build Something Great
          </h2>
          <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
          <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
            Currently based in Leicester, UK and open to senior engineering roles —
            remote, hybrid, or on-site. Let&apos;s talk.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {LINKS.map(({ icon: Icon, label, value, href, color }, i) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-5 flex flex-col items-center text-center gap-3 gradient-border
                         hover:bg-white/5 dark:hover:bg-white/5 transition-colors duration-200 group"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
              >
                <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" style={{ color }} />
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-600 font-mono uppercase tracking-wide mb-0.5">
                  {label}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 break-all">{value}</p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Location badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-600"
        >
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>{resumeData.contact.location}</span>
        </motion.div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/5 dark:border-white/5 border-slate-200
                        flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-sm gradient-text font-semibold">chibu.dev</span>
          <p className="text-xs text-slate-600 dark:text-slate-700">
            Built with Next.js · Tailwind CSS · Framer Motion · Claude AI
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-700">
            © {new Date().getFullYear()} Chibuzor Ojukwu
          </p>
        </div>
      </div>
    </section>
  )
}
