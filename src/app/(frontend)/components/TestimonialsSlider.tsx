'use client'

import { useState, useEffect } from 'react'

interface Testimonial {
  name: string
  role: string
  review: string
  rating: number
  avatar: any
}

interface TestimonialsSliderProps {
  testimonials: Testimonial[]
}

export default function TestimonialsSlider({ testimonials }: TestimonialsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsToShow = 3
  const totalItems = testimonials.length

  // Auto-play functionality - shift by 1 card each time
  useEffect(() => {
    if (totalItems <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems)
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [totalItems])

  if (totalItems === 0) {
    return null
  }

  const goToIndex = (index: number) => {
    setCurrentIndex(index)
  }

  // Get 3 consecutive cards with looping
  const getVisibleTestimonials = () => {
    const visible = []
    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentIndex + i) % totalItems
      visible.push(testimonials[index])
    }
    return visible
  }

  const visibleTestimonials = getVisibleTestimonials()

  return (
    <>
      <div className="testimonials-container" data-aos="fade-up" data-aos-delay="400">
        <div className="row gy-4">
          {visibleTestimonials.map((review: Testimonial, index: number) => (
            <div key={(currentIndex + index) % totalItems} className="col-lg-4 col-md-6">
              <div className="testimonial-item">
                <div className="stars">
                  {Array.from({ length: Math.floor(review.rating || 5) }, (_, i) => (
                    <i key={i} className="bi bi-star-fill"></i>
                  ))}
                  {(review.rating || 5) % 1 !== 0 && <i className="bi bi-star-half"></i>}
                </div>
                <p>{review.review}</p>
                <div className="testimonial-profile">
                  <img 
                    src={typeof review.avatar === 'object' ? review.avatar.url : '/assets/img/person/person-f-1.webp'} 
                    alt="Reviewer" 
                    className="img-fluid rounded-circle"
                  />
                  <div>
                    <h3>{review.name}</h3>
                    <h4>{review.role}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        {totalItems > 1 && (
          <div className="swiper-pagination">
            {Array.from({ length: totalItems }, (_, i) => (
              <span 
                key={i} 
                className={`swiper-pagination-bullet ${i === currentIndex ? 'swiper-pagination-bullet-active' : ''}`}
                onClick={() => goToIndex(i)}
              ></span>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
