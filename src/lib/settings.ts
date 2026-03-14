import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

let payloadInstance: any = null
let payloadInitPromise: Promise<any> | null = null

async function getPayloadInstance() {
  // In development, prefer fresh instances to avoid stale/expired Mongo sessions during HMR.
  if (process.env.NODE_ENV !== 'production') {
    return getPayload({ config })
  }

  if (payloadInstance) return payloadInstance

  if (!payloadInitPromise) {
    payloadInitPromise = getPayload({ config }).then((instance) => {
      payloadInstance = instance
      return instance
    })
  }

  return payloadInitPromise
}

function isMongoNotConnectedError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error)
  return msg.includes('MongoNotConnectedError') || msg.includes('Client must be connected')
}

function isMongoExpiredSessionError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error)
  return msg.includes('MongoExpiredSessionError') || msg.includes('session that has ended')
}

async function withPayloadRetry<T>(operation: (payload: any) => Promise<T>): Promise<T> {
  try {
    const payload = await getPayloadInstance()
    return await operation(payload)
  } catch (error) {
    if (isMongoNotConnectedError(error) || isMongoExpiredSessionError(error)) {
      // Clear stale instance and retry once.
      payloadInstance = null
      payloadInitPromise = null
      const payload = await getPayloadInstance()
      return await operation(payload)
    }
    throw error
  }
}

// Cache settings for 5 minutes in production (300 seconds)
const getCachedSettings = unstable_cache(
  async () => {
    try {
      const settings = await withPayloadRetry(async (payload) => payload.findGlobal({
        slug: 'settings',
        depth: 1, // Reduced depth for faster queries
      }))
      return settings
    } catch (error) {
      console.error('Error in getCachedSettings:', error)
      throw error
    }
  },
  ['settings'],
  { revalidate: 300, tags: ['settings'] }
)

export async function getSettings() {
  try {
    // Use cache in production, direct query in development
    if (process.env.NODE_ENV === 'production') {
      return await getCachedSettings()
    }
    try {
      const settings = await withPayloadRetry(async (payload) => payload.findGlobal({
        slug: 'settings',
        depth: 1,
      }))
      return settings
    } catch (error) {
      console.error('Error calling getPayload or findGlobal in getSettings:', error)
      throw error
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
}

// Cache navigation for 5 minutes in production (300 seconds)
const getCachedNavigation = unstable_cache(
  async () => {
    const navigation = await withPayloadRetry(async (payload) => payload.findGlobal({
      slug: 'navigation' as 'settings',
      depth: 1,
    }))
    return navigation
  },
  ['navigation'],
  { revalidate: 300, tags: ['navigation'] }
)

export async function getNavigation() {
  try {
    if (process.env.NODE_ENV === 'production') {
      return await getCachedNavigation()
    }
    const navigation = await withPayloadRetry(async (payload) => payload.findGlobal({
      slug: 'navigation' as 'settings',
      depth: 1,
    }))
    return navigation
  } catch (error) {
    console.error('Error fetching navigation:', error)
    return null
  }
}

export async function getPageBySlug(slug: string) {
  try {
    const pages = await withPayloadRetry(async (payload) => payload.find({
      collection: 'pages' as 'media',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      depth: 2,
      limit: 1,
    }))
    return pages.docs[0] || null
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}

// Helper to generate CSS variables from theme settings
// Only generates CSS if user has explicitly set custom theme values
export function generateThemeCSS(settings: any) {
  // Don't generate any CSS if theme settings haven't been configured
  // This preserves the original template styling as default
  if (!settings?.theme?.primaryColor && !settings?.typography?.headingFont) {
    return ''
  }
  
  const { theme, typography } = settings
  
  const cssVars: string[] = []
  
  // Only add colors if they differ from defaults (user has customized them)
  // Default values match the template's main.css
  if (theme?.primaryColor && theme.primaryColor !== '#00cec9') {
    cssVars.push(`  --nav-color: ${theme.primaryColor};`)
    cssVars.push(`  --nav-dropdown-hover-color: ${theme.primaryColor};`)
  }
  if (theme?.secondaryColor && theme.secondaryColor !== '#ff5349') {
    cssVars.push(`  --nav-hover-color: ${theme.secondaryColor};`)
  }
  if (theme?.accentColor && theme.accentColor !== '#ff5349') {
    cssVars.push(`  --accent-color: ${theme.accentColor};`)
    cssVars.push(`  --heading-color: ${theme.accentColor};`)
  }
  if (theme?.textColor && theme.textColor !== '#2d3436') {
    cssVars.push(`  --default-color: ${theme.textColor};`)
  }
  if (theme?.backgroundColor && theme.backgroundColor !== '#fff9e6') {
    cssVars.push(`  --background-color: ${theme.backgroundColor};`)
  }
  
  // Typography - only if changed from defaults
  if (typography?.headingFont && typography.headingFont !== 'Raleway') {
    cssVars.push(`  --heading-font: "${typography.headingFont}", sans-serif;`)
  }
  if (typography?.bodyFont && typography.bodyFont !== 'Roboto') {
    cssVars.push(`  --default-font: "${typography.bodyFont}", sans-serif;`)
  }
  
  // Only return CSS if there are actual customizations
  if (cssVars.length === 0) {
    return ''
  }
  
  return `:root {\n${cssVars.join('\n')}\n}\n`
}
