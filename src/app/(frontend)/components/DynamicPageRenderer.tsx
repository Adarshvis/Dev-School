import Link from 'next/link'
import { BlockRenderer } from './BlockRenderer'

interface PageSection {
  id?: string
  sectionType: string
  sectionTitle?: string
  sectionSubtitle?: string
  backgroundColor?: string
  richTextContent?: any
  heroContent?: {
    headline?: string
    subheadline?: string
    backgroundImage?: { url: string } | string
    buttonText?: string
    buttonLink?: string
  }
  cards?: Array<{
    title: string
    description?: string
    image?: { url: string } | string
    icon?: string
    link?: string
  }>
  galleryImages?: Array<{
    image: { url: string } | string
    caption?: string
  }>
  ctaContent?: {
    headline?: string
    description?: string
    primaryButtonText?: string
    primaryButtonLink?: string
    secondaryButtonText?: string
    secondaryButtonLink?: string
  }
  faqItems?: Array<{
    question: string
    answer: string
  }>
  testimonialItems?: Array<{
    quote: string
    authorName: string
    authorRole?: string
    authorImage?: { url: string } | string
    rating?: number
  }>
  statsItems?: Array<{
    number: string
    label: string
    icon?: string
  }>
  teamMembers?: Array<{
    name: string
    role?: string
    image?: { url: string } | string
    bio?: string
    socialLinks?: Array<{
      platform: string
      url: string
    }>
  }>
  peopleGridContent?: {
    people?: Array<any>
    layout?: string
    showStats?: boolean
    showSocialLinks?: boolean
  }
  contactFormSettings?: {
    formTitle?: string
    submitButtonText?: string
    successMessage?: string
  }
  videoContent?: {
    videoType?: string
    videoUrl?: string
    videoFile?: { url: string } | string
    posterImage?: { url: string } | string
  }
  customHtmlContent?: string
  spacerHeight?: string
}

interface DynamicPage {
  title: string
  slug: string
  template: string
  showPageTitle?: boolean
  breadcrumbs?: Array<{ label: string; link?: string }>
  content?: any
  contentBlocks?: any[]
  layout?: any[]
  sections?: PageSection[]
}

interface DynamicPageRendererProps {
  page: DynamicPage
}

// Helper to get image URL
const getImageUrl = (image: { url: string } | string | undefined): string => {
  if (!image) return ''
  return typeof image === 'object' ? image.url : image
}

// Helper to get background class
const getBgClass = (bg?: string): string => {
  const bgMap: Record<string, string> = {
    'white': '',
    'light': 'section-bg-light',
    'primary': 'section-bg-primary',
    'secondary': 'section-bg-secondary',
    'dark': 'section-bg-dark',
  }
  return bgMap[bg || 'white'] || ''
}

// Helper to get alignment style
const getAlignmentStyle = (format: string | number | undefined): React.CSSProperties => {
  if (!format) return {}
  // Handle string format (Lexical uses strings like 'center', 'right', 'left', 'justify')
  if (typeof format === 'string') {
    switch (format) {
      case 'left': return { textAlign: 'left' }
      case 'center': return { textAlign: 'center' }
      case 'right': return { textAlign: 'right' }
      case 'justify': return { textAlign: 'justify' }
      case 'start': return { textAlign: 'left' }
      case 'end': return { textAlign: 'right' }
      default: return {}
    }
  }
  // Handle number format (legacy)
  switch (format) {
    case 1: return { textAlign: 'left' }
    case 2: return { textAlign: 'center' }
    case 3: return { textAlign: 'right' }
    case 4: return { textAlign: 'justify' }
    default: return {}
  }
}

// Helper to parse inline style string to React style object
const parseStyleString = (styleString: string): React.CSSProperties => {
  if (!styleString) return {}
  const styles: Record<string, string> = {}
  styleString.split(';').forEach(rule => {
    const [property, value] = rule.split(':').map(s => s.trim())
    if (property && value) {
      // Convert CSS property to camelCase for React
      const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      styles[camelProperty] = value
    }
  })
  return styles as React.CSSProperties
}

// Helper to render text with formatting
const renderTextNode = (child: any, childIndex: number): React.ReactNode => {
  if (child.type === 'text') {
    let content: React.ReactNode = child.text
    if (child.format & 1) content = <strong key={`b-${childIndex}`}>{content}</strong>
    if (child.format & 2) content = <em key={`i-${childIndex}`}>{content}</em>
    if (child.format & 4) content = <s key={`s-${childIndex}`}>{content}</s>
    if (child.format & 8) content = <u key={`u-${childIndex}`}>{content}</u>
    if (child.format & 16) content = <code key={`c-${childIndex}`}>{content}</code>
    if (child.format & 32) content = <sub key={`sub-${childIndex}`}>{content}</sub>
    if (child.format & 64) content = <sup key={`sup-${childIndex}`}>{content}</sup>
    
    // Apply inline styles (font color, background color, etc.)
    const inlineStyle = child.style ? parseStyleString(child.style) : {}
    return <span key={childIndex} style={inlineStyle}>{content}</span>
  }
  if (child.type === 'link') {
    const url = child.fields?.url || child.url || '#'
    const target = child.fields?.newTab ? '_blank' : undefined
    return (
      <a key={childIndex} href={url} target={target} rel={target ? 'noopener noreferrer' : undefined}>
        {child.children?.map((c: any, i: number) => renderTextNode(c, i))}
      </a>
    )
  }
  if (child.type === 'linebreak') {
    return <br key={childIndex} />
  }
  return child.text || null
}

// Render rich text content
const RichTextRenderer = ({ content }: { content: any }) => {
  if (!content) return null
  
  // Handle Lexical rich text format
  if (content.root?.children) {
    return (
      <div className="rich-text-content">
        {content.root.children.map((node: any, index: number) => {
          const alignStyle = getAlignmentStyle(node.format)

          if (node.type === 'upload') {
            const mediaValue = node?.value || null
            const mediaUrl = mediaValue?.url || ''
            const mediaAlt = mediaValue?.alt || mediaValue?.filename || 'Media'

            if (!mediaUrl) return null

            if (String(mediaValue?.mimeType || '').startsWith('video/')) {
              return (
                <div key={index} style={{ margin: '1rem 0', ...alignStyle }}>
                  <video controls style={{ maxWidth: '100%', height: 'auto' }}>
                    <source src={mediaUrl} type={mediaValue?.mimeType || 'video/mp4'} />
                  </video>
                </div>
              )
            }

            return (
              <div key={index} style={{ margin: '1rem 0', ...alignStyle }}>
                <img src={mediaUrl} alt={mediaAlt} style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
            )
          }
          
          if (node.type === 'paragraph') {
            return (
              <p key={index} style={alignStyle}>
                {node.children?.map((child: any, childIndex: number) => renderTextNode(child, childIndex))}
              </p>
            )
          }
          if (node.type === 'heading') {
            const level = node.tag?.replace('h', '') || '2'
            const headingContent = node.children?.map((child: any, childIndex: number) => renderTextNode(child, childIndex))
            switch (level) {
              case '1': return <h1 key={index} style={alignStyle}>{headingContent}</h1>
              case '2': return <h2 key={index} style={alignStyle}>{headingContent}</h2>
              case '3': return <h3 key={index} style={alignStyle}>{headingContent}</h3>
              case '4': return <h4 key={index} style={alignStyle}>{headingContent}</h4>
              case '5': return <h5 key={index} style={alignStyle}>{headingContent}</h5>
              case '6': return <h6 key={index} style={alignStyle}>{headingContent}</h6>
              default: return <h2 key={index} style={alignStyle}>{headingContent}</h2>
            }
          }
          if (node.type === 'list') {
            const ListTag = node.listType === 'number' ? 'ol' : 'ul'
            return (
              <ListTag key={index}>
                {node.children?.map((item: any, itemIndex: number) => (
                  <li key={itemIndex}>
                    {item.children?.map((child: any, childIndex: number) => renderTextNode(child, childIndex))}
                  </li>
                ))}
              </ListTag>
            )
          }
          if (node.type === 'horizontalrule') {
            return <hr key={index} />
          }
          if (node.type === 'quote' || node.type === 'blockquote' || node.type === 'block-quote') {
            return (
              <blockquote key={index} style={alignStyle}>
                {node.children?.map((child: any, childIndex: number) => {
                  if (child.type === 'paragraph') {
                    return (
                      <p key={childIndex}>
                        {child.children?.map((textChild: any, textChildIndex: number) => renderTextNode(textChild, textChildIndex))}
                      </p>
                    )
                  }
                  return renderTextNode(child, childIndex)
                })}
              </blockquote>
            )
          }
          return null
        })}
      </div>
    )
  }
  
  return null
}

// Section renderers
const HeroSection = ({ section }: { section: PageSection }) => {
  const hero = section.heroContent
  if (!hero) return null
  
  const bgImage = getImageUrl(hero.backgroundImage)
  
  return (
    <section 
      className={`hero-section ${getBgClass(section.backgroundColor)}`}
      style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            {hero.headline && <h1>{hero.headline}</h1>}
            {hero.subheadline && <p className="lead">{hero.subheadline}</p>}
            {hero.buttonText && hero.buttonLink && (
              <Link href={hero.buttonLink} className="btn btn-primary btn-lg mt-3">
                {hero.buttonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const CardsSection = ({ section }: { section: PageSection }) => {
  if (!section.cards?.length) return null
  
  return (
    <section className={`cards-section section ${getBgClass(section.backgroundColor)}`}>
      <div className="container">
        {(section.sectionTitle || section.sectionSubtitle) && (
          <div className="section-title text-center mb-3">
            {section.sectionTitle && <h2>{section.sectionTitle}</h2>}
            {section.sectionSubtitle && <p>{section.sectionSubtitle}</p>}
          </div>
        )}
        <div className="row g-4">
          {section.cards.map((card, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div className="card h-100">
                {getImageUrl(card.image) && (
                  <img src={getImageUrl(card.image)} className="card-img-top" alt={card.title} />
                )}
                <div className="card-body">
                  {card.icon && <i className={`bi ${card.icon} card-icon mb-3`}></i>}
                  <h5 className="card-title">{card.title}</h5>
                  {card.description && <p className="card-text">{card.description}</p>}
                  {card.link && (
                    <Link href={card.link} className="btn btn-outline-primary">
                      Learn More
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const GallerySection = ({ section }: { section: PageSection }) => {
  if (!section.galleryImages?.length) return null
  
  return (
    <section className={`gallery-section section ${getBgClass(section.backgroundColor)}`}>
      <div className="container">
        {(section.sectionTitle || section.sectionSubtitle) && (
          <div className="section-title text-center mb-3">
            {section.sectionTitle && <h2>{section.sectionTitle}</h2>}
            {section.sectionSubtitle && <p>{section.sectionSubtitle}</p>}
          </div>
        )}
        <div className="row g-3">
          {section.galleryImages.map((item, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div className="gallery-item">
                <img src={getImageUrl(item.image)} alt={item.caption || `Gallery image ${index + 1}`} className="img-fluid" />
                {item.caption && <p className="gallery-caption">{item.caption}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const CTASection = ({ section }: { section: PageSection }) => {
  const cta = section.ctaContent
  if (!cta) return null
  
  return (
    <section className={`cta-section section ${getBgClass(section.backgroundColor)}`}>
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            {cta.headline && <h2>{cta.headline}</h2>}
            {cta.description && <p className="lead">{cta.description}</p>}
            <div className="cta-buttons mt-4">
              {cta.primaryButtonText && cta.primaryButtonLink && (
                <Link href={cta.primaryButtonLink} className="btn btn-primary btn-lg me-3">
                  {cta.primaryButtonText}
                </Link>
              )}
              {cta.secondaryButtonText && cta.secondaryButtonLink && (
                <Link href={cta.secondaryButtonLink} className="btn btn-outline-primary btn-lg">
                  {cta.secondaryButtonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const FAQSection = ({ section }: { section: PageSection }) => {
  if (!section.faqItems?.length) return null
  
  return (
    <section className={`faq-section section ${getBgClass(section.backgroundColor)}`}>
      <div className="container">
        {(section.sectionTitle || section.sectionSubtitle) && (
          <div className="section-title text-center mb-3">
            {section.sectionTitle && <h2>{section.sectionTitle}</h2>}
            {section.sectionSubtitle && <p>{section.sectionSubtitle}</p>}
          </div>
        )}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="accordion" id="faqAccordion">
              {section.faqItems.map((item, index) => (
                <div key={index} className="accordion-item">
                  <h2 className="accordion-header">
                    <button 
                      className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target={`#faq-${index}`}
                    >
                      {item.question}
                    </button>
                  </h2>
                  <div 
                    id={`faq-${index}`} 
                    className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">{item.answer}</div>
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

const TestimonialsSection = ({ section }: { section: PageSection }) => {
  if (!section.testimonialItems?.length) return null
  
  return (
    <section className={`testimonials-section section ${getBgClass(section.backgroundColor)}`}>
      <div className="container">
        {(section.sectionTitle || section.sectionSubtitle) && (
          <div className="section-title text-center mb-3">
            {section.sectionTitle && <h2>{section.sectionTitle}</h2>}
            {section.sectionSubtitle && <p>{section.sectionSubtitle}</p>}
          </div>
        )}
        <div className="row g-4">
          {section.testimonialItems.map((item, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div className="testimonial-item">
                <div className="testimonial-content">
                  <p className="quote">"{item.quote}"</p>
                  {item.rating && (
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`bi bi-star${i < item.rating! ? '-fill' : ''}`}></i>
                      ))}
                    </div>
                  )}
                </div>
                <div className="testimonial-author d-flex align-items-center mt-3">
                  {getImageUrl(item.authorImage) && (
                    <img src={getImageUrl(item.authorImage)} alt={item.authorName} className="rounded-circle me-3" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                  )}
                  <div>
                    <h6 className="mb-0">{item.authorName}</h6>
                    {item.authorRole && <small className="text-muted">{item.authorRole}</small>}
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

const StatsSection = ({ section }: { section: PageSection }) => {
  if (!section.statsItems?.length) return null
  
  return (
    <section className={`stats-section section ${getBgClass(section.backgroundColor)}`}>
      <div className="container">
        {(section.sectionTitle || section.sectionSubtitle) && (
          <div className="section-title text-center mb-3">
            {section.sectionTitle && <h2>{section.sectionTitle}</h2>}
            {section.sectionSubtitle && <p>{section.sectionSubtitle}</p>}
          </div>
        )}
        <div className="row g-4 text-center">
          {section.statsItems.map((item, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <div className="stat-item">
                {item.icon && <i className={`bi ${item.icon} stat-icon`}></i>}
                <h3 className="stat-number">{item.number}</h3>
                <p className="stat-label">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const TeamSection = ({ section }: { section: PageSection }) => {
  if (!section.teamMembers?.length) return null
  
  return (
    <section className={`team-section section ${getBgClass(section.backgroundColor)}`}>
      <div className="container">
        {(section.sectionTitle || section.sectionSubtitle) && (
          <div className="section-title text-center mb-3">
            {section.sectionTitle && <h2>{section.sectionTitle}</h2>}
            {section.sectionSubtitle && <p>{section.sectionSubtitle}</p>}
          </div>
        )}
        <div className="row g-4">
          {section.teamMembers.map((member, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <div className="team-member text-center">
                {getImageUrl(member.image) && (
                  <img src={getImageUrl(member.image)} alt={member.name} className="rounded-circle mb-3" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                )}
                <h5>{member.name}</h5>
                {member.role && <p className="text-muted">{member.role}</p>}
                {member.bio && <p className="small">{member.bio}</p>}
                {member.socialLinks?.length && (
                  <div className="social-links">
                    {member.socialLinks.map((link, linkIndex) => (
                      <a key={linkIndex} href={link.url} target="_blank" rel="noopener noreferrer" className="me-2">
                        <i className={`bi bi-${link.platform}`}></i>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const PeopleGridSection = ({ section }: { section: PageSection }) => {
  const peopleContent = section.peopleGridContent
  if (!peopleContent?.people?.length) return null
  
  // Get column class based on layout
  const getColClass = (layout?: string) => {
    switch (layout) {
      case 'grid-3': return 'col-lg-4 col-md-6'
      case 'grid-4': return 'col-xl-3 col-lg-4 col-md-6'
      case 'grid-5': return 'col-xl-5col col-lg-4 col-md-6'
      case 'grid-6': return 'col-xl-2 col-lg-3 col-md-4 col-sm-6'
      default: return 'col-xl-3 col-lg-4 col-md-6'
    }
  }
  
  return (
    <section id="instructors" className={`instructors section ${getBgClass(section.backgroundColor)}`}>
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        {(section.sectionTitle || section.sectionSubtitle) && (
          <div className="section-title text-center" data-aos="fade-up">
            {section.sectionTitle && <h2>{section.sectionTitle}</h2>}
            {section.sectionSubtitle && <p>{section.sectionSubtitle}</p>}
          </div>
        )}
        
        <div className="row gy-4">
          {peopleContent.people.map((person: any, index: number) => (
            <div key={person.id || index} className={getColClass(peopleContent.layout)} data-aos="fade-up" data-aos-delay={200 + (index * 50)}>
              <div className="instructor-card">
                <div className="instructor-image">
                  <img 
                    src={typeof person.image === 'object' && person.image?.url ? person.image.url : '/assets/img/education/teacher-2.webp'} 
                    className="img-fluid" 
                    alt={person.name || 'Person'}
                  />
                  {((person.rating && person.rating > 0) || (person.courseCount && person.courseCount > 0)) && (
                  <div className="overlay-content">
                    {person.rating && person.rating > 0 && (
                    <div className="rating-stars">
                      {Array.from({ length: Math.floor(person.rating) }, (_, i) => (
                        <i key={i} className="bi bi-star-fill"></i>
                      ))}
                      {person.rating % 1 !== 0 && <i className="bi bi-star-half"></i>}
                      {Math.floor(person.rating) < 5 && Array.from({ length: 5 - Math.ceil(person.rating) }, (_, i) => (
                        <i key={`empty-${i}`} className="bi bi-star"></i>
                      ))}
                      <span>{person.rating}</span>
                    </div>
                    )}
                    {person.courseCount && person.courseCount > 0 && (
                    <div className="course-count">
                      <i className="bi bi-play-circle"></i>
                      <span>{person.courseCount} Courses</span>
                    </div>
                    )}
                  </div>
                  )}
                </div>
                <div className="instructor-info">
                  <h5>{person.name || 'Unnamed Person'}</h5>
                  {person.specialty && <p className="specialty">{person.specialty}</p>}
                  {person.credentials && person.credentials.length > 0 && (
                    <p className="description">{person.credentials.map((c: any) => c.credential).join(' • ')}</p>
                  )}
                  {peopleContent.showStats && (person.studentCount > 0 || person.rating > 0) && (
                  <div className="stats-grid">
                    {person.studentCount > 0 && (
                    <div className="stat">
                      <span className="number">{person.studentCount}</span>
                      <span className="label">Students</span>
                    </div>
                    )}
                    {person.rating > 0 && (
                    <div className="stat">
                      <span className="number">{person.rating}</span>
                      <span className="label">Rating</span>
                    </div>
                    )}
                  </div>
                  )}
                  <div className="action-buttons">
                    <Link href={person.slug ? `/instructor-profile/${person.slug}` : '#'} className="btn-view">View Profile</Link>
                    {peopleContent.showSocialLinks && person.socialLinks && person.socialLinks.length > 0 && (
                    <div className="social-links">
                      {person.socialLinks.map((social: any, idx: number) => (
                        <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer">
                          <i className={`bi bi-${social.platform}`}></i>
                        </a>
                      ))}
                    </div>
                    )}
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

const ContactFormSection = ({ section }: { section: PageSection }) => {
  const settings = section.contactFormSettings
  
  return (
    <section className={`contact-form-section section ${getBgClass(section.backgroundColor)}`}>
      <div className="container">
        {(section.sectionTitle || section.sectionSubtitle) && (
          <div className="section-title text-center mb-3">
            {section.sectionTitle && <h2>{section.sectionTitle}</h2>}
            {section.sectionSubtitle && <p>{section.sectionSubtitle}</p>}
          </div>
        )}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <form className="contact-form">
              <div className="row g-3">
                <div className="col-md-6">
                  <input type="text" className="form-control" placeholder="Your Name" required />
                </div>
                <div className="col-md-6">
                  <input type="email" className="form-control" placeholder="Your Email" required />
                </div>
                <div className="col-12">
                  <input type="text" className="form-control" placeholder="Subject" />
                </div>
                <div className="col-12">
                  <textarea className="form-control" rows={5} placeholder="Your Message" required></textarea>
                </div>
                <div className="col-12 text-center">
                  <button type="submit" className="btn btn-primary btn-lg">
                    {settings?.submitButtonText || 'Send Message'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

const VideoSection = ({ section }: { section: PageSection }) => {
  const video = section.videoContent
  if (!video) return null
  
  const getVideoEmbed = () => {
    if (video.videoType === 'youtube' && video.videoUrl) {
      const videoId = video.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1]
      if (videoId) {
        return (
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )
      }
    }
    if (video.videoType === 'vimeo' && video.videoUrl) {
      const videoId = video.videoUrl.match(/vimeo\.com\/(\d+)/)?.[1]
      if (videoId) {
        return (
          <iframe
            width="100%"
            height="500"
            src={`https://player.vimeo.com/video/${videoId}`}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        )
      }
    }
    if (video.videoType === 'self' && video.videoFile) {
      return (
        <video 
          controls 
          width="100%" 
          poster={getImageUrl(video.posterImage)}
        >
          <source src={getImageUrl(video.videoFile)} type="video/mp4" />
        </video>
      )
    }
    return null
  }
  
  return (
    <section className={`video-section section ${getBgClass(section.backgroundColor)}`}>
      <div className="container">
        {(section.sectionTitle || section.sectionSubtitle) && (
          <div className="section-title text-center mb-3">
            {section.sectionTitle && <h2>{section.sectionTitle}</h2>}
            {section.sectionSubtitle && <p>{section.sectionSubtitle}</p>}
          </div>
        )}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="video-container">
              {getVideoEmbed()}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const SpacerSection = ({ section }: { section: PageSection }) => {
  const heightMap: Record<string, string> = {
    'small': '20px',
    'medium': '40px',
    'large': '80px',
    'xlarge': '120px',
  }
  const height = heightMap[section.spacerHeight || 'medium'] || '40px'
  
  return <div style={{ height }} />
}

// Main section renderer
const renderSection = (section: PageSection, index: number) => {
  switch (section.sectionType) {
    case 'richText':
      return (
        <section key={index} className={`rich-text-section section ${getBgClass(section.backgroundColor)}`}>
          <div className="container">
            {(section.sectionTitle || section.sectionSubtitle) && (
              <div className="section-title text-center mb-3">
                {section.sectionTitle && <h2>{section.sectionTitle}</h2>}
                {section.sectionSubtitle && <p>{section.sectionSubtitle}</p>}
              </div>
            )}
            <RichTextRenderer content={section.richTextContent} />
          </div>
        </section>
      )
    case 'hero':
      return <HeroSection key={index} section={section} />
    case 'cards':
      return <CardsSection key={index} section={section} />
    case 'gallery':
      return <GallerySection key={index} section={section} />
    case 'cta':
      return <CTASection key={index} section={section} />
    case 'faq':
      return <FAQSection key={index} section={section} />
    case 'testimonials':
      return <TestimonialsSection key={index} section={section} />
    case 'stats':
      return <StatsSection key={index} section={section} />
    case 'team':
      return <TeamSection key={index} section={section} />
    case 'contactForm':
      return <ContactFormSection key={index} section={section} />
    case 'video':
      return <VideoSection key={index} section={section} />
    case 'customHtml':
      return (
        <section key={index} className={`custom-html-section section ${getBgClass(section.backgroundColor)}`}>
          <div className="container">
            <div dangerouslySetInnerHTML={{ __html: section.customHtmlContent || '' }} />
          </div>
        </section>
      )
    case 'spacer':
      return <SpacerSection key={index} section={section} />
    default:
      return null
  }
}

export default function DynamicPageRenderer({ page }: DynamicPageRendererProps) {
  return (
    <>
      {/* Page Title Section */}
      {page.showPageTitle !== false && (
        <div className="page-title light-background">
          <div className="container d-lg-flex justify-content-between align-items-center">
            <h1 className="mb-2 mb-lg-0">{page.title}</h1>
            <nav className="breadcrumbs">
              <ol>
                {page.breadcrumbs?.length ? (
                  page.breadcrumbs.map((crumb, index) => {
                    const isLast = index === page.breadcrumbs!.length - 1
                    return (
                      <li key={index} className={isLast ? 'current' : undefined}>
                        {!isLast && crumb.link ? <Link href={crumb.link}>{crumb.label}</Link> : crumb.label}
                      </li>
                    )
                  })
                ) : (
                  <>
                    <li><Link href="/">Home</Link></li>
                    <li className="current">{page.title}</li>
                  </>
                )}
              </ol>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      {page.content && (
        <section className="section">
          <div className="container">
            <RichTextRenderer content={page.content} />
          </div>
        </section>
      )}

      {/* Layout Blocks (Payload blocks field) */}
      {page.layout && page.layout.length > 0 && <BlockRenderer blocks={page.layout} />}

      {/* Content Blocks (blockBuilder plugin field) */}
      {page.contentBlocks && page.contentBlocks.length > 0 && <BlockRenderer blocks={page.contentBlocks} />}

      {/* Dynamic Sections */}
      {page.sections?.map((section, index) => renderSection(section, index))}
    </>
  )
}
