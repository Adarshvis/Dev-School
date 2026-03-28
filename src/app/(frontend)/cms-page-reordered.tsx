import * as React from 'react'
import Link from 'next/link'
import { getPageContent } from '../../lib/payload'
import TestimonialsSlider from './components/TestimonialsSlider'
import { BlockRenderer } from './components/BlockRenderer'
import RecentBlogPosts from './components/RecentBlogPosts'
import FeaturedNews from './components/FeaturedNews'
import { HeroSectionRenderer } from './components/HeroSectionRenderer'
import { lexicalToHtml } from '@/lib/lexicalToHtml'

const EXCLUDED_BLOCK_PATTERNS = [/\bvc'?s?\s*speech\b/i, /\bvice\s+chancellor'?s?\s*speech\b/i]

const normalizeSectionType = (sectionType: unknown): string => {
  const raw = String(sectionType || '')
    .trim()
    .toLowerCase()
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .replace(/&/g, 'and')

  if (
    raw === 'news-notification' ||
    raw === 'news-notifications' ||
    raw === 'news-and-notification' ||
    raw === 'news-and-notifications' ||
    raw === 'notification-news'
  ) {
    return 'featured-news'
  }

  return raw
}

const isExcludedBlock = (block: any): boolean => {
  const serialized = JSON.stringify(block || {})
  return EXCLUDED_BLOCK_PATTERNS.some((pattern) => pattern.test(serialized))
}

const filterVisibleBlocks = (blocks: any[] | undefined): any[] => {
  if (!Array.isArray(blocks)) return []
  return blocks.filter((block) => !isExcludedBlock(block))
}

const getSectionBlocks = (section: any): any[] => {
  const fromCustomBlock = filterVisibleBlocks(section?.customBlock)
  if (fromCustomBlock.length > 0) return fromCustomBlock

  const fromContentBlocks = filterVisibleBlocks(section?.contentBlocks)
  if (fromContentBlocks.length > 0) return fromContentBlocks

  return []
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

const getHomePersonProfileHref = (person: any): string => {
  const explicitProfileLink = String(person?.profileLink || '').trim()
  if (explicitProfileLink !== '') {
    return normalizeProfilePath(explicitProfileLink)
  }

  const personId = String(person?.id || person?._id || '').trim()
  if (personId) {
    return `/people/id-${personId}`
  }

  const personSlug = String(person?.slug || '').trim()
  if (personSlug) {
    return `/people/${personSlug}`
  }

  const name = String(person?.name || '').trim()
  if (name) {
    const generatedSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    if (generatedSlug) {
      return `/people/${generatedSlug}`
    }
  }

  return '/people'
}

// Section renderer components
const HeroRenderer = ({ section }: { section: any }) => {
  if (!section?.hero) return null
  return <HeroSectionRenderer hero={section.hero} />
}

const OurStoryRenderer = ({ section }: { section: any }) => {
  const ourStory = section?.ourStory
  if (!ourStory) return null
  const formattedDescriptionHtml = ourStory?.formattedDescription
    ? lexicalToHtml(ourStory.formattedDescription)
    : ''
  const mediaType = ourStory?.mediaType || 'image'

  const extractYouTubeId = (url: string): string => {
    if (!url) return ''
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    return match ? match[1] : ''
  }

  const extractVimeoId = (url: string): string => {
    if (!url) return ''
    const match = url.match(/vimeo\.com\/(\d+)/)
    return match ? match[1] : ''
  }

  const mediaPanelContent = (() => {
    if (mediaType === 'text' && ourStory?.textContent) {
      return (
        <div className="p-4 p-lg-5 d-flex flex-column justify-content-center h-100" style={{ minHeight: '320px', background: 'color-mix(in srgb, var(--accent-color), transparent 92%)' }}>
          {ourStory.textContent.title && <h3>{ourStory.textContent.title}</h3>}
          {ourStory.textContent.description && <p className="mb-0">{ourStory.textContent.description}</p>}
        </div>
      )
    }

    if (mediaType === 'video' && ourStory?.videoFile) {
      return (
        <video
          src={typeof ourStory.videoFile === 'object' ? ourStory.videoFile.url : ourStory.videoFile}
          poster={ourStory.videoPoster && typeof ourStory.videoPoster === 'object' ? ourStory.videoPoster.url : ourStory.videoPoster}
          autoPlay={ourStory.videoAutoplay}
          controls={ourStory.videoControls !== false}
          muted
          loop
          className="img-fluid rounded"
          style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }}
        />
      )
    }

    if (mediaType === 'audio' && ourStory?.audioFile) {
      return (
        <div className="p-4 d-flex align-items-center justify-content-center" style={{ minHeight: '240px', background: 'color-mix(in srgb, var(--background-color), #fff 20%)' }}>
          <audio
            src={typeof ourStory.audioFile === 'object' ? ourStory.audioFile.url : ourStory.audioFile}
            controls
            autoPlay={ourStory.audioAutoplay}
            className="w-100"
          />
        </div>
      )
    }

    if (mediaType === 'document' && ourStory?.documentFile) {
      const docUrl = typeof ourStory.documentFile === 'object' ? ourStory.documentFile.url : ourStory.documentFile
      if (ourStory.documentDisplayMode === 'embed') {
        return <iframe src={docUrl} title="About Document" style={{ width: '100%', height: '420px', border: 'none' }} className="rounded" />
      }

      return (
        <div className="p-4 d-flex align-items-center justify-content-center" style={{ minHeight: '240px', background: 'color-mix(in srgb, var(--background-color), #fff 20%)' }}>
          <a href={docUrl} download className="btn btn-primary">Download Document</a>
        </div>
      )
    }

    if (mediaType === 'animation' && ourStory?.animationFile) {
      return (
        <img
          src={typeof ourStory.animationFile === 'object' ? ourStory.animationFile.url : ourStory.animationFile}
          alt={ourStory.imageAlt || 'Animation'}
          className="img-fluid rounded"
          style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }}
        />
      )
    }

    if (mediaType === '3d' && ourStory?.model3DFile) {
      return (
        <div className="d-flex align-items-center justify-content-center text-white rounded" style={{ minHeight: '300px', background: '#1a1a1a' }}>
          <div className="text-center">
            <i className="bi bi-box" style={{ fontSize: '3rem' }}></i>
            <p className="mb-0 mt-2">3D Model Viewer</p>
          </div>
        </div>
      )
    }

    if (mediaType === 'embed' && ourStory?.embedUrl) {
      if (ourStory.embedType === 'youtube') {
        const videoId = extractYouTubeId(ourStory.embedUrl)
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${ourStory.embedAutoplay ? 1 : 0}&mute=1&rel=0&modestbranding=1`}
            title="About Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '420px', border: 'none' }}
            className="rounded"
          ></iframe>
        )
      }

      if (ourStory.embedType === 'vimeo') {
        const videoId = extractVimeoId(ourStory.embedUrl)
        return (
          <iframe
            src={`https://player.vimeo.com/video/${videoId}?autoplay=${ourStory.embedAutoplay ? 1 : 0}`}
            title="About Vimeo"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '420px', border: 'none' }}
            className="rounded"
          ></iframe>
        )
      }

      return <div className="rounded" dangerouslySetInnerHTML={{ __html: ourStory.embedUrl }} />
    }

    if (mediaType === 'data' && ourStory?.dataEmbedUrl) {
      return (
        <iframe
          src={ourStory.dataEmbedUrl}
          title="About Data"
          style={{ width: '100%', height: `${ourStory.dataHeight || 400}px`, border: 'none' }}
          className="rounded"
        />
      )
    }

    const imageSource =
      (typeof ourStory?.imageFile === 'object' ? ourStory.imageFile?.url : ourStory?.imageFile) ||
      (typeof ourStory?.campusImage === 'object' ? ourStory.campusImage?.url : ourStory?.campusImage)

    if (!imageSource) return null

    return (
      <img
        src={imageSource}
        alt={ourStory?.imageAlt || 'Campus'}
        className="img-fluid rounded"
      />
    )
  })()

  const isImageLeft = ourStory.layout === 'image-left'
  const contentColClass = isImageLeft ? 'col-lg-6 order-lg-2' : 'col-lg-6'
  const imageColClass = isImageLeft ? 'col-lg-6 order-lg-1' : 'col-lg-6'
  const highlightItems = (
    (ourStory.timelinePoints || [])
      .map((item: any) => String(item?.title || item?.description || '').trim())
      .filter(Boolean)
      .slice(0, 4)
  )
  const fallbackHighlights = (
    (ourStory.coreValues || [])
      .map((item: any) => String(item?.title || '').trim())
      .filter(Boolean)
      .slice(0, 4)
  )
  const highlights = highlightItems.length > 0 ? highlightItems : fallbackHighlights
  const statCardTitle = String(ourStory?.missionVisionCards?.[0]?.title || '').trim()
  const statCardSubtitle = String(ourStory?.missionVisionCards?.[0]?.description || '').trim()
  const badgeTitle = String(ourStory?.missionVisionCards?.[1]?.title || '').trim()
  const badgeSubtitle = String(ourStory?.missionVisionCards?.[1]?.description || '').trim()
  const quoteText = String(ourStory?.missionVisionCards?.[2]?.description || '').trim()
  const quoteAuthor = String(ourStory?.missionVisionCards?.[2]?.title || '').trim()
  
  return (
    <section id="about" className="about about-v2 section">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row align-items-center g-5 g-xl-6">
          <div className={imageColClass}>
            <div className="about-image about-v2-media" data-aos="zoom-in" data-aos-delay="250">
              <div className="about-v2-frame"></div>
              <div className="about-v2-main-media">
                {mediaPanelContent}
              </div>

              {(statCardTitle || statCardSubtitle) && (
                <div className="about-v2-floating about-v2-floating-top">
                  {statCardTitle && <div className="value">{statCardTitle}</div>}
                  {statCardSubtitle && <div className="label">{statCardSubtitle}</div>}
                </div>
              )}

              {(badgeTitle || badgeSubtitle) && (
                <div className="about-v2-floating about-v2-floating-bottom">
                  {badgeTitle && <div className="title">{badgeTitle}</div>}
                  {badgeSubtitle && <div className="subtitle">{badgeSubtitle}</div>}
                </div>
              )}
            </div>
          </div>

          <div className={contentColClass}>
            <div className="about-content about-v2-content" data-aos="fade-up" data-aos-delay="200">
              <div className="about-v2-label-wrap">
                <span className="line"></span>
                <span className="label-text">{ourStory.subtitle || 'An Introduction'}</span>
              </div>

              {ourStory.title && <h2>{ourStory.title}</h2>}
              {ourStory.description && <p>{ourStory.description}</p>}
              {formattedDescriptionHtml && (
                <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: formattedDescriptionHtml }} />
              )}

              {highlights.length > 0 && (
                <div className="about-v2-highlights">
                  {highlights.map((item: string, index: number) => (
                    <div key={`${item}-${index}`} className="highlight-item">
                      <i className="bi bi-check-circle-fill" aria-hidden="true"></i>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {quoteText && (
                <blockquote className="about-v2-quote">
                  <p>&quot;{quoteText}&quot;</p>
                  {quoteAuthor && <footer>- {quoteAuthor}</footer>}
                </blockquote>
              )}

              {(ourStory.buttonText || ourStory.buttonLink) && (
                <div className="mt-3" data-aos="fade-up" data-aos-delay="260">
                  <Link href={ourStory.buttonLink || '/about'} className="btn btn-primary">
                    {ourStory.buttonText || 'Learn More About Us'}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {ourStory.coreValues && ourStory.coreValues.length > 0 && (
          <div className="row mt-5">
            <div className="col-lg-12">
              <div className="core-values" data-aos="fade-up" data-aos-delay="500">
                <h3 className="text-center mb-4">Core Values</h3>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                  {ourStory.coreValues.map((value: any, index: number) => (
                    <div key={index} className="col">
                      <div className="value-card">
                        <div className="value-icon">
                          <i className={`bi ${value.icon}`}></i>
                        </div>
                        {value.title && <h4>{value.title}</h4>}
                        {value.description && <p>{value.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

const FeaturedInstructorsRenderer = ({ section }: { section: any }) => {
  const data = section?.featuredInstructors
  if (!data) return null
  
  return (
    <section id="featured-instructors" className="featured-instructors section">
      <div className="container section-title" data-aos="fade-up">
        <h2>{data.title || "Research Domains"}</h2>
        <p>{data.description || "Explore our areas of expertise"}</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row g-4 facility-grid-v2 research-facilities-grid">
          {data.instructors && data.instructors.map((instructor: any, index: number) => {
            const profileHref = getHomePersonProfileHref(instructor)
            const externalProfileHref = isExternalHref(profileHref)
            const iconClasses = [
              'bi bi-display',
              'bi bi-book',
              'bi bi-pc-display',
              'bi bi-dribbble',
              'bi bi-palette',
              'bi bi-bus-front',
            ]
            const iconClassByKey: Record<string, string> = {
              monitor: 'bi bi-display',
              book: 'bi bi-book',
              cpu: 'bi bi-pc-display',
              sports: 'bi bi-dribbble',
              palette: 'bi bi-palette',
              bus: 'bi bi-bus-front',
            }
            const facilityThemes = [
              { color: '#F06F05', bg: 'rgba(240,111,5,0.1)' },
              { color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
              { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
              { color: '#F45525', bg: 'rgba(244,85,37,0.1)' },
              { color: '#A855F7', bg: 'rgba(168,85,247,0.1)' },
              { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
            ]
            const imageSrc = typeof instructor.image === 'object'
              ? instructor.image.url
              : '/assets/img/education/teacher-2.webp'
            const cardDescription = getCardDescription(instructor.description)
            const theme = facilityThemes[index % facilityThemes.length]
            const selectedIconClass = iconClassByKey[String(instructor.icon || '').trim()] || iconClasses[index % iconClasses.length]

            return (
              <div
                key={index}
                className="col-xl-4 col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay={Math.min(120 + index * 70, 520)}
              >
                <article
                  className="facility-card h-100"
                  style={{
                    ['--facility-color' as any]: theme.color,
                    ['--facility-bg' as any]: theme.bg,
                  }}
                >
                  <div className="facility-media">
                    <img
                      src={imageSrc}
                      className="img-fluid"
                      alt={instructor.name || 'Research Domain'}
                    />

                    <span className="facility-icon" aria-hidden="true">
                      <i className={selectedIconClass} />
                    </span>

                    {externalProfileHref ? (
                      <a
                        href={profileHref}
                        className="facility-arrow"
                        aria-label={`Open ${instructor.name || 'research domain'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-arrow-up-right" aria-hidden="true" />
                      </a>
                    ) : (
                      <Link
                        href={profileHref}
                        className="facility-arrow"
                        aria-label={`Open ${instructor.name || 'research domain'}`}
                      >
                        <i className="bi bi-arrow-up-right" aria-hidden="true" />
                      </Link>
                    )}
                  </div>

                  <div className="facility-content instructor-info">
                    {instructor.name && <h5>{instructor.name}</h5>}
                    {cardDescription ? <p className="description">{cardDescription}</p> : null}
                  </div>
                </article>
              </div>
          )})}
        </div>
      </div>
    </section>
  )
}

const FeaturedCoursesRenderer = ({ section }: { section: any }) => {
  const data = section?.featuredCourses
  if (!data) return null
  
  return (
    <section id="featured-courses" className="featured-courses section">
      <div className="container section-title">
        <h2>{data.title || "Work With Us"}</h2>
        <p>{data.description || ""}</p>
      </div>

      <div className="container">
        <div className="row g-4 facility-grid-v2">
          {data.courses && data.courses.map((course: any, index: number) => {
            const iconClasses = [
              'bi bi-display',
              'bi bi-book',
              'bi bi-pc-display',
              'bi bi-dribbble',
              'bi bi-palette',
              'bi bi-bus-front',
            ]

            const cardHref = String(course.buttonLink || '').trim()
            const imageSrc = typeof course.image === 'object' ? course.image.url : '/assets/img/education/students-9.webp'

            return (
              <div
                key={index}
                className="col-xl-3 col-lg-4 col-md-6"
                data-aos="fade-up"
                data-aos-delay={Math.min(120 + index * 70, 520)}
              >
                <article className="facility-card h-100">
                  <div className="facility-media">
                    <img src={imageSrc} alt={course.title || 'Facility'} className="img-fluid" />

                    <span className="facility-icon" aria-hidden="true">
                      <i className={iconClasses[index % iconClasses.length]} />
                    </span>

                    <a
                      href={cardHref || '#'}
                      className="facility-arrow"
                      aria-label={`Open ${course.title || 'facility'}`}
                    >
                      <i className="bi bi-arrow-up-right" aria-hidden="true" />
                    </a>
                  </div>

                  <div className="facility-content">
                    {course.title && <h3>{course.title}</h3>}
                    {course.description && <p>{course.description}</p>}
                    {(course.buttonText || course.buttonLink) && (
                      <a href={cardHref || '#'} className="btn-course facility-btn">
                        {course.buttonText || 'Read More'}
                      </a>
                    )}
                  </div>
                </article>
              </div>
            )
          })}
        </div>

        {data.viewAllButton && data.viewAllButton.text && data.viewAllButton.link && (
          <div className="more-courses text-center">
            <a href={data.viewAllButton.link} className="btn-more">
              {data.viewAllButton.text}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

const TestimonialsRenderer = ({ section }: { section: any }) => {
  const data = section?.testimonials
  if (!data || (!data.criticReviews?.length && !data.studentReviews?.length)) return null
  
  return (
    <section id="testimonials" className="testimonials section">
      {(data.title || data.description) && (
        <div className="container section-title" data-aos="fade-up">
          {data.title && <h2>{data.title}</h2>}
          {data.description && <p>{data.description}</p>}
        </div>
      )}

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row">
          <div className="col-12">
            {data.criticReviews && data.criticReviews.length > 0 && (
              <div className="critic-reviews" data-aos="fade-up" data-aos-delay="300">
                <div className="row">
                  {data.criticReviews.map((review: any, index: number) => (
                    <div key={index} className="col-md-4">
                      <div className="critic-review">
                        <div className="review-quote">&quot;</div>
                        <div className="stars">
                          {Array.from({ length: Math.floor(review.rating || 5) }, (_, i) => (
                            <i key={i} className="bi bi-star-fill"></i>
                          ))}
                          {(review.rating || 5) % 1 !== 0 && <i className="bi bi-star-half"></i>}
                        </div>
                        {review.quote && <p>{review.quote}</p>}
                        {review.source && (
                          <div className="critic-info">
                            <div className="critic-name">{review.source}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.studentReviews && data.studentReviews.length > 0 && (
              <TestimonialsSlider testimonials={data.studentReviews} />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const FeaturedNewsRenderer = ({ section }: { section: any }) => {
  return (
    <FeaturedNews 
      title={section?.featuredNews?.title}
      description={section?.featuredNews?.description}
    />
  )
}

const BlogPostsRenderer = () => {
  return <RecentBlogPosts />
}

const CTARenderer = ({ section }: { section: any }) => {
  const cta = section?.cta
  if (!cta) return null
  
  return (
    <section id="cta" className="cta section">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row align-items-center">
          <div className="col-lg-6" data-aos="fade-right" data-aos-delay="200">
            <div className="cta-content">
              <h2>{cta.title}</h2>
              <p>{cta.description}</p>

              {cta.features && (
                <div className="features-list">
                  {cta.features.map((feature: any, index: number) => (
                    <div key={index} className="feature-item" data-aos="fade-up" data-aos-delay={300 + (index * 50)}>
                      <i className="bi bi-check-circle-fill"></i>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="cta-actions" data-aos="fade-up" data-aos-delay="500">
                {cta.primaryButton && (
                  <a href={cta.primaryButton.link} className="btn btn-primary">
                    {cta.primaryButton.text}
                  </a>
                )}
                {cta.secondaryButton && (
                  <a href={cta.secondaryButton.link} className="btn btn-outline">
                    {cta.secondaryButton.text}
                  </a>
                )}
              </div>

              {cta.stats && (
                <div className="stats-row" data-aos="fade-up" data-aos-delay="400">
                  {cta.stats.map((stat: any, index: number) => (
                    <div key={index} className="stat-item">
                      <h3>
                        <span className="purecounter">{stat.number}</span>
                        {stat.suffix && stat.suffix}
                      </h3>
                      <p>{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-6" data-aos="fade-left" data-aos-delay="300">
            <div className="cta-image">
              <img 
                src={typeof cta.image === 'object' ? cta.image.url : '/assets/img/education/courses-4.webp'} 
                alt={cta.title || 'Online Learning Platform'} 
                className="img-fluid" 
              />

              {cta.floatingCards && (
                <>
                  {cta.floatingCards.map((card: any, index: number) => (
                    <div 
                      key={index} 
                      className={`floating-element ${index === 0 ? 'student-card' : 'course-card'}`}
                      data-aos="zoom-in" 
                      data-aos-delay={600 + (index * 100)}
                    >
                      <div className="card-content">
                        <i className={`bi ${card.icon}`}></i>
                        <div className="text">
                          <span className="number">{card.number}</span>
                          <span className="label">{card.label}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const CustomBlockRenderer = ({ section }: { section: any }) => {
  const blocks = getSectionBlocks(section)
  if (!blocks || blocks.length === 0) return null
  return <BlockRenderer blocks={blocks} />
}

// Map section types to their renderers
const sectionRenderers: { [key: string]: React.FC<{ section: any }> } = {
  'hero': HeroRenderer,
  'our-story': OurStoryRenderer,
  'featured-instructors': FeaturedInstructorsRenderer,
  'featured-courses': FeaturedCoursesRenderer,
  'testimonials': TestimonialsRenderer,
  'featured-news': FeaturedNewsRenderer,
  'blog-posts': BlogPostsRenderer,
  'cta': CTARenderer,
  'custom-block': CustomBlockRenderer,
}

export default async function CMSHomePage() {
  try {
    // Fetch home page sections from the home-page collection
    // Sections are sorted by 'order' field in getPageContent
    const homePageSections = await getPageContent('home')
    
    // Add safety check and ensure homePageSections is an array
    const sections = Array.isArray(homePageSections) ? homePageSections : []
    
    console.log('=== CMS HomePage Debug ===')
    console.log('Total sections:', sections.length)
    console.log('Section order:', sections.map((s: any) => `${s.order}: ${s.sectionType}`))
    console.log('========================')
    
    // If no sections, show setup message
    if (sections.length === 0) {
      return (
        <div className="container py-5">
          <div className="text-center">
            <h2>CMS Integration Active!</h2>
            <p>Your homepage is connected but needs content. Please add sections to your <strong>Home Page</strong> collection.</p>
            <div className="alert alert-info my-4">
              <h6>Available Section Types:</h6>
              <ul className="list-unstyled">
                <li>Hero Section</li>
                <li>Our Story</li>
                <li>Work With Us (Featured Courses)</li>
                <li>Research Domains (Featured Instructors)</li>
                <li>Testimonials</li>
                <li>Featured News</li>
                <li>Recent Blog Posts</li>
                <li>CTA Section</li>
                <li>Custom Block</li>
              </ul>
            </div>
            <p className="text-muted">
              <strong>Tip:</strong> Use the &quot;Order&quot; field to control section position. Lower numbers appear first.
            </p>
            <Link href="/admin" className="btn btn-primary btn-lg">
              Go to Admin Panel
            </Link>
          </div>
        </div>
      )
    }

    // Render sections dynamically based on their order from the database
    return (
      <>
        {sections.map((section: any, index: number) => {
          const normalizedSectionType = normalizeSectionType(section?.sectionType)
          const Renderer = sectionRenderers[normalizedSectionType]
          if (!Renderer) {
            console.warn(`Unknown section type: ${section.sectionType}`)
            return null
          }
          const inlineBlocks = filterVisibleBlocks(section?.contentBlocks)
          const sectionBackgroundColor = section?.sectionBackgroundColor
          const sectionWrapperStyle = sectionBackgroundColor
            ? ({
                '--cms-section-bg': sectionBackgroundColor,
                backgroundColor: sectionBackgroundColor,
              } as React.CSSProperties)
            : undefined
          return (
            <div
              key={section.id || index}
              className="cms-home-section"
              style={sectionWrapperStyle}
            >
              <Renderer section={section} />
              {normalizedSectionType !== 'custom-block' && inlineBlocks.length > 0 ? (
                <BlockRenderer blocks={inlineBlocks} />
              ) : null}
            </div>
          )
        })}
      </>
    )
  } catch (error) {
    // Return empty sections on error
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Welcome to Learner</h2>
          <p>Error loading content. Please check the admin panel and server logs.</p>
          <Link href="/admin" className="btn btn-primary">Go to Admin Panel</Link>
          <div className="alert alert-danger mt-3">
            <strong>Debug Info:</strong> {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>
      </div>
    )
  }
}
