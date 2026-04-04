'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

interface MenuItem {
  id?: string
  label: string
  linkType: 'internal' | 'external' | 'anchor' | 'dropdown' | 'custom' | 'dynamic'
  internalLink?: string
  customLink?: string
  dynamicPageLink?: { slug: string } | string | null
  externalUrl?: string
  anchorLink?: string
  openInNewTab?: boolean
  isVisible?: boolean
  icon?: string
  highlight?: boolean
  children?: MenuItem[]
}

interface NavigationData {
  menuItems?: MenuItem[]
  ctaButton?: {
    isVisible?: boolean
    text?: string
    linkType?: 'internal' | 'external'
    internalLink?: string
    externalUrl?: string
    openInNewTab?: boolean
  }
}

interface CMSNavigationProps {
  navigation: NavigationData | null
  homePage?: string
}

function normalizePath(path: string): string {
  const trimmed = path.trim().toLowerCase()
  if (trimmed === '/') return '/'
  return trimmed.replace(/\/+$/, '')
}

function getItemIdentity(item: MenuItem): string | null {
  if (item.dynamicPageLink) {
    if (typeof item.dynamicPageLink === 'object') {
      const obj = item.dynamicPageLink as any
      if (obj.id) return `id:${String(obj.id)}`
      if (obj.slug) return `slug:${String(obj.slug).trim().toLowerCase()}`
    }
    if (typeof item.dynamicPageLink === 'string') {
      return `dyn:${item.dynamicPageLink.trim().toLowerCase()}`
    }
  }

  if (item.customLink) {
    return `path:${normalizePath(item.customLink)}`
  }

  if (item.internalLink) {
    return `path:${normalizePath(item.internalLink)}`
  }

  return null
}

export default function CMSNavigation({ navigation, homePage = 'home' }: CMSNavigationProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    document.body.classList.toggle('mobile-nav-active', !mobileMenuOpen)
  }

  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setOpenDropdown(null)
    document.body.classList.remove('mobile-nav-active')
  }

  // Get the link URL for a menu item
  const getMenuLink = (item: MenuItem): string => {
    if (item.linkType === 'external' && item.externalUrl) {
      return item.externalUrl
    }
    if (item.linkType === 'anchor' && item.anchorLink) {
      return item.anchorLink
    }
    if (item.linkType === 'dropdown') {
      return '#'
    }
    // Check for custom link (used by dynamic pages)
    if (item.linkType === 'custom' && item.customLink) {
      return item.customLink
    }
    // Check for dynamic page link
    if (item.dynamicPageLink) {
      const slug = typeof item.dynamicPageLink === 'object' 
        ? item.dynamicPageLink.slug 
        : item.dynamicPageLink
      return `/${slug}`
    }
    // Fall back to internal link
    const link = item.internalLink || '/'
    
    // If another page is set as landing page and this is the Home link (/),
    // redirect to /home instead so the original home page is accessible
    if (link === '/' && homePage !== 'home') {
      return '/home'
    }
    
    return link
  }

  // Check if a menu item is active
  const isActive = (item: MenuItem): boolean => {
    const link = getMenuLink(item)
    // Handle home link - active on / or /home
    if (link === '/' || link === '/home') {
      return pathname === '/' || pathname === '/home'
    }
    return pathname.startsWith(link)
  }

  // Render a single menu item
  const renderMenuItem = (item: MenuItem, index: number) => {
    if (item.isVisible === false) return null

    const link = getMenuLink(item)
    const hasChildren = item.children && item.children.length > 0
    const isDropdown = item.linkType === 'dropdown' || hasChildren
    const dropdownKey = item.id || String(index)
    const isOpen = openDropdown === dropdownKey

    if (isDropdown) {
      return (
        <li key={dropdownKey} className={`dropdown${isOpen ? ' active' : ''}`}>
          <a href={link}>
            {item.icon && <i className={`bi ${item.icon} me-1`}></i>}
            <span>{item.label}</span>
            <i
              className={`bi bi-chevron-down toggle-dropdown${isOpen ? ' active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setOpenDropdown(isOpen ? null : dropdownKey)
              }}
              style={{ cursor: 'pointer' }}
            ></i>
          </a>
          {hasChildren && (
            <ul className={isOpen ? 'dropdown-active' : ''}>
              {item.children!.filter(child => child.isVisible !== false).map((child, childIndex) => (
                <li key={child.id || childIndex}>
                  {child.linkType === 'external' ? (
                    <a 
                      href={child.externalUrl || '#'}
                      target={child.openInNewTab ? '_blank' : undefined}
                      rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                      onClick={closeMobileMenu}
                    >
                      {child.icon && <i className={`bi ${child.icon} me-1`}></i>}
                      {child.label}
                    </a>
                  ) : (
                    <Link href={getMenuLink(child)} onClick={closeMobileMenu}>
                      {child.icon && <i className={`bi ${child.icon} me-1`}></i>}
                      {child.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      )
    }

    // Regular menu item
    if (item.linkType === 'external') {
      return (
        <li key={item.id || index}>
          <a
            href={link}
            target={item.openInNewTab ? '_blank' : undefined}
            rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
            className={item.highlight ? 'highlight' : ''}
            onClick={closeMobileMenu}
          >
            {item.icon && <i className={`bi ${item.icon} me-1`}></i>}
            {item.label}
          </a>
        </li>
      )
    }

    return (
      <li key={item.id || index}>
        <Link
          href={link}
          className={`${isActive(item) ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`}
          onClick={closeMobileMenu}
        >
          {item.icon && <i className={`bi ${item.icon} me-1`}></i>}
          {item.label}
        </Link>
      </li>
    )
  }

  // Fallback menu if no navigation data
  const fallbackMenu: MenuItem[] = [
    { label: 'Home', linkType: 'internal' as const, internalLink: '/', isVisible: true },
    { label: 'About', linkType: 'internal' as const, internalLink: '/about', isVisible: true },
    { label: 'Courses', linkType: 'internal' as const, internalLink: '/courses', isVisible: true },
    { label: 'Instructors', linkType: 'internal' as const, internalLink: '/instructors', isVisible: true },
    { label: 'News', linkType: 'internal' as const, internalLink: '/news', isVisible: true },
    { label: 'Blog', linkType: 'internal' as const, internalLink: '/blog', isVisible: true },
    { label: 'Contact', linkType: 'internal' as const, internalLink: '/contact', isVisible: true },
  ]

  const rawMenuItems: MenuItem[] = navigation?.menuItems?.length ? navigation.menuItems : fallbackMenu

  // If a page already appears inside a submenu, hide its duplicate top-level item.
  const childIdentities = new Set<string>()
  rawMenuItems.forEach((item) => {
    item.children?.forEach((child) => {
      const identity = getItemIdentity(child)
      if (identity) childIdentities.add(identity)
    })
  })

  const menuItems = rawMenuItems.filter((item) => {
    const identity = getItemIdentity(item)
    if (!identity) return true
    return !childIdentities.has(identity)
  })

  // Get CTA button settings
  const ctaButton = navigation?.ctaButton

  return (
    <>
      <nav id="navmenu" className="navmenu">
        <ul>
          {menuItems.map((item, index) => renderMenuItem(item, index))}
          {/* CTA Button inside mobile menu */}
          {ctaButton?.isVisible !== false && (
            <li className="d-xl-none mobile-cta-item">
              <Link 
                href={ctaButton?.linkType === 'external' ? (ctaButton?.externalUrl || '#') : (ctaButton?.internalLink || '/enroll')}
                className="mobile-cta-btn"
                onClick={closeMobileMenu}
                target={ctaButton?.openInNewTab ? '_blank' : undefined}
                rel={ctaButton?.openInNewTab ? 'noopener noreferrer' : undefined}
              >
                {ctaButton?.text || 'Enroll Now'}
              </Link>
            </li>
          )}
        </ul>
        <i 
          className={`mobile-nav-toggle d-xl-none bi ${mobileMenuOpen ? 'bi-x' : 'bi-list'}`}
          onClick={toggleMobileMenu}
          style={{ cursor: 'pointer' }}
        ></i>
      </nav>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-nav-overlay" 
          onClick={closeMobileMenu}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9996
          }}
        />
      )}
    </>
  )
}
