import * as React from 'react'
import Link from 'next/link'

async function getInstructors() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/instructors?where[_status][equals]=published&limit=100`, {
      cache: 'no-store',
    })
    
    if (!res.ok) {
      return []
    }
    
    const data = await res.json()
    return data?.docs || []
  } catch (error) {
    return []
  }
}

export default async function CMSInstructorsPage() {
  const instructors = await getInstructors()
  
  return (
    <>
      {/* Page Title */}
      <div className="page-title light-background">
        <div className="container d-lg-flex justify-content-between align-items-center">
          <h1 className="mb-2 mb-lg-0">Instructors</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li className="current">Instructors</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Instructors Section */}
      <section id="instructors" className="instructors section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          
          {instructors && instructors.length > 0 ? (
            <div className="row gy-4">
              {instructors.map((instructor: any, index: number) => (
                <div key={instructor.id} className="col-xl-3 col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={200 + (index * 50)}>
                  <div className="instructor-card">
                    <div className="instructor-image">
                      <img 
                        src={typeof instructor.image === 'object' && instructor.image?.url ? instructor.image.url : '/assets/img/education/teacher-2.webp'} 
                        className="img-fluid" 
                        alt={instructor.name || 'Instructor'}
                      />
                      {(instructor.rating > 0 || instructor.courseCount > 0) && (
                      <div className="overlay-content">
                        {instructor.rating > 0 && (
                        <div className="rating-stars">
                          {Array.from({ length: Math.floor(instructor.rating) }, (_, i) => (
                            <i key={i} className="bi bi-star-fill"></i>
                          ))}
                          {instructor.rating % 1 !== 0 && <i className="bi bi-star-half"></i>}
                          {Math.floor(instructor.rating) < 5 && Array.from({ length: 5 - Math.ceil(instructor.rating) }, (_, i) => (
                            <i key={`empty-${i}`} className="bi bi-star"></i>
                          ))}
                          <span>{instructor.rating}</span>
                        </div>
                        )}
                        {instructor.courseCount > 0 && (
                        <div className="course-count">
                          <i className="bi bi-play-circle"></i>
                          <span>{instructor.courseCount} Courses</span>
                        </div>
                        )}
                      </div>
                      )}
                    </div>
                    <div className="instructor-info">
                      <h5>{instructor.name || 'Unnamed Instructor'}</h5>
                      {instructor.specialty && <p className="specialty">{instructor.specialty}</p>}
                      {instructor.credentials && instructor.credentials.length > 0 && (
                        <p className="description">{instructor.credentials.map((c: any) => c.credential).join(' • ')}</p>
                      )}
                      {(instructor.studentCount > 0 || instructor.rating > 0) && (
                      <div className="stats-grid">
                        {instructor.studentCount > 0 && (
                        <div className="stat">
                          <span className="number">{instructor.studentCount}</span>
                          <span className="label">Students</span>
                        </div>
                        )}
                        {instructor.rating > 0 && (
                        <div className="stat">
                          <span className="number">{instructor.rating}</span>
                          <span className="label">Rating</span>
                        </div>
                        )}
                      </div>
                      )}
                      <div className="action-buttons">
                        <Link href={instructor.slug ? `/instructor-profile/${instructor.slug}` : '#'} className="btn-view">View Profile</Link>
                        {instructor.socialLinks && instructor.socialLinks.length > 0 && (
                        <div className="social-links">
                          {instructor.socialLinks.map((social: any, idx: number) => (
                            <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer">
                              <i className={`bi bi-${social.platform}`}></i>
                            </a>
                          ))}
                        </div>
                        )}
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
    </>
  )
}
