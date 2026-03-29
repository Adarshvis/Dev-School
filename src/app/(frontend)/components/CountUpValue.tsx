'use client'

import React, { useEffect, useRef, useState } from 'react'

type CountUpValueProps = {
  end: number
  suffix?: string
  duration?: number
}

const CountUpValue: React.FC<CountUpValueProps> = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0)
  const [inView, setInView] = useState(false)
  const spanRef = useRef<HTMLSpanElement | null>(null)
  const startedRef = useRef(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const el = spanRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || startedRef.current) return
    startedRef.current = true

    const startTime = performance.now()
    let isMounted = true
    const step = (now: number) => {
      if (!isMounted) return
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      }
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      isMounted = false
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [inView, end, duration])

  return (
    <span ref={spanRef}>
      {count}
      {suffix}
    </span>
  )
}

export default CountUpValue
