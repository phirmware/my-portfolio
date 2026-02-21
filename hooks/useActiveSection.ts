/**
 * useActiveSection
 *
 * Watches a list of section IDs with IntersectionObserver and returns
 * whichever section currently has the greatest visible area.
 *
 * Works on both desktop (scroll + mouse) and mobile (scroll only).
 * Used instead of onMouseEnter so mobile users get section-aware AI questions.
 */

import { useEffect, useRef, useState } from 'react'

export function useActiveSection(ids: string[], defaultSection = 'hero'): string {
  const [active, setActive] = useState(defaultSection)
  // Keep a live map of each section's current intersection ratio
  const ratioMap = useRef<Record<string, number>>(
    Object.fromEntries(ids.map(id => [id, 0]))
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          ratioMap.current[entry.target.id] = entry.intersectionRatio
        })

        // The section with the highest intersection ratio wins
        const [bestId, bestRatio] = Object.entries(ratioMap.current).reduce(
          (acc, [id, ratio]) => (ratio > acc[1] ? [id, ratio] : acc),
          ['', -1]
        )

        if (bestRatio > 0) setActive(bestId)
      },
      {
        // Shrink the root box slightly so a section registers as "active"
        // only when it meaningfully fills the viewport
        rootMargin: '-15% 0px -15% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
      }
    )

    // Elements might not be in the DOM on the very first paint; give React
    // one tick to finish rendering before we start observing.
    const timer = setTimeout(() => {
      ids.forEach(id => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [ids])

  return active
}
