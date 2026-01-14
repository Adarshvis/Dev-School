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
  readTime?: string
  category?: string
  isFeatured?: boolean
  commentCount?: number
}

async function getAllNews(): Promise<NewsArticle[]> {
  try {
    const payload = await getPayload({ config })
    const data = await payload.find({
      collection: 'news' as 'media',
      where: {
        status: { equals: 'published' },
      },
      limit: 100,
      sort: '-publishedDate',
      depth: 2,
    })
    return (data?.docs || []) as unknown as NewsArticle[]
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export default async function CMSNewsPage({ isHomePage = false }: { isHomePage?: boolean } = {}) {
  const news = await getAllNews()

  // Separate featured and regular news
  const featuredNews = news.filter(n => n.isFeatured)
  const regularNews = news.filter(n => !n.isFeatured)

  // Get main featured article and secondary articles
  const mainFeatured = featuredNews[0]
  const secondaryFeatured = featuredNews.slice(1, 3)

  // Group news by tabs for sidebar (3 cards each)
  const topStoriesNews = regularNews.slice(0, 3)
  const trendingNews = regularNews.slice(3, 6)
  const latestNews = news.slice(0, 3)

  return (
    <>
      {/* Page Title - Hide breadcrumb when used as home page */}
      {!isHomePage && (
        <div className="page-title light-background">
          <div className="container d-lg-flex justify-content-between align-items-center">
            <h1 className="mb-2 mb-lg-0">News</h1>
            <nav className="breadcrumbs">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li className="current">News</li>
              </ol>
            </nav>
          </div>
        </div>
      )}

      {/* News Hero Section */}
      <section id="news-hero" className="news-hero section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row g-4">
            {/* Main Content Area */}
            <div className="col-lg-8">
              {/* Featured Article */}
              {mainFeatured && (
                <article className="featured-post position-relative mb-4" data-aos="fade-up">
                  <img 
                    src={mainFeatured.featuredImage?.url || '/assets/img/blog/blog-hero-9.webp'} 
                    alt={mainFeatured.title} 
                    className="img-fluid" 
                  />
                  <div className="post-overlay">
                    <div className="post-content">
                      <div className="post-meta">
                        {mainFeatured.category && (
                          <span className="category">{mainFeatured.category}</span>
                        )}
                        <span className="date">{formatDate(mainFeatured.publishedDate)}</span>
                      </div>
                      <h2 className="post-title">
                        <Link href={`/news/${mainFeatured.slug}`}>{mainFeatured.title}</Link>
                      </h2>
                      <p className="post-excerpt">{mainFeatured.excerpt}</p>
                      <div className="post-author">
                        <span>by</span>
                        <Link href="#">
                          {mainFeatured.authorType === 'instructor' 
                            ? mainFeatured.instructor?.name 
                            : mainFeatured.authorName || 'Anonymous'}
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* Secondary Articles */}
              {secondaryFeatured.length > 0 && (
                <div className="row g-4">
                  {secondaryFeatured.map((article, index) => (
                    <div key={article.id} className="col-md-6">
                      <article className="secondary-post" data-aos="fade-up" data-aos-delay={index * 100}>
                        <div className="post-image">
                          <img 
                            src={article.featuredImage?.url || '/assets/img/blog/blog-post-1.webp'} 
                            alt={article.title} 
                            className="img-fluid" 
                          />
                        </div>
                        <div className="post-content">
                          <div className="post-meta">
                            {article.category && (
                              <span className="category">{article.category}</span>
                            )}
                            <span className="date">{formatDate(article.publishedDate)}</span>
                          </div>
                          <h3 className="post-title">
                            <Link href={`/news/${article.slug}`}>{article.title}</Link>
                          </h3>
                          <div className="post-author">
                            <span>by</span>
                            <Link href="#">
                              {article.authorType === 'instructor' 
                                ? article.instructor?.name 
                                : article.authorName || 'Anonymous'}
                            </Link>
                          </div>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar with Tabs */}
            <div className="col-lg-4">
              <div className="news-tabs" data-aos="fade-up" data-aos-delay="200">
                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#top-stories" type="button" suppressHydrationWarning>
                      Top stories
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#trending" type="button" suppressHydrationWarning>
                      Trending News
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#latest" type="button" suppressHydrationWarning>
                      Latest News
                    </button>
                  </li>
                </ul>

                <div className="tab-content">
                  {/* Top Stories Tab */}
                  <div className="tab-pane fade show active" id="top-stories" suppressHydrationWarning>
                    {topStoriesNews.map((article) => (
                      <article key={article.id} className="tab-post">
                        <div className="row g-0 align-items-center">
                          <div className="col-4">
                            <img 
                              src={article.featuredImage?.url || '/assets/img/blog/blog-post-square-1.webp'} 
                              alt={article.title} 
                              className="img-fluid" 
                            />
                          </div>
                          <div className="col-8">
                            <div className="post-content">
                              {article.category && (
                                <span className="category">{article.category}</span>
                              )}
                              <h4 className="post-title">
                                <Link href={`/news/${article.slug}`}>{article.title}</Link>
                              </h4>
                              <div className="post-author">
                                by{' '}
                                <Link href="#">
                                  {article.authorType === 'instructor' 
                                    ? article.instructor?.name 
                                    : article.authorName || 'Anonymous'}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Trending News Tab */}
                  <div className="tab-pane fade" id="trending" suppressHydrationWarning>
                    {trendingNews.map((article) => (
                      <article key={article.id} className="tab-post">
                        <div className="row g-0 align-items-center">
                          <div className="col-4">
                            <img 
                              src={article.featuredImage?.url || '/assets/img/blog/blog-post-square-1.webp'} 
                              alt={article.title} 
                              className="img-fluid" 
                            />
                          </div>
                          <div className="col-8">
                            <div className="post-content">
                              {article.category && (
                                <span className="category">{article.category}</span>
                              )}
                              <h4 className="post-title">
                                <Link href={`/news/${article.slug}`}>{article.title}</Link>
                              </h4>
                              <div className="post-author">
                                by{' '}
                                <Link href="#">
                                  {article.authorType === 'instructor' 
                                    ? article.instructor?.name 
                                    : article.authorName || 'Anonymous'}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Latest News Tab */}
                  <div className="tab-pane fade" id="latest" suppressHydrationWarning>
                    {latestNews.map((article) => (
                      <article key={article.id} className="tab-post">
                        <div className="row g-0 align-items-center">
                          <div className="col-4">
                            <img 
                              src={article.featuredImage?.url || '/assets/img/blog/blog-post-square-1.webp'} 
                              alt={article.title} 
                              className="img-fluid" 
                            />
                          </div>
                          <div className="col-8">
                            <div className="post-content">
                              {article.category && (
                                <span className="category">{article.category}</span>
                              )}
                              <h4 className="post-title">
                                <Link href={`/news/${article.slug}`}>{article.title}</Link>
                              </h4>
                              <div className="post-author">
                                by{' '}
                                <Link href="#">
                                  {article.authorType === 'instructor' 
                                    ? article.instructor?.name 
                                    : article.authorName || 'Anonymous'}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Posts Section */}
      {regularNews.length > 0 && (
        <section id="news-posts" className="news-posts section">
          <div className="container">
            <div className="row gy-4">
              {regularNews.map((article, index) => {
                const authorName = article.authorType === 'instructor' 
                  ? article.instructor?.name 
                  : article.authorName
                
                const authorImageUrl = article.authorType === 'instructor'
                  ? article.instructor?.image?.url
                  : article.authorImage?.url

                const formattedDate = new Date(article.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })

                return (
                  <div key={article.id} className="col-xl-4 col-md-6" data-aos="fade-up" data-aos-delay={index * 100}>
                    <article>
                      <div className="post-img">
                        <img 
                          src={article.featuredImage?.url || '/assets/img/blog/blog-post-1.webp'} 
                          alt={article.title} 
                          className="img-fluid" 
                        />
                      </div>

                      {article.category && (
                        <p className="post-category">{article.category}</p>
                      )}

                      <h2 className="title">
                        <Link href={`/news/${article.slug}`}>{article.title}</Link>
                      </h2>

                      <div className="d-flex align-items-center">
                        <img 
                          src={authorImageUrl || '/assets/img/person/person-m-1.webp'} 
                          alt={authorName || 'Author'} 
                          className="img-fluid post-author-img flex-shrink-0" 
                        />
                        <div className="post-meta">
                          <p className="post-author">{authorName || 'Anonymous'}</p>
                          <p className="post-date">
                            <time dateTime={article.publishedDate}>{formattedDate}</time>
                          </p>
                        </div>
                      </div>
                    </article>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
