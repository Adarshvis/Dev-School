import * as React from 'react'
import Link from 'next/link'
import { getPageContent } from '../../../lib/payload'
import { BlockRenderer } from '../components/BlockRenderer'

export default async function CMSInstructorsPage({ isHomePage = false }: { isHomePage?: boolean } = {}) {
  try {
    const instructorsPageContent = await getPageContent('instructors')
    
    if (!instructorsPageContent || instructorsPageContent.length === 0) {
      return (
        <div className="container py-5">
          <div className="text-center">
            <h2>Our Instructors</h2>
            <p>Content is being loaded from CMS. Please add content through the admin panel.</p>
            <Link href="/admin" className="btn btn-primary">Go to Admin Panel</Link>
          </div>
        </div>
      )
    }

    const pageTitleSection = instructorsPageContent.find((section: any) => section.sectionType === 'page-title')
    const instructorsGridSection = instructorsPageContent.find((section: any) => section.sectionType === 'instructors-grid')
    
    return (
      <>
        {/* Page Title - Hide breadcrumb when used as home page */}
        {!isHomePage && (
          <div className="page-title light-background">
            <div className="container d-lg-flex justify-content-between align-items-center">
              <h1 className="mb-2 mb-lg-0">
                {pageTitleSection?.pageTitle?.title || 'Instructors'}
              </h1>
              <nav className="breadcrumbs">
                <ol>
                  <li><Link href="/">Home</Link></li>
                  <li className="current">Instructors</li>
                </ol>
              </nav>
            </div>
          </div>
        )}

        {/* Instructors Section */}
        <section id="instructors" className="instructors section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            
            {instructorsGridSection && instructorsGridSection.instructorsGrid && instructorsGridSection.instructorsGrid.instructors ? (
              <div className="row gy-4">
                {instructorsGridSection.instructorsGrid.instructors.map((instructor: any, index: number) => (
                  <div key={index} className="col-xl-3 col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={200 + (index * 50)}>
                    <div className="instructor-card">
                      <div className="instructor-image">
                        <img 
                          src={typeof instructor.image === 'object' ? instructor.image.url : '/assets/img/education/teacher-2.webp'} 
                          className="img-fluid" 
                          alt={instructor.name}
                        />
                        {((instructor.rating && instructor.rating > 0) || (instructor.courseCount && instructor.courseCount > 0)) && (
                        <div className="overlay-content">
                          {instructor.rating && instructor.rating > 0 && (
                          <div className="rating-stars">
                            {Array.from({ length: Math.floor(instructor.rating || 5) }, (_, i) => (
                              <i key={i} className="bi bi-star-fill"></i>
                            ))}
                            {(instructor.rating || 5) % 1 !== 0 && <i className="bi bi-star-half"></i>}
                            {Math.floor(instructor.rating) < 5 && Array.from({ length: 5 - Math.ceil(instructor.rating || 5) }, (_, i) => (
                              <i key={`empty-${i}`} className="bi bi-star"></i>
                            ))}
                            <span>{instructor.rating || 5}</span>
                          </div>
                          )}
                          {instructor.courseCount && instructor.courseCount > 0 && (
                          <div className="course-count">
                            <i className="bi bi-play-circle"></i>
                            <span>{instructor.courseCount} Courses</span>
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
                            <span className="number">{instructor.studentCount}</span>
                            <span className="label">Students</span>
                          </div>
                          )}
                          {instructor.rating && instructor.rating > 0 && (
                          <div className="stat">
                            <span className="number">{instructor.rating}</span>
                            <span className="label">Rating</span>
                          </div>
                          )}
                        </div>
                        )}
                        <div className="action-buttons">
                          <Link href={instructor.slug ? `/instructor-profile/${instructor.slug}` : '#'} className="btn-view">View Profile</Link>
                          <div className="social-links">
                            {instructor.socialLinks && instructor.socialLinks.map((social: any, idx: number) => (
                              <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer">
                                <i className={`bi bi-${social.platform}`}></i>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="row">
                <div className="col-12 text-center">
                  <p>No instructors configured yet. Please add instructors in the admin panel.</p>
                  <Link href="/admin" className="btn btn-primary">Go to Admin Panel</Link>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* Render Content Blocks from all sections */}
        {instructorsPageContent && instructorsPageContent.map((section: any, idx: number) => (
          section.contentBlocks && section.contentBlocks.length > 0 && (
            <BlockRenderer key={`blocks-${idx}`} blocks={section.contentBlocks} />
          )
        ))}
      </>
    )
  } catch (error) {
    // Return empty sections on error
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Our Instructors</h2>
          <p>Content is being loaded. Please check the admin panel.</p>
          <Link href="/admin" className="btn btn-primary">Go to Admin Panel</Link>
        </div>
      </div>
    )
  }
}