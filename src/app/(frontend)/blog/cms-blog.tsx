import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

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
  instructor?: {
    name: string
    image?: {
      url: string
    }
  }
  publishedDate: string
  readTime?: number
  category?: string
}

async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const payload = await getPayload({ config })
    const data = await payload.find({
      collection: 'blog-posts' as 'media',
      where: {
        _status: { equals: 'published' },
      },
      limit: 100,
      sort: '-publishedDate',
      depth: 2,
    })
    return (data?.docs || []) as unknown as BlogPost[]
  } catch (error) {
    return []
  }
}

function formatDate(dateString: string): { day: number; month: string } {
  const date = new Date(dateString)
  return {
    day: date.getDate(),
    month: date.toLocaleDateString('en-US', { month: 'short' })
  }
}

export default async function CMSBlogPage() {
  const posts = await getAllPosts()

  // Separate featured post (first one) from others
  const featuredPost = posts[0]
  const heroPosts = posts.slice(1, 4) // Next 3 posts for hero grid
  const regularPosts = posts.slice(4) // Remaining posts for blog posts section

  return (
    <>
      {/* Page Title */}
      <div className="page-title light-background">
        <div className="container d-lg-flex justify-content-between align-items-center">
          <h1 className="mb-2 mb-lg-0">Blog</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li className="current">Blog</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Blog Hero Grid */}
      {posts.length > 0 && (
        <section id="blog-hero" className="blog-hero section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="blog-grid">
              {/* Featured Post (Large) */}
              {featuredPost && (
                <article className="blog-item featured" data-aos="fade-up">
                  <img 
                    src={featuredPost.featuredImage?.url || '/assets/img/blog/blog-post-1.webp'} 
                    alt={featuredPost.title} 
                    className="img-fluid" 
                  />
                  <div className="blog-content">
                    <div className="post-meta">
                      <span className="date">
                        {new Date(featuredPost.publishedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      {featuredPost.category && (
                        <span className="category">{featuredPost.category}</span>
                      )}
                    </div>
                    <h2 className="post-title">
                      <Link href={`/blog-details/${featuredPost.slug}`} title={featuredPost.title}>
                        {featuredPost.title}
                      </Link>
                    </h2>
                  </div>
                </article>
              )}

              {/* Regular Posts for Hero Grid */}
              {heroPosts.map((post, index) => (
                <article key={post.id} className="blog-item" data-aos="fade-up" data-aos-delay={(index + 1) * 100}>
                  <img 
                    src={post.featuredImage?.url || '/assets/img/blog/blog-post-1.webp'} 
                    alt={post.title} 
                    className="img-fluid" 
                  />
                  <div className="blog-content">
                    <div className="post-meta">
                      <span className="date">
                        {new Date(post.publishedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      {post.category && (
                        <span className="category">{post.category}</span>
                      )}
                    </div>
                    <h3 className="post-title">
                      <Link href={`/blog-details/${post.slug}`} title={post.title}>
                        {post.title}
                      </Link>
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Section */}
      {regularPosts.length > 0 && (
        <section id="blog-posts" className="blog-posts section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row gy-4">
              {regularPosts.map((post, index) => {
                const dateInfo = formatDate(post.publishedDate)
                const authorName = post.authorType === 'instructor' 
                  ? post.instructor?.name 
                  : post.authorName

                return (
                  <div key={post.id} className="col-lg-4">
                    <article className="position-relative h-100">
                      <div className="post-img position-relative overflow-hidden">
                        <img 
                          src={post.featuredImage?.url || '/assets/img/blog/blog-post-1.webp'} 
                          className="img-fluid" 
                          alt={post.title} 
                        />
                      </div>
                      <div className="meta d-flex align-items-end">
                        <span className="post-date">
                          <span>{dateInfo.day}</span>
                          {dateInfo.month}
                        </span>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-person"></i> 
                          <span className="ps-2">{authorName || 'Anonymous'}</span>
                        </div>
                        {post.category && (
                          <>
                            <span className="px-3 text-black-50">/</span>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-folder2"></i> 
                              <span className="ps-2">{post.category}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="post-content d-flex flex-column">
                        <h3 className="post-title">{post.title}</h3>
                        <p>{post.shortDescription}</p>
                        <Link href={`/blog-details/${post.slug}`} className="readmore stretched-link">
                          <span>Read More</span><i className="bi bi-arrow-right"></i>
                        </Link>
                      </div>
                    </article>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Show message if no content */}
      {posts.length === 0 && (
        <section className="section">
          <div className="container">
            <div className="text-center py-5">
              <h3>No blog content available</h3>
              <p>Please add blog posts through the admin panel.</p>
            </div>
          </div>
        </section>
      )}
    </>
  )
}