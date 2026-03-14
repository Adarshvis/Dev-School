import * as React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { BlockRenderer } from '../components/BlockRenderer'

const getCardDescription = (value: unknown): string => {
  if (!value) return ''
  const text = String(value).replace(/\s+/g, ' ').trim()
  if (!text) return ''
  return text.length > 140 ? `${text.slice(0, 140).trim()}...` : text
}

export default async function CMSInstructorsPage({ isHomePage = false }: { isHomePage?: boolean } = {}) {
  try {
    const payload = await getPayload({ config })
    
    // Fetch instructors-page sections
    const instructorsPageSections = await payload.find({
      collection: 'instructors-page' as any,
      where: {
        status: { equals: 'active' }
      },
      sort: 'order',
    })

    const sections = instructorsPageSections.docs || []
    
    const pageTitleSection = sections.find((section: any) => section.sectionType === 'page-title')
    const instructorsGridSection = sections.find((section: any) => section.sectionType === 'instructors-grid')
    
    // Get content blocks that have people data
    const peopleBlocks = instructorsGridSection?.contentBlocks?.filter((block: any) => block.blockType === 'people') || []
    const additionalBlocks = instructorsGridSection?.contentBlocks?.filter((block: any) => block.blockType !== 'people') || []
    
    console.log('Sections found:', sections.length)
    console.log('People blocks found:', peopleBlocks.length)
    console.log('Full grid section:', JSON.stringify(instructorsGridSection, null, 2))
    
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
            {pageTitleSection?.contentBlocks && pageTitleSection.contentBlocks.length > 0 && (
              <BlockRenderer blocks={pageTitleSection.contentBlocks} />
            )}
          </div>
        )}

        {/* Instructors Section */}
        <section id="instructors" className="instructors section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">

            {peopleBlocks.length > 0 ? (
              peopleBlocks.map((block: any, blockIndex: number) => (
                <div key={block.id || blockIndex} className="mb-5">
                  {block.title && (
                    <div className="section-title text-center mb-4">
                      <h2>{block.title}</h2>
                    </div>
                  )}
                  
                  <div className="row gy-4">
                    {block.people?.map((person: any, index: number) => (
                      <div 
                        key={person.id || index} 
                        className="col-xl-3 col-lg-4 col-md-6"
                        data-aos="fade-up" 
                        data-aos-delay={200 + (index * 50)}
                      >
                        <div className="instructor-card">
                          <div className="instructor-image">
                            {person.image && (
                              <img 
                                src={typeof person.image === 'object' ? person.image.url : person.image} 
                                className="img-fluid" 
                                alt={person.name}
                              />
                            )}
                          </div>
                          <div className="instructor-info">
                            <h5>{person.name}</h5>
                            {person.specialty && <p className="specialty" style={{ color: '#011e2c' }}>{person.specialty}</p>}
                            {getCardDescription(person.description) ? <p className="description">{getCardDescription(person.description)}</p> : null}
                            
                            <div className="action-buttons">
                              <Link 
                                href={person?.id ? `/instructors/id-${person.id}` : `/instructors/${person.slug || person.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} 
                                className="btn-view"
                                style={{ backgroundColor: '#011e2c', borderColor: '#011e2c' }}
                              >
                                View Profile
                              </Link>
                              {block.showSocialLinks && person.socialLinks && person.socialLinks.length > 0 && (
                                <div className="social-links">
                                  {person.socialLinks.map((social: any, idx: number) => (
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
                </div>
              ))
            ) : (
              <div className="row">
                <div className="col-12 text-center">
                  <p>No instructors found. Please add instructors in the admin panel.</p>
                  <Link href="/admin" className="btn btn-primary">Go to Admin Panel</Link>
                </div>
              </div>
            )}

            {additionalBlocks.length > 0 && <BlockRenderer blocks={additionalBlocks} />}

          </div>
        </section>
      </>
    )
  } catch (error) {
    console.error('Error loading instructors page:', error)
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Instructors</h2>
          <p>Error loading instructors. Please check the admin panel.</p>
          <Link href="/admin" className="btn btn-primary">Go to Admin Panel</Link>
        </div>
      </div>
    )
  }
}
