import * as React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import PublicationsClient from './PublicationsClient.tsx'

export default async function CMSPublicationsPage() {
  try {
    const payload = await getPayload({ config })
    
    // Fetch publications with reasonable limit (pagination handled client-side)
    const publicationsData = await payload.find({
      collection: 'publications' as any,
      where: {
        status: { equals: 'published' }
      },
      limit: 200, // Reasonable limit - most labs won't have more
      sort: '-year', // Default sort by year descending
      depth: 1, // Reduce depth for better performance
    })

    const publications = publicationsData.docs || []
    
    // Extract unique values for filters (dynamic from data)
    const uniqueYears = [...new Set(publications.map((p: any) => p.year))].sort((a: any, b: any) => b - a)
    const uniqueTypes = [...new Set(publications.map((p: any) => p.type))]
    const uniqueAuthors = [...new Set(publications.flatMap((p: any) => 
      p.authors?.filter((a: any) => a.isLabMember).map((a: any) => a.name) || []
    ))].sort()
    const uniqueKeywords = [...new Set(publications.flatMap((p: any) => 
      p.keywords?.map((k: any) => k.keyword) || []
    ))].sort()

    return (
      <>
        {/* Page Title */}
        <div className="page-title light-background">
          <div className="container d-lg-flex justify-content-between align-items-center">
            <h1 className="mb-2 mb-lg-0">Publications</h1>
            <nav className="breadcrumbs">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li className="current">Publications</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Publications Section */}
        <section id="publications" className="publications section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <PublicationsClient 
              publications={publications}
              dynamicFilters={{
                years: uniqueYears,
                types: uniqueTypes,
                authors: uniqueAuthors,
                keywords: uniqueKeywords,
              }}
            />
          </div>
        </section>
      </>
    )
  } catch (error) {
    console.error('Error loading publications page:', error)
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Publications</h2>
          <p>Error loading publications. Please check the admin panel.</p>
          <Link href="/admin" className="btn btn-primary">Go to Admin Panel</Link>
        </div>
      </div>
    )
  }
}
