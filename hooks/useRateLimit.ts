/**
 * useRateLimit
 *
 * Client-side rate limiter that persists across browser reloads via localStorage.
 *
 * Rules:
 *  - 5 questions allowed per session window
 *  - When the limit is hit, a 30-second cooldown starts
 *  - After 30 seconds the count resets automatically
 *  - A UUID session ID is generated once and stored alongside the counter
 */

import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'chibu-portfolio-rl'
export const MAX_QUESTIONS = 5
const COOLDOWN_MS = 60_000 // 60-second cooldown after 5 questions

interface StoredState {
  sessionId: string
  count: number
  blockedSince: number | null // epoch ms when limit was hit
}

function generateId(): string {
  // crypto.randomUUID() is not available in all browsers (requires Chrome 92+, Safari 15.4+)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback: good enough for a session ID
  return `${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`
}

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) throw new Error('empty')
    const parsed: StoredState = JSON.parse(raw)

    // If cooldown already expired, return a fresh count so the user doesn't
    // start on a blocked screen after a reload mid-cooldown that has elapsed.
    if (parsed.blockedSince && Date.now() - parsed.blockedSince >= COOLDOWN_MS) {
      return { ...parsed, count: 0, blockedSince: null }
    }
    return parsed
  } catch {
    return {
      sessionId: generateId(),
      count: 0,
      blockedSince: null,
    }
  }
}

export interface RateLimitResult {
  /** Whether the user has hit the question limit and is in cooldown */
  isBlocked: boolean
  /** Seconds remaining in the cooldown (0 when not blocked) */
  secondsLeft: number
  /** How many more questions the user can ask before being blocked */
  questionsLeft: number
  /** Unique session identifier (for passing to the API if needed) */
  sessionId: string
  /** Call this BEFORE submitting a question — returns true if now blocked */
  increment: () => boolean
  /** True once localStorage has been read (avoids SSR mismatch) */
  isReady: boolean
}

export function useRateLimit(): RateLimitResult {
  const [state, setState] = useState<StoredState>({
    sessionId: '',
    count: 0,
    blockedSince: null,
  })
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Hydrate from localStorage on mount (must be client-only)
  useEffect(() => {
    setState(loadState())
    setIsReady(true)
  }, [])

  // Persist every state change
  useEffect(() => {
    if (!isReady) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, isReady])

  // Countdown ticker — runs only while blocked
  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current)

    if (!state.blockedSince) {
      setSecondsLeft(0)
      return
    }

    function tick() {
      if (!state.blockedSince) return
      const left = Math.ceil(
        Math.max(0, COOLDOWN_MS - (Date.now() - state.blockedSince)) / 1000
      )
      setSecondsLeft(left)

      if (left <= 0) {
        // Cooldown expired — reset
        setState(s => ({ ...s, count: 0, blockedSince: null }))
        if (tickRef.current) clearInterval(tickRef.current)
      }
    }

    tick() // fire immediately so UI doesn't show 0 for a second
    tickRef.current = setInterval(tick, 1000)

    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [state.blockedSince])

  const increment = useCallback((): boolean => {
    let nowBlocked = false
    setState(s => {
      if (s.blockedSince) return s // already blocked, ignore
      const newCount = s.count + 1
      const hitLimit = newCount >= MAX_QUESTIONS
      nowBlocked = hitLimit
      return {
        ...s,
        count: newCount,
        blockedSince: hitLimit ? Date.now() : null,
      }
    })
    return nowBlocked
  }, [])

  const isBlocked = Boolean(state.blockedSince)
  const questionsLeft = Math.max(0, MAX_QUESTIONS - state.count)

  return { isBlocked, secondsLeft, questionsLeft, sessionId: state.sessionId, increment, isReady }
}
