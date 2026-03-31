'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

type MediaValue = { url?: string } | string | null | undefined

type AnnouncementPopupSettings = {
  enabled?: boolean
  showOn?: 'home' | 'all'
  campaignKey?: string
  title?: string
  subtitle?: string
  mediaType?: 'image' | 'video'
  image?: MediaValue
  videoType?: 'youtube' | 'upload'
  videoUrl?: string
  videoFile?: MediaValue
  modalSize?: 'compact' | 'comfortable' | 'large'
  delaySeconds?: number
  frequency?: 'every-visit' | 'once-per-session' | 'once-per-day'
  closeOnBackdrop?: boolean
  startAt?: string
  endAt?: string
  showCta?: boolean
  ctaText?: string
  ctaLink?: string
  ctaNewTab?: boolean
}

const getMediaUrl = (value: MediaValue): string => {
  if (!value) return ''
  return typeof value === 'object' ? String(value.url || '') : String(value)
}

const getYouTubeEmbedUrl = (url: string): string => {
  const raw = String(url || '').trim()
  if (!raw) return ''
  const match = raw.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)
  const id = match ? match[1] : ''
  return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : ''
}

const sizeMap: Record<string, string> = {
  compact: '560px',
  comfortable: '760px',
  large: '920px',
}

export default function AnnouncementPopup({ popup, version }: { popup?: AnnouncementPopupSettings; version?: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const storageKey = useMemo(() => {
    const key = String(popup?.campaignKey || popup?.title || version || 'default').trim().toLowerCase().replace(/\s+/g, '-')
    return `announcement-popup:${key}`
  }, [popup?.campaignKey, popup?.title, version])

  useEffect(() => {
    if (!popup?.enabled) return

    if (popup?.showOn === 'home' && pathname !== '/') return

    const now = Date.now()
    if (popup?.startAt) {
      const startAt = new Date(popup.startAt).getTime()
      if (!Number.isNaN(startAt) && now < startAt) return
    }

    if (popup?.endAt) {
      const endAt = new Date(popup.endAt).getTime()
      if (!Number.isNaN(endAt) && now > endAt) return
    }

    const frequency = popup?.frequency || 'once-per-session'
    if (frequency === 'once-per-session' && sessionStorage.getItem(storageKey) === 'dismissed') return

    if (frequency === 'once-per-day') {
      const dismissedAtRaw = localStorage.getItem(storageKey)
      const dismissedAt = dismissedAtRaw ? Number(dismissedAtRaw) : 0
      if (dismissedAt > 0 && now - dismissedAt < 24 * 60 * 60 * 1000) return
    }

    const delay = Math.max(0, Number(popup?.delaySeconds || 0)) * 1000
    const timer = window.setTimeout(() => setOpen(true), delay)

    return () => window.clearTimeout(timer)
  }, [pathname, popup, storageKey])

  const closePopup = () => {
    const frequency = popup?.frequency || 'once-per-session'
    if (frequency === 'once-per-session') {
      sessionStorage.setItem(storageKey, 'dismissed')
    }
    if (frequency === 'once-per-day') {
      localStorage.setItem(storageKey, String(Date.now()))
    }
    setOpen(false)
  }

  if (!popup?.enabled || !open) return null

  const modalMaxWidth = sizeMap[String(popup.modalSize || 'comfortable')] || sizeMap.comfortable
  const imageUrl = getMediaUrl(popup?.image)
  const uploadedVideoUrl = getMediaUrl(popup?.videoFile)
  const youtubeEmbedUrl = getYouTubeEmbedUrl(String(popup?.videoUrl || ''))

  return (
    <div
      className="announcement-popup-backdrop"
      onClick={popup?.closeOnBackdrop === false ? undefined : closePopup}
      role="presentation"
    >
      <div
        className="announcement-popup-modal"
        style={{ maxWidth: modalMaxWidth }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={popup?.title || 'Announcement popup'}
      >
        <button
          type="button"
          className="announcement-popup-close"
          aria-label="Close announcement"
          onClick={closePopup}
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>

        <div className="announcement-popup-media">
          {popup?.mediaType === 'video' ? (
            popup?.videoType === 'upload' && uploadedVideoUrl ? (
              <video controls autoPlay muted playsInline className="announcement-popup-video">
                <source src={uploadedVideoUrl} />
              </video>
            ) : youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                title={popup?.title || 'Announcement video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="announcement-popup-iframe"
              />
            ) : (
              <div className="announcement-popup-empty">No video configured.</div>
            )
          ) : imageUrl ? (
            <img src={imageUrl} alt={popup?.title || 'Announcement'} className="announcement-popup-image" />
          ) : (
            <div className="announcement-popup-empty">No image configured.</div>
          )}
        </div>

        {(popup?.title || popup?.subtitle || (popup?.showCta && popup?.ctaText && popup?.ctaLink)) ? (
          <div className="announcement-popup-content">
            {popup?.title ? <h3 className="mb-2">{popup.title}</h3> : null}
            {popup?.subtitle ? <p className="mb-0">{popup.subtitle}</p> : null}
            {popup?.showCta && popup?.ctaText && popup?.ctaLink ? (
              <div className="mt-3">
                <a
                  href={popup.ctaLink}
                  className="btn btn-primary"
                  target={popup.ctaNewTab ? '_blank' : undefined}
                  rel={popup.ctaNewTab ? 'noopener noreferrer' : undefined}
                >
                  {popup.ctaText}
                </a>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <style jsx>{`
        .announcement-popup-backdrop {
          position: fixed;
          inset: 0;
          z-index: 12000;
          background: rgba(7, 17, 34, 0.62);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .announcement-popup-modal {
          width: min(94vw, 920px);
          max-height: min(88vh, 920px);
          overflow: hidden;
          border-radius: 16px;
          background: #faf7f5;
          border: 1px solid color-mix(in srgb, var(--heading-color), transparent 82%);
          box-shadow: 0 28px 60px rgba(0, 0, 0, 0.35);
          position: relative;
        }

        .announcement-popup-close {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 2;
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          color: #222;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .announcement-popup-media {
          width: 100%;
          background: #0f172a;
        }

        .announcement-popup-image,
        .announcement-popup-video,
        .announcement-popup-iframe {
          width: 100%;
          display: block;
          max-height: min(68vh, 720px);
          border: none;
          object-fit: contain;
        }

        .announcement-popup-content {
          padding: 1rem 1.25rem 1.25rem;
          text-align: center;
        }

        .announcement-popup-content h3 {
          color: var(--heading-color);
        }

        .announcement-popup-content p {
          color: color-mix(in srgb, var(--default-color), transparent 16%);
        }

        .announcement-popup-content .btn.btn-primary {
          background-color: var(--button-primary-bg, var(--primary-color));
          border-color: var(--button-primary-bg, var(--primary-color));
          color: var(--button-primary-text, var(--contrast-color));
        }

        .announcement-popup-content .btn.btn-primary:hover {
          background-color: var(--button-primary-hover-bg, var(--primary-color));
          border-color: var(--button-primary-hover-bg, var(--primary-color));
          color: var(--button-primary-text, var(--contrast-color));
        }

        .announcement-popup-empty {
          min-height: 260px;
          color: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 1rem;
        }

        @media (max-width: 767px) {
          .announcement-popup-backdrop {
            padding: 12px;
          }

          .announcement-popup-modal {
            width: min(96vw, 96vw);
            border-radius: 12px;
          }

          .announcement-popup-close {
            width: 34px;
            height: 34px;
            top: 8px;
            right: 8px;
          }

          .announcement-popup-content {
            padding: 0.85rem 0.9rem 1rem;
          }
        }
      `}</style>
    </div>
  )
}
