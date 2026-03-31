import React from 'react';
import Link from 'next/link';
import { getPayload } from 'payload'
import config from '@/payload.config'

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  featuredImage: {
    url: string;
    alt?: string;
  };
  authorType: 'manual' | 'instructor';
  authorName?: string;
  authorImage?: {
    url: string;
  };
  instructor?: {
    name: string;
    image?: {
      url: string;
    };
  };
  publishedDate: string;
  readTime?: number;
  category?: string;
}

async function getRecentPosts(): Promise<BlogPost[]> {
  try {
    const payload = await getPayload({ config })
    const data = await payload.find({
      collection: 'blog-posts' as 'media',
      where: {
        _status: { equals: 'published' },
      },
      limit: 4,
      sort: '-publishedDate',
      depth: 2,
    })
    return (data?.docs || []) as unknown as BlogPost[]
  } catch (error) {
    return []
  }
}

export default async function RecentBlogPosts() {
  const posts = await getRecentPosts();

  // Show section even if no posts, with a message
  return (
    <section id="recent-blog-posts" className="recent-blog-posts section">
      {/* Section Title */}
      <div className="container section-title" data-aos="fade-up">
        <h2>Recent Blog Posts</h2>
        <p>Stay updated with our latest insights</p>
      </div>
      {/* End Section Title */}

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        {posts && posts.length > 0 ? (
          <div className="row gy-4">
            {posts.map((post: BlogPost, index: number) => {
              // Determine author info based on authorType
              const authorName = post.authorType === 'instructor' 
                ? post.instructor?.name 
                : post.authorName;
              
              const authorImageUrl = post.authorType === 'instructor'
                ? post.instructor?.image?.url
                : post.authorImage?.url;

              const featuredImageUrl = typeof post.featuredImage === 'object' 
                ? post.featuredImage.url 
                : '/assets/img/blog/blog-post-1.webp';

              return (
                <div 
                  key={post.id} 
                  className="col-lg-3" 
                  data-aos="fade-up" 
                  data-aos-delay={(index + 2) * 100}
                >
                  <div className="card">
                    <div className="card-top d-flex align-items-center">
                      <img 
                        src={authorImageUrl || '/assets/img/person/person-f-12.webp'} 
                        alt={authorName || 'Author'} 
                        className="rounded-circle me-2"
                      />
                      <span className="author-name">By {authorName || 'Anonymous'}</span>
                    </div>
                    <div className="card-img-wrapper">
                      <img 
                        src={featuredImageUrl} 
                        alt={post.title}
                      />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">
                        <Link href={`/blog-details/${post.slug}`}>{post.title}</Link>
                      </h5>
                      <p className="card-text">{post.shortDescription}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No blog posts available yet. Please add some blog posts in the admin panel.</p>
          </div>
        )}
      </div>
    </section>
  );
}
