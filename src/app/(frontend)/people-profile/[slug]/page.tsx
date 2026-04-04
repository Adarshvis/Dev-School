'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AOS from 'aos'
import 'aos/dist/aos.css'

interface InstructorProfileProps {
  params: Promise<{
    slug: string
  }>
}

export default function InstructorProfilePage({ params }: InstructorProfileProps) {
  const [slug, setSlug] = useState<string>('')
  const [instructor, setInstructor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then((p) => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (!slug) return

    async function fetchInstructor() {
      try {
        // Use relative URL for client-side fetch
        const res = await fetch(`/api/instructors-page?where[slug][equals]=${slug}`)
        
        if (!res.ok) {
          setInstructor(null)
          setLoading(false)
          return
        }
        
        const data = await res.json()
        if (data.docs && data.docs.length > 0) {
          setInstructor(data.docs[0])
        } else {
          setInstructor(null)
        }
      } catch (error) {
        setInstructor(null)
      } finally {
        setLoading(false)
      }
    }

    fetchInstructor()
  }, [slug])

  useEffect(() => {
    if (!loading) {
      // Initialize AOS after component mounts
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      })
    }
  }, [loading])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!instructor) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Instructor Not Found</h2>
          <p>The instructor profile you're looking for doesn't exist.</p>
          <Link href="/instructors" className="btn btn-primary">Back to Instructors</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Page Title */}
      <div className="page-title light-background">
        <div className="container d-lg-flex justify-content-between align-items-center">
          <h1 className="mb-2 mb-lg-0">Instructor Profile</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/instructors">Instructors</Link></li>
              <li className="current">Instructor Profile</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Instructor Profile Section */}
      <section id="instructor-profile" className="instructor-profile section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row">
            <div className="col-lg-12">
              <div className="instructor-hero-banner" data-aos="zoom-out" data-aos-delay="200">
                <div className="hero-background">
                  <img src="/assets/img/education/showcase-4.webp" alt="Background" className="img-fluid" />
                  <div className="hero-overlay"></div>
                </div>
                <div className="hero-content">
                  <div className="instructor-avatar">
                    <img 
                      src={instructor.image?.url || '/assets/img/education/teacher-7.webp'} 
                      alt={instructor.name || 'Instructor'} 
                      className="img-fluid" 
                    />
                    <div className="status-badge">
                      <i className="bi bi-patch-check-fill"></i>
                      <span>Verified</span>
                    </div>
                  </div>
                  <div className="instructor-info">
                    <h2>{instructor.name || 'Instructor Name'}</h2>
                    <p className="title">{instructor.specialty || 'Specialist'}</p>
                    <div className="credentials">
                      <span className="credential">{instructor.studentCount || 0} Students</span>
                      <span className="credential">{instructor.courseCount || 0} Courses</span>
                      <span className="credential">{instructor.rating || 5} Rating</span>
                    </div>
                    <div className="rating-overview">
                      <div className="stars">
                        {Array.from({ length: Math.floor(instructor.rating || 5) }, (_, i) => (
                          <i key={i} className="bi bi-star-fill"></i>
                        ))}
                        {(instructor.rating || 5) % 1 !== 0 && <i className="bi bi-star-half"></i>}
                      </div>
                      <span className="rating-text">{instructor.rating || 5} rating</span>
                    </div>
                    <div className="contact-actions">
                      <a href="#" className="btn-contact">
                        <i className="bi bi-envelope"></i>
                        Contact Instructor
                      </a>
                      <div className="social-media">
                        {instructor.socialLinks?.map((social: any, idx: number) => (
                          <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer">
                            <i className={`bi bi-${social.platform}`}></i>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row gy-5 mt-4">
            <div className="col-lg-8">
              <div className="content-tabs" data-aos="fade-right" data-aos-delay="300">
                <ul className="nav nav-tabs custom-tabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button 
                      className="nav-link active" 
                      data-bs-toggle="tab" 
                      data-bs-target="#about" 
                      type="button" 
                      role="tab"
                    >
                      <i className="bi bi-person"></i>
                      About
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button 
                      className="nav-link" 
                      data-bs-toggle="tab" 
                      data-bs-target="#experience" 
                      type="button" 
                      role="tab"
                    >
                      <i className="bi bi-briefcase"></i>
                      Experience
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button 
                      className="nav-link" 
                      data-bs-toggle="tab" 
                      data-bs-target="#courses" 
                      type="button" 
                      role="tab"
                    >
                      <i className="bi bi-book"></i>
                      Courses
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button 
                      className="nav-link" 
                      data-bs-toggle="tab" 
                      data-bs-target="#reviews" 
                      type="button" 
                      role="tab"
                    >
                      <i className="bi bi-star"></i>
                      Reviews
                    </button>
                  </li>
                </ul>

                <div className="tab-content custom-tab-content">
                  {/* About Tab */}
                  <div className="tab-pane fade show active" id="about" role="tabpanel">
                    <div className="about-content">
                      <div className="bio-section">
                        <h4>Message</h4>
                        <p>
                          Dr. Alexandra Chen is a renowned expert in Machine Learning and Artificial Intelligence with over 10 years 
                          of experience in both academia and industry. She holds a Ph.D. in Computer Science from MIT and has 
                          published numerous papers in top-tier conferences and journals.
                        </p>
                        <p>
                          Her research focuses on deep learning, neural networks, and their applications in real-world problems. 
                          She has worked with leading tech companies and has been instrumental in developing AI solutions that 
                          have impacted millions of users worldwide.
                        </p>
                      </div>

                      <div className="expertise-grid">
                        <h4>Core Expertise</h4>
                        <div className="skills-grid">
                          <div className="skill-item">
                            <i className="bi bi-cpu"></i>
                            <span>Artificial Intelligence</span>
                          </div>
                          <div className="skill-item">
                            <i className="bi bi-diagram-3"></i>
                            <span>Neural Networks</span>
                          </div>
                          <div className="skill-item">
                            <i className="bi bi-graph-up"></i>
                            <span>Data Science</span>
                          </div>
                          <div className="skill-item">
                            <i className="bi bi-code-slash"></i>
                            <span>Python & R</span>
                          </div>
                          <div className="skill-item">
                            <i className="bi bi-cloud"></i>
                            <span>Cloud Computing</span>
                          </div>
                          <div className="skill-item">
                            <i className="bi bi-robot"></i>
                            <span>Machine Learning</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Experience Tab */}
                  <div className="tab-pane fade" id="experience" role="tabpanel">
                    <div className="experience-grid">
                      <div className="experience-card">
                        <div className="timeline-marker">2019</div>
                        <div className="experience-details">
                          <h5>Lead AI Researcher</h5>
                          <p className="institution">TechForward Institute</p>
                          <p>
                            Leading a team of researchers in developing cutting-edge AI solutions for healthcare and finance. 
                            Responsible for strategic research direction and collaboration with industry partners.
                          </p>
                        </div>
                      </div>

                      <div className="experience-card">
                        <div className="timeline-marker">2016</div>
                        <div className="experience-details">
                          <h5>Senior Data Scientist</h5>
                          <p className="institution">InnovateLabs Corp</p>
                          <p>
                            Developed machine learning models for predictive analytics and recommendation systems. 
                            Led cross-functional teams to implement AI solutions that improved business outcomes by 40%.
                          </p>
                        </div>
                      </div>

                      <div className="experience-card">
                        <div className="timeline-marker">2014</div>
                        <div className="experience-details">
                          <h5>Research Fellow</h5>
                          <p className="institution">MIT Computer Science Lab</p>
                          <p>
                            Conducted groundbreaking research in deep learning architectures. Published 15+ papers 
                            in top-tier conferences and contributed to open-source ML frameworks.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Courses Tab */}
                  <div className="tab-pane fade" id="courses" role="tabpanel">
                    <div className="courses-grid">
                      <div className="course-item">
                        <div className="course-thumb">
                          <img src="/assets/img/education/courses-5.webp" alt="Course" className="img-fluid" />
                          <div className="course-level">Advanced</div>
                        </div>
                        <div className="course-info">
                          <h5>Deep Learning Mastery</h5>
                          <div className="course-stats">
                            <span><i className="bi bi-people"></i> 5,234 enrolled</span>
                            <span><i className="bi bi-star-fill"></i> 4.8</span>
                          </div>
                          <p className="price">$249</p>
                        </div>
                      </div>

                      <div className="course-item">
                        <div className="course-thumb">
                          <img src="/assets/img/education/courses-9.webp" alt="Course" className="img-fluid" />
                          <div className="course-level">Intermediate</div>
                        </div>
                        <div className="course-info">
                          <h5>AI Ethics & Applications</h5>
                          <div className="course-stats">
                            <span><i className="bi bi-people"></i> 3,567 enrolled</span>
                            <span><i className="bi bi-star-fill"></i> 4.9</span>
                          </div>
                          <p className="price">$179</p>
                        </div>
                      </div>

                      <div className="course-item">
                        <div className="course-thumb">
                          <img src="/assets/img/education/courses-12.webp" alt="Course" className="img-fluid" />
                          <div className="course-level">Beginner</div>
                        </div>
                        <div className="course-info">
                          <h5>Python for Data Analysis</h5>
                          <div className="course-stats">
                            <span><i className="bi bi-people"></i> 8,912 enrolled</span>
                            <span><i className="bi bi-star-fill"></i> 4.7</span>
                          </div>
                          <p className="price">$129</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reviews Tab */}
                  <div className="tab-pane fade" id="reviews" role="tabpanel">
                    <div className="reviews-container">
                      <div className="review-card">
                        <div className="review-header">
                          <img src="/assets/img/person/person-f-12.webp" alt="Student" className="reviewer-avatar" />
                          <div className="reviewer-info">
                            <h6>Sarah Williams</h6>
                            <p>Data Scientist at Amazon</p>
                            <div className="review-rating">
                              <i className="bi bi-star-fill"></i>
                              <i className="bi bi-star-fill"></i>
                              <i className="bi bi-star-fill"></i>
                              <i className="bi bi-star-fill"></i>
                              <i className="bi bi-star-fill"></i>
                            </div>
                          </div>
                        </div>
                        <p>
                          "Professor Chen's teaching style is exceptional. The hands-on approach and real-world projects 
                          made all the difference in my understanding of machine learning concepts. Highly recommended!"
                        </p>
                      </div>

                      <div className="review-card">
                        <div className="review-header">
                          <img src="/assets/img/person/person-m-8.webp" alt="Student" className="reviewer-avatar" />
                          <div className="reviewer-info">
                            <h6>David Martinez</h6>
                            <p>ML Engineer at Tesla</p>
                            <div className="review-rating">
                              <i className="bi bi-star-fill"></i>
                              <i className="bi bi-star-fill"></i>
                              <i className="bi bi-star-fill"></i>
                              <i className="bi bi-star-fill"></i>
                              <i className="bi bi-star-fill"></i>
                            </div>
                          </div>
                        </div>
                        <p>
                          "The depth of knowledge and practical insights shared by Professor Chen are unmatched. 
                          Her courses have been instrumental in advancing my career in AI and machine learning."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="sidebar-widgets" data-aos="fade-left" data-aos-delay="300">
                {/* Teaching Impact */}
                <div className="stats-widget">
                  <h4>Teaching Impact</h4>
                  <div className="stats-grid">
                    <div className="stat-box">
                      <div className="stat-icon">
                        <i className="bi bi-people"></i>
                      </div>
                      <div className="stat-content">
                        <h5>15,247</h5>
                        <p>Total Students</p>
                      </div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-icon">
                        <i className="bi bi-book"></i>
                      </div>
                      <div className="stat-content">
                        <h5>18</h5>
                        <p>Active Courses</p>
                      </div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-icon">
                        <i className="bi bi-award"></i>
                      </div>
                      <div className="stat-content">
                        <h5>94%</h5>
                        <p>Completion Rate</p>
                      </div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-icon">
                        <i className="bi bi-clock"></i>
                      </div>
                      <div className="stat-content">
                        <h5>10+</h5>
                        <p>Years Teaching</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recognition & Awards */}
                <div className="achievements-widget">
                  <h4>Recognition & Awards</h4>
                  <div className="achievement-list">
                    <div className="achievement-item">
                      <i className="bi bi-trophy"></i>
                      <div className="achievement-text">
                        <h6>Excellence in Teaching Award</h6>
                        <p>MIT Computer Science Department • 2022</p>
                      </div>
                    </div>
                    <div className="achievement-item">
                      <i className="bi bi-patch-check"></i>
                      <div className="achievement-text">
                        <h6>AI Research Grant</h6>
                        <p>National Science Foundation • 2021</p>
                      </div>
                    </div>
                    <div className="achievement-item">
                      <i className="bi bi-mortarboard"></i>
                      <div className="achievement-text">
                        <h6>Outstanding Educator Recognition</h6>
                        <p>IEEE Computer Society • 2020</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="contact-widget">
                  <h4>Get in Touch</h4>
                  <div className="contact-info">
                    <div className="contact-item">
                      <i className="bi bi-envelope"></i>
                      <span>alexandra.chen@university.edu</span>
                    </div>
                    <div className="contact-item">
                      <i className="bi bi-telephone"></i>
                      <span>+1 (555) 789-0123</span>
                    </div>
                    <div className="contact-item">
                      <i className="bi bi-geo-alt"></i>
                      <span>Room 304, Computer Science Building</span>
                    </div>
                  </div>
                  <div className="office-hours">
                    <h6>Office Hours</h6>
                    <p>Tuesday & Thursday<br />2:00 PM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
