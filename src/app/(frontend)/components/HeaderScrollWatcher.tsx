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

      if (isScrolled !== wasScrolled.current) {
        wasScrolled.current = isScrolled

        // Pull the header out of rendering completely
        header.style.display = 'none'
        // Force the browser to acknowledge the removal
        void header.offsetHeight

        // Apply the class change while element is not rendered
        header.classList.toggle('header-scrolled', isScrolled)

        // Restore — browser will paint the final state in one go
        header.style.display = ''
      }
    }

    // Initial state
    const initialScrolled = window.scrollY > threshold
    wasScrolled.current = initialScrolled
    if (initialScrolled) {
      header.classList.add('header-scrolled')
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return null
}
