import * as React from 'react'
import Link from 'next/link'
import { getPageContent } from '../../../lib/payload'
import { BlockRenderer } from '../components/BlockRenderer'

export default async function CMSCoursesPage({ isHomePage = false }: { isHomePage?: boolean } = {}) {
  try {
    const coursesPageContent = await getPageContent('courses')
    
    if (!coursesPageContent || coursesPageContent.length === 0) {
      return (
        <div className="container py-5">
          <div className="text-center">
            <h2>Our Courses</h2>
            <p>Content is being loaded from CMS. Please add content through the admin panel.</p>
            <Link href="/admin" className="btn btn-primary">Go to Admin Panel</Link>
          </div>
        </div>
      )
    }

    const pageTitleSection = coursesPageContent.find((section: any) => section.sectionType === 'page-title')
    const coursesGridSection = coursesPageContent.find((section: any) => section.sectionType === 'courses-grid')
    
    return (
      <>
        {/* Page Title - Hide breadcrumb when used as home page */}
        {!isHomePage && (
          <div className="page-title light-background">
            <div className="container d-lg-flex justify-content-between align-items-center">
              <h1 className="mb-2 mb-lg-0">
                {pageTitleSection?.pageTitle?.title || 'Courses'}
              </h1>
              <nav className="breadcrumbs">
                <ol>
                  <li><Link href="/">Home</Link></li>
                  <li className="current">Courses</li>
                </ol>
              </nav>
            </div>
            {pageTitleSection?.contentBlocks && pageTitleSection.contentBlocks.length > 0 && (
              <BlockRenderer blocks={pageTitleSection.contentBlocks} />
            )}
          </div>
        )}

        {/* Courses Section */}
        <section id="courses-2" className="courses-2 section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row">
              {/* Facilities Grid */}
              <div className="col-12">
                {coursesGridSection && coursesGridSection.coursesGrid && (
                  <>
                    {/* Facility Cards */}
                    <div className="courses-grid" data-aos="fade-up" data-aos-delay="200">
                      <div className="row">
                        {coursesGridSection.coursesGrid.courses && coursesGridSection.coursesGrid.courses.map((course: any, index: number) => (
                          <div key={index} className="col-lg-4 col-md-6 mb-4">
                            <div className="course-card h-100">
                              <div className="course-image">
                                <img
                                  src={typeof course.image === 'object' ? course.image.url : '/assets/img/education/courses-3.webp'}
                                  alt={course.title}
                                  className="img-fluid"
                                />
                              </div>
                              <div className="course-content">
                                <h3>{course.title}</h3>
                                <p>{course.description}</p>
                                {course.showViewMoreButton && (
                                  <a href={course.viewMoreLink || '#'} className="btn-course">
                                    {course.viewMoreText || 'View More'}
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {coursesGridSection.contentBlocks && coursesGridSection.contentBlocks.length > 0 && (
                      <BlockRenderer blocks={coursesGridSection.contentBlocks} />
                    )}
                  </>
                )}
              </div>
              
            </div>
          </div>
        </section>

        {/* Fallback when no content */}
        {!coursesGridSection && (
          <div className="container py-5">
            <div className="text-center">
              <h2>Our Courses</h2>
              <p>Please add course content through the admin panel.</p>
              <Link href="/admin" className="btn btn-primary">Go to Admin Panel</Link>
            </div>
          </div>
        )}

      </>
    )
  } catch (error) {
    // Return empty sections on error
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Our Courses</h2>
          <p>Content is being loaded. Please check the admin panel.</p>
          <Link href="/admin" className="btn btn-primary">Go to Admin Panel</Link>
        </div>
      </div>
    )
  }
}