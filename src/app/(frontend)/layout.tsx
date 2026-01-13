import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollHandler from './components/ScrollHandler'
import { getSettings, generateThemeCSS } from '@/lib/settings'

export async function generateMetadata() {
  const settings = await getSettings()
  
  const faviconUrl = settings?.favicon && typeof settings.favicon === 'object' && 'url' in settings.favicon
    ? settings.favicon.url as string
    : null

  return {
    title: settings?.defaultMetaTitle || 'Learner - Online Learning Platform',
    description: settings?.defaultMetaDescription || 'Empowering learners worldwide with quality education and expert instructors.',
    icons: faviconUrl ? {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    } : undefined,
  }
}

// Generate dynamic font imports based on settings
function getFontImports(settings: any): string {
  const fonts = new Set<string>()
  
  if (settings?.typography?.headingFont) {
    fonts.add(settings.typography.headingFont)
  }
  if (settings?.typography?.bodyFont) {
    fonts.add(settings.typography.bodyFont)
  }
  
  // Default fonts
  fonts.add('Roboto')
  fonts.add('Raleway')
  fonts.add('Ubuntu')
  
  const fontString = Array.from(fonts)
    .map(font => font.replace(/ /g, '+'))
    .map(font => `family=${font}:wght@300;400;500;600;700`)
    .join('&')
  
  return `https://fonts.googleapis.com/css2?${fontString}&display=swap`
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const settings = await getSettings()
  
  // Generate theme CSS from settings
  const themeCSS = generateThemeCSS(settings)
  const fontUrl = getFontImports(settings)

  return (
    <html lang="en">
      <head>
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontUrl} rel="stylesheet" />

        {/* Vendor CSS Files */}
        <link href="/assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet" />
        <link href="/assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet" />

        {/* Main CSS File - This contains the template styling */}
        <link href="/assets/css/main.css" rel="stylesheet" />
        
        {/* Dynamic Theme CSS from CMS */}
        {themeCSS && <style dangerouslySetInnerHTML={{ __html: themeCSS }} />}
        
        {/* Prevent horizontal scroll for full-width hero */}
        <style>{`
          body { overflow-x: hidden; }
          .main { overflow-x: hidden; }
          
          /* Mobile CTA button in hamburger menu */
          .mobile-cta-item {
            padding: 10px 20px !important;
            margin-top: 10px;
          }
          .mobile-cta-btn {
            display: inline-block;
            background: var(--accent-color, #04415f);
            color: #fff !important;
            padding: 10px 25px;
            border-radius: 50px;
            font-weight: 500;
            text-decoration: none;
            transition: all 0.3s ease;
          }
          .mobile-cta-btn:hover {
            background: var(--nav-hover-color, #2086b8);
          }
          
          /* Hide desktop CTA on mobile/tablet */
          @media (max-width: 1199px) {
            .btn-getstarted {
              display: none !important;
            }
          }
        `}</style>
      </head>
      <body className="index-page">
        <ScrollHandler />
        <Header />
        <main className="main">{children}</main>
        <Footer />

        {/* Scroll Top */}
        <a
          href="#"
          id="scroll-top"
          className="scroll-top d-flex align-items-center justify-content-center"
        >
          <i className="bi bi-arrow-up-short"></i>
        </a>

        {/* Essential JS for dropdowns and navigation */}
        <script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  )
}
