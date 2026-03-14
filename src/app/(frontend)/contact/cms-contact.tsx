import * as React from 'react'
import Link from 'next/link'
import { getPageContent } from '../../../lib/payload'
import { BlockRenderer } from '../components/BlockRenderer'

export default async function CMSContactPage({ isHomePage = false }: { isHomePage?: boolean } = {}) {
  try {
    const contactPageContent = await getPageContent('contact')
    
    if (!contactPageContent || contactPageContent.length === 0) {
      return (
        <div className="container py-5">
          <div className="text-center">
            <h2>Contact Us</h2>
            <p>Content is being loaded from CMS. Please add content through the admin panel.</p>
            <Link href="/admin" className="btn btn-primary">Go to Admin Panel</Link>
          </div>
        </div>
      )
    }

    const pageTitleSection = contactPageContent.find((section: any) => section.sectionType === 'page-title')
    const contactMapSection = contactPageContent.find((section: any) => section.sectionType === 'contact-map')
    const contactInfoSection = contactPageContent.find((section: any) => section.sectionType === 'contact-info')
    
    return (
      <>
        {/* Page Title - Hide breadcrumb when used as home page */}
        {!isHomePage && (
          <div className="page-title light-background">
            <div className="container d-lg-flex justify-content-between align-items-center">
              <h1 className="mb-2 mb-lg-0">
                {pageTitleSection?.pageTitle?.title || 'Contact'}
              </h1>
              <nav className="breadcrumbs">
                <ol>
                  <li><Link href="/">Home</Link></li>
                  <li className="current">Contact</li>
                </ol>
              </nav>
            </div>
            {pageTitleSection?.contentBlocks && pageTitleSection.contentBlocks.length > 0 && (
              <BlockRenderer blocks={pageTitleSection.contentBlocks} />
            )}
          </div>
        )}

        {/* Contact Section */}
        <section id="contact" className="contact section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="contact-main-wrapper">
              
              {/* Map Wrapper */}
              {contactMapSection && contactMapSection.contactMap && (
                <div>
                  <div className="map-wrapper">
                    <iframe 
                      src={contactMapSection.contactMap.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d48389.78314118045!2d-74.006138!3d40.710059!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sDowntown%20Conference%20Center!5e0!3m2!1sen!2sus!4v1676961268712!5m2!1sen!2sus'}
                      width="100%" 
                      height="100%" 
                      style={{border: 0}} 
                      allowFullScreen={true}
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  {contactMapSection.contentBlocks && contactMapSection.contentBlocks.length > 0 && (
                    <BlockRenderer blocks={contactMapSection.contentBlocks} />
                  )}
                </div>
              )}

              {/* Contact Content */}
              {contactInfoSection && contactInfoSection.contactInfo && (
                <div className="contact-content">
                  
                  {/* Contact Cards */}
                  <div className="contact-cards-container" data-aos="fade-up" data-aos-delay="300">
                    {contactInfoSection.contactInfo.contactCards && contactInfoSection.contactInfo.contactCards.map((card: any, index: number) => (
                      <div key={index} className="contact-card">
                        <div className="icon-box">
                          <i className={card.icon}></i>
                        </div>
                        <div className="contact-text">
                          <h4>{card.heading}</h4>
                          <p>{card.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Contact Form */}
                  <div className="contact-form-container" data-aos="fade-up" data-aos-delay="400">
                    <h3>{contactInfoSection.contactInfo.formSection?.heading || 'Get in Touch'}</h3>
                    <p>{contactInfoSection.contactInfo.formSection?.description}</p>

                    <form 
                      action={contactInfoSection.contactInfo.formSection?.formAction || 'forms/contact.php'} 
                      method="post" 
                      className="php-email-form"
                    >
                      <div className="row">
                        <div className="col-md-6 form-group">
                          <input type="text" name="name" className="form-control" id="name" placeholder="Your Name" required />
                        </div>
                        <div className="col-md-6 form-group mt-3 mt-md-0">
                          <input type="email" className="form-control" name="email" id="email" placeholder="Your Email" required />
                        </div>
                      </div>
                      <div className="form-group mt-3">
                        <input type="text" className="form-control" name="subject" id="subject" placeholder="Subject" required />
                      </div>
                      <div className="form-group mt-3">
                        <textarea className="form-control" name="message" rows={5} placeholder="Message" required></textarea>
                      </div>

                      <div className="my-3">
                        <div className="loading">Loading</div>
                        <div className="error-message"></div>
                        <div className="sent-message">Your message has been sent. Thank you!</div>
                      </div>

                      <div className="form-submit">
                        <button type="submit">
                          {contactInfoSection.contactInfo.formSection?.submitButtonText || 'Send Message'}
                        </button>
                        {contactInfoSection.contactInfo.formSection?.socialLinks && (
                          <div className="social-links">
                            {contactInfoSection.contactInfo.formSection.socialLinks.map((social: any, index: number) => (
                              <a key={index} href={social.url} target="_blank" rel="noopener noreferrer">
                                <i className={`bi bi-${social.platform}`}></i>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </form>
                  </div>

                  {contactInfoSection.contentBlocks && contactInfoSection.contentBlocks.length > 0 && (
                    <BlockRenderer blocks={contactInfoSection.contentBlocks} />
                  )}

                </div>
              )}

            </div>
          </div>
        </section>

        {/* Fallback when no content */}
        {!contactInfoSection && (
          <div className="container py-5">
            <div className="text-center">
              <h2>Contact Us</h2>
              <p>Please add contact information through the admin panel.</p>
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
          <h2>Contact Us</h2>
          <p>Content is being loaded. Please check the admin panel.</p>
          <Link href="/admin" className="btn btn-primary">Go to Admin Panel</Link>
        </div>
      </div>
    )
  }
}