import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Metadata } from 'next'
import DynamicPageRenderer from '@/app/(frontend)/components/DynamicPageRenderer'

// Use ISR - revalidate every 60 seconds for better performance
export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function getSlugCandidates(rawSlug: string): string[] {
  const decoded = decodeURIComponent(String(rawSlug || '')).trim()
  const lower = decoded.toLowerCase()
  const slugified = slugify(decoded)

  return Array.from(new Set([decoded, lower, slugified].filter(Boolean)))
}

function normalizeStoredSlug(value: string): string {
  const raw = String(value || '').trim().replace(/^\/+/, '')
  return slugify(raw)
}

async function findPublishedPageBySlug(rawSlug: string, depth: number = 1) {
  const payload = await getPayload({ config })
  const slugCandidates = getSlugCandidates(rawSlug)
  const normalizedCandidates = slugCandidates.map((candidate) => normalizeStoredSlug(candidate))

  const pages = await payload.find({
    collection: 'pages' as any,
    where: {
      status: { equals: 'published' },
    },
    depth,
    limit: 500,
  })

  const docs = pages.docs || []
  const page = docs.find((doc: any) => {
    const docSlugRaw = String(doc?.slug || '')
    const docSlug = normalizeStoredSlug(docSlugRaw)
    if (!docSlug) return false

    if (slugCandidates.includes(docSlugRaw)) return true
    if (slugCandidates.includes(docSlug)) return true
    if (normalizedCandidates.includes(docSlug)) return true

    return false
  })

  return page || null
}

// Generate static params for all published pages
export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config })
    const pages = await payload.find({
      collection: 'pages' as any,
      where: {
        status: { equals: 'published' },
      },
      limit: 100,
    })
    
    return pages.docs.map((page: any) => ({
      slug: page.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const page = await findPublishedPageBySlug(slug, 1) as any
    if (!page) return {}
    
    return {
      title: page.metaTitle || page.title,
      description: page.metaDescription || `${page.title} - Learn more about our services and offerings.`,
      openGraph: page.metaImage ? {
        images: [typeof page.metaImage === 'object' ? page.metaImage.url : page.metaImage],
      } : undefined,
      robots: page.noIndex ? { index: false, follow: false } : undefined,
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {}
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const normalizedSlug = slugify(String(slug || ''))
  
  // Skip reserved routes that have their own pages
  const reservedRoutes = [
    'about', 'courses', 'people', 'news', 'blog', 'contact', 
    'enroll', 'events', 'research-domains', 'work-with-us',
    'course-details', 'people-profile', 'blog-details', 'pricing',
    'terms', 'privacy', '404'
  ]
  
  if (reservedRoutes.includes(normalizedSlug)) {
    notFound()
  }

  let page: any = null

  try {
    page = await findPublishedPageBySlug(slug, 3)
  } catch (error) {
    console.error('Error fetching page:', error)
    notFound()
  }

  if (!page) {
    notFound()
  }

  return <DynamicPageRenderer page={page} />
}
