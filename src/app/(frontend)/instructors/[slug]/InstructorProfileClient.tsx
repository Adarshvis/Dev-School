'use client'

import * as React from 'react'
import Link from 'next/link'

interface InstructorProfileClientProps {
  person: any
  blockTitle: string
}

export default function InstructorProfileClient({ person, blockTitle }: InstructorProfileClientProps) {
  const [activeTab, setActiveTab] = React.useState('about')

  // Check which tabs have content
  const hasAbout = person.biography || person.description
  const hasEducation = person.education && person.education.length > 0
  const hasExperience = (person.experience && person.experience.length > 0) || 
                        (person.awards && person.awards.length > 0)
  const hasCourses = person.courses && person.courses.length > 0
  const hasPublications = person.publications && person.publications.length > 0
  const hasResearch = person.researchInterests && person.researchInterests.length > 0

  // Available tabs based on content
  const tabs = [
    { id: 'about', label: 'About', icon: 'bi-person', available: true }, // Always show about
    { id: 'education', label: 'Education', icon: 'bi-mortarboard', available: hasEducation },
    { id: 'experience', label: 'Experience', icon: 'bi-briefcase', available: hasExperience },
    { id: 'research', label: 'Research', icon: 'bi-lightbulb', available: hasResearch },
    { id: 'courses', label: 'Courses', icon: 'bi-book', available: hasCourses },
    { id: 'publications', label: 'Publications', icon: 'bi-journal-text', available: hasPublications },
  ].filter(tab => tab.available)

  return (
    <>
      {/* Page Title */}
      <div className="page-title light-background">
        <div className="container d-lg-flex justify-content-between align-items-center">
          <h1 className="mb-2 mb-lg-0">{person.name}</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/instructors">Instructors</Link></li>
              <li className="current">{person.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Profile Section */}
      <section className="instructor-profile section">
        <div className="container">
          <div className="row">
            {/* Left Sidebar */}
            <div className="col-lg-4 mb-4">
              <div className="profile-sidebar">
                {/* Profile Card */}
                <div className="profile-card text-center">
                  <div className="profile-image mb-3">
                    <img 
                      src={typeof person.image === 'object' ? person.image.url : '/assets/img/person/default-avatar.png'} 
                      alt={person.name}
                      className="img-fluid rounded-circle"
                      style={{ width: '180px', height: '180px', objectFit: 'cover' }}
                    />
                  </div>
                  <h3>{person.name}</h3>
                  {person.specialty && <p className="specialty mb-2" style={{ color: '#011e2c' }}>{person.specialty}</p>}
                  {person.description && <p className="text-muted small">{person.description}</p>}
                  
                  {/* Category Badge */}
                  {blockTitle && (
                    <span className="badge bg-light text-dark mb-3">{blockTitle}</span>
                  )}
                </div>

                {/* Contact Info */}
                {(person.email || person.phone || person.office) && (
                  <div className="contact-info mt-4">
                    <h5><i className="bi bi-info-circle me-2"></i>Contact Info</h5>
                    <ul className="list-unstyled">
                      {person.email && (
                        <li className="mb-2">
                          <i className="bi bi-envelope me-2 text-primary"></i>
                          <a href={`mailto:${person.email}`}>{person.email}</a>
                        </li>
                      )}
                      {person.phone && (
                        <li className="mb-2">
                          <i className="bi bi-phone me-2 text-primary"></i>
                          <a href={`tel:${person.phone}`}>{person.phone}</a>
                        </li>
                      )}
                      {person.office && (
                        <li className="mb-2">
                          <i className="bi bi-geo-alt me-2 text-primary"></i>
                          {person.office}
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Social Links */}
                {person.socialLinks && person.socialLinks.length > 0 && (
                  <div className="social-links mt-4">
                    <h5><i className="bi bi-share me-2"></i>Social</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {person.socialLinks.map((social: any, idx: number) => (
                        <a 
                          key={idx} 
                          href={social.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className={`bi bi-${social.platform}`}></i>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Academic Links */}
                {person.academicLinks && person.academicLinks.length > 0 && (
                  <div className="academic-links mt-4">
                    <h5><i className="bi bi-mortarboard me-2"></i>Academic Profiles</h5>
                    <ul className="list-unstyled">
                      {person.academicLinks.map((link: any, idx: number) => (
                        <li key={idx} className="mb-2">
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                            <i className="bi bi-link-45deg me-2"></i>
                            {link.platform === 'google-scholar' ? 'Google Scholar' :
                             link.platform === 'researchgate' ? 'ResearchGate' :
                             link.platform === 'orcid' ? 'ORCID' :
                             link.platform === 'academia' ? 'Academia.edu' :
                             link.platform === 'scopus' ? 'Scopus' :
                             link.platform === 'wos' ? 'Web of Science' : 'Profile'}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* External Profile Link */}
                {person.profileLink && (
                  <div className="mt-4">
                    <a href={person.profileLink} target="_blank" rel="noopener noreferrer" className="btn w-100" style={{ backgroundColor: '#011e2c', borderColor: '#011e2c', color: '#fff' }}>
                      <i className="bi bi-box-arrow-up-right me-2"></i>View Official Profile
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Right Content - Tabs */}
            <div className="col-lg-8">
              {/* Tab Navigation */}
              <div className="profile-tabs mb-4">
                <ul className="nav nav-pills" role="tablist">
                  {tabs.map((tab) => (
                    <li key={tab.id} className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        type="button"
                        role="tab"
                      >
                        <i className={`bi ${tab.icon} me-2`}></i>
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {/* About Tab - Biography Only */}
                {activeTab === 'about' && (
                  <div className="tab-pane fade show active">
                    {person.biography && (
                      <div className="content-card mb-4">
                        <h4><i className="bi bi-person-lines-fill me-2"></i>Professional Biography</h4>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{person.biography}</p>
                      </div>
                    )}

                    {!person.biography && (
                      <div className="content-card">
                        <p className="text-muted mb-0">
                          {person.description || 'No biography available.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Education Tab */}
                {activeTab === 'education' && (
                  <div className="tab-pane fade show active">
                    <div className="content-card mb-4">
                      <h4><i className="bi bi-mortarboard me-2"></i>Education</h4>
                      <div className="timeline">
                        {person.education?.map((edu: any, idx: number) => (
                          <div key={idx} className="timeline-item mb-3">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="mb-1">{edu.degree}</h6>
                                <p className="text-muted mb-0">{edu.institution}</p>
                                {edu.field && <p className="small text-secondary mb-0">{edu.field}</p>}
                              </div>
                              {edu.year && <span className="badge bg-light text-dark">{edu.year}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Experience Tab - Work Experience & Awards */}
                {activeTab === 'experience' && (
                  <div className="tab-pane fade show active">
                    {person.experience && person.experience.length > 0 && (
                      <div className="content-card mb-4">
                        <h4><i className="bi bi-briefcase me-2"></i>Work Experience</h4>
                        <div className="timeline">
                          {person.experience.map((exp: any, idx: number) => (
                            <div key={idx} className="timeline-item mb-3 pb-3 border-bottom">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="mb-1">{exp.position}</h6>
                                  <p style={{ color: '#011e2c' }} className="mb-1">{exp.organization}</p>
                                  {exp.description && <p className="text-muted small mb-0">{exp.description}</p>}
                                </div>
                                {exp.duration && <span className="badge bg-light text-dark">{exp.duration}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {person.awards && person.awards.length > 0 && (
                      <div className="content-card mb-4">
                        <h4><i className="bi bi-award me-2"></i>Awards & Honors</h4>
                        {person.awards.map((award: any, idx: number) => (
                          <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                              <strong>{award.title}</strong>
                              {award.organization && <span className="text-muted"> - {award.organization}</span>}
                            </div>
                            {award.year && <span className="badge bg-light text-dark">{award.year}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Research Tab */}
                {activeTab === 'research' && (
                  <div className="tab-pane fade show active">
                    <div className="content-card mb-4">
                      <h4><i className="bi bi-lightbulb me-2"></i>Research Interests</h4>
                      <div className="d-flex flex-wrap gap-2">
                        {person.researchInterests?.map((item: any, idx: number) => (
                          <span key={idx} className="badge" style={{ backgroundColor: '#011e2c', color: '#fff', fontSize: '14px', padding: '8px 16px' }}>{item.interest}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Courses Tab */}
                {activeTab === 'courses' && (
                  <div className="tab-pane fade show active">
                    <div className="content-card">
                      <h4><i className="bi bi-book me-2"></i>Courses Taught</h4>
                      <div className="row">
                        {person.courses?.map((course: any, idx: number) => (
                          <div key={idx} className="col-md-6 mb-3">
                            <div className="card h-100">
                              <div className="card-body">
                                <h6 className="card-title">{course.courseName}</h6>
                                {course.courseCode && <span className="badge bg-secondary mb-2">{course.courseCode}</span>}
                                {course.semester && <p className="text-muted small mb-1">{course.semester}</p>}
                                {course.description && <p className="small mb-0">{course.description}</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Publications Tab */}
                {activeTab === 'publications' && (
                  <div className="tab-pane fade show active">
                    <div className="content-card">
                      <h4><i className="bi bi-journal-text me-2"></i>Publications</h4>
                      {person.publications?.map((pub: any, idx: number) => (
                        <div key={idx} className="publication-item mb-3 pb-3 border-bottom">
                          <h6 className="mb-1">
                            {pub.link ? (
                              <a href={pub.link} target="_blank" rel="noopener noreferrer">{pub.title}</a>
                            ) : (
                              pub.title
                            )}
                          </h6>
                          <p className="text-muted mb-0">
                            {pub.journal && <span>{pub.journal}</span>}
                            {pub.year && <span className="ms-2">({pub.year})</span>}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .profile-sidebar {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          position: sticky;
          top: 100px;
        }
        .profile-card h3 {
          color: var(--heading-color, #011e2c);
          margin-bottom: 8px;
        }
        .specialty {
          font-weight: 500;
        }
        .profile-tabs .nav-pills {
          background: #f8f9fa;
          padding: 8px;
          border-radius: 50px;
          display: inline-flex;
          gap: 8px;
        }
        .profile-tabs .nav-link {
          border-radius: 50px;
          padding: 10px 20px;
          color: #666;
          font-weight: 500;
          transition: all 0.3s;
        }
        .profile-tabs .nav-link:hover {
          background: #e9ecef;
        }
        .profile-tabs .nav-link.active {
          background: var(--accent-color, #2086b8);
          color: #fff;
        }
        .content-card {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        .content-card h4 {
          color: var(--heading-color, #011e2c);
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f0f0f0;
        }
        .timeline-item {
          padding-left: 20px;
          border-left: 2px solid var(--accent-color, #2086b8);
        }
        .contact-info h5,
        .social-links h5,
        .academic-links h5 {
          font-size: 14px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }
      `}</style>
    </>
  )
}
