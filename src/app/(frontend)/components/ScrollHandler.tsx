'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollHandler() {
  const pathname = usePathname()

  useEffect(() => {
    function toggleScrolled() {
      const selectBody = document.querySelector('body')
      const selectHeader = document.querySelector('.header')
      if (!selectBody || !selectHeader) return
      
      if (window.scrollY > 100) {
        selectBody.classList.add('scrolled')
      } else {
        selectBody.classList.remove('scrolled')
      }
    }

    // Add scroll event listener
    document.addEventListener('scroll', toggleScrolled)
    
    // Call on load and route change
    toggleScrolled()

    // Cleanup
    return () => {
      document.removeEventListener('scroll', toggleScrolled)
    }
  }, [pathname])

  return null
}
