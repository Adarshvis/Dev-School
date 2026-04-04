'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function HeaderScrollWatcher() {
  const wasScrolled = useRef(false)
  const pathname = usePathname()

  useEffect(() => {
    const header = document.getElementById('header')
    if (!header) return

    const threshold = 50

    /**
     * Sync the header-scrolled class based on current scroll position
     * and the presence of `.hero-fullscreen-overlay` in the DOM.
     * Checks for hero every call so it works across client-side navigations.
     */
    const sync = () => {
      const hasHero = !!document.querySelector('.hero-fullscreen-overlay')

      if (!hasHero) {
        // No hero on this page — remove scrolled class if it was set
        if (wasScrolled.current) {
          header.classList.remove('header-scrolled')
          wasScrolled.current = false
        }
        return
      }

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

    // Sync immediately + after a frame (hero DOM may arrive slightly late
    // during client-side navigation due to streaming / Suspense)
    sync()
    const raf = requestAnimationFrame(() => sync())

    window.addEventListener('scroll', sync, { passive: true })
    return () => {
      window.removeEventListener('scroll', sync)
      cancelAnimationFrame(raf)
    }
  }, [pathname])

  return null
}
