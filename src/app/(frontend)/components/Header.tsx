import Link from 'next/link'
import { getSettings, getNavigation } from '@/lib/settings'
import CMSNavigation from './CMSNavigation'
import HeaderScrollWatcher from './HeaderScrollWatcher'

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
  const headerLayout = headerStyle?.headerLayout || 'default'
  const headerType = headerStyle?.headerType || 'sticky'
  const headerBackground = headerStyle?.headerBackground || 'white'
  const headerShadow = headerStyle?.headerShadow !== false
  const siteNameColor = (settings as any)?.siteNameColor || undefined
  const configuredLogoWidth = Number((settings as any)?.logoWidth)
  const logoWidth = configuredLogoWidth > 0 ? configuredLogoWidth : null
  const configuredLogoHeight = Number((settings as any)?.logoHeight)
  const logoHeight = configuredLogoHeight > 0 ? configuredLogoHeight : 52
  const siteNameFontSize = Number((settings as any)?.siteNameFontSize) > 0 ? Number((settings as any)?.siteNameFontSize) : 26

  // Build header classes based on settings
  const headerClasses = [
    'header',
    'd-flex',
    'align-items-center',
    headerLayout === 'centered' ? 'header-centered-layout' : '',
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

  const infoBar = (navigation as any)?.infoBar || {}
  const infoBarVisible = infoBar?.isVisible !== false
  const phone = String(infoBar?.phone || '').trim()
  const email = String(infoBar?.email || '').trim()
  const locationText = String(infoBar?.locationText || '').trim()
  const highlightText = String(infoBar?.highlightText || '').trim()
  const socialLinks = Array.isArray(infoBar?.socialLinks)
    ? infoBar.socialLinks.filter((item: any) => {
        if (!item || item.isVisible === false) return false
        const icon = String(item.icon || '').trim()
        const url = String(item.url || '').trim()
        return icon !== '' || url !== ''
      })
    : []
  const hasLeftInfo = phone !== '' || email !== ''
  const hasRightInfo = locationText !== '' || highlightText !== '' || socialLinks.length > 0
  const shouldShowInfoBar = infoBarVisible && (hasLeftInfo || hasRightInfo)

  const getTelHref = (value: string): string => `tel:${value.replace(/\s+/g, '')}`
  const getMailHref = (value: string): string => (value.startsWith('mailto:') ? value : `mailto:${value}`)
  const getSocialHref = (value: string): string => {
    const url = String(value || '').trim()
    if (url === '') return '#'
    if (/^https?:\/\//i.test(url) || /^mailto:/i.test(url) || /^tel:/i.test(url)) return url
    return `https://${url}`
  }
  
  return (
    <>
      {shouldShowInfoBar && (
        <div className="top-info-bar d-none d-md-block">
          <div className="container-fluid container-xl">
            <div className="top-info-bar-inner">
              <div className="top-info-left">
                {phone && (
                  <a href={getTelHref(phone)} className="top-info-link" aria-label={`Call ${phone}`}>
                    <i className="bi bi-telephone" aria-hidden="true" />
                    <span>{phone}</span>
                  </a>
                )}
                {email && (
                  <a href={getMailHref(email)} className="top-info-link" aria-label={`Email ${email}`}>
                    <i className="bi bi-envelope" aria-hidden="true" />
                    <span>{email}</span>
                  </a>
                )}
              </div>

              <div className="top-info-right">
                {locationText && <span className="top-info-location">{locationText}</span>}
                {locationText && highlightText && <span className="top-info-separator" aria-hidden="true">|</span>}
                {highlightText && <span className="top-info-highlight">{highlightText}</span>}

                {socialLinks.length > 0 && (
                  <div className="top-info-socials" aria-label="Social links">
                    {socialLinks.map((item: any, index: number) => {
                      const iconClass = String(item?.icon || '').trim()
                      const url = String(item?.url || '').trim()
                      const label = String(item?.label || '').trim() || 'Social link'

                      if (url) {
                        return (
                          <a
                            key={index}
                            href={getSocialHref(url)}
                            className="top-info-social-link"
                            target={item?.openInNewTab !== false ? '_blank' : undefined}
                            rel={item?.openInNewTab !== false ? 'noopener noreferrer' : undefined}
                            aria-label={label}
                          >
                            {iconClass ? <i className={`bi ${iconClass}`} aria-hidden="true" /> : <span>{label}</span>}
                          </a>
                        )
                      }

                      return (
                        <span key={index} className="top-info-social-link" aria-label={label}>
                          {iconClass ? <i className={`bi ${iconClass}`} aria-hidden="true" /> : <span>{label}</span>}
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <header id="header" className={`${headerClasses} header-v2`}>
        <div className="header-inner container-fluid container-xl position-relative d-flex align-items-center">
          <Link href="/" className="logo d-flex align-items-center me-auto">
            {settings?.useLogo && logoUrl ? (
              <>
                <img
                  src={logoUrl}
                  alt={settings?.siteName || 'Learner'}
                  className={`site-logo${headerLayout === 'centered' ? ' centered-logo' : ''}`}
                  style={{
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
                {settings?.siteName ? (
                  <h1 className="sitename mb-0" style={{ fontSize: `${siteNameFontSize}px`, fontWeight: 700, color: siteNameColor }}>
                    {settings.siteName}
                  </h1>
                ) : null}
              </>
            ) : (
              <h1 className="sitename" style={{ fontSize: `${siteNameFontSize}px`, fontWeight: 700, color: siteNameColor }}>
                {settings?.siteName || 'Learner'}
              </h1>
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
        {headerLayout === 'centered' && <HeaderScrollWatcher />}
      </header>
    </>
  )
}
