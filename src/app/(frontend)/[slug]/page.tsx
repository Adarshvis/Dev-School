import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Metadata } from 'next'
import DynamicPageRenderer from '@/app/(frontend)/components/DynamicPageRenderer'

interface PageProps {
  params: Promise<{ slug: string }>
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
    const payload = await getPayload({ config })
    const pages = await payload.find({
      collection: 'pages' as any,
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      limit: 1,
    })
    
    const page = pages.docs[0] as any
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
  
  // Skip reserved routes that have their own pages
  const reservedRoutes = [
    'about', 'courses', 'people', 'news', 'blog', 'contact', 
    'enroll', 'events', 'research-domains', 'work-with-us',
    'course-details', 'people-profile', 'blog-details', 'pricing',
    'terms', 'privacy', '404'
  ]
  
  if (reservedRoutes.includes(slug)) {
    notFound()
  }
  
  try {
    const payload = await getPayload({ config })
    const pages = await payload.find({
      collection: 'pages' as any,
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      depth: 3,
      limit: 1,
    })
    
    const page = pages.docs[0] as any
    
    if (!page) {
      notFound()
    }
    
    return <DynamicPageRenderer page={page} />
  } catch (error) {
    console.error('Error fetching page:', error)
    notFound()
  }
}
