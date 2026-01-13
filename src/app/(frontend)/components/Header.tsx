import Link from 'next/link'
import { getSettings, getNavigation } from '@/lib/settings'
import CMSNavigation from './CMSNavigation'

export default async function Header() {
  const [settings, navigation] = await Promise.all([
    getSettings(),
    getNavigation(),
  ])
  
  // Extract logo URL if it exists
  const logoUrl = settings?.logo && typeof settings.logo === 'object' && 'url' in settings.logo 
    ? settings.logo.url as string 
    : null

  // Get header style settings
  const headerStyle = (settings as any)?.headerStyle || {}
  const headerType = headerStyle?.headerType || 'sticky'
  const headerBackground = headerStyle?.headerBackground || 'white'
  const headerShadow = headerStyle?.headerShadow !== false

  // Build header classes based on settings
  const headerClasses = [
    'header',
    'd-flex',
    'align-items-center',
    headerType === 'sticky' ? 'sticky-top' : '',
    headerType === 'fixed-transparent' ? 'fixed-top header-transparent' : '',
    headerBackground === 'dark' ? 'header-dark' : '',
    headerBackground === 'primary' ? 'header-primary' : '',
    headerBackground === 'transparent' ? 'header-transparent' : '',
    !headerShadow ? 'no-shadow' : '',
  ].filter(Boolean).join(' ')

  // Get CTA button settings
  const ctaButton = (navigation as any)?.ctaButton || { isVisible: true, text: 'Enroll Now', internalLink: '/enroll' }
  const ctaLink = ctaButton.linkType === 'external' 
    ? ctaButton.externalUrl 
    : (ctaButton.internalLink || '/enroll')
  
  return (
    <header id="header" className={headerClasses}>
      <div className="container-fluid container-xl position-relative d-flex align-items-center">
        <Link href="/" className="logo d-flex align-items-center me-auto">
          {settings?.useLogo && logoUrl ? (
            <img 
              src={logoUrl} 
              alt={settings?.siteName || 'Learner'} 
              className="site-logo"
              style={{ 
                height: '60px', 
                maxHeight: '60px',
                width: 'auto', 
                objectFit: 'contain',
                display: 'block'
              }}
            />
          ) : (
            <h1 className="sitename">{settings?.siteName || 'Learner'}</h1>
          )}
        </Link>

        <CMSNavigation navigation={navigation as any} homePage={(settings as any)?.homePage || 'home'} />

        {ctaButton.isVisible !== false && (
          <Link 
            className="btn-getstarted" 
            href={ctaLink}
            target={ctaButton.openInNewTab ? '_blank' : undefined}
            rel={ctaButton.openInNewTab ? 'noopener noreferrer' : undefined}
          >
            {ctaButton.text || 'Enroll Now'}
          </Link>
        )}
      </div>
    </header>
  )
}
