import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

// Cache settings for 60 seconds in production
const getCachedSettings = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: 'settings',
      depth: 1, // Reduced depth for faster queries
    })
    return settings
  },
  ['settings'],
  { revalidate: 60 }
)

export async function getSettings() {
  try {
    // Use cache in production, direct query in development
    if (process.env.NODE_ENV === 'production') {
      return await getCachedSettings()
    }
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: 'settings',
      depth: 1,
    })
    return settings
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
}

// Cache navigation for 60 seconds in production
const getCachedNavigation = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const navigation = await payload.findGlobal({
      slug: 'navigation' as 'settings',
      depth: 1,
    })
    return navigation
  },
  ['navigation'],
  { revalidate: 60 }
)

export async function getNavigation() {
  try {
    if (process.env.NODE_ENV === 'production') {
      return await getCachedNavigation()
    }
    const payload = await getPayload({ config })
    const navigation = await payload.findGlobal({
      slug: 'navigation' as 'settings',
      depth: 1,
    })
    return navigation
  } catch (error) {
    console.error('Error fetching navigation:', error)
    return null
  }
}

export async function getPageBySlug(slug: string) {
  try {
    const payload = await getPayload({ config })
    const pages = await payload.find({
      collection: 'pages' as 'media',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      depth: 2,
      limit: 1,
    })
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
  if (theme?.primaryColor && theme.primaryColor !== '#04415f') {
    cssVars.push(`  --nav-color: ${theme.primaryColor};`)
    cssVars.push(`  --nav-dropdown-hover-color: ${theme.primaryColor};`)
  }
  if (theme?.secondaryColor && theme.secondaryColor !== '#2086b8') {
    cssVars.push(`  --nav-hover-color: ${theme.secondaryColor};`)
  }
  if (theme?.accentColor && theme.accentColor !== '#011e2c') {
    cssVars.push(`  --accent-color: ${theme.accentColor};`)
    cssVars.push(`  --heading-color: ${theme.accentColor};`)
  }
  if (theme?.textColor && theme.textColor !== '#010608') {
    cssVars.push(`  --default-color: ${theme.textColor};`)
  }
  if (theme?.backgroundColor && theme.backgroundColor !== '#f1f5f7') {
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
