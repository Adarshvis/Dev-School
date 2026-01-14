'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { lexicalToHtml } from '@/lib/lexicalToHtml'
import AOS from 'aos'
import 'aos/dist/aos.css'

interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage: {
    url: string
    alt?: string
  }
  authorType: 'manual' | 'instructor'
  authorName?: string
  authorImage?: {
    url: string
  }
  authorRole?: string
  instructor?: {
    id: string
    name: string
    image?: {
      url: string
    }
    specialty?: string
  }
  content: any
  publishedDate: string
  readTime?: string
  category?: string
  tags?: Array<{ tag: string }>
  commentCount?: number
}

interface CMSNewsDetailsPageProps {
  slug: string
}

function CategoryBadge({ category }: { category: string }) {
  const getCategoryLabel = (cat: string) => {
    const categories: Record<string, string> = {
      'campus': 'Campus News',
      'academic': 'Academic',
      'events': 'Events',
      'achievements': 'Achievements',
      'research': 'Research',
      'sports': 'Sports',
      'technology': 'Technology',
      'general': 'General'
    }
    return categories[cat] || cat
  }

  return <a href={`/news?category=${category}`} className="category">{getCategoryLabel(category)}</a>
}

export default function CMSNewsDetailsPage({ slug }: CMSNewsDetailsPageProps) {
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [relatedNews, setRelatedNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Use relative URL for client-side fetch - works on any domain/port
        const res = await fetch(`/api/news?where[slug][equals]=${slug}`)
        
        if (!res.ok) {
          setLoading(false)
          return
        }
        
        const data = await res.json()
        
        if (!data.docs || data.docs.length === 0) {
          setLoading(false)
          return
        }
        
        const articleData = data.docs[0]
        setArticle(articleData)
        
        // Fetch related news
        if (articleData.category) {
          const relatedRes = await fetch(
            `/api/news?where[category][equals]=${articleData.category}&where[slug][not_equals]=${slug}&limit=3`
          )
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json()
            setRelatedNews(relatedData.docs || [])
          }
        }
      } catch (error) {
        console.error('Error fetching news article:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [slug])

  useEffect(() => {
    if (!loading) {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      })
    }
  }, [loading])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!article) {
    notFound()
  }

  const authorName = article.authorType === 'instructor' ? article.instructor?.name : article.authorName
  const authorImageUrl = article.authorType === 'instructor' ? article.instructor?.image?.url : article.authorImage?.url
  const authorRole = article.authorType === 'instructor' ? article.instructor?.specialty : article.authorRole

  const formattedDate = new Date(article.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const contentHtml = lexicalToHtml(article.content)

  return (
    <>
      {/* Page Title */}
      <div className="page-title light-background">
        <div className="container d-lg-flex justify-content-between align-items-center">
          <h1 className="mb-2 mb-lg-0">News Details</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/news">News</Link></li>
              <li className="current">{article.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* News Details Section */}
      <section id="blog-details" className="blog-details section">
        <div className="container" data-aos="fade-up">
          <article className="article">
            {/* Article Header */}
            <div className="article-header">
              {article.category && (
                <div className="meta-categories" data-aos="fade-up">
                  <CategoryBadge category={article.category} />
                </div>
              )}

              <h1 className="title" data-aos="fade-up" data-aos-delay="100">
                {article.title}
              </h1>

              <div className="article-meta" data-aos="fade-up" data-aos-delay="200">
                {authorName && (
                  <div className="author">
                    {authorImageUrl && (
                      <img 
                        src={authorImageUrl} 
                        alt={authorName} 
                        className="author-img" 
                      />
                    )}
                    <div className="author-info">
                      <h4>{authorName}</h4>
                      {authorRole && <span>{authorRole}</span>}
                    </div>
                  </div>
                )}
                <div className="post-info">
                  <span>
                    <i className="bi bi-calendar4-week"></i> {formattedDate}
                  </span>
                  {article.readTime && (
                    <span>
                      <i className="bi bi-clock"></i> {article.readTime}
                    </span>
                  )}
                  {article.commentCount !== undefined && article.commentCount > 0 && (
                    <span>
                      <i className="bi bi-chat-square-text"></i> {article.commentCount} Comments
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {article.featuredImage?.url && (
              <div className="article-featured-image" data-aos="zoom-in">
                <img 
                  src={article.featuredImage.url} 
                  alt={article.title} 
                  className="img-fluid"
                />
              </div>
            )}

            {/* Article Wrapper */}
            <div className="article-wrapper">
              {/* Table of Contents - Optional Sidebar */}
              <aside className="table-of-contents" data-aos="fade-left">
                <h3>Table of Contents</h3>
                <nav>
                  <ul>
                    <li><a href="#introduction" className="active">Introduction</a></li>
                    <li><a href="#content">Full Story</a></li>
                  </ul>
                </nav>
              </aside>

              {/* Article Content */}
              <div className="article-content">
                {/* Introduction Section */}
                <div className="content-section" id="introduction" data-aos="fade-up">
                  <p className="lead">{article.excerpt}</p>
                </div>

                {/* Main Content */}
                <div 
                  id="content"
                  className="content-section" 
                  data-aos="fade-up"
                  dangerouslySetInnerHTML={{ __html: contentHtml }} 
                />
              </div>
            </div>

            {/* Article Footer */}
            <div className="article-footer" data-aos="fade-up">
              {/* Share Buttons */}
              <div className="share-article">
                <h4>Share this article</h4>
                <div className="share-buttons">
                  <a 
                    href={`https://twitter.com/intent/tweet?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}&text=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-button twitter"
                  >
                    <i className="bi bi-twitter-x"></i>
                    <span>Share on X</span>
                  </a>
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-button facebook"
                  >
                    <i className="bi bi-facebook"></i>
                    <span>Share on Facebook</span>
                  </a>
                  <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-button linkedin"
                  >
                    <i className="bi bi-linkedin"></i>
                    <span>Share on LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="article-tags">
                  <h4>Related Topics</h4>
                  <div className="tags">
                    {article.tags.map((tagObj, index) => (
                      <a key={index} href="#" className="tag">
                        {tagObj.tag}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Related News */}
          {relatedNews.length > 0 && (
            <section id="related-news" className="related-posts mt-5" data-aos="fade-up">
              <div className="section-title">
                <h2>Related News</h2>
                <p>More stories from {article.category && getCategoryLabel(article.category)}</p>
              </div>
              <div className="row gy-4">
                {relatedNews.map((relatedArticle) => (
                  <div key={relatedArticle.id} className="col-lg-4">
                    <article className="related-post">
                      <div className="post-img">
                        <img 
                          src={relatedArticle.featuredImage?.url || '/assets/img/blog/blog-post-1.webp'} 
                          alt={relatedArticle.title}
                          className="img-fluid"
                        />
                      </div>
                      <h3 className="post-title">
                        <Link href={`/news/${relatedArticle.slug}`}>
                          {relatedArticle.title}
                        </Link>
                      </h3>
                      <p className="post-excerpt">{relatedArticle.excerpt}</p>
                      <div className="post-meta">
                        <span className="date">
                          <i className="bi bi-calendar4-week"></i>
                          {new Date(relatedArticle.publishedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </>
  )
}

function getCategoryLabel(cat: string) {
  const categories: Record<string, string> = {
    'campus': 'Campus News',
    'academic': 'Academic',
    'events': 'Events',
    'achievements': 'Achievements',
    'research': 'Research',
    'sports': 'Sports',
    'technology': 'Technology',
    'general': 'General'
  }
  return categories[cat] || cat
}
