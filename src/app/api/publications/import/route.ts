import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// API endpoint to import publications from external sources
// POST /api/publications/import
// Body: { source: 'google-scholar' | 'orcid' | 'crossref' | 'semantic-scholar', authorId?: string, query?: string }

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    
    const { source, authorId, query, apiKey } = body

    if (!source) {
      return NextResponse.json({ error: 'Source is required' }, { status: 400 })
    }

    let publications: any[] = []

    switch (source) {
      case 'google-scholar':
        publications = await importFromGoogleScholar(authorId, apiKey)
        break
      case 'orcid':
        publications = await importFromOrcid(authorId)
        break
      case 'crossref':
        publications = await importFromCrossRef(query)
        break
      case 'semantic-scholar':
        publications = await importFromSemanticScholar(authorId)
        break
      default:
        return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
    }

    // Import publications to database
    const results = {
      imported: 0,
      skipped: 0,
      errors: 0,
      details: [] as any[],
    }

    for (const pub of publications) {
      try {
        // Check if publication already exists (by externalId or DOI)
        const existing = await payload.find({
          collection: 'publications' as any,
          where: {
            or: [
              { externalId: { equals: pub.externalId } },
              ...(pub.doi ? [{ doi: { equals: pub.doi } }] : []),
            ],
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          results.skipped++
          results.details.push({ title: pub.title, status: 'skipped', reason: 'Already exists' })
          continue
        }

        // Create new publication
        await payload.create({
          collection: 'publications' as any,
          data: {
            title: pub.title,
            publisher: pub.publisher || 'Unknown',
            authors: pub.authors?.map((name: string) => ({ name, isLabMember: false })) || [],
            keywords: pub.keywords?.map((keyword: string) => ({ keyword })) || [],
            year: pub.year || new Date().getFullYear(),
            type: pub.type || 'journal',
            abstract: pub.abstract,
            doi: pub.doi,
            link: pub.link,
            citationCount: pub.citationCount || 0,
            importSource: source,
            externalId: pub.externalId,
            status: 'published',
          },
        })

        results.imported++
        results.details.push({ title: pub.title, status: 'imported' })
      } catch (error: any) {
        results.errors++
        results.details.push({ title: pub.title, status: 'error', reason: error.message })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Imported ${results.imported} publications, skipped ${results.skipped}, errors: ${results.errors}`,
      results,
    })

  } catch (error: any) {
    console.error('Import error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Google Scholar import via SerpAPI
async function importFromGoogleScholar(authorId: string, apiKey: string): Promise<any[]> {
  if (!authorId || !apiKey) {
    throw new Error('Author ID and SerpAPI key are required for Google Scholar import')
  }

  const response = await fetch(
    `https://serpapi.com/search.json?engine=google_scholar_author&author_id=${authorId}&api_key=${apiKey}&num=100`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch from Google Scholar')
  }

  const data = await response.json()
  const articles = data.articles || []

  return articles.map((article: any) => ({
    title: article.title,
    publisher: article.publication || 'Unknown',
    authors: article.authors?.split(', ') || [],
    year: parseInt(article.year) || new Date().getFullYear(),
    type: 'journal',
    link: article.link,
    citationCount: article.cited_by?.value || 0,
    externalId: `gs-${article.citation_id}`,
  }))
}

// ORCID import (free API)
async function importFromOrcid(orcidId: string): Promise<any[]> {
  if (!orcidId) {
    throw new Error('ORCID ID is required')
  }

  const response = await fetch(
    `https://pub.orcid.org/v3.0/${orcidId}/works`,
    {
      headers: {
        'Accept': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch from ORCID')
  }

  const data = await response.json()
  const works = data.group || []

  return works.map((work: any) => {
    const summary = work['work-summary']?.[0] || {}
    const title = summary.title?.title?.value || 'Untitled'
    const year = summary['publication-date']?.year?.value || new Date().getFullYear()
    const doi = summary['external-ids']?.['external-id']?.find((id: any) => id['external-id-type'] === 'doi')?.['external-id-value']
    
    return {
      title,
      publisher: summary['journal-title']?.value || 'Unknown',
      year: parseInt(year),
      type: mapOrcidWorkType(summary.type),
      doi,
      link: doi ? `https://doi.org/${doi}` : summary.url?.value,
      externalId: `orcid-${summary['put-code']}`,
    }
  })
}

// CrossRef import (free API)
async function importFromCrossRef(query: string): Promise<any[]> {
  if (!query) {
    throw new Error('Search query is required for CrossRef')
  }

  const response = await fetch(
    `https://api.crossref.org/works?query.author=${encodeURIComponent(query)}&rows=100`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch from CrossRef')
  }

  const data = await response.json()
  const items = data.message?.items || []

  return items.map((item: any) => ({
    title: item.title?.[0] || 'Untitled',
    publisher: item['container-title']?.[0] || item.publisher || 'Unknown',
    authors: item.author?.map((a: any) => `${a.given || ''} ${a.family || ''}`.trim()) || [],
    year: item.published?.['date-parts']?.[0]?.[0] || new Date().getFullYear(),
    type: mapCrossRefType(item.type),
    doi: item.DOI,
    link: `https://doi.org/${item.DOI}`,
    abstract: item.abstract,
    citationCount: item['is-referenced-by-count'] || 0,
    externalId: `crossref-${item.DOI}`,
  }))
}

// Semantic Scholar import (free API)
async function importFromSemanticScholar(authorId: string): Promise<any[]> {
  if (!authorId) {
    throw new Error('Author ID is required for Semantic Scholar')
  }

  const response = await fetch(
    `https://api.semanticscholar.org/graph/v1/author/${authorId}/papers?fields=title,venue,year,authors,abstract,externalIds,citationCount&limit=100`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch from Semantic Scholar')
  }

  const data = await response.json()
  const papers = data.data || []

  return papers.map((paper: any) => ({
    title: paper.title,
    publisher: paper.venue || 'Unknown',
    authors: paper.authors?.map((a: any) => a.name) || [],
    year: paper.year || new Date().getFullYear(),
    type: 'journal',
    doi: paper.externalIds?.DOI,
    link: paper.externalIds?.DOI ? `https://doi.org/${paper.externalIds.DOI}` : null,
    abstract: paper.abstract,
    citationCount: paper.citationCount || 0,
    externalId: `ss-${paper.paperId}`,
  }))
}

// Map ORCID work types to our types
function mapOrcidWorkType(type: string): string {
  const typeMap: Record<string, string> = {
    'journal-article': 'journal',
    'conference-paper': 'conference',
    'book-chapter': 'book-chapter',
    'report': 'technical-report',
    'dissertation': 'thesis',
  }
  return typeMap[type] || 'journal'
}

// Map CrossRef types to our types
function mapCrossRefType(type: string): string {
  const typeMap: Record<string, string> = {
    'journal-article': 'journal',
    'proceedings-article': 'conference',
    'book-chapter': 'book-chapter',
    'report': 'technical-report',
    'dissertation': 'thesis',
  }
  return typeMap[type] || 'journal'
}

// GET endpoint to check import status or fetch available sources
export async function GET() {
  return NextResponse.json({
    availableSources: [
      {
        id: 'google-scholar',
        name: 'Google Scholar',
        requiresApiKey: true,
        requiresAuthorId: true,
        description: 'Import via SerpAPI (requires paid API key)',
      },
      {
        id: 'orcid',
        name: 'ORCID',
        requiresApiKey: false,
        requiresAuthorId: true,
        description: 'Free API - requires ORCID ID (e.g., 0000-0002-1234-5678)',
      },
      {
        id: 'crossref',
        name: 'CrossRef',
        requiresApiKey: false,
        requiresAuthorId: false,
        description: 'Free API - search by author name',
      },
      {
        id: 'semantic-scholar',
        name: 'Semantic Scholar',
        requiresApiKey: false,
        requiresAuthorId: true,
        description: 'Free API - requires Semantic Scholar Author ID',
      },
    ],
  })
}
