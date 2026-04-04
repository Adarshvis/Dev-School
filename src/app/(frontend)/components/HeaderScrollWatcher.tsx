'use client'

import { useEffect, useRef } from 'react'

export default function HeaderScrollWatcher() {
  const wasScrolled = useRef(false)

  useEffect(() => {
    const header = document.getElementById('header')
    if (!header) return

    const hasHero = document.querySelector('.hero-fullscreen-overlay')
    if (!hasHero) return

    const threshold = 50

    const onScroll = () => {
      const isScrolled = window.scrollY > threshold
      if (isScrolled === wasScrolled.current) return
      wasScrolled.current = isScrolled

      // 1. Kill ALL transitions on header + every descendant
      header.style.transition = 'none'
      const children = header.querySelectorAll('*') as NodeListOf<HTMLElement>
      children.forEach((el) => { el.style.transition = 'none' })

      // 2. Apply layout class
      header.classList.toggle('header-scrolled', isScrolled)

      // 3. Force synchronous reflow so the layout settles
      void header.offsetHeight

      // 4. Re-enable transitions on next frame (after paint)
      requestAnimationFrame(() => {
        header.style.transition = ''
        children.forEach((el) => { el.style.transition = '' })
      })
    }

    // Initial state
    wasScrolled.current = window.scrollY > threshold
    if (wasScrolled.current) {
      header.classList.add('header-scrolled')
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return null
}
