import * as React from 'react'
import Link from 'next/link'
import { getPageContent } from '../../../lib/payload'

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
    const filtersSection = coursesPageContent.find((section: any) => section.sectionType === 'filters')
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
          </div>
        )}

        {/* Courses Section */}
        <section id="courses-2" className="courses-2 section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row">
              
              {/* Filters Sidebar */}
              {filtersSection && filtersSection.filters && (
                <div className="col-lg-3">
                  <div className="course-filters" data-aos="fade-right" data-aos-delay="100">
                    <h4 className="filter-title">{filtersSection.filters.title}</h4>
                    
                    {/* Category Filters */}
                    {filtersSection.filters.categoryFilters && (
                      <div className="filter-group">
                        <h5>Category</h5>
                        <div className="filter-options">
                          {filtersSection.filters.categoryFilters.map((filter: any, index: number) => (
                            <label key={index} className="filter-checkbox">
                              <input type="checkbox" />
                              <span className="checkmark"></span>
                              {filter.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Level Filters */}
                    {filtersSection.filters.levelFilters && (
                      <div className="filter-group">
                        <h5>Level</h5>
                        <div className="filter-options">
                          {filtersSection.filters.levelFilters.map((filter: any, index: number) => (
                            <label key={index} className="filter-checkbox">
                              <input type="checkbox" />
                              <span className="checkmark"></span>
                              {filter.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Duration Filters */}
                    {filtersSection.filters.durationFilters && (
                      <div className="filter-group">
                        <h5>Duration</h5>
                        <div className="filter-options">
                          {filtersSection.filters.durationFilters.map((filter: any, index: number) => (
                            <label key={index} className="filter-checkbox">
                              <input type="checkbox" />
                              <span className="checkmark"></span>
                              {filter.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Price Filters */}
                    {filtersSection.filters.priceFilters && (
                      <div className="filter-group">
                        <h5>Price</h5>
                        <div className="filter-options">
                          {filtersSection.filters.priceFilters.map((filter: any, index: number) => (
                            <label key={index} className="filter-checkbox">
                              <input type="checkbox" />
                              <span className="checkmark"></span>
                              {filter.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Courses Grid */}
              <div className={filtersSection ? "col-lg-9" : "col-12"}>
                {coursesGridSection && coursesGridSection.coursesGrid && (
                  <>
                    {/* Search and Sort */}
                    <div className="courses-header" data-aos="fade-left" data-aos-delay="100">
                      <div className="search-box">
                        <i className="bi bi-search"></i>
                        <input 
                          type="text" 
                          placeholder={coursesGridSection.coursesGrid.searchPlaceholder || 'Search courses...'}
                        />
                      </div>
                      <div className="sort-dropdown">
                        {coursesGridSection.coursesGrid.sortOptions && (
                          <select>
                            {coursesGridSection.coursesGrid.sortOptions.map((option: any, index: number) => (
                              <option key={index} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                    
                    {/* Course Cards */}
                    <div className="courses-grid" data-aos="fade-up" data-aos-delay="200">
                      <div className="row">
                        {coursesGridSection.coursesGrid.courses && coursesGridSection.coursesGrid.courses.map((course: any, index: number) => (
                          <div key={index} className="col-lg-6 col-md-6">
                            <div className="course-card">
                              <div className="course-image">
                                <img 
                                  src={typeof course.image === 'object' ? course.image.url : '/assets/img/education/courses-3.webp'} 
                                  alt={course.title} 
                                  className="img-fluid" 
                                />
                                {course.badge && course.badge !== 'none' && (
                                  <div className={`course-badge ${course.badge === 'free' ? 'badge-free' : course.badge === 'new' ? 'badge-new' : course.badge === 'certificate' ? 'badge-certificate' : ''}`}>
                                    {course.badge === 'best-seller' ? 'Best Seller' : 
                                     course.badge === 'new' ? 'New' : 
                                     course.badge === 'popular' ? 'Popular' : 
                                     course.badge === 'free' ? 'Free' : 
                                     course.badge === 'certificate' ? 'Certificate' : course.badge}
                                  </div>
                                )}
                                {course.price && course.badge !== 'free' && (
                                  <div className="course-price">{course.price}</div>
                                )}
                              </div>
                              <div className="course-content">
                                <div className="course-meta">
                                  <span className="category">{course.category}</span>
                                  <span className="level">{course.level}</span>
                                </div>
                                <h3>{course.title}</h3>
                                <p>{course.description}</p>
                                <div className="course-stats">
                                  <div className="stat">
                                    <i className="bi bi-clock"></i>
                                    <span>{course.duration}</span>
                                  </div>
                                  <div className="stat">
                                    <i className="bi bi-people"></i>
                                    <span>{course.studentCount} students</span>
                                  </div>
                                  <div className="rating">
                                    {Array.from({ length: Math.floor(course.rating || 5) }, (_, i) => (
                                      <i key={i} className="bi bi-star-fill"></i>
                                    ))}
                                    {(course.rating || 5) % 1 !== 0 && <i className="bi bi-star-half"></i>}
                                    {Math.floor(course.rating) < 5 && Array.from({ length: 5 - Math.ceil(course.rating || 5) }, (_, i) => (
                                      <i key={`empty-${i}`} className="bi bi-star"></i>
                                    ))}
                                    <span>{course.rating} ({course.reviewCount} reviews)</span>
                                  </div>
                                </div>
                                <div className="instructor-info">
                                  <img 
                                    src={typeof course.instructorAvatar === 'object' ? course.instructorAvatar.url : '/assets/img/person/person-m-3.webp'} 
                                    alt={course.instructorName} 
                                    className="instructor-avatar" 
                                  />
                                  <span className="instructor-name">{course.instructorName}</span>
                                </div>
                                <a href={course.enrollLink || '/enroll'} className="btn-course">
                                  {course.badge === 'free' ? 'Start Free Course' : 'Enroll Now'}
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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