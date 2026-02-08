'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import AOS from 'aos'
import 'aos/dist/aos.css'

// This is an example of how to integrate CMS data into your pages
// You would replace the static homepage with this approach

interface Course {
  id: string
  title: string
  slug: string
  shortDescription: string
  featuredImage: {
    url: string
    alt: string
  }
  category: string
  level: string
  price: {
    amount: number
    currency: string
  }
  duration: {
    hours: number
  }
  instructor: {
    fullName: string
    avatar: {
      url: string
    }
  }
  stats: {
    studentsEnrolled: number
    rating: number
    reviewsCount: number
  }
}

interface Instructor {
  id: string
  fullName: string
  slug: string
  title: string
  specialty: string
  shortBio: string
  avatar: {
    url: string
  }
  stats: {
    studentsCount: number
    rating: number
  }
}

interface PageContent {
  content: {
    title: string
    subtitle: string
    description: any
    buttonText: string
    buttonLink: string
    image?: {
      url: string
    }
  }
}

interface Testimonial {
  studentName: string
  studentTitle: string
  testimonial: string
  rating: number
  studentAvatar?: {
    url: string
  }
}

export default function HomepageWithCMS() {
  const [heroContent, setHeroContent] = useState<PageContent | null>(null)
  const [ctaContent, setCtaContent] = useState<PageContent | null>(null)
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([])
  const [featuredInstructors, setFeaturedInstructors] = useState<Instructor[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })

    // Fetch CMS data
    fetchCMSData()
  }, [])

  const fetchCMSData = async () => {
    try {
      // In a real implementation, these would be API calls to your CMS
      // For now, we'll use mock data to show the structure

      // Mock hero content
      setHeroContent({
        content: {
          title: "Learn Without Limits",
          subtitle: "Unlock Your Potential with Expert-Led Courses",
          description: "Join thousands of students learning from industry experts. Master in-demand skills with our comprehensive online courses.",
          buttonText: "Start Learning Today",
          buttonLink: "/courses"
        }
      })

      // Mock CTA content
      setCtaContent({
        content: {
          title: "Ready to Start Your Learning Journey?",
          subtitle: "Join Our Community of Learners",
          description: "Take the first step towards mastering new skills. Enroll in our courses and transform your career.",
          buttonText: "Enroll Now",
          buttonLink: "/enroll"
        }
      })

      // Mock featured courses (these would come from CMS)
      setFeaturedCourses([
        {
          id: '1',
          title: 'Full Stack Web Development',
          slug: 'full-stack-web-development',
          shortDescription: 'Learn HTML, CSS, JavaScript, React, Node.js, and databases in this comprehensive bootcamp.',
          featuredImage: {
            url: '/assets/img/course/course-1.webp',
            alt: 'Full Stack Web Development'
          },
          category: 'Web Development',
          level: 'Beginner',
          price: { amount: 299, currency: 'USD' },
          duration: { hours: 120 },
          instructor: {
            fullName: 'Prof. Michael Chen',
            avatar: { url: '/assets/img/person/person-m-12.webp' }
          },
          stats: {
            studentsEnrolled: 1250,
            rating: 4.7,
            reviewsCount: 89
          }
        },
        // Add more courses...
      ])

      // Mock featured instructors
      setFeaturedInstructors([
        {
          id: '1',
          fullName: 'Dr. Sarah Johnson',
          slug: 'sarah-johnson',
          title: 'Senior Data Scientist',
          specialty: 'Data Science & Analytics',
          shortBio: 'Expert in machine learning and data visualization with 10+ years of experience.',
          avatar: { url: '/assets/img/person/person-f-8.webp' },
          stats: {
            studentsCount: 2500,
            rating: 4.9
          }
        },
        // Add more instructors...
      ])

      // Mock testimonials
      setTestimonials([
        {
          studentName: 'Alex Johnson',
          studentTitle: 'Software Developer',
          testimonial: 'The courses here transformed my career. The instructors are world-class and the content is always up-to-date.',
          rating: 5,
          studentAvatar: { url: '/assets/img/person/person-m-1.webp' }
        },
        // Add more testimonials...
      ])

      setLoading(false)
    } catch (error) {
      // Silently handle error
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section - Content from CMS */}
      {heroContent && (
        <section id="hero" className="hero section">
          <div className="hero-bg">
            <img src="/assets/img/hero-bg.webp" alt="Hero Background" />
          </div>
          <div className="container text-center">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h1 data-aos="fade-up">{heroContent.content.title}</h1>
              <p data-aos="fade-up" data-aos-delay="100">
                {heroContent.content.subtitle}
              </p>
              <div className="d-flex" data-aos="fade-up" data-aos-delay="200">
                <Link href={heroContent.content.buttonLink} className="btn-get-started">
                  {heroContent.content.buttonText}
                </Link>
              </div>
              <img 
                src="/assets/img/hero-services-img.webp" 
                className="img-fluid hero-img" 
                alt="Hero Image" 
                data-aos="zoom-out" 
                data-aos-delay="300" 
              />
            </div>
          </div>
        </section>
      )}

      {/* Featured Courses Section - Data from CMS */}
      <section id="featured-courses" className="courses section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Featured Courses</h2>
          <p>Discover our most popular courses taught by industry experts</p>
        </div>

        <div className="container">
          <div className="row gy-4">
            {featuredCourses.map((course, index) => (
              <div key={course.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={100 * (index + 1)}>
                <div className="course-item">
                  <img src={course.featuredImage.url} className="img-fluid" alt={course.title} />
                  <div className="course-content">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <p className="category">{course.category}</p>
                      <p className="price">${course.price.amount}</p>
                    </div>
                    <h3>
                      <Link href={`/course-details/${course.slug}`}>{course.title}</Link>
                    </h3>
                    <p className="description">{course.shortDescription}</p>
                    <div className="trainer d-flex justify-content-between align-items-center">
                      <div className="trainer-profile d-flex align-items-center">
                        <img 
                          src={course.instructor.avatar.url} 
                          className="img-fluid" 
                          alt={course.instructor.fullName} 
                        />
                        <a href="#" className="trainer-link">{course.instructor.fullName}</a>
                      </div>
                      <div className="trainer-rank d-flex align-items-center">
                        <i className="bi bi-person user-icon"></i>&nbsp;{course.stats.studentsEnrolled}
                        &nbsp;&nbsp;
                        <i className="bi bi-heart heart-icon"></i>&nbsp;{course.stats.rating}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Instructors Section - Data from CMS */}
      <section id="trainers" className="trainers section light-background">
        <div className="container section-title" data-aos="fade-up">
          <h2>Featured Instructors</h2>
          <p>Learn from industry professionals and experienced educators</p>
        </div>

        <div className="container">
          <div className="row gy-4">
            {featuredInstructors.map((instructor, index) => (
              <div key={instructor.id} className="col-lg-6" data-aos="fade-up" data-aos-delay={100 * (index + 1)}>
                <div className="member">
                  <div className="pic">
                    <img src={instructor.avatar.url} className="img-fluid" alt={instructor.fullName} />
                  </div>
                  <div className="member-info">
                    <h4>{instructor.fullName}</h4>
                    <span>{instructor.specialty}</span>
                    <div className="stats">
                      <span>{instructor.stats.studentsCount} Students</span>
                      <span>{instructor.stats.rating}/5 Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Data from CMS */}
      <section id="testimonials" className="testimonials section">
        <div className="container section-title" data-aos="fade-up">
          <h2>What Our Students Say</h2>
          <p>Real feedback from our learning community</p>
        </div>

        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="swiper init-swiper">
            <div className="swiper-wrapper">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="swiper-slide">
                  <div className="testimonial-item">
                    <div className="stars">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill"></i>
                      ))}
                    </div>
                    <p>"{testimonial.testimonial}"</p>
                    <div className="profile mt-auto">
                      {testimonial.studentAvatar && (
                        <img 
                          src={testimonial.studentAvatar.url} 
                          className="testimonial-img" 
                          alt={testimonial.studentName} 
                        />
                      )}
                      <h3>{testimonial.studentName}</h3>
                      <h4>{testimonial.studentTitle}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="swiper-pagination"></div>
          </div>
        </div>
      </section>

      {/* CTA Section - Content from CMS */}
      {ctaContent && (
        <section id="cta" className="cta section">
          <div className="container">
            <div className="row g-5">
              <div className="col-lg-8 col-md-6 content" data-aos="fade-up" data-aos-delay="100">
                <h3>{ctaContent.content.title}</h3>
                <p>{ctaContent.content.description}</p>
              </div>
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                <Link href={ctaContent.content.buttonLink} className="btn-cta">
                  {ctaContent.content.buttonText}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
