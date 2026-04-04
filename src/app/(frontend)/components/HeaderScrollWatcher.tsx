'use client'

import { useEffect } from 'react'

export default function HeaderScrollWatcher() {
  useEffect(() => {
    const header = document.getElementById('header')
    if (!header) return

    const threshold = 50

    const onScroll = () => {
      if (window.scrollY > threshold) {
        header.classList.add('header-scrolled')
      } else {
        header.classList.remove('header-scrolled')
      }
    }

    // Initial check
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return null
}
