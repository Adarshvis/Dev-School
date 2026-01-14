'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { lexicalToHtml } from '@/lib/lexicalToHtml'
import AOS from 'aos'
import 'aos/dist/aos.css'

interface BlogPost {
  id: string
  title: string
  slug: string
  shortDescription: string
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
  authorBio?: string
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
}

interface CMSBlogDetailsPageProps {
  slug: string
}

function CategoryBadge({ category }: { category: string }) {
  const getCategoryLabel = (cat: string) => {
    const categories: Record<string, string> = {
      'web-development': 'Web Development',
      'data-science': 'Data Science',
      'design': 'Design',
      'marketing': 'Marketing',
      'business': 'Business',
      'general': 'General'
    }
    return categories[cat] || cat
  }

  return <a href={`/blog?category=${category}`} className="category">{getCategoryLabel(category)}</a>
}

export default function CMSBlogDetailsPage({ slug }: CMSBlogDetailsPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Use relative URL for client-side fetch
        const res = await fetch(`/api/blog-posts?where[slug][equals]=${slug}&where[status][equals]=published`)
        
        if (!res.ok) {
          setLoading(false)
          return
        }
        
        const data = await res.json()
        
        if (!data.docs || data.docs.length === 0) {
          setLoading(false)
          return
        }
        
        const postData = data.docs[0]
        setPost(postData)
        
        // Fetch related posts
        if (postData.category) {
          const relatedRes = await fetch(
            `/api/blog-posts?where[category][equals]=${postData.category}&where[slug][not_equals]=${slug}&where[status][equals]=published&limit=3`
          )
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json()
            setRelatedPosts(relatedData.docs || [])
          }
        }
      } catch (error) {
        console.error('Error fetching blog post:', error)
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

  if (!post) {
    notFound()
  }

  const authorName = post.authorType === 'instructor' ? post.instructor?.name : post.authorName
  const authorImageUrl = post.authorType === 'instructor' ? post.instructor?.image?.url : post.authorImage?.url
  const authorRole = post.authorType === 'instructor' ? post.instructor?.specialty : post.authorRole

  const formattedDate = new Date(post.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const contentHtml = lexicalToHtml(post.content)

  return (
    <>
      {/* Page Title */}
      <div className="page-title light-background">
        <div className="container d-lg-flex justify-content-between align-items-center">
          <h1 className="mb-2 mb-lg-0">Blog Details</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li className="current">{post.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Blog Details Section */}
      <section id="blog-details" className="blog-details section">
        <div className="container" data-aos="fade-up">
          <article className="article">
            {/* Article Header */}
            <div className="article-header">
              {post.category && (
                <div className="meta-categories" data-aos="fade-up">
                  <CategoryBadge category={post.category} />
                </div>
              )}

              <h1 className="title" data-aos="fade-up" data-aos-delay="100">
                {post.title}
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
                  {post.readTime && (
                    <span>
                      <i className="bi bi-clock"></i> {post.readTime}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.featuredImage?.url && (
              <div className="article-featured-image" data-aos="zoom-in">
                <img 
                  src={post.featuredImage.url} 
                  alt={post.title} 
                  className="img-fluid"
                  style={{ maxHeight: '500px', width: 'auto', display: 'block', margin: '0 auto' }}
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
                    <li><a href="#content" className="active">Article Content</a></li>
                  </ul>
                </nav>
              </aside>

              {/* Article Content */}
              <div className="article-content">
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
                    href={`https://twitter.com/intent/tweet?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}&text=${encodeURIComponent(post.title)}`}
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
              {post.tags && post.tags.length > 0 && (
                <div className="article-tags">
                  <h4>Related Topics</h4>
                  <div className="tags">
                    {post.tags.map((tagObj, index) => (
                      <a key={index} href="#" className="tag">
                        {tagObj.tag}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Author Bio */}
          {post.authorBio && authorName && (
            <div className="author-bio-section mt-5" data-aos="fade-up">
              <div className="author-bio-card">
                {authorImageUrl && (
                  <div className="author-avatar">
                    <img src={authorImageUrl} alt={authorName} />
                  </div>
                )}
                <div className="author-details">
                  <h4>About {authorName}</h4>
                  {authorRole && <p className="author-title">{authorRole}</p>}
                  <p className="author-description">{post.authorBio}</p>
                </div>
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="related-posts-section mt-5" data-aos="fade-up">
              <h3 className="section-title mb-4">Related Articles</h3>
              <div className="row gy-4">
                {relatedPosts.map((relatedPost) => (
                  <div key={relatedPost.id} className="col-lg-4 col-md-6">
                    <div className="post-card h-100">
                      {relatedPost.featuredImage?.url && (
                        <div className="post-img">
                          <Link href={`/blog-details/${relatedPost.slug}`}>
                            <img 
                              src={relatedPost.featuredImage.url} 
                              alt={relatedPost.title} 
                              className="img-fluid" 
                            />
                          </Link>
                        </div>
                      )}
                      <div className="post-content p-3">
                        {relatedPost.category && (
                          <div className="post-category mb-2">
                            <CategoryBadge category={relatedPost.category} />
                          </div>
                        )}
                        <h4 className="mb-3">
                          <Link href={`/blog-details/${relatedPost.slug}`} className="text-decoration-none">
                            {relatedPost.title}
                          </Link>
                        </h4>
                        <p className="mb-3">{relatedPost.shortDescription}</p>
                        <div className="post-meta d-flex gap-3 text-muted small">
                          <span>
                            <i className="bi bi-calendar me-1"></i>
                            {new Date(relatedPost.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          {relatedPost.readTime && (
                            <span>
                              <i className="bi bi-clock me-1"></i>
                              {relatedPost.readTime}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
