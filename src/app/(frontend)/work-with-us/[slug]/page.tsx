import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { lexicalToHtml } from '@/lib/lexicalToHtml'

// Use ISR - revalidate every 60 seconds for better performance
export const revalidate = 60

interface WorkWithUsData {
  title: string
  slug: string
  content: any
  effectiveDate?: string
  excerpt?: string
  category?: string
  applyButtonText?: string
  applyButtonLink?: string
  problemDomains?: Array<{
    title: string
    description?: string
    challenges?: Array<{ challenge: string }>
    technicalSkills?: Array<{ skill: string }>
    nonTechnicalSkills?: Array<{ skill: string }>
    id?: string
  }>
}

async function getWorkWithUsItem(slug: string): Promise<WorkWithUsData | null> {
  try {
    const payload = await getPayload({ config })
    const data = await payload.find({
      collection: 'work-with-us' as 'media',
      where: {
        slug: { equals: slug },
      },
      limit: 1,
      depth: 2,
    })
    return data.docs && data.docs.length > 0 ? (data.docs[0] as unknown as WorkWithUsData) : null
  } catch (error) {
    return null
  }
}

export default async function WorkWithUsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await getWorkWithUsItem(slug)
  
  if (!item) {
    notFound()
  }
  
  const contentHTML = lexicalToHtml(item.content)
  
  return (
    <main className="main">
      {/* Page Title */}
      <div className="page-title light-background">
        <div className="container d-lg-flex justify-content-between align-items-center">
          <h1 className="mb-2 mb-lg-0">{item.title}</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li className="current">{item.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Program Content Section */}
      <section id="work-with-us" className="privacy section">
        <div className="container" data-aos="fade-up">
          {/* Header */}
          {item.effectiveDate && (
            <div className="privacy-header" data-aos="fade-up">
              <div className="header-content">
                <div className="last-updated">{item.effectiveDate}</div>
                <h1>{item.title}</h1>
                {item.excerpt && <p className="intro-text">{item.excerpt}</p>}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="privacy-content" data-aos="fade-up">
            <div className="content-section" dangerouslySetInnerHTML={{ __html: contentHTML }} />
          </div>

          {/* Problem Domains Accordion */}
          {item.problemDomains && item.problemDomains.length > 0 && (
            <div className="privacy-content mt-5" data-aos="fade-up">
              <h2 className="mb-4">Problem Domains</h2>
              <div className="accordion" id="problemDomainsAccordion">
                {item.problemDomains.map((domain: any, index: number) => (
                  <div className="accordion-item" key={index}>
                    <h2 className="accordion-header" id={`heading${index}`}>
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${index}`}
                        aria-expanded="false"
                        aria-controls={`collapse${index}`}
                      >
                        {domain.title}
                      </button>
                    </h2>
                    <div
                      id={`collapse${index}`}
                      className="accordion-collapse collapse"
                      aria-labelledby={`heading${index}`}
                      data-bs-parent="#problemDomainsAccordion"
                    >
                      <div className="accordion-body">
                        <p>{domain.description}</p>
                        
                        {domain.challenges && domain.challenges.length > 0 && (
                          <div className="mt-3">
                            <h6 className="fw-bold">Challenges for Research Interns:</h6>
                            <ol>
                              {domain.challenges.map((item: any, idx: number) => (
                                <li key={idx}>{item.challenge}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                        
                        {((domain.technicalSkills && domain.technicalSkills.length > 0) || 
                          (domain.nonTechnicalSkills && domain.nonTechnicalSkills.length > 0)) && (
                          <div className="mt-3">
                            <h6 className="fw-bold">Prerequisites:</h6>
                            
                            {domain.technicalSkills && domain.technicalSkills.length > 0 && (
                              <div className="mt-2">
                                <strong>Technical Skills:</strong>
                                <ul>
                                  {domain.technicalSkills.map((item: any, idx: number) => (
                                    <li key={idx}>{item.skill}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {domain.nonTechnicalSkills && domain.nonTechnicalSkills.length > 0 && (
                              <div className="mt-2">
                                <strong>Non-Technical Skills:</strong>
                                <ul>
                                  {domain.nonTechnicalSkills.map((item: any, idx: number) => (
                                    <li key={idx}>{item.skill}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Apply Now Button */}
          {item.applyButtonText && item.applyButtonLink && (
            <div className="text-center mt-5" data-aos="fade-up">
              <a 
                href={item.applyButtonLink} 
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.applyButtonText}
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await getWorkWithUsItem(slug)
  
  if (!item) {
    return {
      title: 'Program Not Found'
    }
  }
  
  return {
    title: `${item.title} - Work With Us`,
    description: item.excerpt || `Learn about ${item.title}`,
  }
}
