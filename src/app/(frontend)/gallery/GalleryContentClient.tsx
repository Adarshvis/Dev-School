"use client"

import React from 'react'
import MediaLightbox, { type MediaLightboxItem } from '@/app/(frontend)/components/MediaLightbox'

type GalleryImage = {
  image?: unknown
  caption?: string
  alt?: string
  mediaType?: string
  videoSource?: string
  videoUpload?: unknown
  youtubeUrl?: string
}

type GalleryBlock = {
  title?: string
  description?: string
  images?: GalleryImage[]
}

type Props = {
  galleryBlocks: GalleryBlock[]
  totalImages: number
}

const getMediaUrl = (value: unknown): string => {
  if (!value) return ''
  if (typeof value === 'object' && value && 'url' in (value as Record<string, unknown>)) {
    return String((value as { url?: unknown }).url || '').trim()
  }
  return String(value).trim()
}

const getYouTubeWatchUrl = (url: string): string => {
  const raw = String(url || '').trim()
  if (!raw) return ''

  const match = raw.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)
  const id = match ? match[1] : ''
  return id ? `https://www.youtube.com/watch?v=${id}` : ''
}

const toLightboxItem = (item: GalleryImage, index: number): MediaLightboxItem | null => {
  const mediaType = String(item?.mediaType || (item?.videoUpload || item?.youtubeUrl ? 'video' : 'image')).toLowerCase()

  if (mediaType === 'video') {
    const videoSource = String(item?.videoSource || (item?.youtubeUrl ? 'youtube' : 'upload')).toLowerCase()

    if (videoSource === 'youtube') {
      const watchUrl = getYouTubeWatchUrl(String(item?.youtubeUrl || ''))
      if (!watchUrl) return null
      return {
        type: 'video',
        src: watchUrl,
        caption: item?.caption,
        alt: item?.alt || `Gallery video ${index + 1}`,
      }
    }

    const videoUrl = getMediaUrl(item?.videoUpload)
    if (!videoUrl) return null

    return {
      type: 'video',
      src: videoUrl,
      caption: item?.caption,
      alt: item?.alt || `Gallery video ${index + 1}`,
    }
  }

  const imageUrl = getMediaUrl(item?.image)
  if (!imageUrl) return null

  return {
    type: 'image',
    src: imageUrl,
    caption: item?.caption,
    alt: item?.alt || `Gallery image ${index + 1}`,
  }
}

const renderCardMedia = (item: GalleryImage, index: number): React.ReactNode => {
  const mediaType = String(item?.mediaType || (item?.videoUpload || item?.youtubeUrl ? 'video' : 'image')).toLowerCase()

  if (mediaType === 'video') {
    const videoSource = String(item?.videoSource || (item?.youtubeUrl ? 'youtube' : 'upload')).toLowerCase()

    if (videoSource === 'youtube') {
      const thumbnail = getMediaUrl(item?.image)
      if (thumbnail) {
        return <img src={thumbnail} alt={item?.alt || item?.caption || `Gallery video ${index + 1}`} className="img-fluid" />
      }
    }

    const videoUrl = getMediaUrl(item?.videoUpload)
    if (videoUrl) {
      return (
        <video preload="metadata" muted playsInline className="img-fluid">
          <source src={videoUrl} />
        </video>
      )
    }
  }

  const imageUrl = getMediaUrl(item?.image)
  if (!imageUrl) return null

  return <img src={imageUrl} alt={item?.alt || item?.caption || `Gallery image ${index + 1}`} className="img-fluid" />
}

export default function GalleryContentClient({ galleryBlocks, totalImages }: Props) {
  const [lightboxItems, setLightboxItems] = React.useState<MediaLightboxItem[]>([])
  const [activeIndex, setActiveIndex] = React.useState(0)

  const openLightbox = React.useCallback((items: MediaLightboxItem[], index: number) => {
    if (!items.length) return
    setLightboxItems(items)
    setActiveIndex(index)
  }, [])

  const closeLightbox = React.useCallback(() => {
    setLightboxItems([])
    setActiveIndex(0)
  }, [])

  return (
    <>
      <div className="section-title gallery-v2-header text-center mb-4" data-aos="fade-up">
        <h2>All Gallery Images</h2>
        <p>{totalImages} media items</p>
      </div>

      {galleryBlocks.map((gallery, galleryIndex) => {
        const sourceItems = Array.isArray(gallery.images) ? gallery.images : []
        const normalizedItems = sourceItems
          .map((item, index) => toLightboxItem(item, index))
          .filter((item): item is MediaLightboxItem => Boolean(item))

        return (
          <div key={galleryIndex} className="mb-5">
            {(gallery.title || gallery.description) && (
              <div className="mb-3">
                {gallery.title ? <h4>{gallery.title}</h4> : null}
                {gallery.description ? <p className="mb-0">{gallery.description}</p> : null}
              </div>
            )}

            <div className="gallery-v2-grid">
              {sourceItems.map((item, imageIndex) => {
                const mediaEntry = toLightboxItem(item, imageIndex)
                if (!mediaEntry) return null

                const normalizedIndex = normalizedItems.findIndex((entry) => entry.src === mediaEntry.src && entry.type === mediaEntry.type)
                const isVideo = mediaEntry.type === 'video'

                return (
                  <div
                    key={`${galleryIndex}-${imageIndex}`}
                    className="gallery-v2-item"
                    data-aos="fade-up"
                    data-aos-delay={Math.min(90 + imageIndex * 70, 500)}
                  >
                    <button
                      type="button"
                      className="gallery-item gallery-v2-card gallery-v2-open"
                      onClick={() => openLightbox(normalizedItems, Math.max(0, normalizedIndex))}
                      aria-label={`Open ${isVideo ? 'video' : 'image'} ${imageIndex + 1}`}
                    >
                      {renderCardMedia(item, imageIndex)}
                      <div className="gallery-v2-overlay">
                        <div className="gallery-v2-overlay-content">
                          <div>
                            <span className="gallery-v2-overlay-line" aria-hidden="true" />
                            <span className="gallery-v2-overlay-label">{item.caption || item.alt || `Media ${imageIndex + 1}`}</span>
                          </div>
                          <span className="gallery-v2-zoom" aria-hidden="true">
                            <i className={`bi ${isVideo ? 'bi-play-circle' : 'bi-search'}`} />
                          </span>
                        </div>
                      </div>
                      <span className="gallery-v2-camera" aria-hidden="true">
                        <i className={`bi ${isVideo ? 'bi-camera-video' : 'bi-camera'}`} />
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {lightboxItems.length > 0 ? (
        <MediaLightbox items={lightboxItems} initialIndex={activeIndex} onClose={closeLightbox} />
      ) : null}
    </>
  )
}
