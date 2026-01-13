import * as React from 'react'
import Link from 'next/link'
import { getPageContent } from '../../lib/payload'

export default async function CMSHomePage() {
  // Fetch all content from CMS using the new structure
  const heroContent = await getPageContent('home', 'hero')
  const featuredCoursesContent = await getPageContent('home', 'featured-courses')
  const categoriesContent = await getPageContent('home', 'course-categories')
  const instructorsContent = await getPageContent('home', 'featured-instructors')
  const testimonialsContent = await getPageContent('home', 'testimonials')
  const blogContent = await getPageContent('home', 'blog-posts')
  const ctaContent = await getPageContent('home', 'cta')

  return (
    <>
      {/* Hero Section - Fully CMS Controlled */}
      {heroContent && heroContent.hero && (
        <section id="courses-hero" className="courses-hero section light-background">
          <div className="hero-content">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="hero-text">
                    <h1>{heroContent.hero.title}</h1>
                    <p>{heroContent.hero.description}</p>

                    {heroContent.hero.stats && heroContent.hero.stats.length > 0 && (
                      <div className="hero-stats">
                        {heroContent.hero.stats.map((stat: any, index: number) => (
                          <div key={index} className="stat-item">
                            <span className="number">{stat.number}</span>
                            <span className="label">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="hero-buttons">
                      {heroContent.hero.primaryButton && (
                        <a href={heroContent.hero.primaryButton.link} className="btn btn-primary">
                          {heroContent.hero.primaryButton.text}
                        </a>
                      )}
                      {heroContent.hero.secondaryButton && (
                        <a href={heroContent.hero.secondaryButton.link} className="btn btn-outline">
                          {heroContent.hero.secondaryButton.text}
                        </a>
                      )}
                    </div>

                    {heroContent.hero.features && heroContent.hero.features.length > 0 && (
                      <div className="hero-features">
                        {heroContent.hero.features.map((feature: any, index: number) => (
                          <div key={index} className="feature">
                            <i className={feature.icon}></i>
                            <span>{feature.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="hero-image">
                    <div className="main-image">
                      {heroContent.hero.heroImage && (
                        <img
                          src={heroContent.hero.heroImage.url || '/assets/img/education/courses-13.webp'}
                          alt={heroContent.hero.heroImage.alt || 'Online Learning'}
                          className="img-fluid"
                        />
                      )}
                    </div>

                    {heroContent.hero.floatingCards && heroContent.hero.floatingCards.length > 0 && (
                      <div className="floating-cards">
                        {heroContent.hero.floatingCards.map((card: any, index: number) => (
                          <div key={index} className="course-card">
                            <div className="card-icon">
                              <i className={card.icon}></i>
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

      {/* Featured Courses Section - Dynamic from CMS */}
      {featuredCoursesContent && featuredCoursesContent.featuredCourses && (
        <section id="featured-courses" className="featured-courses section">
          <div className="container section-title">
            <h2>{featuredCoursesContent.featuredCourses.title}</h2>
            <p>{featuredCoursesContent.featuredCourses.description}</p>
          </div>

          <div className="container">
            <div className="row gy-4">
              {featuredCoursesContent.featuredCourses.courses && featuredCoursesContent.featuredCourses.courses.map((course: any, index: number) => (
                <div key={index} className="col-lg-4 col-md-6">
                  <div className="course-card">
                    <div className="course-image">
                      <img 
                        src={course.image?.url || '/assets/img/education/students-9.webp'} 
                        alt={course.title} 
                        className="img-fluid" 
                      />
                      {course.badge && <div className={`badge ${course.badge}`}>{course.badge}</div>}
                      <div className="price-badge">{course.price}</div>
                    </div>
                    <div className="course-content">
                      <div className="course-meta">
                        <span className="level">{course.level}</span>
                        <span className="duration">{course.duration}</span>
                      </div>
                      <h3><Link href="/course-details">{course.title}</Link></h3>
                      <p>{course.description}</p>
                      <div className="instructor">
                        <img 
                          src={course.instructorAvatar?.url || '/assets/img/person/person-f-3.webp'} 
                          alt={course.instructorName} 
                          className="instructor-img" 
                        />
                        <div className="instructor-info">
                          <h6>{course.instructorName}</h6>
                          <span>{course.instructorSpecialty}</span>
                        </div>
                      </div>
                      <div className="course-stats">
                        <div className="rating">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`bi bi-star${i < Math.floor(course.rating || 0) ? '-fill' : ''}`}></i>
                          ))}
                          <span>({course.rating || 0})</span>
                        </div>
                        <div className="students">
                          <i className="bi bi-people-fill"></i>
                          <span>{course.studentCount || 0} students</span>
                        </div>
                      </div>
                      <Link href="/enroll" className="btn-course">Enroll Now</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {featuredCoursesContent.featuredCourses.viewAllButton && (
              <div className="more-courses text-center">
                <Link href={featuredCoursesContent.featuredCourses.viewAllButton.link} className="btn-more">
                  {featuredCoursesContent.featuredCourses.viewAllButton.text}
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Course Categories - CMS Controlled */}
      {categoriesContent && categoriesContent.courseCategories && (
        <section id="course-categories" className="course-categories section">
          <div className="container section-title">
            <h2>{categoriesContent.courseCategories.title}</h2>
            <p>{categoriesContent.courseCategories.description}</p>
          </div>

          <div className="container">
            <div className="row g-4">
              {categoriesContent.courseCategories.categories && categoriesContent.courseCategories.categories.map((category: any, index: number) => (
                <div key={index} className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                  <Link href={category.link} className="category-card">
                    <div className="category-icon">
                      <i className={category.icon}></i>
                    </div>
                    <h5>{category.name}</h5>
                    <span className="course-count">{category.courseCount} Courses</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Instructors - Dynamic from CMS */}
      {instructorsContent && instructorsContent.featuredInstructors && (
        <section id="featured-instructors" className="featured-instructors section">
          <div className="container section-title">
            <h2>{instructorsContent.featuredInstructors.title}</h2>
            <p>{instructorsContent.featuredInstructors.description}</p>
          </div>

          <div className="container">
            <div className="row gy-4">
              {instructorsContent.featuredInstructors.instructors && instructorsContent.featuredInstructors.instructors.map((instructor: any, index: number) => (
                <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                  <div className="instructor-card">
                    <div className="instructor-image">
                      <img 
                        src={instructor.image?.url || '/assets/img/education/teacher-2.webp'} 
                        className="img-fluid" 
                        alt={instructor.name} 
                      />
                      {((instructor.rating && instructor.rating > 0) || (instructor.courseCount && instructor.courseCount > 0)) && (
                      <div className="overlay-content">
                        {instructor.rating && instructor.rating > 0 && (
                        <div className="rating-stars">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`bi bi-star${i < Math.floor(instructor.rating || 0) ? '-fill' : ''}`}></i>
                          ))}
                          <span>{instructor.rating || 0}</span>
                        </div>
                        )}
                        {instructor.courseCount && instructor.courseCount > 0 && (
                        <div className="course-count">
                          <i className="bi bi-play-circle"></i>
                          <span>{instructor.courseCount || 0} Courses</span>
                        </div>
                        )}
                      </div>
                      )}
                    </div>
                    <div className="instructor-info">
                      <h5>{instructor.name}</h5>
                      {instructor.specialty && <p className="specialty">{instructor.specialty}</p>}
                      {instructor.description && <p className="description">{instructor.description}</p>}
                      {((instructor.studentCount && instructor.studentCount > 0) || (instructor.rating && instructor.rating > 0)) && (
                      <div className="stats-grid">
                        {instructor.studentCount && instructor.studentCount > 0 && (
                        <div className="stat">
                          <span className="number">{Math.floor((instructor.studentCount || 0) / 1000)}k</span>
                          <span className="label">Students</span>
                        </div>
                        )}
                        {instructor.rating && instructor.rating > 0 && (
                        <div className="stat">
                          <span className="number">{instructor.rating || 0}</span>
                          <span className="label">Rating</span>
                        </div>
                        )}
                      </div>
                      )}
                      <div className="action-buttons">
                        <Link href="#" className="btn-view">View Profile</Link>
                        <div className="social-links">
                          {instructor.socialLinks?.map((social: any, socialIndex: number) => (
                            <a key={socialIndex} href={social.url}><i className={`bi bi-${social.platform}`}></i></a>
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
      )}

      {/* CTA Section - Fully CMS Controlled */}
      {ctaContent && ctaContent.cta && (
        <section id="cta" className="cta section light-background">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="cta-content">
                  <h2>{ctaContent.cta.title}</h2>
                  <p>{ctaContent.cta.description}</p>

                  {ctaContent.cta.features && ctaContent.cta.features.length > 0 && (
                    <div className="features-list">
                      {ctaContent.cta.features.map((feature: any, index: number) => (
                        <div key={index} className="feature-item">
                          <i className="bi bi-check-circle-fill"></i>
                          <span>{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="cta-actions">
                    {ctaContent.cta.primaryButton && (
                      <Link href={ctaContent.cta.primaryButton.link} className="btn btn-primary">
                        {ctaContent.cta.primaryButton.text}
                      </Link>
                    )}
                    {ctaContent.cta.secondaryButton && (
                      <Link href={ctaContent.cta.secondaryButton.link} className="btn btn-outline">
                        {ctaContent.cta.secondaryButton.text}
                      </Link>
                    )}
                  </div>

                  {ctaContent.cta.stats && ctaContent.cta.stats.length > 0 && (
                    <div className="stats-row">
                      {ctaContent.cta.stats.map((stat: any, index: number) => (
                        <div key={index} className="stat-item">
                          <h3>{stat.number}</h3>
                          <p>{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-6">
                <div className="cta-image">
                  {ctaContent.cta.image && (
                    <img 
                      src={ctaContent.cta.image.url || '/assets/img/education/courses-4.webp'} 
                      alt="Online Learning Platform" 
                      className="img-fluid" 
                    />
                  )}
                  {ctaContent.cta.floatingCards && ctaContent.cta.floatingCards.map((card: any, index: number) => (
                    <div key={index} className="floating-element student-card">
                      <div className="card-content">
                        <i className={card.icon}></i>
                        <div className="text">
                          <span className="number">{card.number}</span>
                          <span className="label">{card.label}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}