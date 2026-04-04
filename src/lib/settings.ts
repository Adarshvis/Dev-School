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

// Cache settings for 1 minute in production as a fallback.
// Real-time invalidation is triggered from Payload global hooks.
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
  { revalidate: 60, tags: ['settings'] }
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

// Cache navigation for 1 minute in production as a fallback.
// Real-time invalidation is triggered from Payload global hooks.
const getCachedNavigation = unstable_cache(
  async () => {
    const navigation = await withPayloadRetry(async (payload) => payload.findGlobal({
      slug: 'navigation' as 'settings',
      depth: 1,
    }))
    return navigation
  },
  ['navigation'],
  { revalidate: 60, tags: ['navigation'] }
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
  const headerStyle = settings?.headerStyle || {}
  const buttonStyle = settings?.buttonStyle || {}
  const layoutSettings = settings?.layoutSettings || {}

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
  }
  const headingColor = theme?.primaryColor || '#F0690F'
  const subheadingColor = theme?.secondaryColor || '#1C2E40'
  cssVars.push(`  --heading-color: ${headingColor};`)
  cssVars.push(`  --subheading-color: ${subheadingColor};`)

  const bodyTextColor = theme?.textColor || '#5F7287'
  if (bodyTextColor) {
    cssVars.push(`  --default-color: ${bodyTextColor};`)
  }
  if (theme?.backgroundColor) {
    cssVars.push(`  --background-color: ${theme.backgroundColor};`)
  }
  const surfaceColor = theme?.surfaceColor || '#ffffff'
  cssVars.push(`  --surface-color: ${surfaceColor};`)
  const darkColor = theme?.darkModeColor || theme?.secondaryColor || '#0F1A24'
  cssVars.push(`  --dark-color: ${darkColor};`)
  cssVars.push(`  --stats-block-bg: ${darkColor};`)
  cssVars.push(`  --dark-mode-color: ${darkColor};`)
  if (theme?.primaryForegroundColor) {
    cssVars.push(`  --primary-foreground: ${theme.primaryForegroundColor};`)
    cssVars.push(`  --contrast-color: ${theme.primaryForegroundColor};`)
    cssVars.push(`  --on-primary: ${theme.primaryForegroundColor};`)
  }

  const buttonPrimaryBg = theme?.primaryColor || '#F0690F'
  const buttonPrimaryText = theme?.primaryForegroundColor || '#FFFFFF'
  const buttonPrimaryHover = theme?.secondaryColor || '#1C2E40'
  cssVars.push(`  --button-primary-bg: ${buttonPrimaryBg};`)
  cssVars.push(`  --button-primary-text: ${buttonPrimaryText};`)
  cssVars.push(`  --button-primary-hover-bg: ${buttonPrimaryHover};`)
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
  if (typography?.headingFont) {
    cssVars.push(`  --heading-font: "${typography.headingFont}", sans-serif;`)
  }
  if (typography?.subHeadingFont) {
    cssVars.push(`  --subheading-font: "${typography.subHeadingFont}", sans-serif;`)
  }
  if (typography?.bodyFont) {
    cssVars.push(`  --default-font: "${typography.bodyFont}", sans-serif;`)
  }
  if (typography?.baseFontSize) {
    cssVars.push(`  --base-font-size: ${typography.baseFontSize};`)
  }

  const sectionSpacingMap: Record<string, string> = {
    compact: '64px',
    normal: '84px',
    spacious: '108px',
  }
  cssVars.push(`  --section-spacing-y: ${sectionSpacingMap[layoutSettings?.sectionSpacing] || sectionSpacingMap.normal};`)

  const containerWidthMap: Record<string, string> = {
    narrow: '960px',
    default: '1140px',
    wide: '1320px',
    full: '100%',
  }
  cssVars.push(`  --container-max-width: ${containerWidthMap[layoutSettings?.containerWidth] || containerWidthMap.default};`)

  const radiusMap: Record<string, string> = {
    square: '0px',
    slight: '8px',
    rounded: '12px',
    pill: '999px',
  }
  cssVars.push(`  --button-radius: ${radiusMap[buttonStyle?.borderRadius] || radiusMap.rounded};`)

  const buttonSizeMap: Record<string, { py: string; px: string; fs: string }> = {
    small: { py: '0.45rem', px: '1rem', fs: '0.9rem' },
    medium: { py: '0.65rem', px: '1.4rem', fs: '0.98rem' },
    large: { py: '0.8rem', px: '1.8rem', fs: '1.05rem' },
  }
  const buttonSize = buttonSizeMap[buttonStyle?.buttonSize] || buttonSizeMap.medium
  cssVars.push(`  --button-padding-y: ${buttonSize.py};`)
  cssVars.push(`  --button-padding-x: ${buttonSize.px};`)
  cssVars.push(`  --button-font-size: ${buttonSize.fs};`)

  const headerBackground = headerStyle?.headerBackground || 'white'
  const defaultHeaderText = theme?.secondaryColor || '#1c2e40'
  const headerColors: Record<string, { bg: string; text: string; border: string }> = {
    white: {
      bg: '#ffffff',
      text: defaultHeaderText,
      border: 'color-mix(in srgb, var(--default-color), transparent 84%)',
    },
    light: {
      bg: 'color-mix(in srgb, var(--background-color), #fff 24%)',
      text: defaultHeaderText,
      border: 'color-mix(in srgb, var(--default-color), transparent 84%)',
    },
    dark: {
      bg: theme?.darkModeColor || '#0f1a24',
      text: theme?.primaryForegroundColor || '#ffffff',
      border: 'transparent',
    },
    primary: {
      bg: theme?.primaryColor || '#f0690f',
      text: theme?.primaryForegroundColor || '#ffffff',
      border: 'transparent',
    },
    transparent: {
      bg: 'transparent',
      text: defaultHeaderText,
      border: 'transparent',
    },
  }
  const headerTheme = headerColors[headerBackground] || headerColors.white
  cssVars.push(`  --header-bg: ${headerTheme.bg};`)
  cssVars.push(`  --header-text: ${headerTheme.text};`)
  cssVars.push(`  --header-border-color: ${headerTheme.border};`)
  cssVars.push(`  --header-shadow: ${headerStyle?.headerShadow === false ? 'none' : '0 6px 18px rgba(14, 28, 52, 0.07)'};`)

  if (headerStyle?.headerType === 'fixed-transparent' || headerBackground === 'transparent') {
    cssVars.push('  --header-bg: transparent;')
    cssVars.push('  --header-border-color: transparent;')
    cssVars.push('  --header-shadow: none;')
  }
  
  // Only return CSS if there are actual customizations
  if (cssVars.length === 0) {
    return ''
  }
  
  return `:root {\n${cssVars.join('\n')}\n}\n`
}
