import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage: {
    url: string
    alt?: string
  }
  category: string
  publishedDate: string
  author: {
    name: string
    photo?: {
      url: string
    }
  }
  readTime?: string
}

interface FeaturedNewsProps {
  title?: string
  description?: string
}

const EXCLUDED_NEWS_PATTERNS = [/\bvc\s*speech\b/i, /\bvice\s+chancellor\s+speech\b/i]

function isExcludedNewsItem(article: NewsArticle): boolean {
  const title = article?.title || ''
  const excerpt = article?.excerpt || ''
  return EXCLUDED_NEWS_PATTERNS.some((pattern) => pattern.test(title) || pattern.test(excerpt))
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Fetch news data from API
async function getNewsForHome(): Promise<{ featured: NewsArticle | null; recent: NewsArticle[] }> {
  try {
    const payload = await getPayload({ config })
    const data = await payload.find({
      collection: 'news' as 'media',
      where: {
        status: { equals: 'published' },
      },
      limit: 5,
      sort: '-publishedDate',
      depth: 2,
    })
    
    const docs = (data.docs || []) as unknown as NewsArticle[]
    const visibleDocs = docs.filter((article) => !isExcludedNewsItem(article))
    
    // Get 1 featured article (first one)
    const featured = visibleDocs[0] || null
    
    // Get 4 recent articles (remaining ones)
    const recent = visibleDocs.slice(1, 5)
    
    return { featured, recent }
  } catch (error) {
    console.error('Error fetching news:', error)
    return { featured: null, recent: [] }
  }
}

export default async function FeaturedNews({ title, description }: FeaturedNewsProps = {}) {
  const { featured, recent } = await getNewsForHome()
  
  if (!featured && recent.length === 0) {
    return null
  }

  return (
    <section id="featured-news" className="featured-news section">
      {/* Section Title */}
      <div className="container section-title" data-aos="fade-up">
        <h2>{title || 'Featured News'}</h2>
        <p>{description || 'Stay updated with our latest news and announcements'}</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row gy-5">
          {/* Featured News - Large Banner */}
          {featured && (
            <div className="col-lg-6" data-aos="fade-right" data-aos-delay="100">
              <Link href={`/news/${featured.slug}`} className="news-banner">
                <div className="banner-image">
                  <img 
                    src={featured.featuredImage?.url || '/assets/img/blog/blog-1.jpg'} 
                    alt={featured.title} 
                    className="img-fluid"
                  />
                  <div className="banner-badge">
                    <span className="badge-text">{featured.category?.toUpperCase()}</span>
                  </div>
                </div>
                <div className="banner-info">
                  <div className="news-header">
                    <h3>{featured.title}</h3>
                    <div className="news-meta">
                      <span>
                        <i className="bi bi-person-fill"></i> {featured.author?.name}
                      </span>
                      <span>
                        <i className="bi bi-calendar-fill"></i> {formatDate(featured.publishedDate)}
                      </span>
                    </div>
                  </div>
                  <p>{featured.excerpt}</p>
                  <span className="discover-btn">Read More</span>
                </div>
              </Link>
            </div>
          )}

          {/* Recent News Grid - 4 Small Cards */}
          <div className="col-lg-6">
            <div className="news-grid">
              <div className="row g-3">
                {recent.map((article: NewsArticle, index: number) => (
                  <div key={article.id} className="col-12" data-aos="fade-left" data-aos-delay={`${200 + index * 100}`}>
                    <Link href={`/news/${article.slug}`} className="news-item">
                      <div className="item-icon">
                        <img 
                          src={article.featuredImage?.url || '/assets/img/blog/blog-2.jpg'} 
                          alt={article.title} 
                          className="img-fluid"
                        />
                      </div>
                      <div className="item-content">
                        <h4>{article.title}</h4>
                        <p>{article.excerpt?.substring(0, 100)}...</p>
                        <div className="meta-info">
                          <span className="category">{article.category?.toUpperCase()}</span>
                          <span>{formatDate(article.publishedDate)}</span>
                        </div>
                      </div>
                      <div className="item-arrow">
                        <i className="bi bi-arrow-right"></i>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
