"use client"

import React from 'react'
import Link from 'next/link'
import LucideIcon from './LucideIcon'
import FlexibleRowBlock from './blocks/FlexibleRowBlock'
import CountUpValue from './CountUpValue'
import { lexicalToHtml } from '@/lib/lexicalToHtml'
import MediaLightbox, { type MediaLightboxItem } from './MediaLightbox'

interface BlockRendererProps {
  blocks?: any[]
}

const getCardDescription = (value: unknown): string => {
  if (!value) return ''
  const text = String(value).replace(/\s+/g, ' ').trim()
  if (!text) return ''
  return text.length > 140 ? `${text.slice(0, 140).trim()}...` : text
}

const parseCounter = (value: unknown): { end: number; suffix: string } => {
  const text = String(value || '').trim()
  const numeric = text.match(/\d+(?:\.\d+)?/)
  if (!numeric) return { end: 0, suffix: '' }

  const end = Math.floor(Number(numeric[0]) || 0)
  const suffix = text.replace(numeric[0], '').trim()
  return { end, suffix }
}

const isExternalHref = (value: string): boolean => /^(https?:\/\/|mailto:|tel:)/i.test(value)

const normalizeProfilePath = (value: string): string => {
  const raw = String(value || '').trim()
  if (!raw) return ''

  if (/^\/?people-id-/i.test(raw)) {
    const normalized = raw.replace(/^\/?people-id-/i, 'id-')
    return `/people/${normalized}`
  }

  if (/^\/?instructors-id-/i.test(raw)) {
    const normalized = raw.replace(/^\/?instructors-id-/i, 'id-')
    return `/people/${normalized}`
  }

  if (/^\/people-profile\//i.test(raw)) {
    return raw.replace(/^\/people-profile\//i, '/people/')
  }

  if (/^\/instructor-profile\//i.test(raw)) {
    return raw.replace(/^\/instructor-profile\//i, '/people/')
  }

  if (/^\/instructors\//i.test(raw)) {
    return raw.replace(/^\/instructors\//i, '/people/')
  }

  return raw
}

const getPersonProfileHref = (person: any): string => {
  const explicitProfileLink = String(person?.profileLink || '').trim()
  if (explicitProfileLink !== '') {
    return normalizeProfilePath(explicitProfileLink)
  }

  const personId = String(person?.id || person?._id || '').trim()
  if (personId !== '') {
    return `/people/id-${personId}`
  }

  if (person?.slug && String(person.slug).trim() !== '') {
    return `/people/${String(person.slug).trim()}`
  }

  if (person?.name && String(person.name).trim() !== '') {
    const generatedSlug = String(person.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    if (generatedSlug) {
      return `/people/${generatedSlug}`
    }
  }

  return '/people'
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'cardGrid':
            return <CardGridBlock key={index} {...block} />
          case 'video':
            return <VideoBlock key={index} {...block} />
          case 'imageGallery':
            return <ImageGalleryBlock key={index} {...block} />
          case 'testimonials':
            return <TestimonialsBlock key={index} {...block} />
          case 'cta':
            return <CTABlock key={index} {...block} />
          case 'richText':
            return <RichTextBlock key={index} {...block} />
          case 'stats':
            return <StatsBlock key={index} {...block} />
          case 'faq':
            return <FAQBlock key={index} {...block} />
          case 'form':
            return <FormBlock key={index} {...block} />
          case 'formBuilder':
            return <FormBuilderBlock key={index} {...block} />
          case 'countdown':
            return <CountdownBlock key={index} {...block} />
          case 'socialFeed':
            return <SocialFeedBlock key={index} {...block} />
          case 'customCode':
            return <CustomCodeBlock key={index} {...block} />
          case 'map':
            return <MapBlock key={index} {...block} />
          case 'people':
            return <PeopleBlock key={index} {...block} />
          case 'tabs':
            return <TabsBlock key={index} {...block} />
          case 'flexibleRow':
            return <FlexibleRowBlock key={index} {...block} />
          default:
            console.warn('Unknown block type:', block.blockType)
            return <div className="alert alert-warning m-3">Unknown block type: {block.blockType}</div>
        }
      })}
    </>
  )
}

/* ── Card Carousel (image slideshow inside carousel-layout cards) ── */
interface CardCarouselProps {
  images: { url: string; alt: string }[]
  carouselId: string
  autoplayInterval?: number
  showDots?: boolean
  showArrows?: boolean
  pauseOnHover?: boolean
}

const CardCarousel: React.FC<CardCarouselProps> = ({ images, carouselId, autoplayInterval = 5, showDots = true, showArrows = true, pauseOnHover = true }) => {
  const [active, setActive] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const count = images.length

  const prev = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setActive((active - 1 + count) % count) }
  const next = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setActive((active + 1) % count) }

  // Autoplay
  React.useEffect(() => {
    if (count <= 1 || autoplayInterval <= 0 || paused) return
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % count)
    }, autoplayInterval * 1000)
    return () => clearInterval(timer)
  }, [count, autoplayInterval, paused, active])

  if (count === 0) return null

  return (
    <div
      className="card-carousel"
      id={carouselId}
      onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
    >
      <div className="card-carousel-inner">
        {images.map((img, i) => (
          <div key={i} className={`card-carousel-slide${i === active ? ' active' : ''}`}>
            <img src={img.url} alt={img.alt} />
          </div>
        ))}
      </div>
      {count > 1 && (
        <>
          {showArrows && (
            <>
              <button type="button" className="card-carousel-arrow card-carousel-prev" onClick={prev} aria-label="Previous image">
                <i className="bi bi-chevron-left"></i>
              </button>
              <button type="button" className="card-carousel-arrow card-carousel-next" onClick={next} aria-label="Next image">
                <i className="bi bi-chevron-right"></i>
              </button>
            </>
          )}
          {showDots && (
            <div className="card-carousel-dots">
              {images.map((_, i) => (
                <button key={i} type="button" className={`card-carousel-dot${i === active ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActive(i) }} aria-label={`Go to image ${i + 1}`} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

const CardGridBlock: React.FC<any> = ({ title, description, descriptionRich, columns, cardAlignment, cardLayout, cardClickBehavior, slideInterval, showDots, showArrows, pauseOnHover, cards }) => {
  if (!Array.isArray(cards) || cards.length === 0) return null

  const isCarousel = cardLayout === 'carousel'
  const isClickable = cardClickBehavior === 'clickable'
  const textAlign = (cardAlignment as 'left' | 'center' | 'right') || 'left'

  // Convert a textColor to a CSS filter so uploaded SVG/PNG icons match the text color.
  // `<img>` tags ignore CSS `color`, so we use filter instead.
  const getIconFilter = (color: string): string | undefined => {
    if (!color) return undefined
    const c = color.toLowerCase().replace(/\s/g, '')
    // White variants → invert black to white
    if (c === '#fff' || c === '#ffffff' || c === 'white' || c === 'rgb(255,255,255)') return 'brightness(0) invert(1)'
    // Dark / black variants → darken to black
    if (c === '#000' || c === '#000000' || c === 'black' || c === 'rgb(0,0,0)') return 'brightness(0)'
    // For other colors: sepia + hue-rotate approximation (best-effort)
    return 'brightness(0) saturate(100%)'
  }

  const columnClass =
    columns === '2'
      ? 'col-lg-6 col-md-6'
      : columns === '4'
        ? 'col-xl-3 col-lg-4 col-md-6'
        : 'col-lg-4 col-md-6'

  const blockDescHtml = descriptionRich
    ? lexicalToHtml(descriptionRich)
    : description
      ? `<p>${String(description).replace(/\n/g, '</p><p>')}</p>`
      : ''

  return (
    <section className="cards-section section">
      <div className="container">
        {(title || blockDescHtml) && (
          <div className="section-title text-center mb-3" data-aos="fade-up">
            {title && <h2>{title}</h2>}
            {blockDescHtml && <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: blockDescHtml }} />}
          </div>
        )}

        <div className="row g-4">
          {cards.map((card: any, index: number) => {
            // Build images list from the images array
            const allImages: { url: string; alt: string }[] = []
            if (Array.isArray(card?.images)) {
              card.images.forEach((img: any) => {
                const url = typeof img.image === 'object' ? img.image?.url : img.image
                if (url) allImages.push({ url, alt: card?.title || `Card ${index + 1}` })
              })
            }
            // Fallback: legacy single image field
            if (allImages.length === 0 && card?.image) {
              const legacyUrl = typeof card.image === 'object' ? card.image.url : card.image
              if (legacyUrl) allImages.push({ url: legacyUrl, alt: card?.title || `Card ${index + 1}` })
            }

            const imageUrl = allImages.length > 0 ? allImages[0].url : undefined
            const linkText = String(card?.linkText || '').trim() || 'Learn More'
            const href = String(card?.link || '').trim()
            const bgColor = String(card?.backgroundColor || '').trim()
            const txtColor = String(card?.textColor || '').trim()
            const descHtml = card?.descriptionRich
              ? lexicalToHtml(card.descriptionRich)
              : card?.description
                ? `<p>${String(card.description).replace(/\n/g, '</p><p>')}</p>`
                : ''

            const cardStyle: React.CSSProperties = {}
            if (bgColor) cardStyle.backgroundColor = bgColor
            if (txtColor) cardStyle.color = txtColor

            // Carousel card layout
            if (isCarousel) {
              const carouselId = `card-carousel-${index}`
              const cardInner = (
                <div
                  className={`card h-100 card-carousel-card${isClickable && href ? ' card-clickable' : ''}`}
                  style={cardStyle}
                  data-aos="fade-up"
                  data-aos-delay={Math.min(index * 80, 320)}
                >
                  {allImages.length > 0 && (
                    <CardCarousel
                      images={allImages}
                      carouselId={carouselId}
                      autoplayInterval={slideInterval ?? 5}
                      showDots={showDots !== false}
                      showArrows={showArrows !== false}
                      pauseOnHover={pauseOnHover !== false}
                    />
                  )}
                  <div className="card-body d-flex flex-column" style={{ textAlign }}>
                    {card?.title && <h5 className="card-title">{card.title}</h5>}
                    {descHtml && <div className="card-text rich-text-content" dangerouslySetInnerHTML={{ __html: descHtml }} />}
                    {!isClickable && href && (
                      <div className="mt-auto pt-2">
                        {isExternalHref(href) ? (
                          <a href={href} className="btn btn-primary" target="_blank" rel="noopener noreferrer">{linkText}</a>
                        ) : (
                          <Link href={href} className="btn btn-primary">{linkText}</Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )

              return (
                <div key={index} className={columnClass}>
                  {isClickable && href ? (
                    isExternalHref(href) ? (
                      <a href={href} className="card-carousel-link" target="_blank" rel="noopener noreferrer">{cardInner}</a>
                    ) : (
                      <Link href={href} className="card-carousel-link">{cardInner}</Link>
                    )
                  ) : cardInner}
                </div>
              )
            }

            // Default card layout
            return (
              <div key={index} className={columnClass}>
                <div
                  className="card h-100"
                  style={cardStyle}
                  data-aos="fade-up"
                  data-aos-delay={Math.min(index * 80, 320)}
                >
                  {imageUrl ? <img src={imageUrl} className="card-img-top" alt={card?.title || `Card ${index + 1}`} /> : null}
                  <div className="card-body d-flex flex-column" style={{ textAlign }}>
                    <div className="d-flex align-items-center gap-2 mb-3" style={{ justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start' }}>
                      {card?.iconType === 'upload' && card?.customIcon ? (
                        (() => {
                          const iconUrl = typeof card.customIcon === 'object' ? card.customIcon?.url : card.customIcon
                          const iconFilter = getIconFilter(txtColor)
                          return iconUrl
                            ? <img src={iconUrl} alt="" aria-hidden="true" className="card-icon flex-shrink-0" style={{ width: 28, height: 28, objectFit: 'contain', filter: iconFilter }} />
                            : null
                        })()
                      ) : card?.iconType !== 'bootstrap' && card?.lucideIcon ? (
                        <LucideIcon name={card.lucideIcon} size={28} className="card-icon flex-shrink-0" style={txtColor ? { color: txtColor } : undefined} aria-hidden="true" />
                      ) : card?.icon ? (
                        <i className={`bi ${card.icon} card-icon flex-shrink-0`} style={txtColor ? { color: txtColor } : undefined} aria-hidden="true"></i>
                      ) : null}
                      {card?.title ? <h5 className="card-title mb-0">{card.title}</h5> : null}
                    </div>
                    {descHtml ? <div className="card-text rich-text-content" dangerouslySetInnerHTML={{ __html: descHtml }} /> : null}
                    {href ? (
                      <div className="mt-auto pt-2">
                        {isExternalHref(href) ? (
                          <a href={href} className="btn btn-outline-primary" target="_blank" rel="noopener noreferrer">
                            {linkText}
                          </a>
                        ) : (
                          <Link href={href} className="btn btn-outline-primary">
                            {linkText}
                          </Link>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const TabsBlock: React.FC<any> = ({ title, description, tabs, tabStyle }) => {
  const normalizedTabs = Array.isArray(tabs) ? tabs.filter(Boolean) : []
  const [activeIndex, setActiveIndex] = React.useState(0)

  React.useEffect(() => {
    if (activeIndex > normalizedTabs.length - 1) {
      setActiveIndex(0)
    }
  }, [activeIndex, normalizedTabs.length])

  if (normalizedTabs.length === 0) return null

  const activeTab = normalizedTabs[activeIndex]
  const tabStyleClass =
    tabStyle === 'pills' ? 'tabs-style-pills' : tabStyle === 'buttons' ? 'tabs-style-buttons' : 'tabs-style-underline'

  return (
    <section className={`tabs-content-block section ${tabStyleClass}`}>
      <div className="container">
        {(title || description) && (
          <div className="section-title text-center mb-3" data-aos="fade-up">
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        )}

        <div className="tabs-nav" role="tablist" aria-label={title || 'Content Tabs'}>
          {normalizedTabs.map((tab: any, index: number) => {
            const tabId = `tab-${index}`
            const panelId = `tab-panel-${index}`
            const isActive = activeIndex === index
            const savedIcon = String(tab?.icon || '').trim()
            const customIcon = String(tab?.customIcon || '').trim()
            const iconClass = savedIcon === 'custom' ? customIcon : savedIcon

            return (
              <button
                key={tabId}
                id={tabId}
                type="button"
                role="tab"
                className={`tabs-nav-btn ${isActive ? 'is-active' : ''}`}
                aria-selected={isActive}
                aria-controls={panelId}
                onClick={() => setActiveIndex(index)}
              >
                {iconClass ? <i className={`${iconClass} me-2`} aria-hidden="true"></i> : null}
                <span>{String(tab?.label || `Tab ${index + 1}`)}</span>
              </button>
            )
          })}
        </div>

        <div
          id={`tab-panel-${activeIndex}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeIndex}`}
          className="tabs-panel"
        >
          {Array.isArray(activeTab?.content) && activeTab.content.length > 0 ? (
            <BlockRenderer blocks={activeTab.content} />
          ) : (
            <p className="tabs-panel-empty mb-0">No content added for this tab yet.</p>
          )}
        </div>
      </div>
    </section>
  )
}

// Video Block Component
const VideoBlock: React.FC<any> = ({ videoType, videoUrl, videoFile, title, description, aspectRatio, width, autoplay, loop }) => {
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return ''
    
    // Extract video ID from various YouTube URL formats
    let videoId = ''
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = new URL(url).searchParams.get('v') || ''
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || ''
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || ''
    } else {
      // Assume it's just the video ID
      videoId = url
    }
    
    // Build embed URL with parameters
    const params = new URLSearchParams()
    if (autoplay) {
      params.append('autoplay', '1')
      params.append('mute', '1') // YouTube requires mute for autoplay
    }
    if (loop) {
      params.append('loop', '1')
      params.append('playlist', videoId) // Required for loop
    }
    params.append('rel', '0') // Don't show related videos
    params.append('modestbranding', '1') // Minimal YouTube branding
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
  }

  const getVimeoEmbedUrl = (url: string) => {
    if (!url) return ''
    
    const videoId = url.split('/').pop()?.split('?')[0] || ''
    const params = new URLSearchParams()
    if (autoplay) params.append('autoplay', '1')
    if (loop) params.append('loop', '1')
    
    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`
  }

  const getEmbedUrl = () => {
    if (videoType === 'youtube') {
      return getYouTubeEmbedUrl(videoUrl)
    }
    if (videoType === 'vimeo') {
      return getVimeoEmbedUrl(videoUrl)
    }
    return videoUrl
  }

  const containerClass = width === 'full' ? 'container-fluid' : width === 'wide' ? 'container-lg' : 'container'
  const aspectClass = aspectRatio?.replace(':', '-') || '16-9'

  return (
    <section className="video-block section">
      <div className={containerClass}>
        {(title || description) && (
          <div className="section-title text-center mb-3" data-aos="fade-up">
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        )}
        <div className={`video-container ratio ratio-${aspectClass}`} data-aos="fade-up" data-aos-delay="100" style={{ minHeight: '400px' }}>
          {videoType === 'selfhosted' && videoFile ? (
            <video controls className="w-100 rounded" style={{ objectFit: 'cover' }}>
              <source src={typeof videoFile === 'object' ? videoFile.url : videoFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <iframe
              src={getEmbedUrl()}
              title={title || 'Video'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded"
              style={{ width: '100%', height: '100%', minHeight: '400px' }}
            />
          )}
        </div>
      </div>
    </section>
  )
}

// Image Gallery Block Component
const ImageGalleryBlock: React.FC<any> = ({
  title,
  description,
  galleryType,
  images,
  columns,
  showViewMoreButton,
  viewMoreButtonText,
  viewMoreLink,
}) => {
  const [lightboxItems, setLightboxItems] = React.useState<MediaLightboxItem[]>([])
  const [activeLightboxIndex, setActiveLightboxIndex] = React.useState(0)

  const shouldShowViewMore = !!showViewMoreButton
  const galleryImages = shouldShowViewMore && galleryType !== 'carousel'
    ? (images || []).slice(0, 4)
    : (images || [])

  const viewMoreHref = String(viewMoreLink || '/gallery').trim() || '/gallery'
  const isAnimatedStrip = String(galleryType || '') === 'animatedStrip'
  const marqueeItems = isAnimatedStrip
    ? [...galleryImages, ...galleryImages]
    : []

  const getSpanClass = (index: number): string => {
    void index
    return ''
  }

  const getMediaUrl = (value: any): string => {
    if (!value) return ''
    return typeof value === 'object' ? (value.url || '') : String(value)
  }

  const getYouTubeEmbedUrl = (url: string): string => {
    const raw = String(url || '').trim()
    if (!raw) return ''

    const match = raw.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)
    const id = match ? match[1] : ''
    return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : ''
  }

  const getYouTubeWatchUrl = (url: string): string => {
    const raw = String(url || '').trim()
    if (!raw) return ''

    const match = raw.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)
    const id = match ? match[1] : ''
    return id ? `https://www.youtube.com/watch?v=${id}` : ''
  }

  const toLightboxItem = (item: any, index: number): MediaLightboxItem | null => {
    const mediaType = String(item?.mediaType || (item?.videoUpload || item?.youtubeUrl ? 'video' : 'image')).toLowerCase()

    if (mediaType === 'video') {
      const videoSource = String(item?.videoSource || (item?.youtubeUrl ? 'youtube' : 'upload')).toLowerCase()

      if (videoSource === 'youtube') {
        const watchUrl = getYouTubeWatchUrl(item?.youtubeUrl || '')
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

  const openLightbox = (items: MediaLightboxItem[], index: number) => {
    if (!items.length) return
    setLightboxItems(items)
    setActiveLightboxIndex(Math.max(0, index))
  }

  const closeLightbox = () => {
    setLightboxItems([])
    setActiveLightboxIndex(0)
  }

  const normalizedLightboxItems = galleryImages
    .map((item: any, index: number) => toLightboxItem(item, index))
    .filter((item: MediaLightboxItem | null): item is MediaLightboxItem => Boolean(item))

  const getNormalizedIndex = (item: any, index: number): number => {
    const candidate = toLightboxItem(item, index)
    if (!candidate) return 0

    const foundIndex = normalizedLightboxItems.findIndex((entry: MediaLightboxItem) => entry.src === candidate.src && entry.type === candidate.type)
    return Math.max(0, foundIndex)
  }

  const renderGalleryMedia = (item: any, index: number, isCarousel: boolean): React.ReactNode => {
    const mediaType = String(item?.mediaType || (item?.videoUpload || item?.youtubeUrl ? 'video' : 'image'))

    if (mediaType === 'video') {
      const videoSource = String(item?.videoSource || (item?.youtubeUrl ? 'youtube' : 'upload'))

      if (videoSource === 'youtube') {
        const embedUrl = getYouTubeEmbedUrl(item?.youtubeUrl || '')
        if (embedUrl) {
          return (
            <iframe
              src={embedUrl}
              title={item?.caption || `Gallery video ${index + 1}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className={isCarousel ? 'd-block w-100' : 'img-fluid'}
              style={
                isCarousel
                  ? { height: '500px', border: 'none' }
                  : { width: '100%', height: '100%', border: 'none', display: 'block' }
              }
            />
          )
        }
      }

      const videoUrl = getMediaUrl(item?.videoUpload)
      if (videoUrl) {
        return (
          <video
            controls
            preload="metadata"
            className={isCarousel ? 'd-block w-100' : 'img-fluid'}
            style={
              isCarousel
                ? { maxHeight: '500px', objectFit: 'cover' }
                : { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }
            }
          >
            <source src={videoUrl} />
            Your browser does not support the video tag.
          </video>
        )
      }
    }

    const imageUrl = getMediaUrl(item?.image)
    if (!imageUrl) return null

    return (
      <img
        src={imageUrl}
        alt={item?.alt || item?.caption || 'Gallery image'}
        className={isCarousel ? 'd-block w-100' : 'img-fluid'}
        style={
          isCarousel
            ? { maxHeight: '500px', objectFit: 'cover' }
            : { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }
        }
      />
    )
  }

  return (
    <section className="image-gallery-block gallery-v2 section">
      <div className="container">
        {(title || description) && (
          <div className="section-title gallery-v2-header text-center" data-aos="fade-up">
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        )}
        
        {galleryType === 'carousel' ? (
          <div id="galleryCarousel" className="carousel slide pointer-event" data-bs-ride="carousel" data-aos="fade-up" data-aos-delay="100">
            <div className="carousel-indicators">
              {galleryImages?.map((_: any, index: number) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#galleryCarousel"
                  data-bs-slide-to={index}
                  className={index === 0 ? 'active' : ''}
                  aria-current={index === 0 ? 'true' : 'false'}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
            <div className="carousel-inner rounded">
              {galleryImages?.map((item: any, index: number) => (
                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  {renderGalleryMedia(item, index, true)}
                  {item.caption && (
                    <div className="carousel-caption d-none d-md-block">
                      <p className="mb-0">{item.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#galleryCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#galleryCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        ) : isAnimatedStrip ? (
          <div className="gallery-v2-marquee" data-aos="fade-up" data-aos-delay="100">
            <div className="gallery-v2-marquee-track">
              {marqueeItems?.map((item: any, index: number) => (
                <div key={`marquee-${index}`} className="gallery-v2-marquee-item">
                  <button
                    type="button"
                    className="gallery-item gallery-v2-card gallery-v2-card-marquee gallery-v2-open"
                    onClick={() => openLightbox(normalizedLightboxItems, getNormalizedIndex(item, index))}
                    aria-label={`Open ${String(item?.mediaType || '').toLowerCase() === 'video' ? 'video' : 'image'} ${index + 1}`}
                  >
                    {renderGalleryMedia(item, index, false)}
                    <div className="gallery-v2-overlay">
                      <div className="gallery-v2-overlay-content">
                        <div>
                          <span className="gallery-v2-overlay-line" aria-hidden="true" />
                          <span className="gallery-v2-overlay-label">{item.caption || item.alt || `Photo ${index + 1}`}</span>
                        </div>
                        <span className="gallery-v2-zoom" aria-hidden="true">
                          <i className={`bi ${String(item?.mediaType || '').toLowerCase() === 'video' ? 'bi-play-circle' : 'bi-search'}`} />
                        </span>
                      </div>
                    </div>
                    <span className="gallery-v2-camera" aria-hidden="true">
                      <i className={`bi ${String(item?.mediaType || '').toLowerCase() === 'video' ? 'bi-camera-video' : 'bi-camera'}`} />
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : galleryType === 'bento' ? (
          <div className="gallery-v2-bento" data-aos="fade-up" data-aos-delay="100">
            {galleryImages?.map((item: any, index: number) => {
              const isTall = index % 3 === 0
              return (
                <div
                  key={index}
                  className={`gallery-v2-bento-item${isTall ? ' gallery-v2-bento-tall' : ''}`}
                  data-aos="fade-up"
                  data-aos-delay={Math.min(100 + (index * 80), 520)}
                >
                  <button
                    type="button"
                    className="gallery-item gallery-v2-card gallery-v2-open"
                    onClick={() => openLightbox(normalizedLightboxItems, getNormalizedIndex(item, index))}
                    aria-label={`Open ${String(item?.mediaType || '').toLowerCase() === 'video' ? 'video' : 'image'} ${index + 1}`}
                  >
                    {renderGalleryMedia(item, index, false)}
                    <div className="gallery-v2-overlay">
                      <div className="gallery-v2-overlay-content">
                        <div>
                          <span className="gallery-v2-overlay-line" aria-hidden="true" />
                          <span className="gallery-v2-overlay-label">{item.caption || item.alt || `Photo ${index + 1}`}</span>
                        </div>
                        <span className="gallery-v2-zoom" aria-hidden="true">
                          <i className={`bi ${String(item?.mediaType || '').toLowerCase() === 'video' ? 'bi-play-circle' : 'bi-search'}`} />
                        </span>
                      </div>
                    </div>
                    <span className="gallery-v2-camera" aria-hidden="true">
                      <i className={`bi ${String(item?.mediaType || '').toLowerCase() === 'video' ? 'bi-camera-video' : 'bi-camera'}`} />
                    </span>
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="gallery-v2-grid" data-aos="fade-up" data-aos-delay="100" style={{ '--gallery-columns': columns || '3' } as React.CSSProperties}>
            {galleryImages?.map((item: any, index: number) => (
              <div
                key={index}
                className={`gallery-v2-item ${getSpanClass(index)}`}
                data-aos="fade-up"
                data-aos-delay={Math.min(100 + (index * 80), 520)}
              >
                <button
                  type="button"
                  className="gallery-item gallery-v2-card gallery-v2-open"
                  onClick={() => openLightbox(normalizedLightboxItems, getNormalizedIndex(item, index))}
                  aria-label={`Open ${String(item?.mediaType || '').toLowerCase() === 'video' ? 'video' : 'image'} ${index + 1}`}
                >
                  {renderGalleryMedia(item, index, false)}
                  <div className="gallery-v2-overlay">
                    <div className="gallery-v2-overlay-content">
                      <div>
                        <span className="gallery-v2-overlay-line" aria-hidden="true" />
                        <span className="gallery-v2-overlay-label">{item.caption || item.alt || `Photo ${index + 1}`}</span>
                      </div>
                      <span className="gallery-v2-zoom" aria-hidden="true">
                        <i className={`bi ${String(item?.mediaType || '').toLowerCase() === 'video' ? 'bi-play-circle' : 'bi-search'}`} />
                      </span>
                    </div>
                  </div>
                  <span className="gallery-v2-camera" aria-hidden="true">
                    <i className={`bi ${String(item?.mediaType || '').toLowerCase() === 'video' ? 'bi-camera-video' : 'bi-camera'}`} />
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}

        {shouldShowViewMore && (
          <div className="text-center mt-4" data-aos="fade-up" data-aos-delay="180">
            <Link href={viewMoreHref} className="btn btn-primary gallery-v2-btn">
              <i className="bi bi-camera me-2" aria-hidden="true" />
              {viewMoreButtonText || 'View More'}
            </Link>
          </div>
        )}

        {lightboxItems.length > 0 ? (
          <MediaLightbox items={lightboxItems} initialIndex={activeLightboxIndex} onClose={closeLightbox} />
        ) : null}
      </div>
    </section>
  )
}

// Testimonials Block Component
const TestimonialsBlock: React.FC<any> = ({ title, description, layout, testimonials, showRating }) => {
  return (
    <section className="testimonials-block section">
      <div className="container">
        {(title || description) && (
          <div className="section-title" data-aos="fade-up">
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        )}
        
        <div className={`row ${layout === 'grid' ? 'gy-4' : ''}`}>
          {testimonials?.map((testimonial: any, index: number) => (
            <div key={index} className={layout === 'grid' ? 'col-lg-4 col-md-6' : 'col-12'} data-aos="fade-up" data-aos-delay={`${100 * (index + 1)}`}>
              <div className="testimonial-card p-4 rounded" style={{ background: 'var(--surface-color)', boxShadow: '0 5px 25px color-mix(in srgb, var(--default-color), transparent 90%)' }}>
                {showRating && testimonial.rating && (
                  <div className="rating mb-2">
                    {Array.from({ length: Math.floor(testimonial.rating) }, (_, i) => (
                      <i key={i} className="bi bi-star-fill text-warning"></i>
                    ))}
                  </div>
                )}
                <p className="testimonial-text">"{testimonial.testimonial}"</p>
                <div className="d-flex align-items-center mt-3">
                  {testimonial.avatar && (
                    <img
                      src={typeof testimonial.avatar === 'object' ? testimonial.avatar.url : testimonial.avatar}
                      alt={testimonial.name}
                      className="rounded-circle me-3"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <h6 className="mb-0">{testimonial.name}</h6>
                    {testimonial.role && <small className="text-muted">{testimonial.role}</small>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Block Component
const CTABlock: React.FC<any> = ({ style, heading, subheading, image, primaryButton, secondaryButton, backgroundColor }) => {
  const bgClass = backgroundColor === 'accent' ? 'bg-accent' : backgroundColor === 'dark' ? 'bg-dark text-white' : backgroundColor === 'light' ? 'bg-light' : ''
  
  return (
    <section className={`cta-block section ${bgClass}`}>
      <div className="container">
        <div className={`cta-content ${style === 'split' ? 'row align-items-center' : 'text-center'}`} data-aos="fade-up">
          {style === 'split' && image && (
            <div className="col-md-6">
              <img src={typeof image === 'object' ? image.url : image} alt={heading} className="img-fluid rounded" />
            </div>
          )}
          <div className={style === 'split' ? 'col-md-6' : ''}>
            <h2 className="mb-3">{heading}</h2>
            {subheading && <p className="mb-4">{subheading}</p>}
            <div className="cta-buttons">
              {primaryButton?.text && (
                <a href={primaryButton.link || '#'} className={`btn btn-${primaryButton.style || 'primary'} me-2`}>
                  {primaryButton.text}
                </a>
              )}
              {secondaryButton?.text && (
                <a href={secondaryButton.link || '#'} className={`btn btn-${secondaryButton.style || 'secondary'}`}>
                  {secondaryButton.text}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Rich Text Block Component
const RichTextBlock: React.FC<any> = ({ content, width }) => {
  const containerClass = width === 'narrow' ? 'container-narrow' : width === 'full' ? 'container-fluid' : 'container'
  const htmlContent = typeof content === 'string' ? content : lexicalToHtml(content)

  if (!htmlContent) {
    return null
  }
  
  return (
    <section className="rich-text-block section">
      <div className={containerClass}>
        <div className="rich-text-content" data-aos="fade-up" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </section>
  )
}

// Stats Block Component
const StatsBlock: React.FC<any> = ({ title, description, stats, layout }) => {
  const fallbackIcons = ['bi-people', 'bi-book', 'bi-trophy', 'bi-star']
  const normalizedTitle = String(title || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
  const showEyebrow = normalizedTitle !== 'by the numbers'

  return (
    <section
      className="stats-block section"
      style={{
        background: 'var(--cms-section-bg, var(--stats-block-bg, color-mix(in srgb, var(--heading-color), black 82%)))',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 56% 75% at 18% 8%, color-mix(in srgb, var(--primary-color, var(--accent-color)), transparent 90%) 0%, transparent 72%), radial-gradient(ellipse 70% 80% at 88% 95%, color-mix(in srgb, var(--accent-color), transparent 93%) 0%, transparent 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: 'radial-gradient(color-mix(in srgb, var(--secondary-foreground, #fff), transparent 94%) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.55,
        }}
      />

      <div className="container">
        {(title || description) && (
          <div className="section-title text-center" data-aos="fade-up">
            {showEyebrow && (
              <div className="d-inline-flex align-items-center gap-2 mb-2">
                <span style={{ width: '2rem', height: '2px', background: 'var(--primary-color, var(--accent-color))' }} />
                <span
                  style={{
                    fontSize: '0.72rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--primary-color, var(--accent-color))',
                    fontWeight: 700,
                  }}
                >
                  By The Numbers
                </span>
                <span style={{ width: '2rem', height: '2px', background: 'var(--primary-color, var(--accent-color))' }} />
              </div>
            )}

            {title && <h2 style={{ color: 'var(--heading-color)' }}>{title}</h2>}
            {description && (
              <p style={{ color: 'color-mix(in srgb, var(--secondary-foreground, #fff), transparent 30%)' }}>
                {description}
              </p>
            )}
          </div>
        )}

        <div
          className="row g-0"
          style={{
            borderTop: '1px solid color-mix(in srgb, var(--secondary-foreground, #fff), transparent 88%)',
          }}
        >
          {stats?.map((stat: any, index: number) => {
            const parsed = parseCounter(stat.number)
            const iconClass = String(stat?.icon || '').trim()
            const resolvedIcon = iconClass
              ? (iconClass.startsWith('bi ') ? iconClass : `bi ${iconClass}`)
              : `bi ${fallbackIcons[index % fallbackIcons.length]}`

            return (
              <div
                key={index}
                className="col-6 col-lg-3"
                data-aos="fade-up"
                data-aos-delay={`${120 * index}`}
              >
                <div className="stat-card text-center py-4 px-3 position-relative h-100 d-flex flex-column align-items-center justify-content-center">
                  {index > 0 && (
                    <div
                      className="d-none d-lg-block position-absolute"
                      style={{
                        left: 0,
                        top: '24px',
                        bottom: '24px',
                        width: '1px',
                        background: 'color-mix(in srgb, var(--accent-color), transparent 76%)',
                      }}
                    />
                  )}

                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '3.35rem',
                      height: '3.35rem',
                      borderRadius: '999px',
                      border: '1px solid color-mix(in srgb, var(--secondary-foreground, #fff), transparent 84%)',
                      background: 'color-mix(in srgb, var(--secondary-foreground, #fff), transparent 92%)',
                    }}
                  >
                    <i className={resolvedIcon} style={{ color: 'var(--accent-color)', fontSize: '1.15rem' }} />
                  </div>

                  <h3
                    className="stat-number mb-2"
                    style={{
                      fontSize: 'clamp(40px, 5vw, 68px)',
                      lineHeight: 1,
                      fontWeight: 700,
                      color: 'var(--accent-color)',
                      textShadow: '0 0 40px color-mix(in srgb, var(--accent-color), transparent 70%)',
                    }}
                  >
                    <CountUpValue end={parsed.end} suffix={parsed.suffix} />
                  </h3>

                  <p
                    className="stat-label mb-0"
                    style={{
                      color: 'color-mix(in srgb, var(--secondary-foreground, #fff), transparent 35%)',
                      letterSpacing: '0.06em',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </p>

                  <div
                    className="mx-auto mt-3"
                    style={{ width: '2rem', height: '2px', borderRadius: '999px', background: 'color-mix(in srgb, var(--accent-color), transparent 50%)' }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// FAQ Block Component
const FAQBlock: React.FC<any> = ({ title, description, faqs, layout, openFirst }) => {
  return (
    <section className="faq-block section">
      <div className="container">
        {(title || description) && (
          <div className="section-title" data-aos="fade-up">
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        )}
        
        <div className={layout === 'twoColumn' ? 'row' : ''}>
          <div className={layout === 'twoColumn' ? 'col-md-6' : ''}>
            <div className="accordion" id="faqAccordion" data-aos="fade-up" data-aos-delay="100">
              {faqs?.map((faq: any, index: number) => (
                <div key={index} className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${index === 0 && openFirst ? '' : 'collapsed'}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#faq${index}`}
                    >
                      {faq.question}
                    </button>
                  </h2>
                  <div
                    id={`faq${index}`}
                    className={`accordion-collapse collapse ${index === 0 && openFirst ? 'show' : ''}`}
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">{faq.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Form Block Component
const FormBlock: React.FC<any> = ({ formType, title, description, submitButtonText }) => {
  return (
    <section className="form-block section">
      <div className="container">
        {(title || description) && (
          <div className="section-title" data-aos="fade-up">
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        )}
        
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form data-aos="fade-up" data-aos-delay="100">
              {formType === 'newsletter' && (
                <div className="mb-3">
                  <input type="email" className="form-control" placeholder="Enter your email" required />
                </div>
              )}
              {formType === 'contact' && (
                <>
                  <div className="mb-3">
                    <input type="text" className="form-control" placeholder="Your Name" required />
                  </div>
                  <div className="mb-3">
                    <input type="email" className="form-control" placeholder="Your Email" required />
                  </div>
                  <div className="mb-3">
                    <textarea className="form-control" rows={4} placeholder="Your Message" required></textarea>
                  </div>
                </>
              )}
              <button type="submit" className="btn btn-primary w-100">
                {submitButtonText || 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

const resolveRelationId = (value: any): string => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'object') {
    if (value.id) return String(value.id)
    if (value._id) return String(value._id)
  }
  return ''
}

const FormBuilderBlock: React.FC<any> = ({ title, description, form, submitButtonText }) => {
  const [formDoc, setFormDoc] = React.useState<any>(typeof form === 'object' ? form : null)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string>('')
  const [success, setSuccess] = React.useState<boolean>(false)
  const [values, setValues] = React.useState<Record<string, any>>({})
  const [uploadingFields, setUploadingFields] = React.useState<Record<string, boolean>>({})

  const formId = resolveRelationId(form)

  React.useEffect(() => {
    let cancelled = false

    if (typeof form === 'object' && form) {
      setFormDoc(form)
      return
    }

    if (!formId) {
      setFormDoc(null)
      return
    }

    const loadForm = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(`/api/forms/${formId}`)
        if (!response.ok) {
          throw new Error('Failed to load selected form.')
        }

        const data = await response.json()
        if (!cancelled) {
          setFormDoc(data)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || 'Unable to load form.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadForm()

    return () => {
      cancelled = true
    }
  }, [form, formId])

  const formFields = Array.isArray(formDoc?.fields) ? formDoc.fields : []

  const onChangeValue = (name: string, nextValue: any) => {
    setValues((prev) => ({ ...prev, [name]: nextValue }))
  }

  const uploadFileToMedia = async (fieldName: string, file: File): Promise<string> => {
    const data = new FormData()
    data.append('file', file)
    data.append('alt', `${fieldName}-${file.name}`)

    const response = await fetch('/api/media', {
      method: 'POST',
      body: data,
    })

    if (!response.ok) {
      const failureText = await response.text().catch(() => '')
      throw new Error(failureText || 'File upload failed. Please try again.')
    }

    const payload = await response.json()
    const doc = payload?.doc || payload
    const fileUrl = String(doc?.url || '').trim()

    if (!fileUrl) {
      throw new Error('Uploaded file URL was not returned by server.')
    }

    return fileUrl
  }

  const onFileSelect = async (fieldName: string, file: File | null) => {
    if (!file) {
      onChangeValue(fieldName, '')
      return
    }

    setError('')
    setUploadingFields((prev) => ({ ...prev, [fieldName]: true }))

    try {
      const uploadedUrl = await uploadFileToMedia(fieldName, file)
      onChangeValue(fieldName, uploadedUrl)
    } catch (err: any) {
      setError(err?.message || 'File upload failed. Please try again.')
    } finally {
      setUploadingFields((prev) => ({ ...prev, [fieldName]: false }))
    }
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formId) {
      setError('Please select a form in this block first.')
      return
    }

    if (Object.values(uploadingFields).some(Boolean)) {
      setError('Please wait for all file uploads to finish before submitting.')
      return
    }

    const missingRequiredUpload = formFields.find((field: any) => {
      const blockType = String(field?.blockType || '').trim()
      const name = String(field?.name || '').trim()
      if (!name) return false
      if (blockType !== 'imageUpload' && blockType !== 'documentUpload') return false
      if (!field?.required) return false
      return !String(values[name] || '').trim()
    })

    if (missingRequiredUpload) {
      setError(`Please upload ${String(missingRequiredUpload?.label || missingRequiredUpload?.name || 'required file')}.`)
      return
    }

    setError('')

    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form: formId,
          submissionData: values,
        }),
      })

      if (!response.ok) {
        throw new Error('Submission failed. Please try again.')
      }

      setSuccess(true)

      const redirectUrl = String(formDoc?.confirmationRedirect?.url || formDoc?.redirect || '').trim()
      if (redirectUrl) {
        window.location.href = redirectUrl
      }
    } catch (err: any) {
      setError(err?.message || 'Submission failed. Please try again.')
    }
  }

  const renderField = (field: any, index: number) => {
    const key = `${field?.name || field?.blockType || 'field'}-${index}`
    const blockType = String(field?.blockType || '').trim()
    const name = String(field?.name || '').trim()
    const label = String(field?.label || name || 'Field').trim()
    const required = Boolean(field?.required)
    const options = Array.isArray(field?.options) ? field.options : []
    const fullWidthTypes = new Set(['message', 'textarea', 'radio'])
    const fieldColClass = fullWidthTypes.has(blockType) ? 'col-12' : 'col-12 col-md-6'

    if (blockType === 'message') {
      const messageHtml = lexicalToHtml(field?.message)
      if (!messageHtml) return null
      return <div key={key} className={`${fieldColClass} form-builder-field`} dangerouslySetInnerHTML={{ __html: messageHtml }} />
    }

    if (!name) return null

    if (blockType === 'imageUpload' || blockType === 'documentUpload') {
      const accept =
        blockType === 'imageUpload'
          ? '.jpg,.jpeg,.png,image/jpeg,image/png'
          : '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

      const uploadedUrl = String(values[name] || '').trim()

      return (
        <div key={key} className={`${fieldColClass} form-builder-field`}>
          <label className="form-label form-builder-label">{label}</label>
          {field?.helpText ? <div className="form-text mb-1 form-builder-help">{String(field.helpText)}</div> : null}
          <input
            className="form-control"
            type="file"
            accept={accept}
            required={required && !uploadedUrl}
            onChange={(e) => onFileSelect(name, e.target.files?.[0] || null)}
          />
          {uploadingFields[name] ? <div className="form-text mt-1 form-builder-help">Uploading...</div> : null}
          {!uploadingFields[name] && uploadedUrl ? (
            <div className="form-text mt-1 text-success form-builder-help">File uploaded successfully.</div>
          ) : null}
        </div>
      )
    }

    if (blockType === 'textarea') {
      return (
        <div key={key} className={`${fieldColClass} form-builder-field`}>
          <label className="form-label form-builder-label">{label}</label>
          <textarea
            className="form-control"
            rows={4}
            required={required}
            placeholder={String(field?.placeholder || '')}
            value={String(values[name] || '')}
            onChange={(e) => onChangeValue(name, e.target.value)}
          />
        </div>
      )
    }

    if (blockType === 'select' || blockType === 'country' || blockType === 'state') {
      return (
        <div key={key} className={`${fieldColClass} form-builder-field`}>
          <label className="form-label form-builder-label">{label}</label>
          <select
            className="form-select"
            required={required}
            value={String(values[name] || '')}
            onChange={(e) => onChangeValue(name, e.target.value)}
          >
            <option value="">Select an option</option>
            {options.map((option: any, optionIndex: number) => {
              const optionValue = String(option?.value || '')
              const optionLabel = String(option?.label || optionValue)
              return (
                <option key={`${key}-opt-${optionIndex}`} value={optionValue}>
                  {optionLabel}
                </option>
              )
            })}
          </select>
        </div>
      )
    }

    if (blockType === 'radio') {
      return (
        <fieldset key={key} className={`${fieldColClass} form-builder-field`}>
          <legend className="form-label form-builder-label fs-6">{label}</legend>
          {options.map((option: any, optionIndex: number) => {
            const optionValue = String(option?.value || '')
            const optionLabel = String(option?.label || optionValue)
            return (
              <div className="form-check" key={`${key}-radio-${optionIndex}`}>
                <input
                  className="form-check-input"
                  type="radio"
                  id={`${key}-${optionIndex}`}
                  name={name}
                  value={optionValue}
                  checked={String(values[name] || '') === optionValue}
                  onChange={(e) => onChangeValue(name, e.target.value)}
                  required={required}
                />
                <label className="form-check-label" htmlFor={`${key}-${optionIndex}`}>
                  {optionLabel}
                </label>
              </div>
            )
          })}
        </fieldset>
      )
    }

    if (blockType === 'checkbox') {
      return (
        <div key={key} className={`${fieldColClass} form-builder-field form-check`}>
          <input
            className="form-check-input"
            type="checkbox"
            id={key}
            checked={Boolean(values[name])}
            onChange={(e) => onChangeValue(name, e.target.checked)}
            required={required}
          />
          <label className="form-check-label" htmlFor={key}>
            {label}
          </label>
        </div>
      )
    }

    const inputType =
      blockType === 'email'
        ? 'email'
        : blockType === 'number'
          ? 'number'
          : blockType === 'date'
            ? 'date'
            : 'text'

    return (
      <div key={key} className={`${fieldColClass} form-builder-field`}>
        <label className="form-label form-builder-label">{label}</label>
        <input
          className="form-control"
          type={inputType}
          required={required}
          placeholder={String(field?.placeholder || '')}
          value={String(values[name] || '')}
          onChange={(e) => onChangeValue(name, e.target.value)}
        />
      </div>
    )
  }

  return (
    <section className="form-builder-block section">
      <div className="container">
        {(title || description) && (
          <div className="section-title" data-aos="fade-up">
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        )}

        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            {isLoading ? <div className="alert alert-info">Loading form...</div> : null}
            {error ? <div className="alert alert-danger">{error}</div> : null}

            {!isLoading && !error && !formId ? (
              <div className="alert alert-warning mb-0">Select a form in this block to render it.</div>
            ) : null}

            {!isLoading && !error && formId && success ? (
              <div className="alert alert-success mb-0">
                {String(formDoc?.confirmationMessage || 'Thank you for your submission!')}
              </div>
            ) : null}

            {!isLoading && !error && formId && !success ? (
              <div className="form-builder-surface" data-aos="fade-up" data-aos-delay="100">
              <form className="form-builder-form" onSubmit={onSubmit}>
                <div className="row g-3">
                  {formFields.map((field: any, index: number) => renderField(field, index))}
                  <div className="col-12">
                    <button type="submit" className="btn w-100 form-builder-submit-btn">
                      {String(submitButtonText || formDoc?.submitButtonLabel || 'Submit')}
                    </button>
                  </div>
                </div>
              </form>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

// Countdown Block Component
const CountdownBlock: React.FC<any> = ({ title, description, targetDate, ctaButton }) => {
  return (
    <section className="countdown-block section">
      <div className="container text-center">
        {(title || description) && (
          <div className="section-title" data-aos="fade-up">
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        )}
        
        <div className="countdown-timer mb-4" data-aos="fade-up" data-aos-delay="100">
          <div className="d-flex justify-content-center gap-3">
            <div className="time-unit">
              <span className="time-value display-4" style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>00</span>
              <span className="time-label d-block">Days</span>
            </div>
            <div className="time-unit">
              <span className="time-value display-4">00</span>
              <span className="time-label d-block">Hours</span>
            </div>
            <div className="time-unit">
              <span className="time-value display-4">00</span>
              <span className="time-label d-block">Minutes</span>
            </div>
            <div className="time-unit">
              <span className="time-value display-4">00</span>
              <span className="time-label d-block">Seconds</span>
            </div>
          </div>
        </div>
        
        {ctaButton?.text && (
          <div data-aos="fade-up" data-aos-delay="200">
            <a href={ctaButton.link || '#'} className="btn btn-primary btn-lg">
              {ctaButton.text}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

// Social Feed Block Component
const SocialFeedBlock: React.FC<any> = ({ title, platform, embedCode }) => {
  return (
    <section className="social-feed-block section">
      <div className="container">
        {title && (
          <div className="section-title" data-aos="fade-up">
            <h2>{title}</h2>
          </div>
        )}
        {embedCode && (
          <div data-aos="fade-up" data-aos-delay="100" dangerouslySetInnerHTML={{ __html: embedCode }} />
        )}
      </div>
    </section>
  )
}

// Custom Code Block Component
const CustomCodeBlock: React.FC<any> = ({ title, code, codeType, height }) => {
  return (
    <section className="custom-code-block section">
      <div className="container">
        {title && (
          <div className="section-title" data-aos="fade-up">
            <h2>{title}</h2>
          </div>
        )}
        <div data-aos="fade-up" data-aos-delay="100">
          {codeType === 'iframe' ? (
            <div style={{ height: height || 'auto' }} dangerouslySetInnerHTML={{ __html: code }} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: code }} />
          )}
        </div>
      </div>
    </section>
  )
}

// Map Block Component
const MapBlock: React.FC<any> = ({ title, address, embedUrl, height }) => {
  // Convert Google Maps sharing URLs to embed URLs
  const convertToGoogleMapsEmbed = (url: string): string => {
    if (!url) return ''
    
    // If already an embed URL, return as is
    if (url.includes('/maps/embed')) {
      return url
    }
    
    // If it's a sharing URL, try to convert
    if (url.includes('maps.app.goo.gl') || url.includes('google.com/maps')) {
      const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
      if (match) {
        const lat = match[1]
        const lng = match[2]
        return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15282!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1`
      }
      
      console.warn('Please use Google Maps Embed URL. Go to Google Maps → Share → Embed a map → Copy HTML')
      return url
    }
    
    return url
  }

  return (
    <section className="map-block section">
      <div className="container">
        {(title || address) && (
          <div className="section-title" data-aos="fade-up">
            {title && <h2>{title}</h2>}
            {address && <p>{address}</p>}
          </div>
        )}
        <div data-aos="fade-up" data-aos-delay="100" style={{ borderRadius: '8px', overflow: 'hidden' }}>
          {embedUrl && (
            <iframe
              src={convertToGoogleMapsEmbed(embedUrl)}
              className="w-100"
              style={{ height: height || '400px', border: 'none' }}
              title="Map"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </section>
  )
}

// People Block Component
const PeopleBlock: React.FC<any> = ({ title, description, layout, showStats, showSocialLinks, people }) => {
  if (!people || people.length === 0) return null
  const useTwoEntryLayout = people.length === 2

  const selectedColumns = (() => {
    switch (layout) {
      case 'grid-3':
        return 3
      case 'grid-5':
        return 5
      case 'grid-6':
        return 6
      case 'grid-4':
      default:
        return 4
    }
  })()
  
  // Get responsive Bootstrap classes based on selected layout.
  const getColClass = (layoutType?: string) => {
    switch (layoutType) {
      case 'grid-3':
        return 'col-lg-4 col-md-6'
      case 'grid-5':
        return 'col-lg-3 col-md-6'
      case 'grid-6':
        return 'col-xl-2 col-lg-3 col-md-6'
      case 'grid-4':
      default:
        return 'col-xl-3 col-lg-4 col-md-6'
    }
  }

  const shouldCenterSparseRow = !useTwoEntryLayout && people.length < selectedColumns

  return (
    <section id="people-block" className="instructors section">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        {(title || description) && (
          <div className="section-title text-center" data-aos="fade-up">
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        )}
        
        <div className={`row gy-4${shouldCenterSparseRow ? ' justify-content-center' : ''}`}>
          {people.map((person: any, index: number) => (
            <div key={person.id || index} className={useTwoEntryLayout ? 'col-xl-6 col-lg-6' : getColClass(layout)} data-aos="fade-up" data-aos-delay={200 + (index * 50)}>
              {useTwoEntryLayout ? (
                <div className="people-duo-card">
                  <div className="people-duo-media">
                    <img
                      src={typeof person.image === 'object' && person.image?.url ? person.image.url : '/assets/img/education/teacher-2.webp'}
                      className="img-fluid"
                      alt={person.name || 'Person'}
                    />
                  </div>
                  <div className="people-duo-content">
                    {person.specialty && <span className="people-duo-tag">{person.specialty}</span>}
                    <h4>{person.name || 'Unnamed Person'}</h4>
                    {getCardDescription(person.description) ? <p>{getCardDescription(person.description)}</p> : null}

                    {showStats && ((person.studentCount && person.studentCount !== '0') || (person.rating && person.rating > 0)) && (
                      <div className="people-duo-meta">
                        {person.studentCount && person.studentCount !== '0' && (
                          <span><i className="bi bi-people"></i> {person.studentCount} Students</span>
                        )}
                        {person.rating && person.rating > 0 && (
                          <span><i className="bi bi-star"></i> {person.rating} Rating</span>
                        )}
                      </div>
                    )}

                    <div className="action-buttons">
                      <Link href={getPersonProfileHref(person)} className="btn-view">View Profile</Link>
                      <div className="social-links">
                        {showSocialLinks && person.socialLinks && person.socialLinks.map((social: any, idx: number) => (
                          <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer">
                            <i className={`bi bi-${social.platform}`}></i>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="instructor-card">
                  <div className="instructor-image">
                    <img 
                      src={typeof person.image === 'object' && person.image?.url ? person.image.url : '/assets/img/education/teacher-2.webp'} 
                      className="img-fluid" 
                      alt={person.name || 'Person'}
                    />
                  </div>
                  <div className="instructor-info">
                    <h5>{person.name || 'Unnamed Person'}</h5>
                    {person.specialty && <p className="specialty">{person.specialty}</p>}
                    {getCardDescription(person.description) ? <p className="description">{getCardDescription(person.description)}</p> : null}
                    
                    {showStats && ((person.studentCount && person.studentCount !== '0') || (person.rating && person.rating > 0)) && (
                    <div className="stats-grid">
                      {person.studentCount && person.studentCount !== '0' && (
                      <div className="stat">
                        <span className="number">{person.studentCount}</span>
                        <span className="label">Students</span>
                      </div>
                      )}
                      {person.rating && person.rating > 0 && (
                      <div className="stat">
                        <span className="number">{person.rating}</span>
                        <span className="label">Rating</span>
                      </div>
                      )}
                    </div>
                    )}
                    
                    <div className="action-buttons">
                      <Link href={getPersonProfileHref(person)} className="btn-view">View Profile</Link>
                      <div className="social-links">
                        {showSocialLinks && person.socialLinks && person.socialLinks.map((social: any, idx: number) => (
                          <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer">
                            <i className={`bi bi-${social.platform}`}></i>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
