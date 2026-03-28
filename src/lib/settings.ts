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

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const raw = String(hex || '').trim().replace('#', '')
  const normalized = raw.length === 3
    ? raw.split('').map((c) => `${c}${c}`).join('')
    : raw

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null

  const value = parseInt(normalized, 16)
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}

function mixWithWhite(rgb: { r: number; g: number; b: number }, amount: number) {
  const t = Math.max(0, Math.min(1, amount))
  return {
    r: Math.round(rgb.r * (1 - t) + 255 * t),
    g: Math.round(rgb.g * (1 - t) + 255 * t),
    b: Math.round(rgb.b * (1 - t) + 255 * t),
  }
}

// Helper to generate CSS variables from theme settings
// Only generates CSS if user has explicitly set custom theme values
export function generateThemeCSS(settings: any) {
  const gradientConfigured = settings?.theme?.enableSoftGradientBackground !== undefined

  // Don't generate any CSS if theme settings haven't been configured
  // This preserves the original template styling as default
  if (!settings?.theme?.primaryColor && !settings?.typography?.headingFont && !gradientConfigured) {
    return ''
  }
  
  const { theme, typography } = settings
  
  const cssVars: string[] = []

  // Theme colors come directly from admin values.
  if (theme?.primaryColor) {
    cssVars.push(`  --nav-color: ${theme.primaryColor};`)
    cssVars.push(`  --nav-dropdown-hover-color: ${theme.primaryColor};`)
    cssVars.push(`  --primary-color: ${theme.primaryColor};`)
  }
  if (theme?.secondaryColor) {
    cssVars.push(`  --nav-hover-color: ${theme.secondaryColor};`)
    cssVars.push(`  --secondary-color: ${theme.secondaryColor};`)
  }
  if (theme?.accentColor) {
    cssVars.push(`  --accent-color: ${theme.accentColor};`)
    cssVars.push(`  --heading-color: ${theme.accentColor};`)
  }
  const bodyTextColor = theme?.secondaryColor || theme?.textColor
  if (bodyTextColor) {
    cssVars.push(`  --default-color: ${bodyTextColor};`)
  }
  if (theme?.backgroundColor) {
    cssVars.push(`  --background-color: ${theme.backgroundColor};`)
  }
  if (theme?.darkModeColor) {
    cssVars.push(`  --dark-color: ${theme.darkModeColor};`)
    cssVars.push(`  --stats-block-bg: ${theme.darkModeColor};`)
    cssVars.push(`  --dark-mode-color: ${theme.darkModeColor};`)
  }
  if (theme?.primaryForegroundColor) {
    cssVars.push(`  --primary-foreground: ${theme.primaryForegroundColor};`)
    cssVars.push(`  --contrast-color: ${theme.primaryForegroundColor};`)
    cssVars.push(`  --on-primary: ${theme.primaryForegroundColor};`)
  }
  const secondaryForeground = theme?.secondaryForegroundColor || theme?.primaryForegroundColor
  if (secondaryForeground) {
    cssVars.push(`  --secondary-foreground: ${secondaryForeground};`)
    cssVars.push(`  --on-secondary: ${secondaryForeground};`)
  }

  // Soft global gradient derived from theme variables (no fixed palette hardcoding)
  const gradientEnabled = theme?.enableSoftGradientBackground !== false
  const gradientIntensity = theme?.softGradientIntensity || 'medium'

  if (!gradientEnabled) {
    cssVars.push('  --page-soft-gradient: none;')
  } else {
    const intensityMap: Record<string, { accentA: number; navA: number; baseLift: number }> = {
      low: { accentA: 0.04, navA: 0.03, baseLift: 0.16 },
      medium: { accentA: 0.06, navA: 0.05, baseLift: 0.12 },
      high: { accentA: 0.08, navA: 0.07, baseLift: 0.09 },
    }

    const mix = intensityMap[gradientIntensity] || intensityMap.medium
    const accent = hexToRgb(theme?.accentColor || '#ff5349') || { r: 255, g: 83, b: 73 }
    const nav = hexToRgb(theme?.primaryColor || '#00cec9') || { r: 0, g: 206, b: 201 }
    const bg = hexToRgb(theme?.backgroundColor || '#fff9e6') || { r: 255, g: 249, b: 230 }

    const bgTop = mixWithWhite(bg, mix.baseLift)
    const bgBottom = mixWithWhite(bg, Math.max(mix.baseLift - 0.05, 0.04))

    cssVars.push(
      `  --page-soft-gradient: radial-gradient(1000px 560px at 14% 10%, rgba(${accent.r}, ${accent.g}, ${accent.b}, ${mix.accentA}) 0%, rgba(${accent.r}, ${accent.g}, ${accent.b}, 0) 70%), radial-gradient(920px 540px at 86% 14%, rgba(${nav.r}, ${nav.g}, ${nav.b}, ${mix.navA}) 0%, rgba(${nav.r}, ${nav.g}, ${nav.b}, 0) 72%), linear-gradient(180deg, rgb(${bgTop.r}, ${bgTop.g}, ${bgTop.b}) 0%, rgb(${bgBottom.r}, ${bgBottom.g}, ${bgBottom.b}) 100%);`,
    )
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
