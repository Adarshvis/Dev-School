import React from 'react'
import Link from 'next/link'
import FlexibleRowBlock from './blocks/FlexibleRowBlock'
import { lexicalToHtml } from '@/lib/lexicalToHtml'

interface BlockRendererProps {
  blocks?: any[]
}

const getCardDescription = (value: unknown): string => {
  if (!value) return ''
  const text = String(value).replace(/\s+/g, ' ').trim()
  if (!text) return ''
  return text.length > 140 ? `${text.slice(0, 140).trim()}...` : text
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
    console.log('BlockRenderer: No blocks provided')
    return null
  }

  console.log('BlockRenderer: Rendering', blocks.length, 'blocks:', blocks.map(b => b.blockType))

  return (
    <>
      {blocks.map((block, index) => {
        console.log(`Rendering block ${index}:`, block.blockType, block)
        
        switch (block.blockType) {
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
      const embedUrl = getYouTubeEmbedUrl(videoUrl)
      console.log('YouTube Embed URL:', embedUrl)
      return embedUrl
    }
    if (videoType === 'vimeo') {
      return getVimeoEmbedUrl(videoUrl)
    }
    console.log('External/Other video URL:', videoUrl)
    return videoUrl
  }

  const containerClass = width === 'full' ? 'container-fluid' : width === 'wide' ? 'container-lg' : 'container'
  const aspectClass = aspectRatio?.replace(':', '-') || '16-9'
  
  console.log('VideoBlock render:', { videoType, videoUrl, title, aspectRatio, width })

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
  const shouldShowViewMore = !!showViewMoreButton
  const galleryImages = shouldShowViewMore && galleryType !== 'carousel'
    ? (images || []).slice(0, 4)
    : (images || [])

  const viewMoreHref = String(viewMoreLink || '/gallery').trim() || '/gallery'

  return (
    <section className="image-gallery-block section">
      <div className="container">
        {(title || description) && (
          <div className="section-title" data-aos="fade-up">
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        )}
        
        {galleryType === 'carousel' ? (
          <div id="galleryCarousel" className="carousel slide" data-bs-ride="carousel" data-aos="fade-up" data-aos-delay="100">
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
                  <img
                    src={typeof item.image === 'object' ? item.image.url : item.image}
                    alt={item.alt || item.caption || 'Gallery image'}
                    className="d-block w-100"
                    style={{ maxHeight: '500px', objectFit: 'cover' }}
                  />
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
        ) : (
          <div className={`row gy-4`} data-aos="fade-up" data-aos-delay="100">
            {galleryImages?.map((item: any, index: number) => (
              <div key={index} className={`col-lg-${12 / parseInt(columns || '3')} col-md-6`}>
                <div className="gallery-item">
                  <img
                    src={typeof item.image === 'object' ? item.image.url : item.image}
                    alt={item.alt || item.caption || 'Gallery image'}
                    className="img-fluid rounded"
                  />
                  {item.caption && <p className="mt-2 text-center">{item.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {shouldShowViewMore && (
          <div className="text-center mt-4" data-aos="fade-up" data-aos-delay="150">
            <Link href={viewMoreHref} className="btn btn-primary">
              {viewMoreButtonText || 'View More'}
            </Link>
          </div>
        )}
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
        <div data-aos="fade-up" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </section>
  )
}

// Stats Block Component
const StatsBlock: React.FC<any> = ({ title, description, stats, layout }) => {
  return (
    <section className="stats-block section">
      <div className="container">
        {(title || description) && (
          <div className="section-title" data-aos="fade-up">
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        )}
        
        <div className={`row ${layout === 'grid' ? 'gy-4' : 'justify-content-center'}`}>
          {stats?.map((stat: any, index: number) => (
            <div key={index} className={layout === 'grid' ? 'col-lg-4 col-md-6' : 'col-auto'} data-aos="fade-up" data-aos-delay={`${100 * (index + 1)}`}>
              <div className="stat-card text-center p-4">
                {stat.icon && <i className={`${stat.icon} fs-1 mb-3`} style={{ color: 'var(--accent-color)' }}></i>}
                <h3 className="stat-number mb-2" style={{ color: 'var(--heading-color)' }}>{stat.number}</h3>
                <p className="stat-label mb-0">{stat.label}</p>
              </div>
            </div>
          ))}
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
  
  // Get column class based on layout - all use same card size
  const getColClass = (layoutType?: string) => {
    // All layouts use the same card size for consistency
    return 'col-xl-3 col-lg-4 col-md-6'
  }

  return (
    <section id="people-block" className="instructors section">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        {(title || description) && (
          <div className="section-title text-center" data-aos="fade-up">
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
        )}
        
        <div className="row gy-4">
          {people.map((person: any, index: number) => (
            <div key={person.id || index} className={getColClass(layout)} data-aos="fade-up" data-aos-delay={200 + (index * 50)}>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
