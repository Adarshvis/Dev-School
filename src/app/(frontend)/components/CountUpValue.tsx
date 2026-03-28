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
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [inView, end, duration])

  return (
    <span ref={spanRef}>
      {count}
      {suffix}
    </span>
  )
}

export default CountUpValue
