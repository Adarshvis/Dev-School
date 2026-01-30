import * as React from 'react'
import Link from 'next/link'
import { getPageContent } from '../../../lib/payload'
import { BlockRenderer } from '../components/BlockRenderer'

export default async function CMSPeoplePage({ isHomePage = false }: { isHomePage?: boolean } = {}) {
  try {
    const peoplePageContent = await getPageContent('people')
    
    if (!peoplePageContent || peoplePageContent.length === 0) {
      return (
        <div className="container py-5">
          <div className="text-center">
            <h2>Our People</h2>
            <p>Content is being loaded from CMS. Please add content through the admin panel.</p>
            <Link href="/admin" className="btn btn-primary">Go to Admin Panel</Link>
          </div>
        </div>
      )
    }

    const pageTitleSection = peoplePageContent.find((section: any) => section.sectionType === 'page-title')
    const peopleGridSection = peoplePageContent.find((section: any) => section.sectionType === 'people-grid')
    
    return (
      <>
        {/* Page Title - Hide breadcrumb when used as home page */}
        {!isHomePage && (
          <div className="page-title light-background">
            <div className="container d-lg-flex justify-content-between align-items-center">
              <h1 className="mb-2 mb-lg-0">
                {pageTitleSection?.pageTitle?.title || 'People'}
              </h1>
              <nav className="breadcrumbs">
                <ol>
                  <li><Link href="/">Home</Link></li>
                  <li className="current">People</li>
                </ol>
              </nav>
            </div>
          </div>
        )}

        {/* People Section */}
        <section id="people" className="instructors section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            
            {peopleGridSection && peopleGridSection.peopleGrid && peopleGridSection.peopleGrid.people ? (
              <div className="row gy-4">
                {peopleGridSection.peopleGrid.people.map((person: any, index: number) => (
                  <div key={index} className="col-xl-3 col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={200 + (index * 50)}>
                    <div className="instructor-card">
                      <div className="instructor-image">
                        <img 
                          src={typeof person.image === 'object' ? person.image.url : '/assets/img/education/teacher-2.webp'} 
                          className="img-fluid" 
                          alt={person.name}
                        />
                        {((person.rating && person.rating > 0) || (person.courseCount && person.courseCount > 0)) && (
                        <div className="overlay-content">
                          {person.rating && person.rating > 0 && (
                          <div className="rating-stars">
                            {Array.from({ length: Math.floor(person.rating || 5) }, (_, i) => (
                              <i key={i} className="bi bi-star-fill"></i>
                            ))}
                            {(person.rating || 5) % 1 !== 0 && <i className="bi bi-star-half"></i>}
                            {Math.floor(person.rating) < 5 && Array.from({ length: 5 - Math.ceil(person.rating || 5) }, (_, i) => (
                              <i key={`empty-${i}`} className="bi bi-star"></i>
                            ))}
                            <span>{person.rating || 5}</span>
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
                        <h5>{person.name}</h5>
                        {person.specialty && <p className="specialty">{person.specialty}</p>}
                        {person.description && <p className="description">{person.description}</p>}
                        {((person.studentCount && person.studentCount > 0) || (person.rating && person.rating > 0)) && (
                        <div className="stats-grid">
                          {person.studentCount && person.studentCount > 0 && (
                          <div className="stat">
                            <span className="number">{person.studentCount}</span>
                            <span className="label">Students</span>
                          </div>
                          )}
                          {person.rating && person.rating > 0 && (
                          <div className="stat">
                            <span className="number">{person.rating}</span>
                            <span className="label">Rating</span>
                          </div>
                          )}
                        </div>
                        )}
                        <div className="action-buttons">
                          <Link href={person.slug ? `/people-profile/${person.slug}` : '#'} className="btn-view">View Profile</Link>
                          <div className="social-links">
                            {person.socialLinks && person.socialLinks.map((social: any, idx: number) => (
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
                  <p>No people configured yet. Please add people in the admin panel.</p>
                  <Link href="/admin" className="btn btn-primary">Go to Admin Panel</Link>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* Render Content Blocks from all sections */}
        {peoplePageContent && peoplePageContent.map((section: any, idx: number) => (
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
          <h2>Our People</h2>
          <p>Content is being loaded. Please check the admin panel.</p>
          <Link href="/admin" className="btn btn-primary">Go to Admin Panel</Link>
        </div>
      </div>
    )
  }
}