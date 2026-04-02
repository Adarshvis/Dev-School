import * as React from 'react'
import Link from 'next/link'
import { HandHeart, BookOpen, Binoculars, Handshake, Scale, Rocket, Telescope, Gavel, Target, Lightbulb } from 'lucide-react'
import { getPageContent } from '../../../lib/payload'
import { BlockRenderer } from '../components/BlockRenderer'

const getCoreValueIcon = (value: any): React.ReactNode => {
  const title = String(value?.title || '').trim().toLowerCase()
  const rawIcon = String(value?.icon || '').trim().toLowerCase()

  if (title === 'care' || rawIcon.includes('hand-heart')) return <HandHeart aria-hidden="true" strokeWidth={1.8} />
  if (title === 'learning' || rawIcon.includes('book-open')) return <BookOpen aria-hidden="true" strokeWidth={1.8} />
  if (title === 'curious' || rawIcon.includes('binoculars')) return <Binoculars aria-hidden="true" strokeWidth={1.8} />
  if (title.includes('collaboration') || rawIcon.includes('handshake')) return <Handshake aria-hidden="true" strokeWidth={1.8} />
  if (title === 'integrity' || rawIcon.includes('scale-balanced')) return <Scale aria-hidden="true" strokeWidth={1.8} />

  return <BookOpen aria-hidden="true" strokeWidth={1.8} />
}

const getMissionVisionIcon = (card: any): React.ReactNode => {
  const title = String(card?.title || '').trim().toLowerCase()
  const rawIcon = String(card?.icon || '').trim().toLowerCase()

  if (rawIcon.includes('rocket')) return <Rocket aria-hidden="true" strokeWidth={1.8} />
  if (rawIcon.includes('telescope')) return <Telescope aria-hidden="true" strokeWidth={1.8} />
  if (rawIcon.includes('gavel')) return <Gavel aria-hidden="true" strokeWidth={1.8} />
  if (rawIcon.includes('target')) return <Target aria-hidden="true" strokeWidth={1.8} />
  if (rawIcon.includes('lightbulb')) return <Lightbulb aria-hidden="true" strokeWidth={1.8} />
  if (rawIcon.includes('book-open')) return <BookOpen aria-hidden="true" strokeWidth={1.8} />

  if (title.includes('mission')) return <Rocket aria-hidden="true" strokeWidth={1.8} />
  if (title.includes('vision')) return <Telescope aria-hidden="true" strokeWidth={1.8} />
  if (title.includes('motto')) return <Gavel aria-hidden="true" strokeWidth={1.8} />

  return <Target aria-hidden="true" strokeWidth={1.8} />
}

export default async function CMSAboutPage({ isHomePage = false }: { isHomePage?: boolean } = {}) {
  try {
    const aboutPageContent = await getPageContent('about')

    if (!aboutPageContent || aboutPageContent.length === 0) {
      return (
        <div className="container py-5">
          <div className="text-center">
            <h2>About Us</h2>
            <p>Content is being loaded from CMS. Please add content through the admin panel.</p>
            <Link href="/admin" className="btn btn-primary">Go to Admin Panel</Link>
          </div>
        </div>
      )
    }

    const pageTitleSection = aboutPageContent.find((section: any) => section.sectionType === 'page-title')
    const aboutMainSection = aboutPageContent.find((section: any) => section.sectionType === 'about-main')
    const ourStorySection = aboutPageContent.find((section: any) => section.sectionType === 'our-story')
    const missionVisionSection = aboutPageContent.find((section: any) => section.sectionType === 'mission-vision-values')
    const whyChooseUsSection = aboutPageContent.find((section: any) => section.sectionType === 'why-choose-us')

    return (
      <>
        {!isHomePage && (
          <div className="page-title light-background">
            <div className="container d-lg-flex justify-content-between align-items-center">
              <h1 className="mb-2 mb-lg-0">{pageTitleSection?.pageTitle?.title || 'About'}</h1>
              <nav className="breadcrumbs">
                <ol>
                  <li><Link href="/">Home</Link></li>
                  <li className="current">About</li>
                </ol>
              </nav>
            </div>
            {pageTitleSection?.contentBlocks?.length > 0 && (
              <BlockRenderer blocks={pageTitleSection.contentBlocks} />
            )}
          </div>
        )}

        {aboutMainSection?.aboutMain && (
          <section id="about" className="about section">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  {aboutMainSection.aboutMain.image && (
                    <img
                      src={typeof aboutMainSection.aboutMain.image === 'object' ? aboutMainSection.aboutMain.image.url : aboutMainSection.aboutMain.image}
                      alt={aboutMainSection.aboutMain.title}
                      className="img-fluid rounded-4"
                    />
                  )}
                </div>
                <div className="col-lg-6">
                  <div className="about-content">
                    {aboutMainSection.aboutMain.subtitle && (
                      <span className="subtitle">{aboutMainSection.aboutMain.subtitle}</span>
                    )}
                    <h2>{aboutMainSection.aboutMain.title}</h2>
                    <p>{aboutMainSection.aboutMain.description}</p>

                    {aboutMainSection.aboutMain.stats && (
                      <div className="stats-row">
                        {aboutMainSection.aboutMain.stats.map((stat: any, index: number) => (
                          <div key={index} className="stats-item">
                            <span className="count">{stat.count}</span>
                            <p>{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {aboutMainSection.contentBlocks?.length > 0 && (
                      <BlockRenderer blocks={aboutMainSection.contentBlocks} />
                    )}
                  </div>
                </div>
              </div>

              {missionVisionSection?.missionVisionValues && (
                <>
                  <div className="row mt-5 pt-4">
                    {missionVisionSection.missionVisionValues.cards?.map((card: any, index: number) => (
                      <div key={index} className="col-lg-4" data-aos="fade-up" data-aos-delay={200 + index * 100}>
                        <div className="mission-card">
                          <div className="icon-box">
                            <i className={`bi ${card.icon}`}></i>
                          </div>
                          <h3>{card.title}</h3>
                          <p>{card.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {missionVisionSection.contentBlocks?.length > 0 && (
                    <BlockRenderer blocks={missionVisionSection.contentBlocks} />
                  )}
                </>
              )}

              {whyChooseUsSection?.whyChooseUs && (
                <>
                  <div className="row mt-5 pt-3 align-items-center">
                    <div className="col-lg-6 order-lg-2" data-aos="fade-up" data-aos-delay="300">
                      <div className="achievements">
                        <span className="subtitle">{whyChooseUsSection.whyChooseUs.subtitle}</span>
                        <h2>{whyChooseUsSection.whyChooseUs.title}</h2>
                        <p>{whyChooseUsSection.whyChooseUs.description}</p>

                        {whyChooseUsSection.whyChooseUs.features && (
                          <ul className="achievements-list">
                            {whyChooseUsSection.whyChooseUs.features.map((feature: any, index: number) => (
                              <li key={index}>
                                <i className="bi bi-check-circle-fill"></i> {feature.text}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6 order-lg-1" data-aos="fade-up" data-aos-delay="200">
                      {whyChooseUsSection.whyChooseUs.galleryImages && (
                        <div className="about-gallery">
                          <div className="row g-3">
                            {whyChooseUsSection.whyChooseUs.galleryImages.slice(0, 2).map((item: any, index: number) => (
                              <div key={index} className="col-6">
                                <img
                                  src={typeof item.image === 'object' ? item.image.url : item.image}
                                  alt={item.alt}
                                  className="img-fluid rounded-3"
                                />
                              </div>
                            ))}
                            {whyChooseUsSection.whyChooseUs.galleryImages[2] && (
                              <div className="col-12 mt-3">
                                <img
                                  src={typeof whyChooseUsSection.whyChooseUs.galleryImages[2].image === 'object'
                                    ? whyChooseUsSection.whyChooseUs.galleryImages[2].image.url
                                    : whyChooseUsSection.whyChooseUs.galleryImages[2].image}
                                  alt={whyChooseUsSection.whyChooseUs.galleryImages[2].alt}
                                  className="img-fluid rounded-3"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {whyChooseUsSection.contentBlocks?.length > 0 && (
                    <BlockRenderer blocks={whyChooseUsSection.contentBlocks} />
                  )}
                </>
              )}
            </div>
          </section>
        )}

        {ourStorySection?.ourStory && (
          <section id="about" className="about section">
            <div className="container" data-aos="fade-up" data-aos-delay="100">
              <div className="row align-items-center g-5">
                <div className="col-lg-6">
                  <div className="about-content" data-aos="fade-up" data-aos-delay="200">
                    <h3>{ourStorySection.ourStory.subtitle}</h3>
                    <h2>{ourStorySection.ourStory.title}</h2>
                    <p>{ourStorySection.ourStory.description}</p>

                    {ourStorySection.ourStory.timeline && (
                      <div className="timeline">
                        {ourStorySection.ourStory.timeline.map((item: any, index: number) => (
                          <div key={index} className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                              <h4>{item.year}</h4>
                              <p>{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="about-image" data-aos="zoom-in" data-aos-delay="300">
                    {ourStorySection.ourStory.campusImage && (
                      <img
                        src={typeof ourStorySection.ourStory.campusImage === 'object'
                          ? ourStorySection.ourStory.campusImage.url
                          : ourStorySection.ourStory.campusImage}
                        alt="Campus"
                        className="img-fluid rounded"
                      />
                    )}

                    {ourStorySection.ourStory.missionVisionCards && (
                      <div className="mission-vision" data-aos="fade-up" data-aos-delay="400">
                        {ourStorySection.ourStory.missionVisionCards.map((card: any, index: number) => (
                          <div key={index} className={index === 0 ? 'mission' : 'vision'}>
                            <div className="mission-vision-icon">{getMissionVisionIcon(card)}</div>
                            <h3>{card.title}</h3>
                            <p>{card.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {ourStorySection.ourStory.coreValues && (
                <div className="row mt-5">
                  <div className="col-lg-12">
                    <div className="core-values" data-aos="fade-up" data-aos-delay="500">
                      <h3 className="text-center mb-4">Core Values</h3>
                      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-5 g-4">
                        {ourStorySection.ourStory.coreValues.map((value: any, index: number) => (
                          <div key={index} className="col">
                            <div className="value-card">
                              <div className="value-icon">
                                {getCoreValueIcon(value)}
                              </div>
                              <h4>{value.title}</h4>
                              <p>{value.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {ourStorySection.contentBlocks?.length > 0 && (
                <BlockRenderer blocks={ourStorySection.contentBlocks} />
              )}
            </div>
          </section>
        )}

        {!aboutMainSection && !ourStorySection && !missionVisionSection && !whyChooseUsSection && (
          <div className="container py-5">
            <div className="text-center">
              <h2>About Us</h2>
              <p>Please add content to your about page through the admin panel.</p>
              <Link href="/admin" className="btn btn-primary">Go to Admin Panel</Link>
            </div>
          </div>
        )}
      </>
    )
  } catch (error) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>About Us</h2>
          <p>Content is being loaded. Please check the admin panel to add content.</p>
          <Link href="/admin" className="btn btn-primary">Go to Admin Panel</Link>
        </div>
      </div>
    )
  }
}
