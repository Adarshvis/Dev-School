import { getPayload } from 'payload'
import config from '../payload.config'
import { unstable_cache } from 'next/cache'

// Initialize payload instance with singleton pattern
let payloadInstance: any = null
let payloadPromise: Promise<any> | null = null

async function getPayloadInstance() {
  if (payloadInstance) {
    return payloadInstance
  }
  
  // Use promise to prevent multiple simultaneous initializations
  if (!payloadPromise) {
    payloadPromise = getPayload({ config }).then((instance) => {
      payloadInstance = instance
      return instance
    })
  }
  
  return payloadPromise
}

// Utility functions for fetching data
export async function getFeaturedCourses() {
  try {
    const payload = await getPayloadInstance()
    const courses = await payload.find({
      collection: 'courses-page',
      where: {
        status: { equals: 'active' }
      },
      limit: 6,
      overrideAccess: true,
    })
    return courses.docs
  } catch (error) {
    console.error('Error fetching featured courses:', error)
    return []
  }
}

export async function getFeaturedPeople() {
  try {
    const payload = await getPayloadInstance()
    const people = await payload.find({
      collection: 'people-page',
      where: {
        status: { equals: 'active' }
      },
      limit: 4,
      overrideAccess: true,
    })
    return people.docs
  } catch (error) {
    console.error('Error fetching featured people:', error)
    return []
  }
}

export async function getFeaturedBlogPosts() {
  try {
    const payload = await getPayloadInstance()
    const posts = await payload.find({
      collection: 'blog-posts',
      where: {
        status: { equals: 'published' }
      },
      limit: 3,
      overrideAccess: true,
    })
    return posts.docs
  } catch (error) {
    console.error('Error fetching featured blog posts:', error)
    return []
  }
}

export async function getFeaturedTestimonials() {
  // Testimonials would come from a dedicated collection if needed
  // For now return empty array
  return []
}

// Internal function for fetching page content (used by cached version)
async function _getPageContent(pageName: string, section?: string) {
  try {
    const payload = await getPayloadInstance()
    
    // Map page names to their actual collection slugs from payload.config.ts
    const collectionMap: { [key: string]: string } = {
      'homepage': 'home-page',
      'home': 'home-page',
      'about': 'about-page', 
      'courses': 'courses-page',
      'people': 'people-page',
      'blog': 'blog-page',
      'blog-details': 'blog-details-page',
      'contact': 'contact-page',
      'enroll': 'apply-now'
    }
    
    const collectionSlug = collectionMap[pageName] || pageName
    
    const whereClause: any = { 
      status: { equals: 'active' }
    }
    
    if (section) {
      whereClause.sectionType = { equals: section }
    }

    const content = await payload.find({
      collection: collectionSlug,
      where: whereClause,
      sort: 'order', // Sort by order field for proper section sequencing
      overrideAccess: true,
      depth: 4, // Deep enough for nested blocks (tab → row → image → media)
    })
    
    if (section && content.docs?.length > 0) {
      return content.docs[0]
    }
    
    return content.docs || []
  } catch (error) {
    console.error(`Error fetching page content for ${pageName}:`, error instanceof Error ? error.message : 'Unknown error')
    return section ? null : []
  }
}

// Cached version for production - revalidates every 60 seconds
const getCachedPageContent = (pageName: string, section?: string) => {
  const cacheKey = section ? `page-${pageName}-${section}` : `page-${pageName}`
  return unstable_cache(
    async () => _getPageContent(pageName, section),
    [cacheKey],
    { revalidate: 60, tags: ['page-content', `page-${pageName}`] }
  )()
}

export async function getPageContent(pageName: string, section?: string) {
  // Use cache in production, direct query in development
  if (process.env.NODE_ENV === 'production') {
    return getCachedPageContent(pageName, section)
  }
  return _getPageContent(pageName, section)
}

export async function getMediaUrl(mediaId: any) {
  if (!mediaId) return null
  
  try {
    if (typeof mediaId === 'object' && mediaId.url) {
      return mediaId.url
    }
    
    const payload = await getPayloadInstance()
    const media = await payload.findByID({
      collection: 'media',
      id: typeof mediaId === 'string' ? mediaId : mediaId.id,
      overrideAccess: true,
    })
    
    return media?.url || null
  } catch (error) {
    console.error('Error fetching media URL:', error)
    return null
  }
}

export async function getSettings() {
  try {
    const payload = await getPayloadInstance()
    const settings = await payload.findGlobal({
      slug: 'settings',
      overrideAccess: true,
    })
    return settings
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
}

// NOTE: pricing-plans, events, and contact-info collections do not exist.
// These functions are kept as stubs that return empty arrays.
export async function getPricingPlans() {
  return []
}

export async function getUpcomingEvents() {
  return []
}

export async function getContactInfo() {
  return []
}

export async function getCollection(collectionSlug: string, options?: any) {
  try {
    const payload = await getPayloadInstance()
    
    // Handle specific collection logic
    let whereClause: any = {}
    
    // Map collection slugs to actual collection names
    const collectionMapping: { [key: string]: string } = {
      'home-page': 'home-page',
      'about-page': 'about-page', 
      'blog-page': 'blog-page',
      'blog-details-page': 'blog-details-page',
      'courses-page': 'courses-page',
      'people-page': 'people-page',
      'contact-page': 'contact-page',
      'enroll-page': 'apply-now'
    }

    const actualCollection = collectionMapping[collectionSlug] || collectionSlug
    whereClause = options?.where || {}

    const result = await payload.find({
      collection: actualCollection,
      where: whereClause,
      sort: options?.sort || '-updatedAt',
      limit: options?.limit || 100,
      overrideAccess: true,
      ...options
    })
    
    return result.docs
  } catch (error) {
    console.error(`Error fetching ${collectionSlug}:`, error)
    return []
  }
}
