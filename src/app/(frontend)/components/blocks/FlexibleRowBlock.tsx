'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { lexicalToHtml } from '@/lib/lexicalToHtml'

type Props = {
  heading?: string
  description?: string
  alignment?: 'left' | 'center' | 'right'
  sectionBackgroundColor?: string
  columnGap?: 'none' | 'small' | 'medium' | 'large' | 'xl'
  verticalAlignment?: 'top' | 'center' | 'bottom' | 'stretch'
  columns?: Array<any>
}

const gapMap: Record<string, string> = {
  none: '0px',
  small: '8px',
  medium: '16px',
  large: '24px',
  xl: '32px',
}

const paddingMap: Record<string, string> = {
  none: '0px',
  small: '8px',
  medium: '16px',
  large: '24px',
}

const radiusMap: Record<string, string> = {
  none: '0px',
  sm: '6px',
  md: '12px',
  lg: '18px',
  'full-circle': '9999px',
}

const fontSizeMap: Record<string, string> = {
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
}

function toMediaUrl(media: any): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  return media.url || ''
}

function getYouTubeEmbed(url?: string): string {
  if (!url) return ''
  const direct = url.match(/youtube\.com\/embed\/([^?&]+)/)?.[1]
  if (direct) return `https://www.youtube.com/embed/${direct}`
  const watch = url.match(/[?&]v=([^&]+)/)?.[1]
  if (watch) return `https://www.youtube.com/embed/${watch}`
  const short = url.match(/youtu\.be\/([^?&]+)/)?.[1]
  if (short) return `https://www.youtube.com/embed/${short}`
  return url
}

function getVimeoEmbed(url?: string): string {
  if (!url) return ''
  const id = url.match(/vimeo\.com\/(\d+)/)?.[1]
  if (id) return `https://player.vimeo.com/video/${id}`
  return url
}

function CarouselBlock({ block }: { block: any }) {
  const slides = block?.slides || []
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!block?.autoplay || slides.length <= 1) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, block?.interval || 4000)

    return () => clearInterval(timer)
  }, [block?.autoplay, block?.interval, slides.length])

  if (!slides.length) return null

  return (
    <div className="fr-media-card fr-carousel">
      {slides.map((slide: any, index: number) => {
        const active = index === activeIndex
        return (
          <div
            key={index}
            className={`fr-slide ${active ? 'active' : ''}`}
            aria-hidden={!active}
          >
            {slide.mediaType === 'image' && toMediaUrl(slide.image) && (
              <Image src={toMediaUrl(slide.image)} alt={`Slide ${index + 1}`} fill style={{ objectFit: 'cover' }} />
            )}
            {slide.mediaType === 'video' && toMediaUrl(slide.videoFile) && (
              <video src={toMediaUrl(slide.videoFile)} className="fr-video" controls muted playsInline />
            )}
            {slide.mediaType === 'youtube' && slide.youtubeUrl && (
              <iframe
                src={getYouTubeEmbed(slide.youtubeUrl)}
                title={`Slide video ${index + 1}`}
                className="fr-iframe"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        )
      })}

      {block?.showArrows && slides.length > 1 && (
        <>
          <button className="fr-arrow fr-arrow-prev" onClick={() => setActiveIndex((activeIndex - 1 + slides.length) % slides.length)}>
            ‹
          </button>
          <button className="fr-arrow fr-arrow-next" onClick={() => setActiveIndex((activeIndex + 1) % slides.length)}>
            ›
          </button>
        </>
      )}

      {block?.showDots && slides.length > 1 && (
        <div className="fr-dots">
          {slides.map((_: any, i: number) => (
            <button
              key={i}
              className={`fr-dot ${i === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function renderColumnItem(block: any, key: string) {
  switch (block.blockType) {
    case 'frRichText': {
      const richTextHtml = lexicalToHtml(block.content)
      return (
        <div
          key={key}
          className="fr-media-card fr-richtext"
          style={{
            backgroundColor: block.backgroundColor || '#f8fafc',
            fontFamily: block.fontFamily || 'Inter',
            fontSize: fontSizeMap[block.fontSize || 'base'] || fontSizeMap.base,
            color: block.textColor || '#111827',
          }}
        >
          <div className="fr-richtext-inner" dangerouslySetInnerHTML={{ __html: richTextHtml }} />
        </div>
      )
    }

    case 'frImage': {
      const src = toMediaUrl(block.image)
      if (!src) return null
      return (
        <div key={key} className="fr-media-card" style={{ backgroundColor: block.backgroundColor || '#f8fafc' }}>
          <Image src={src} alt={block.caption || 'Flexible row image'} fill style={{ objectFit: block.objectFit || 'cover' }} />
          {block.caption ? (
            <div className="fr-caption" style={{ color: block.captionColor || '#111827' }}>
              {block.caption}
            </div>
          ) : null}
          <style jsx>{`
            .fr-media-card { border-radius: ${radiusMap[block.borderRadius || 'md'] || radiusMap.md}; }
          `}</style>
        </div>
      )
    }

    case 'frVideo': {
      const autoplay = !!block.autoplay
      const loop = !!block.loop
      const controls = block.showControls !== false
      const poster = toMediaUrl(block.posterImage)

      let source: React.ReactNode = null
      if (block.sourceType === 'upload' && toMediaUrl(block.videoFile)) {
        source = (
          <video
            className="fr-video"
            src={toMediaUrl(block.videoFile)}
            poster={poster || undefined}
            autoPlay={autoplay}
            muted={autoplay}
            loop={loop}
            controls={controls}
            playsInline
          />
        )
      }
      if (block.sourceType === 'external' && block.externalUrl) {
        source = (
          <video
            className="fr-video"
            src={block.externalUrl}
            poster={poster || undefined}
            autoPlay={autoplay}
            muted={autoplay}
            loop={loop}
            controls={controls}
            playsInline
          />
        )
      }
      if (block.sourceType === 'youtube' && block.youtubeUrl) {
        source = <iframe className="fr-iframe" src={getYouTubeEmbed(block.youtubeUrl)} title="YouTube video" allow="autoplay; encrypted-media" allowFullScreen />
      }
      if (block.sourceType === 'vimeo' && block.vimeoUrl) {
        source = <iframe className="fr-iframe" src={getVimeoEmbed(block.vimeoUrl)} title="Vimeo video" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
      }

      return (
        <div key={key} className="fr-media-card" style={{ backgroundColor: block.backgroundColor || '#f8fafc' }}>
          {source}
        </div>
      )
    }

    case 'frCarousel':
      return (
        <div key={key} style={{ backgroundColor: block.backgroundColor || '#f8fafc', borderRadius: '12px' }}>
          <CarouselBlock block={block} />
        </div>
      )

    case 'frMapEmbed': {
      const height = `${Math.max(120, Number(block.height || 360))}px`
      return (
        <div key={key} className="fr-media-card" style={{ aspectRatio: '16 / 9', backgroundColor: block.backgroundColor || '#f8fafc' }}>
          {block.embedType === 'iframeUrl' && block.iframeUrl ? (
            <iframe
              src={block.iframeUrl}
              title="Embed"
              loading="lazy"
              allowFullScreen
              className="fr-iframe"
              style={{ height }}
            />
          ) : null}
          {block.embedType === 'html' && block.embedHtml ? (
            <div style={{ width: '100%', height, overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: block.embedHtml }} />
          ) : null}
        </div>
      )
    }

    case 'frAnimation': {
      return (
        <div key={key} className="fr-media-card" style={{ backgroundColor: block.backgroundColor || '#f8fafc' }}>
          {block.animationType === 'lottie' && block.lottieUrl ? (
            <iframe
              className="fr-iframe"
              src={`https://lottie.host/?src=${encodeURIComponent(block.lottieUrl)}&loop=${block.loop ? '1' : '0'}&autoplay=${block.autoplay ? '1' : '0'}`}
              title="Lottie animation"
            />
          ) : null}
          {block.animationType === 'gif' && toMediaUrl(block.gif) ? (
            <Image src={toMediaUrl(block.gif)} alt="GIF animation" fill style={{ objectFit: 'cover' }} />
          ) : null}
        </div>
      )
    }

    case 'frPeople': {
      const people = Array.isArray(block.people) ? block.people : []
      return (
        <div key={key} className="fr-media-card fr-people" style={{ backgroundColor: block.backgroundColor || '#f8fafc' }}>
          <div className="fr-people-inner">
            {block.title ? <h4 className="fr-people-title">{block.title}</h4> : null}
            {people.length === 0 ? <p className="fr-people-empty">No people selected.</p> : null}
            {people.map((person: any, i: number) => (
              <div key={person?.id || i} className="fr-person-row">
                <div className="fr-person-avatar">
                  {toMediaUrl(person?.image) ? (
                    <Image
                      src={toMediaUrl(person.image)}
                      alt={person?.name || 'Person'}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <span>{(person?.name || 'P').charAt(0)}</span>
                  )}
                </div>
                <div className="fr-person-meta">
                  <strong>{person?.name || 'Unnamed Person'}</strong>
                  {person?.specialty ? <small>{person.specialty}</small> : null}
                  {block.showStats && (person?.studentCount || person?.rating) ? (
                    <small>
                      {person?.studentCount ? `${person.studentCount} students` : ''}
                      {person?.studentCount && person?.rating ? ' • ' : ''}
                      {person?.rating ? `${person.rating} rating` : ''}
                    </small>
                  ) : null}
                </div>
                {block.showSocialLinks && Array.isArray(person?.socialLinks) && person.socialLinks.length > 0 ? (
                  <div className="fr-person-social">
                    {person.socialLinks.slice(0, 3).map((social: any, sIndex: number) => (
                      <a key={sIndex} href={social?.url || '#'} target="_blank" rel="noopener noreferrer">
                        <i className={`bi bi-${social?.platform || 'link-45deg'}`}></i>
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )
    }

    default:
      return null
  }
}

export default function FlexibleRowBlock(props: Props) {
  const {
    heading,
    description,
    alignment = 'center',
    sectionBackgroundColor = '#ffffff',
    columnGap = 'medium',
    verticalAlignment = 'stretch',
    columns = [],
  } = props

  const gridTemplateColumns = useMemo(() => {
    if (columns.length <= 0) return '1fr'
    if (columns.length >= 4) return 'repeat(2, minmax(0, 1fr))'

    const widthFr = columns.map((col: any) => {
      const val = col?.width || 'auto'
      if (val === 'auto') return 1
      if (val === '25') return 1
      if (val === '33') return 1.33
      if (val === '50') return 2
      if (val === '66') return 2.66
      if (val === '75') return 3
      if (val === '100') return 4
      return 1
    })

    return widthFr.map((f: number) => `${f}fr`).join(' ')
  }, [columns])

  const alignItems =
    verticalAlignment === 'top'
      ? 'start'
      : verticalAlignment === 'center'
        ? 'center'
        : verticalAlignment === 'bottom'
          ? 'end'
          : 'stretch'

  return (
    <section className="fr-section" style={{ backgroundColor: sectionBackgroundColor || '#ffffff' }}>
      <div className="container">
        {(heading || description) && (
          <div className="fr-header" style={{ textAlign: alignment }}>
            {heading ? <h2>{heading}</h2> : null}
            {description ? <p>{description}</p> : null}
          </div>
        )}

        <div
          className="fr-grid"
          style={{
            gap: gapMap[columnGap] || gapMap.medium,
            alignItems,
            gridTemplateColumns,
          }}
        >
          {columns.map((column: any, index: number) => (
            <div
              key={index}
              className="fr-column"
              style={{
                backgroundColor: column.backgroundColor || '#ffffff',
                padding: paddingMap[column.padding || 'medium'] || paddingMap.medium,
              }}
            >
              <div className="fr-column-stack">
                {(column.items || []).map((item: any, itemIndex: number) =>
                  renderColumnItem(item, `${index}-${itemIndex}`),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .fr-section {
          padding: 64px 0;
        }

        .fr-header {
          margin-bottom: 24px;
        }

        .fr-grid {
          display: grid;
        }

        .fr-column {
          border-radius: 12px;
          min-width: 0;
        }

        .fr-column-stack {
          display: grid;
          gap: 12px;
        }

        .fr-media-card {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: 12px;
          background: #f8fafc;
        }

        .fr-richtext {
          overflow: hidden;
        }

        .fr-richtext-inner {
          height: 100%;
          overflow: auto;
          padding: 12px;
        }

        .fr-people-inner {
          height: 100%;
          overflow: auto;
          padding: 12px;
          display: grid;
          gap: 10px;
          align-content: start;
        }

        .fr-people-title {
          margin: 0 0 4px;
          font-size: 1rem;
        }

        .fr-people-empty {
          margin: 0;
          color: #64748b;
          font-size: 0.875rem;
        }

        .fr-person-row {
          display: grid;
          grid-template-columns: 40px 1fr auto;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.75);
        }

        .fr-person-avatar {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 9999px;
          overflow: hidden;
          background: #e2e8f0;
          display: grid;
          place-items: center;
          font-weight: 700;
          color: #334155;
        }

        .fr-person-meta {
          display: grid;
          line-height: 1.2;
          gap: 2px;
        }

        .fr-person-meta strong {
          font-size: 0.9rem;
        }

        .fr-person-meta small {
          color: #64748b;
          font-size: 0.75rem;
        }

        .fr-person-social {
          display: flex;
          gap: 6px;
        }

        .fr-person-social a {
          color: #0f172a;
          font-size: 0.85rem;
        }

        .fr-video,
        .fr-iframe {
          width: 100%;
          height: 100%;
          border: 0;
          object-fit: cover;
        }

        .fr-caption {
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 10px;
          padding: 6px 10px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.86);
          font-size: 0.875rem;
        }

        .fr-carousel .fr-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }

        .fr-carousel .fr-slide.active {
          opacity: 1;
          pointer-events: auto;
        }

        .fr-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.64);
          color: #fff;
          font-size: 22px;
          line-height: 1;
          display: grid;
          place-items: center;
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 3;
          cursor: pointer;
        }

        .fr-carousel:hover .fr-arrow {
          opacity: 1;
        }

        .fr-arrow-prev {
          left: 10px;
        }

        .fr-arrow-next {
          right: 10px;
        }

        .fr-dots {
          position: absolute;
          bottom: 10px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 8px;
          z-index: 4;
        }

        .fr-dot {
          width: 10px;
          height: 10px;
          border: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          cursor: pointer;
        }

        .fr-dot.active {
          background: #fff;
        }

        @media (max-width: 768px) {
          .fr-grid {
            grid-template-columns: 1fr !important;
          }

          .fr-section {
            padding: 40px 0;
          }
        }
      `}</style>
    </section>
  )
}
