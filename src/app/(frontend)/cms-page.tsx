import * as React from 'react'
import Link from 'next/link'
import { getPageContent } from '../../lib/payload'
import TestimonialsSlider from './components/TestimonialsSlider'
import { BlockRenderer } from './components/BlockRenderer'
import RecentBlogPosts from './components/RecentBlogPosts'
import FeaturedNews from './components/FeaturedNews'

export default async function CMSHomePage() {
  try {
    // Fetch home page sections from the home-page collection
    const homePageSections = await getPageContent('home')
    
    // Add safety check and ensure homePageSections is an array
    const sections = Array.isArray(homePageSections) ? homePageSections : []
    
    // If no sections, show setup message
    if (sections.length === 0) {
      return (
        <div className="container py-5">
          <div className="text-center">
            <h2>🎉 CMS Integration Active!</h2>
            <p>Your homepage is connected but needs content. Please add sections to your <strong>Home Page</strong> collection.</p>
            <div className="alert alert-info my-4">
              <h6>Available Section Types:</h6>
              <ul className="list-unstyled">
                <li>✅ Hero Section</li>
                <li>✅ Featured Courses</li>
                <li>✅ Course Categories</li>
                <li>✅ Featured Instructors</li>
                <li>✅ Testimonials</li>
                <li>✅ Recent Blog Posts</li>
                <li>✅ CTA Section</li>
              </ul>
            </div>
            <Link href="/admin" className="btn btn-primary btn-lg">
              Go to Admin Panel
            </Link>
          </div>
        </div>
      )
    }

    // Helper function to render a section based on its type
    const renderSection = (section: any, index: number) => {
      // Custom block section - render using BlockRenderer
      if (section.sectionType === 'custom-block' && section.customBlock) {
        return <BlockRenderer key={`custom-${section.id || index}`} blocks={section.customBlock} />
      }
      
      // Return null for other sections - they have their own rendering logic below
      // We'll check after each main section if there's a custom block that should appear next
      return null
    }

    // Helper to get custom blocks that should appear after a specific section type
    const getCustomBlocksAfter = (sectionType: string) => {
      const currentIndex = sections.findIndex((s: any) => s.sectionType === sectionType)
      if (currentIndex === -1) return []
      
      // Find all custom blocks that appear after this section and before the next major section
      const customBlocks = []
      for (let i = currentIndex + 1; i < sections.length; i++) {
        if (sections[i].sectionType === 'custom-block') {
          customBlocks.push(sections[i])
        } else {
          // Stop when we hit the next major section
          break
        }
      }
      return customBlocks
    }

    // Find sections by type
    const heroSection = sections.find((section: any) => section.sectionType === 'hero')
    const ourStorySection = sections.find((section: any) => section.sectionType === 'our-story')
    const featuredCoursesSection = sections.find((section: any) => section.sectionType === 'featured-courses')
    const categoriesSection = sections.find((section: any) => section.sectionType === 'course-categories')
    const instructorsSection = sections.find((section: any) => section.sectionType === 'featured-instructors')
    const testimonialsSection = sections.find((section: any) => section.sectionType === 'testimonials')
    const featuredNewsSection = sections.find((section: any) => section.sectionType === 'featured-news')
    const blogSection = sections.find((section: any) => section.sectionType === 'blog-posts')
    const ctaSection = sections.find((section: any) => section.sectionType === 'cta')

    // Get section order from database (sections are ordered in CMS)
    const sectionOrder = sections.map((s: any) => s.sectionType)

    return (
      <>
        {/* Hero Section */}
        {heroSection && heroSection.hero && (
          <section id="courses-hero" className="courses-hero section light-background">
            <div className="hero-content">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="hero-text">
                      <h1>
                        {heroSection.hero.title || "Welcome to Learner"}
                      </h1>
                      <p>{heroSection.hero.description || "Learn new skills with our expert courses"}</p>

                      {/* Hero Stats */}
                      {heroSection.hero.stats && (
                        <div className="hero-stats">
                          {heroSection.hero.stats.map((stat: any, index: number) => (
                            <div key={index} className="stat-item">
                              <span className="number">{stat.number}</span>
                              <span className="label">{stat.label}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Hero Buttons */}
                      <div className="hero-buttons">
                        {heroSection.hero.primaryButton && (
                          <a href={heroSection.hero.primaryButton.link} className="btn btn-primary">
                            {heroSection.hero.primaryButton.text}
                          </a>
                        )}
                        {heroSection.hero.secondaryButton && (
                          <a href={heroSection.hero.secondaryButton.link} className="btn btn-outline">
                            {heroSection.hero.secondaryButton.text}
                          </a>
                        )}
                      </div>

                      {/* Hero Features */}
                      {heroSection.hero.features && (
                        <div className="hero-features">
                          {heroSection.hero.features.map((feature: any, index: number) => (
                            <div key={index} className="feature">
                              <i className={`bi ${feature.icon}`}></i>
                              <span>{feature.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="hero-image">
                      {/* Hero Image Carousel */}
                      {heroSection.hero.heroImages && heroSection.hero.heroImages.length > 0 ? (
                        <div id="heroCarousel" className="carousel slide main-image pointer-event" data-bs-ride="carousel">
                          <div className="carousel-indicators">
                            {heroSection.hero.heroImages.map((_: any, index: number) => (
                              <button
                                key={index}
                                type="button"
                                data-bs-target="#heroCarousel"
                                data-bs-slide-to={index}
                                className={index === 0 ? 'active' : ''}
                                aria-current={index === 0 ? 'true' : 'false'}
                                aria-label={`Slide ${index + 1}`}
                              ></button>
                            ))}
                          </div>
                          <div className="carousel-inner">
                            {heroSection.hero.heroImages.map((item: any, index: number) => (
                              <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                <img
                                  src={typeof item.image === 'object' ? item.image.url : '/assets/img/education/courses-13.webp'}
                                  alt={item.alt || heroSection.hero.title}
                                  className="d-block w-100"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="main-image">
                          <img
                            src="/assets/img/education/courses-13.webp"
                            alt="Online Learning"
                            className="img-fluid"
                          />
                        </div>
                      )}

                      {/* Floating Cards */}
                      {heroSection.hero.floatingCards && (
                        <div className="floating-cards">
                          {heroSection.hero.floatingCards.map((card: any, index: number) => (
                            <div key={index} className="course-card">
                              <div className="card-icon">
                                <i className={`bi ${card.icon}`}></i>
                              </div>
                              <div className="card-content">
                                <h6>{card.title}</h6>
                                <span>{card.students}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-background">
              <div className="bg-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
              </div>
            </div>
          </section>
        )}

        {/* Render custom blocks after hero */}
        {getCustomBlocksAfter('hero').map((section: any, idx: number) => 
          section.customBlock && <BlockRenderer key={`after-hero-${idx}`} blocks={section.customBlock} />
        )}

        {/* Our Story Section */}
        {ourStorySection && ourStorySection.ourStory && (
          <section id="about" className="about section">
            <div className="container" data-aos="fade-up" data-aos-delay="100">
              {(() => {
                const isImageLeft = ourStorySection.ourStory.layout === 'image-left'
                const contentColClass = isImageLeft ? 'col-lg-6 order-lg-2' : 'col-lg-6'
                const imageColClass = isImageLeft ? 'col-lg-6 order-lg-1' : 'col-lg-6'
                return (
              <div className="row align-items-center g-5">
                <div className={contentColClass}>
                  <div className="about-content" data-aos="fade-up" data-aos-delay="200">
                    {ourStorySection.ourStory.subtitle && <h3>{ourStorySection.ourStory.subtitle}</h3>}
                    {ourStorySection.ourStory.title && <h2>{ourStorySection.ourStory.title}</h2>}
                    {ourStorySection.ourStory.description && <p>{ourStorySection.ourStory.description}</p>}

                    {/* Timeline with 3 text points */}
                    {ourStorySection.ourStory.timelinePoints && ourStorySection.ourStory.timelinePoints.length > 0 && (
                      <div className="timeline">
                        {ourStorySection.ourStory.timelinePoints.map((item: any, index: number) => (
                          <div key={index} className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                              {item.title && <h4>{item.title}</h4>}
                              {item.description && <p>{item.description}</p>}
                            </div>
                          </div>
                        ))}
                        
                        {/* Button instead of 4th timeline point */}
                        {(ourStorySection.ourStory.buttonText || ourStorySection.ourStory.buttonLink) && (
                          <div className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                              <Link 
                                href={ourStorySection.ourStory.buttonLink || '/about'} 
                                className="btn btn-primary"
                              >
                                {ourStorySection.ourStory.buttonText || 'Learn More About Us'}
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className={imageColClass}>
                  <div className="about-image" data-aos="zoom-in" data-aos-delay="300">
                    {ourStorySection.ourStory.campusImage && (
                      <img 
                        src={typeof ourStorySection.ourStory.campusImage === 'object' 
                          ? ourStorySection.ourStory.campusImage.url 
                          : ourStorySection.ourStory.campusImage}
                        alt="Campus" 
                        className="img-fluid rounded"
                      />
                    )}

                    {/* Mission & Vision Cards */}
                    {ourStorySection.ourStory.missionVisionCards && ourStorySection.ourStory.missionVisionCards.length > 0 && (
                      <div className="mission-vision" data-aos="fade-up" data-aos-delay="400">
                        {ourStorySection.ourStory.missionVisionCards.map((card: any, index: number) => (
                          <div key={index} className={index === 0 ? 'mission' : 'vision'}>
                            {card.title && <h3>{card.title}</h3>}
                            {card.description && <p>{card.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
                )
              })()}

              {/* Core Values */}
              {ourStorySection.ourStory.coreValues && ourStorySection.ourStory.coreValues.length > 0 && (
                <div className="row mt-5">
                  <div className="col-lg-12">
                    <div className="core-values" data-aos="fade-up" data-aos-delay="500">
                      <h3 className="text-center mb-4">Core Values</h3>
                      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                        {ourStorySection.ourStory.coreValues.map((value: any, index: number) => (
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
        )}

        {/* REMOVED: Featured Courses Section - not in new layout */}
        {/* REMOVED: Course Categories Section - not in new layout */}

        {/* 3. Featured Instructors Section */}
        {instructorsSection && instructorsSection.featuredInstructors && (
          <section id="featured-courses" className="featured-courses section">
            <div className="container section-title">
              <h2>{featuredCoursesSection.featuredCourses.title || "Featured Courses"}</h2>
              <p>{featuredCoursesSection.featuredCourses.description || "Explore our most popular courses"}</p>
            </div>

            <div className="container">
              <div className="row gy-4">
                {featuredCoursesSection.featuredCourses.courses && featuredCoursesSection.featuredCourses.courses.map((course: any, index: number) => (
                  <div key={index} className="col-lg-4 col-md-6">
                    <div className="course-card" style={{ height: 'auto' }}>
                      {course.image && (
                        <div className="course-image">
                          <img 
                            src={typeof course.image === 'object' ? course.image.url : '/assets/img/education/students-9.webp'} 
                            alt={course.title || 'Course'} 
                            className="img-fluid" 
                          />
                          {course.badge && <div className={`badge ${course.badge}`}>{course.badge}</div>}
                          {course.price && <div className="price-badge">{course.price}</div>}
                        </div>
                      )}
                      <div className="course-content">
                        {(course.level || course.duration) && (
                          <div className="course-meta">
                            {course.level && <span className="level">{course.level}</span>}
                            {course.duration && <span className="duration">{course.duration}</span>}
                          </div>
                        )}
                        {course.title && <h3><a href="#">{course.title}</a></h3>}
                        {course.description && <p>{course.description}</p>}
                        {(course.instructorAvatar || course.instructorName || course.instructorSpecialty) && (
                          <div className="instructor">
                            {course.instructorAvatar && (
                              <img 
                                src={typeof course.instructorAvatar === 'object' ? course.instructorAvatar.url : '/assets/img/person/person-f-3.webp'} 
                                alt={course.instructorName || 'Instructor'} 
                                className="instructor-img" 
                              />
                            )}
                            {(course.instructorName || course.instructorSpecialty) && (
                              <div className="instructor-info">
                                {course.instructorName && <h6>{course.instructorName}</h6>}
                                {course.instructorSpecialty && <span>{course.instructorSpecialty}</span>}
                              </div>
                            )}
                          </div>
                        )}
                        {(course.rating || course.studentCount) && (
                          <div className="course-stats">
                            {course.rating && (
                              <div className="rating">
                                {Array.from({ length: Math.floor(course.rating) }, (_, i) => (
                                  <i key={i} className="bi bi-star-fill"></i>
                                ))}
                                {course.rating % 1 !== 0 && <i className="bi bi-star-half"></i>}
                                <span>({course.rating})</span>
                              </div>
                            )}
                            {course.studentCount && (
                              <div className="students">
                                <i className="bi bi-people-fill"></i>
                                <span>{course.studentCount} students</span>
                              </div>
                            )}
                          </div>
                        )}
                        {(course.buttonText || course.buttonLink) && (
                          <a 
                            href={course.buttonLink || '#'} 
                            className="btn-course"
                          >
                            {course.buttonText || 'Enroll Now'}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              {featuredCoursesSection.featuredCourses.viewAllButton && (
                <div className="more-courses text-center">
                  <a href={featuredCoursesSection.featuredCourses.viewAllButton.link} className="btn-more">
                    {featuredCoursesSection.featuredCourses.viewAllButton.text}
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Render custom blocks after featured courses */}
        {getCustomBlocksAfter('featured-courses').map((section: any, idx: number) => 
          section.customBlock && <BlockRenderer key={`after-courses-${idx}`} blocks={section.customBlock} />
        )}

        {/* REMOVED: Course Categories Section */}

        {/* Featured Instructors Section */}
        {instructorsSection && instructorsSection.featuredInstructors && (
          <section id="featured-instructors" className="featured-instructors section">
            {/* Section Title */}
            <div className="container section-title" data-aos="fade-up">
              <h2>{instructorsSection.featuredInstructors.title || "Featured Instructors"}</h2>
              <p>{instructorsSection.featuredInstructors.description || "Learn from industry experts"}</p>
            </div>{/* End Section Title */}

            <div className="container" data-aos="fade-up" data-aos-delay="100">
              <div className="row gy-4">
                {instructorsSection.featuredInstructors.instructors && instructorsSection.featuredInstructors.instructors.map((instructor: any, index: number) => (
                  <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                    <div className="instructor-card">
                      {instructor.image && (
                        <div className="instructor-image">
                          <img 
                            src={typeof instructor.image === 'object' ? instructor.image.url : '/assets/img/education/teacher-2.webp'} 
                            className="img-fluid" 
                            alt={instructor.name || 'Instructor'} 
                          />
                          {(instructor.rating || instructor.courseCount) && (
                            <div className="overlay-content">
                              {instructor.rating && (
                                <div className="rating-stars">
                                  {Array.from({ length: Math.floor(instructor.rating) }, (_, i) => (
                                    <i key={i} className="bi bi-star-fill"></i>
                                  ))}
                                  {instructor.rating % 1 !== 0 && <i className="bi bi-star-half"></i>}
                                  <span>{instructor.rating}</span>
                                </div>
                              )}
                              {instructor.courseCount && (
                                <div className="course-count">
                                  <i className="bi bi-play-circle"></i>
                                  <span>{instructor.courseCount} Courses</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="instructor-info">
                        {instructor.name && <h5>{instructor.name}</h5>}
                        {instructor.description && <p className="description">{instructor.description}</p>}
                        {(instructor.studentCount || instructor.rating) && (
                          <div className="stats-grid">
                            {instructor.studentCount && (
                              <div className="stat">
                                <span className="number">{instructor.studentCount}</span>
                                <span className="label">Students</span>
                              </div>
                            )}
                            {instructor.rating && (
                              <div className="stat">
                                <span className="number">{instructor.rating}</span>
                                <span className="label">Rating</span>
                              </div>
                            )}
                          </div>
                        )}
                        {(instructor.profileLink || instructor.profileButtonText || instructor.socialLinks) && (
                          <div className="action-buttons">
                            {(instructor.profileLink || instructor.profileButtonText) && (
                              <a 
                                href={instructor.profileLink || '#'} 
                                className="btn-view"
                              >
                                {instructor.profileButtonText || 'View Profile'}
                              </a>
                            )}
                            {instructor.socialLinks && instructor.socialLinks.length > 0 && (
                              <div className="social-links">
                                {instructor.socialLinks.map((social: any, socialIndex: number) => (
                                  social.url && (
                                    <a key={socialIndex} href={social.url} target="_blank" rel="noopener noreferrer">
                                      <i className={`bi bi-${social.platform}`}></i>
                                    </a>
                                  )
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Render custom blocks after instructors */}
        {getCustomBlocksAfter('featured-instructors').map((section: any, idx: number) => 
          section.customBlock && <BlockRenderer key={`after-instructors-${idx}`} blocks={section.customBlock} />
        )}

        {/* Testimonials Section */}
        {testimonialsSection && testimonialsSection.testimonials && (
          <section id="testimonials" className="testimonials section">
            {/* Section Title */}
            <div className="container section-title" data-aos="fade-up">
              <h2>{testimonialsSection.testimonials.title || "Testimonials"}</h2>
              <p>{testimonialsSection.testimonials.description || "What our students say about us"}</p>
            </div>{/* End Section Title */}

            <div className="container" data-aos="fade-up" data-aos-delay="100">
              <div className="row">
                <div className="col-12">
                  
                  {/* Critic Reviews - Top 3 Cards */}
                  {testimonialsSection.testimonials.criticReviews && (
                    <div className="critic-reviews" data-aos="fade-up" data-aos-delay="300">
                      <div className="row">
                        {testimonialsSection.testimonials.criticReviews.map((review: any, index: number) => (
                          <div key={index} className="col-md-4">
                            <div className="critic-review">
                              <div className="review-quote">"</div>
                              <div className="stars">
                                {Array.from({ length: Math.floor(review.rating || 5) }, (_, i) => (
                                  <i key={i} className="bi bi-star-fill"></i>
                                ))}
                                {(review.rating || 5) % 1 !== 0 && <i className="bi bi-star-half"></i>}
                              </div>
                              <p>{review.quote}</p>
                              <div className="critic-info">
                                <div className="critic-name">{review.source}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Student Testimonials with Slider */}
                  {testimonialsSection.testimonials.studentReviews && (
                    <TestimonialsSlider testimonials={testimonialsSection.testimonials.studentReviews} />
                  )}

                </div>
              </div>
            </div>
          </section>
        )}

        {/* Render custom blocks after testimonials */}
        {getCustomBlocksAfter('testimonials').map((section: any, idx: number) => 
          section.customBlock && <BlockRenderer key={`after-testimonials-${idx}`} blocks={section.customBlock} />
        )}

        {/* Featured News Section */}
        {featuredNewsSection && (
          <FeaturedNews 
            title={featuredNewsSection.featuredNews?.title}
            description={featuredNewsSection.featuredNews?.description}
          />
        )}

        {/* Render custom blocks after featured news */}
        {getCustomBlocksAfter('featured-news').map((section: any, idx: number) => 
          section.customBlock && <BlockRenderer key={`after-featured-news-${idx}`} blocks={section.customBlock} />
        )}

        {/* Recent Blog Posts Section */}
        <RecentBlogPosts />

        {/* Render custom blocks after blog posts */}
        {getCustomBlocksAfter('blog-posts').map((section: any, idx: number) => 
          section.customBlock && <BlockRenderer key={`after-blog-${idx}`} blocks={section.customBlock} />
        )}

        {/* CTA Section */}
        {ctaSection && ctaSection.cta && (
          <section id="cta" className="cta section light-background">
            <div className="container" data-aos="fade-up" data-aos-delay="100">
              <div className="row align-items-center">
                
                <div className="col-lg-6" data-aos="fade-right" data-aos-delay="200">
                  <div className="cta-content">
                    <h2>{ctaSection.cta.title}</h2>
                    <p>{ctaSection.cta.description}</p>

                    {/* Feature List */}
                    {ctaSection.cta.features && (
                      <div className="features-list">
                        {ctaSection.cta.features.map((feature: any, index: number) => (
                          <div key={index} className="feature-item" data-aos="fade-up" data-aos-delay={300 + (index * 50)}>
                            <i className="bi bi-check-circle-fill"></i>
                            <span>{feature.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="cta-actions" data-aos="fade-up" data-aos-delay="500">
                      {ctaSection.cta.primaryButton && (
                        <a href={ctaSection.cta.primaryButton.link} className="btn btn-primary">
                          {ctaSection.cta.primaryButton.text}
                        </a>
                      )}
                      {ctaSection.cta.secondaryButton && (
                        <a href={ctaSection.cta.secondaryButton.link} className="btn btn-outline">
                          {ctaSection.cta.secondaryButton.text}
                        </a>
                      )}
                    </div>

                    {/* CTA Stats */}
                    {ctaSection.cta.stats && (
                      <div className="stats-row" data-aos="fade-up" data-aos-delay="400">
                        {ctaSection.cta.stats.map((stat: any, index: number) => (
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
                      src={typeof ctaSection.cta.image === 'object' ? ctaSection.cta.image.url : '/assets/img/education/courses-4.webp'} 
                      alt={ctaSection.cta.title || 'Online Learning Platform'} 
                      className="img-fluid" 
                    />

                    {/* Floating Cards */}
                    {ctaSection.cta.floatingCards && (
                      <>
                        {ctaSection.cta.floatingCards.map((card: any, index: number) => (
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
        )}
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
