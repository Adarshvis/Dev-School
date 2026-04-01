"use client"

import React from 'react'
import { createPortal } from 'react-dom'

export type MediaLightboxItem = {
  type: 'image' | 'video'
  src: string
  caption?: string
  alt?: string
}

type MediaLightboxProps = {
  items: MediaLightboxItem[]
  initialIndex: number
  onClose: () => void
}

export default function MediaLightbox({ items, initialIndex, onClose }: MediaLightboxProps) {
  const lightboxRef = React.useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(() => {
    if (!items.length) return 0
    return Math.max(0, Math.min(initialIndex, items.length - 1))
  })

  const hasItems = items.length > 0
  const current = hasItems ? items[currentIndex] : null
  const canNavigate = items.length > 1

  const goPrev = React.useCallback(() => {
    if (!canNavigate) return
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }, [canNavigate, items.length])

  const goNext = React.useCallback(() => {
    if (!canNavigate) return
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }, [canNavigate, items.length])

  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  React.useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lightboxRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goPrev()
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goNext()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('keydown', onKeyDown, true)

    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('keydown', onKeyDown, true)
      document.body.style.overflow = previousOverflow
    }
  }, [goNext, goPrev, onClose])

  if (!current || !mounted) return null

  return createPortal(
    <div
      ref={lightboxRef}
      className="media-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
      tabIndex={-1}
      onClick={onClose}
    >
      <button
        type="button"
        className="media-lightbox-close"
        aria-label="Close viewer"
        onClick={onClose}
      >
        <i className="bi bi-x-lg" aria-hidden="true" />
      </button>

      {canNavigate ? (
        <>
          <button
            type="button"
            className="media-lightbox-nav media-lightbox-nav-prev"
            aria-label="Previous media"
            onClick={(event) => {
              event.stopPropagation()
              goPrev()
            }}
          >
            <i className="bi bi-chevron-left" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="media-lightbox-nav media-lightbox-nav-next"
            aria-label="Next media"
            onClick={(event) => {
              event.stopPropagation()
              goNext()
            }}
          >
            <i className="bi bi-chevron-right" aria-hidden="true" />
          </button>
        </>
      ) : null}

      <div className="media-lightbox-inner" onClick={(event) => event.stopPropagation()}>
        <div className="media-lightbox-stage">
          {current.type === 'video' ? (
            <video key={current.src} controls autoPlay preload="metadata" className="media-lightbox-media">
              <source src={current.src} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              key={current.src}
              src={current.src}
              alt={current.alt || current.caption || `Media ${currentIndex + 1}`}
              className="media-lightbox-media"
            />
          )}
        </div>

        <div className="media-lightbox-meta">
          <span className="media-lightbox-index">{currentIndex + 1} / {items.length}</span>
          <span className="media-lightbox-caption">{current.caption || current.alt || 'Media preview'}</span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
