import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollHandler from './components/ScrollHandler'
import AnnouncementPopup from './components/AnnouncementPopup'
import FloatingButtons from './components/FloatingButtons'
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
  if (settings?.typography?.subHeadingFont) {
    fonts.add(settings.typography.subHeadingFont)
  }
  
  // Default fonts
  fonts.add('DM Sans')
  fonts.add('Playfair Display')
  fonts.add('Roboto')
  fonts.add('Raleway')
  
  const fontString = Array.from(fonts)
    .map(font => font.replace(/ /g, '+'))
    .map(font => `family=${font}:wght@300;400;500;600;700`)
    .join('&')
  
  return `https://fonts.googleapis.com/css2?${fontString}&display=swap`
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const settings = await getSettings()
  const announcementPopup = (settings as any)?.announcementPopup || null
  const floatingButtons = (settings as any)?.floatingButtons || []
  
  // Generate theme CSS from settings
  const themeCSS = generateThemeCSS(settings)
  if (process.env.NODE_ENV === 'development') {
    console.log('[THEME DEBUG] darkModeColor:', (settings as any)?.theme?.darkModeColor, '| primaryColor:', (settings as any)?.theme?.primaryColor, '| themeCSS length:', themeCSS?.length)
  }
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
        
        {/* Hero layout styles (fullscreen overlay, etc.) */}
        <link href="/assets/css/hero-layouts.css" rel="stylesheet" />
        
        {/* Dynamic Theme CSS from CMS */}
        {themeCSS && <style dangerouslySetInnerHTML={{ __html: themeCSS }} />}
        
        {/* Prevent horizontal scroll for full-width hero */}
        <style>{`
          body { overflow-x: hidden; }
          .main { overflow-x: hidden; }

          :root {
            --ui-radius: 16px;
            --ui-radius-sm: 12px;
            --ui-shadow-soft: 0 10px 30px rgba(16, 34, 66, 0.08);
            --ui-shadow-hover: 0 18px 38px rgba(16, 34, 66, 0.14);
          }

          body {
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            font-size: var(--base-font-size, 16px);
            background-color: var(--background-color);
            background-image: var(--page-soft-gradient, none);
            background-attachment: fixed;
            background-size: cover;
          }

          h1,
          h2 {
            font-family: var(--heading-font, 'Playfair Display', serif);
            color: var(--heading-color);
          }

          h3,
          h4,
          .subtitle,
          .label-text,
          .section-label,
          .about-v2-label-wrap .label-text {
            font-family: var(--subheading-font, var(--default-font));
            color: var(--subheading-color, var(--heading-color));
          }

          .section {
            padding-top: var(--section-spacing-y, 84px);
            padding-bottom: var(--section-spacing-y, 84px);
            background-color: transparent;
          }

          .container,
          .container-xl,
          .container-fluid.container-xl {
            max-width: var(--container-max-width, 1140px);
          }

          .cms-home-section > section,
          .cms-home-section > .section {
            background-color: transparent !important;
          }

          .stats-block.section,
          .cms-home-section > .stats-block.section {
            background-color: var(--cms-section-bg, var(--stats-block-bg, color-mix(in srgb, var(--heading-color), black 82%))) !important;
          }

          .section-title {
            margin-bottom: 34px;
          }

          .section-title h2 {
            letter-spacing: -0.02em;
            font-weight: 700;
          }

          .section-title h2:before,
          .section-title h2:after {
            background: var(--primary-color) !important;
          }

          .section-title p {
            max-width: 760px;
            margin-left: auto;
            margin-right: auto;
            color: var(--secondary-color);
          }

          .tabs-content-block .tabs-nav {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            gap: 10px;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid color-mix(in srgb, var(--heading-color), transparent 82%);
            padding-bottom: 10px;
          }
          .tabs-content-block .tabs-nav::-webkit-scrollbar {
            display: none;
          }

          .tabs-content-block .tabs-nav-btn {
            border: 1px solid color-mix(in srgb, var(--primary-color), transparent 72%);
            background: color-mix(in srgb, var(--primary-color), transparent 90%);
            color: var(--heading-color);
            border-radius: 10px;
            padding: 0.5rem 0.95rem;
            font-weight: 600;
            line-height: 1.2;
            white-space: nowrap;
            flex-shrink: 0;
            transition: all 0.25s ease;
          }

          .tabs-content-block .tabs-nav-btn:hover {
            background: color-mix(in srgb, var(--primary-color), transparent 84%);
            border-color: color-mix(in srgb, var(--primary-color), transparent 56%);
          }

          .tabs-content-block .tabs-nav-btn.is-active {
            background: var(--primary-color);
            color: var(--contrast-color);
            border-color: var(--primary-color);
            box-shadow: 0 6px 16px color-mix(in srgb, var(--primary-color), transparent 70%);
          }

          .tabs-content-block.tabs-style-underline .tabs-nav-btn {
            border: none;
            border-bottom: 2px solid transparent;
            border-radius: 0;
            background: transparent;
            padding-left: 0.25rem;
            padding-right: 0.25rem;
          }

          .tabs-content-block.tabs-style-underline .tabs-nav-btn.is-active {
            background: transparent;
            color: var(--primary-color);
            border-bottom-color: var(--primary-color);
            box-shadow: none;
          }

          .tabs-content-block.tabs-style-pills .tabs-nav {
            border-bottom: none;
            padding-bottom: 0;
          }

          .tabs-content-block .tabs-panel {
            border: 1px solid color-mix(in srgb, var(--secondary-color), transparent 78%);
            border-radius: 14px;
            background: color-mix(in srgb, var(--background-color), #ffffff 22%);
            padding: clamp(16px, 2vw, 28px);
          }

          /* Remove heavy section padding when FlexibleRow is inside a tab panel */
          .tabs-content-block .tabs-panel .fr-section {
            padding: 12px 0;
          }

          /* Vertically center columns inside tab panels */
          .tabs-content-block .tabs-panel .fr-grid {
            align-items: center;
          }

          /* Let rich text inside tabs vertically center */
          .tabs-content-block .tabs-panel .fr-column-stack {
            height: 100%;
            align-content: center;
          }

          .tabs-content-block .tabs-panel-empty {
            color: var(--secondary-color);
          }

          .form-builder-block .form-builder-surface {
            background: color-mix(in srgb, var(--background-color), #ffffff 22%);
            border: 1px solid color-mix(in srgb, var(--heading-color), transparent 84%);
            border-radius: 16px;
            padding: clamp(16px, 2vw, 28px);
            box-shadow: 0 12px 28px color-mix(in srgb, var(--heading-color), transparent 90%);
          }

          .form-builder-block .form-builder-label {
            font-weight: 600;
            color: var(--heading-color);
            margin-bottom: 0.45rem;
          }

          .form-builder-block .form-builder-help {
            color: var(--secondary-color);
          }

          .form-builder-block .form-control,
          .form-builder-block .form-select {
            min-height: 48px;
            border-radius: 12px;
            border-color: color-mix(in srgb, var(--heading-color), transparent 82%);
            background: color-mix(in srgb, var(--background-color), #ffffff 42%);
          }

          .form-builder-block input[type='file'].form-control {
            padding: 0;
            min-height: 52px;
            line-height: 52px;
          }

          .form-builder-block .form-control:focus,
          .form-builder-block .form-select:focus {
            border-color: color-mix(in srgb, var(--primary-color), transparent 35%);
            box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--primary-color), transparent 78%);
          }

          .form-builder-block input[type='file']::file-selector-button {
            border: none;
            border-right: 1px solid color-mix(in srgb, var(--heading-color), transparent 86%);
            background: color-mix(in srgb, var(--primary-color), transparent 88%);
            color: var(--heading-color);
            height: 52px;
            line-height: 52px;
            display: inline-flex;
            align-items: center;
            font-weight: 600;
            padding: 0 1rem;
            margin-right: 0.65rem;
            border-radius: 11px 0 0 11px;
          }

          .form-builder-block input[type='file']::-webkit-file-upload-button {
            border: none;
            border-right: 1px solid color-mix(in srgb, var(--heading-color), transparent 86%);
            background: color-mix(in srgb, var(--primary-color), transparent 88%);
            color: var(--heading-color);
            height: 52px;
            line-height: 52px;
            display: inline-flex;
            align-items: center;
            font-weight: 600;
            padding: 0 1rem;
            margin-right: 0.65rem;
            border-radius: 11px 0 0 11px;
          }

          .form-builder-block .form-builder-submit-btn {
            background: var(--primary-color) !important;
            border-color: var(--primary-color) !important;
            color: var(--contrast-color) !important;
            min-height: 48px;
            border-radius: 12px;
            font-weight: 700;
          }

          .form-builder-block .form-builder-submit-btn:hover,
          .form-builder-block .form-builder-submit-btn:focus {
            background: color-mix(in srgb, var(--primary-color), #000 10%) !important;
            border-color: color-mix(in srgb, var(--primary-color), #000 10%) !important;
          }

          .page-title.light-background {
            background-color: color-mix(in srgb, white 10%, var(--background-color));
          }

          .courses-hero .hero-image .carousel-inner {
            border-radius: 7px;
            overflow: hidden;
          }

          .courses-hero .hero-image .carousel-item {
            aspect-ratio: 16 / 9;
            background: color-mix(in srgb, var(--background-color), #000 3%);
          }

          .courses-hero .hero-image .carousel-item > img,
          .courses-hero .hero-image .carousel-item > video,
          .courses-hero .hero-image .carousel-item > iframe,
          .courses-hero .hero-image .carousel-item .hero-slide-embed iframe {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            max-height: none;
          }

          .courses-hero .hero-image .carousel-item .hero-slide-embed {
            width: 100%;
            height: 100%;
          }

          .course-card,
          .instructor-card,
          .testimonial-item,
          .blog-item,
          .news-item,
          .card {
            border-radius: var(--ui-radius);
            box-shadow: var(--ui-shadow-soft);
            border: 1px solid rgba(20, 44, 84, 0.06);
            transition: transform 0.28s ease, box-shadow 0.28s ease;
          }

          .course-card:hover,
          .instructor-card:hover,
          .testimonial-item:hover,
          .blog-item:hover,
          .news-item:hover,
          .card:hover {
            transform: translateY(-6px);
            box-shadow: var(--ui-shadow-hover);
          }

          .course-image img,
          .instructor-image img,
          .card img {
            border-radius: var(--ui-radius-sm);
          }

          .facility-grid-v2 .facility-card {
            background: var(--surface-color);
            border-radius: 18px;
            overflow: hidden;
            border: 1px solid rgba(20, 44, 84, 0.12);
            box-shadow: 0 14px 28px rgba(14, 38, 73, 0.08);
            transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
          }

          .facility-grid-v2 .facility-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 16px 28px rgba(14, 38, 73, 0.11);
            border-color: color-mix(in srgb, var(--accent-color), transparent 72%);
          }

          .facility-grid-v2 .facility-media {
            position: relative;
            height: 190px;
            overflow: hidden;
            background: color-mix(in srgb, var(--accent-color), black 14%);
          }

          .facility-grid-v2 .facility-media::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(11, 30, 58, 0.04), rgba(11, 30, 58, 0.18));
            pointer-events: none;
          }

          .facility-grid-v2 .facility-media img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.45s ease;
          }

          .facility-grid-v2 .facility-card:hover .facility-media img {
            transform: scale(1.04);
          }

          .facility-grid-v2 .facility-icon,
          .facility-grid-v2 .facility-arrow {
            position: absolute;
            top: 14px;
            width: 40px;
            height: 40px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            backdrop-filter: blur(4px);
            color: #fff;
          }

          .facility-grid-v2 .facility-icon {
            left: 14px;
            background: color-mix(in srgb, var(--accent-color), #ff8a00 45%);
            font-size: 1rem;
          }

          .facility-grid-v2 .facility-arrow {
            right: 14px;
            text-decoration: none;
            background: rgba(255, 255, 255, 0.14);
            border: 1px solid rgba(255, 255, 255, 0.32);
            transition: transform 0.3s ease, background-color 0.3s ease;
          }

          .facility-grid-v2 .facility-card:hover .facility-arrow {
            transform: translateY(-2px);
            background: color-mix(in srgb, var(--accent-color), transparent 25%);
          }

          .facility-grid-v2 .facility-content {
            padding: 1.45rem 1.3rem 1.3rem;
            border-bottom: 3px solid color-mix(in srgb, var(--accent-color), transparent 78%);
            transition: border-color 0.35s ease;
          }

          .facility-grid-v2 .facility-card:hover .facility-content {
            border-bottom-color: color-mix(in srgb, var(--accent-color), transparent 45%);
          }

          .facility-grid-v2 .facility-content h3 {
            margin: 0 0 0.7rem;
            font-size: 1.6rem;
            line-height: 1.2;
          }

          .facility-grid-v2 .facility-content p {
            margin: 0;
            color: color-mix(in srgb, var(--default-color), transparent 20%);
          }

          .facility-grid-v2 .facility-btn {
            margin-top: 0.9rem;
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            background: color-mix(in srgb, var(--accent-color), transparent 86%);
            color: color-mix(in srgb, var(--accent-color), black 6%);
            border: 1px solid color-mix(in srgb, var(--accent-color), transparent 70%);
            padding: 0.45rem 0.95rem;
            border-radius: 999px;
            text-decoration: none;
          }

          .facility-grid-v2 .facility-btn:hover {
            background: var(--accent-color);
            color: var(--contrast-color);
            border-color: var(--accent-color);
          }

          .research-facilities-grid .facility-card {
            position: relative;
            border: 1px solid hsl(30 18% 88%);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
            transition: transform 0.35s ease, box-shadow 0.35s ease;
          }

          .research-facilities-grid .facility-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 14px 32px -10px color-mix(in srgb, var(--facility-color), transparent 78%);
            border-color: hsl(30 18% 88%);
          }

          .research-facilities-grid .facility-card::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 0;
            height: 3px;
            background: var(--facility-color);
            transition: width 0.35s ease;
          }

          .research-facilities-grid .facility-card:hover::after {
            width: 100%;
          }

          .research-facilities-grid .facility-media {
            height: 160px;
          }

          .research-facilities-grid .facility-media::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--facility-color);
            opacity: 0.2;
            transition: opacity 0.3s ease;
            z-index: 1;
            pointer-events: none;
          }

          .research-facilities-grid .facility-card:hover .facility-media::before {
            opacity: 0.3;
          }

          .research-facilities-grid .facility-media::after {
            z-index: 1;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.3) 100%);
          }

          .research-facilities-grid .facility-icon,
          .research-facilities-grid .facility-arrow {
            z-index: 2;
          }

          .research-facilities-grid .facility-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: var(--facility-color);
          }

          .research-facilities-grid .facility-arrow {
            width: 36px;
            height: 36px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          .research-facilities-grid .facility-content {
            padding: 1.25rem 1.35rem 1.5rem;
            border-bottom: 0;
          }

          .research-facilities-grid .instructor-info h5 {
            margin: 0 0 0.65rem;
            color: hsl(18 30% 10%);
          }

          .research-facilities-grid .instructor-info .description {
            margin: 0;
            line-height: 1.65;
            color: hsl(18 10% 48%);
          }

          .image-gallery-block.gallery-v2 {
            background: var(--cms-section-bg, color-mix(in srgb, var(--background-color), #fff 8%));
          }

          .gallery-v2 .gallery-v2-header {
            margin-bottom: 2.3rem;
          }

          .gallery-v2 .gallery-v2-kicker-wrap {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.65rem;
            margin-bottom: 0.9rem;
          }

          .gallery-v2 .gallery-v2-kicker-line {
            width: 2.25rem;
            height: 2px;
            background: var(--accent-color);
            opacity: 0.9;
          }

          .gallery-v2 .gallery-v2-kicker {
            text-transform: uppercase;
            font-size: 0.74rem;
            letter-spacing: 0.12em;
            font-weight: 700;
            color: var(--accent-color);
          }

          .gallery-v2 .gallery-v2-grid {
            display: grid;
            grid-template-columns: repeat(1, minmax(0, 1fr));
            gap: 1.25rem;
             align-items: start;
          }

          .gallery-v2 .gallery-v2-marquee {
            position: relative;
            overflow-x: auto;
            overflow-y: hidden;
            width: 100%;
            padding: 0.2rem 0;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            touch-action: pan-x;
            cursor: grab;
            mask-image: linear-gradient(to right, transparent 0, #000 5%, #000 95%, transparent 100%);
          }

          .gallery-v2 .gallery-v2-marquee:active {
            cursor: grabbing;
          }

          .gallery-v2 .gallery-v2-marquee::-webkit-scrollbar {
            display: none;
          }

          .gallery-v2 .gallery-v2-marquee-track {
            display: flex;
            align-items: stretch;
            gap: 1rem;
            width: max-content;
            animation: gallery-v2-marquee-scroll 52s linear infinite;
            will-change: transform;
          }

          .gallery-v2 .gallery-v2-marquee:hover .gallery-v2-marquee-track,
          .gallery-v2 .gallery-v2-marquee:focus-within .gallery-v2-marquee-track,
          .gallery-v2 .gallery-v2-marquee:active .gallery-v2-marquee-track {
            animation-play-state: paused;
          }

          .gallery-v2 .gallery-v2-marquee-item {
            flex: 0 0 clamp(280px, 45vw, 540px);
            min-width: 0;
          }

          .gallery-v2 .gallery-v2-card.gallery-v2-card-marquee {
            aspect-ratio: 5 / 4;
          }

          @keyframes gallery-v2-marquee-scroll {
            from {
              transform: translate3d(0, 0, 0);
            }
            to {
              transform: translate3d(-50%, 0, 0);
            }
          }

          .gallery-v2 .gallery-v2-item {
            min-width: 0;
          }

          .gallery-v2 .gallery-v2-card {
            position: relative;
            border-radius: 1rem;
            overflow: hidden;
            border: 1px solid color-mix(in srgb, var(--default-color), transparent 86%);
            box-shadow: 0 10px 26px rgba(0, 0, 0, 0.12);
            transition: transform 0.34s ease, box-shadow 0.34s ease;
            height: 100%;
            aspect-ratio: 4 / 5;
          }

          .gallery-v2 .gallery-v2-open {
            width: 100%;
            text-align: left;
            padding: 0;
            background: transparent;
            cursor: zoom-in;
          }

          .gallery-v2 .gallery-v2-card:hover {
            transform: translateY(-7px);
            box-shadow: 0 18px 38px color-mix(in srgb, var(--heading-color), transparent 76%);
          }

          .gallery-v2 .gallery-v2-card img,
          .gallery-v2 .gallery-v2-card video,
          .gallery-v2 .gallery-v2-card iframe {
            width: 100%;
            display: block;
            height: 100%;
            min-height: 230px;
            object-fit: cover;
            transition: transform 0.42s ease;
          }

          .gallery-v2 .gallery-v2-card:hover img {
            transform: scale(1.06);
          }

          .gallery-v2 .gallery-v2-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: flex-end;
            padding: 1rem;
            background: linear-gradient(180deg, rgba(10, 22, 46, 0.08) 28%, rgba(10, 22, 46, 0.5) 62%, rgba(10, 22, 46, 0.88) 100%);
            opacity: 0;
            transform: translateY(8px);
            transition: opacity 0.3s ease, transform 0.3s ease, background 0.3s ease;
            pointer-events: none;
          }

          .gallery-v2 .gallery-v2-card:hover .gallery-v2-overlay {
            opacity: 1;
            transform: translateY(0);
            background: linear-gradient(180deg, rgba(8, 18, 38, 0.12) 24%, rgba(8, 18, 38, 0.58) 58%, rgba(8, 18, 38, 0.92) 100%);
          }

          .gallery-v2 .gallery-v2-overlay-content {
            width: 100%;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 0.8rem;
          }

          .gallery-v2 .gallery-v2-overlay-line {
            width: 1.4rem;
            height: 2px;
            background: var(--accent-color);
            display: block;
            margin-bottom: 0.5rem;
          }

          .gallery-v2 .gallery-v2-overlay-label {
            color: var(--secondary-foreground, #fff);
            font-weight: 600;
            font-size: 0.86rem;
            line-height: 1.4;
            display: inline-block;
          }

          .gallery-v2 .gallery-v2-zoom,
          .gallery-v2 .gallery-v2-camera {
            width: 2.15rem;
            height: 2.15rem;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            background: rgba(255, 255, 255, 0.14);
            border: 1px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(4px);
          }

          .gallery-v2 .gallery-v2-camera {
            position: absolute;
            top: 0.7rem;
            right: 0.7rem;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 2;
             pointer-events: none;
          }

          .gallery-v2 .gallery-v2-card:hover .gallery-v2-camera {
            opacity: 1;
          }

          .gallery-v2 .gallery-v2-btn {
            border-color: var(--accent-color);
            color: var(--accent-color);
            background: transparent;
          }

          .gallery-v2 .gallery-v2-btn:hover {
            background: var(--accent-color);
            border-color: var(--accent-color);
            color: var(--contrast-color);
          }

          .media-lightbox {
            position: fixed;
            inset: 0;
            z-index: 20000;
            background: rgba(30, 22, 14, 0.7);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: clamp(16px, 2vw, 28px);
          }

          .media-lightbox-inner {
            position: relative;
            width: min(1000px, calc(100vw - 60px));
            max-height: calc(100vh - 44px);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .media-lightbox-stage {
            background: transparent;
            border-radius: 16px;
            border: none;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          }

          .media-lightbox-media {
            width: 100%;
            max-height: calc(100vh - 160px);
            display: block;
            object-fit: contain;
            background: transparent;
            border-radius: 16px;
          }

          .media-lightbox-meta {
            display: flex;
            gap: 1.5rem;
            align-items: center;
            justify-content: center;
            color: #f4f7ff;
            padding: 0.5rem 1.2rem;
            background: rgba(0, 0, 0, 0.35);
            backdrop-filter: blur(8px);
            border-radius: 24px;
          }

          .media-lightbox-index {
            font-size: 0.84rem;
            opacity: 0.88;
          }

          .media-lightbox-caption {
            font-size: 0.96rem;
            font-weight: 500;
            text-align: center;
            max-width: 78%;
          }

          .media-lightbox-close,
          .media-lightbox-nav {
            position: fixed;
            border: 0;
            background: rgba(255, 255, 255, 0.18);
            color: #fff;
            width: 48px;
            height: 48px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(6px);
            z-index: 20010;
            cursor: pointer;
            font-size: 1.2rem;
            transition: background 0.2s ease;
          }

          .media-lightbox-close:hover,
          .media-lightbox-nav:hover {
            background: rgba(255, 255, 255, 0.3);
          }

          .media-lightbox-close {
            top: 18px;
            right: 18px;
          }

          .media-lightbox-nav {
            top: 50%;
            transform: translateY(-50%);
          }

          .media-lightbox-nav-prev {
            left: 18px;
          }

          .media-lightbox-nav-next {
            right: 18px;
          }

          @media (max-width: 767.98px) {
            .media-lightbox-nav {
              width: 40px;
              height: 40px;
            }

            .media-lightbox-caption {
              max-width: 70%;
              font-size: 0.88rem;
            }
          }

          .gallery-v2-page .gallery-v2-grid {
            margin-bottom: 0.4rem;
          }

          @media (min-width: 576px) {
            .gallery-v2 .gallery-v2-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          @media (min-width: 992px) {
            .gallery-v2 .gallery-v2-grid {
              grid-template-columns: repeat(var(--gallery-columns, 3), minmax(0, 1fr));
            }

            .gallery-v2 .gallery-v2-item.gallery-v2-span-2 {
              grid-column: span 2;
            }

            .gallery-v2 .gallery-v2-item.gallery-v2-span-2 .gallery-v2-card img {
              min-height: 290px;
            }
          }

          /* ── Bento Gallery Layout ── */
          .gallery-v2-bento {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-auto-rows: 200px;
            gap: 1.25rem;
          }

          .gallery-v2-bento-item {
            min-width: 0;
          }

          .gallery-v2-bento-item.gallery-v2-bento-tall {
            grid-row: span 2;
          }

          .gallery-v2-bento-item .gallery-v2-card {
            aspect-ratio: unset;
            height: 100%;
          }

          .gallery-v2-bento-item .gallery-v2-card img,
          .gallery-v2-bento-item .gallery-v2-card video,
          .gallery-v2-bento-item .gallery-v2-card iframe {
            height: 100%;
            min-height: unset;
          }

          @media (max-width: 991.98px) {
            .gallery-v2-bento {
              grid-template-columns: repeat(2, 1fr);
              grid-auto-rows: 180px;
            }
          }

          @media (max-width: 575.98px) {
            .gallery-v2-bento {
              grid-template-columns: 1fr;
              grid-auto-rows: 220px;
            }

            .gallery-v2-bento-item.gallery-v2-bento-tall {
              grid-row: span 1;
            }
          }

          .about.about-v2 {
            background: color-mix(in srgb, var(--background-color), #fff 8%);
          }

          .about.about-v2 .about-v2-media {
            position: relative;
            padding: 0.6rem 0.6rem 0 0;
          }

          .about.about-v2 .about-v2-frame {
            position: absolute;
            right: 0;
            bottom: -0.7rem;
            width: 100%;
            height: 100%;
            border: 3px solid var(--primary-color, var(--accent-color));
            border-radius: 1.1rem;
            z-index: 0;
          }

          .about.about-v2 .about-v2-main-media {
            position: relative;
            z-index: 1;
            border-radius: 1.1rem;
            overflow: hidden;
            box-shadow: 0 12px 34px rgba(0, 0, 0, 0.16);
          }

          .about.about-v2 .about-v2-main-media img,
          .about.about-v2 .about-v2-main-media video,
          .about.about-v2 .about-v2-main-media iframe {
            width: 100%;
            min-height: 380px;
            max-height: 500px;
            object-fit: cover;
            display: block;
          }

          .about.about-v2 .about-v2-floating {
            position: absolute;
            z-index: 2;
            border-radius: 0.85rem;
            box-shadow: 0 10px 26px rgba(14, 33, 61, 0.18);
          }

          .about.about-v2 .about-v2-floating .about-v2-floating-icon {
            width: 1.4rem;
            height: 1.4rem;
            color: var(--accent-color);
            margin-bottom: 0.3rem;
          }

          .about.about-v2 .about-v2-floating .about-v2-floating-icon svg {
            width: 100%;
            height: 100%;
          }

          .about.about-v2 .about-v2-mission-cards {
            margin-top: 1.25rem;
          }

          .about.about-v2 .about-v2-mission-card {
            position: relative;
            background: var(--surface-color);
            border: 1px solid color-mix(in srgb, var(--default-color), transparent 86%);
            border-radius: 0.9rem;
            padding: 1.05rem 1.1rem;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            display: flex;
            align-items: flex-start;
            gap: 0.9rem;
            cursor: pointer;
            overflow: hidden;
            transition: transform 0.28s ease, box-shadow 0.28s ease;
          }

          .about.about-v2 .about-v2-mission-card::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0.45rem;
            bottom: 0.45rem;
            width: 5px;
            border-radius: 0 8px 8px 0;
            background: color-mix(in srgb, var(--accent-color), black 12%);
            opacity: 0.95;
          }

          .about.about-v2 .about-v2-mission-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 14px 28px rgba(0, 0, 0, 0.12);
          }

          .about.about-v2 .about-v2-mission-card:active,
          .about.about-v2 .about-v2-mission-card:focus-visible {
            animation: about-v2-card-float-soft 420ms ease-out;
          }

          .about.about-v2 .about-v2-mission-card:focus-visible {
            outline: 2px solid color-mix(in srgb, var(--accent-color), transparent 45%);
            outline-offset: 2px;
          }

          .about.about-v2 .about-v2-mission-card-icon {
            width: 3rem;
            height: 3rem;
            min-width: 3rem;
            min-height: 3rem;
            border-radius: 0.8rem;
            background: color-mix(in srgb, var(--accent-color), transparent 90%);
            color: var(--accent-color);
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .about.about-v2 .about-v2-mission-card-icon svg {
            width: 1.45rem;
            height: 1.45rem;
          }

          .about.about-v2 .about-v2-mission-card-content {
            min-width: 0;
          }

          .about.about-v2 .about-v2-mission-card h4 {
            margin: 0 0 0.3rem;
            font-size: 1.85rem;
            line-height: 1.15;
            color: var(--heading-color);
          }

          .about.about-v2 .about-v2-mission-card p {
            margin: 0;
            font-size: 1.02rem;
            color: color-mix(in srgb, var(--default-color), transparent 16%);
            line-height: 1.45;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          @keyframes about-v2-card-float-soft {
            0% {
              transform: translateY(0);
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            }
            35% {
              transform: translateY(-7px);
              box-shadow: 0 18px 34px rgba(0, 0, 0, 0.14);
            }
            100% {
              transform: translateY(-2px);
              box-shadow: 0 12px 24px rgba(0, 0, 0, 0.11);
            }
          }

          .about.about-v2 .about-v2-floating-top {
            top: -1rem;
            left: -1rem;
            background: var(--surface-color);
            border: 1px solid color-mix(in srgb, var(--default-color), transparent 86%);
            padding: 0.7rem 0.9rem;
            min-width: 126px;
          }

          .about.about-v2 .about-v2-floating-top .value {
            font-size: 1.6rem;
            line-height: 1;
            font-weight: 700;
            color: var(--primary-color, var(--accent-color));
            margin-bottom: 0.2rem;
          }

          .about.about-v2 .about-v2-floating-top .label {
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: color-mix(in srgb, var(--default-color), transparent 30%);
          }

          .about.about-v2 .about-v2-floating-bottom {
            left: -1rem;
            bottom: -0.4rem;
            background: var(--dark-mode-color, var(--dark-color, color-mix(in srgb, var(--heading-color), black 80%)));
            color: var(--secondary-foreground, #fff);
            padding: 0.65rem 0.9rem;
            min-width: 138px;
          }

          .about.about-v2 .about-v2-floating-bottom .title {
            font-size: 0.69rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--accent-color);
            font-weight: 700;
          }

          .about.about-v2 .about-v2-floating-bottom .subtitle {
            font-size: 0.72rem;
            color: color-mix(in srgb, var(--secondary-foreground, #fff), transparent 28%);
          }

          .about.about-v2 .about-v2-label-wrap {
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            margin-bottom: 0.75rem;
          }

          .about.about-v2 .about-v2-label-wrap .line {
            width: 2rem;
            height: 2px;
            background: var(--primary-color, var(--accent-color));
          }

          .about.about-v2 .about-v2-label-wrap .label-text {
            font-size: 0.74rem;
            text-transform: uppercase;
            letter-spacing: 0.11em;
            color: var(--primary-color, var(--accent-color));
            font-weight: 700;
          }

          .about.about-v2 .about-v2-content h2 {
            margin-bottom: 1rem;
            color: var(--heading-color);
          }

          .about.about-v2 .about-v2-content p {
            color: color-mix(in srgb, var(--default-color), transparent 18%);
          }

          .about.about-v2 .about-v2-highlights {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.55rem 1rem;
            margin: 1.35rem 0;
          }

          .about.about-v2 .about-v2-highlights .highlight-item {
            display: flex;
            align-items: flex-start;
            gap: 0.55rem;
            color: var(--heading-color);
            font-size: 0.92rem;
          }

          .about.about-v2 .about-v2-highlights .highlight-item i {
            color: var(--primary-color, var(--accent-color));
            margin-top: 0.15rem;
            font-size: 0.95rem;
          }

          .about.about-v2 .about-v2-quote {
            margin: 0 0 1.5rem;
            padding: 0.85rem 1rem;
            border-left: 4px solid var(--primary-color, var(--accent-color));
            background: color-mix(in srgb, var(--background-color), #fff 22%);
            border-radius: 0 0.75rem 0.75rem 0;
          }

          .about.about-v2 .about-v2-quote p {
            margin: 0;
            font-style: italic;
            color: var(--heading-color);
          }

          .about.about-v2 .about-v2-quote footer {
            margin-top: 0.4rem;
            font-size: 0.78rem;
            color: color-mix(in srgb, var(--default-color), transparent 28%);
            font-weight: 600;
          }

          @media (max-width: 991px) {
            .about.about-v2 .about-v2-highlights {
              grid-template-columns: 1fr;
            }

            .about.about-v2 .about-v2-main-media img,
            .about.about-v2 .about-v2-main-media video,
            .about.about-v2 .about-v2-main-media iframe {
              min-height: 310px;
            }
          }

          @media (max-width: 575px) {
            .facility-grid-v2 .facility-media {
              height: 176px;
            }

            .facility-grid-v2 .facility-content h3 {
              font-size: 1.45rem;
            }
          }

          #people-block .instructor-image {
            height: 300px;
            background: #eef3f8;
          }

          #people-block .instructor-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center top;
          }

          #people-block .people-duo-card {
            display: grid;
            grid-template-columns: 170px 1fr;
            min-height: 100%;
            border-radius: var(--ui-radius);
            overflow: hidden;
            background: var(--surface-color);
            border: 1px solid rgba(20, 44, 84, 0.1);
            box-shadow: var(--ui-shadow-soft);
          }

          #people-block .people-duo-media {
            height: 100%;
            background: color-mix(in srgb, var(--accent-color), black 35%);
          }

          #people-block .people-duo-media img {
            width: 100%;
            height: 100%;
            min-height: 260px;
            object-fit: cover;
            object-position: center top;
            display: block;
          }

          #people-block .people-duo-content {
            padding: 1.2rem 1.4rem;
            display: flex;
            flex-direction: column;
            gap: 0.7rem;
          }

          #people-block .people-duo-content h4 {
            margin: 0;
            font-weight: 700;
            color: var(--heading-color);
          }

          #people-block .people-duo-content p {
            margin: 0;
            color: color-mix(in srgb, var(--default-color), transparent 18%);
          }

          #people-block .people-duo-tag {
            display: inline-flex;
            align-self: flex-start;
            padding: 0.3rem 0.8rem;
            border-radius: 999px;
            font-size: 0.88rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            color: var(--accent-color);
            background: color-mix(in srgb, var(--accent-color), transparent 88%);
          }

          #people-block .people-duo-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            color: color-mix(in srgb, var(--default-color), transparent 20%);
            font-weight: 500;
          }

          #people-block .people-duo-meta span {
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
          }

          @media (max-width: 991px) {
            #people-block .people-duo-card {
              grid-template-columns: 1fr;
            }

            #people-block .people-duo-media img {
              min-height: 220px;
            }
          }

          .btn,
          .btn-course,
          .btn-view,
          .btn-getstarted {
            border-radius: var(--button-radius, 999px) !important;
            padding: var(--button-padding-y, 0.65rem) var(--button-padding-x, 1.4rem);
            font-size: var(--button-font-size, 0.98rem);
            font-weight: 600;
            letter-spacing: 0.01em;
            transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          }

          .btn:hover,
          .btn-course:hover,
          .btn-view:hover,
          .btn-getstarted:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 18px rgba(17, 37, 71, 0.14);
          }

          .about .about-image .btn.btn-primary,
          .about .about-content .btn.btn-primary,
          .image-gallery-block .btn.btn-primary,
          .featured-instructors .btn.btn-primary {
            background-color: var(--button-primary-bg, var(--secondary-color));
            border-color: var(--button-primary-bg, var(--secondary-color));
            color: var(--button-primary-text, var(--contrast-color));
          }

          .about .about-image .btn.btn-primary:hover,
          .about .about-content .btn.btn-primary:hover,
          .image-gallery-block .btn.btn-primary:hover,
          .featured-instructors .btn.btn-primary:hover {
            background-color: var(--button-primary-hover-bg, var(--primary-color));
            border-color: var(--button-primary-hover-bg, var(--primary-color));
            color: var(--button-primary-text, var(--contrast-color));
          }

          .about.about-v2 .about-v2-end-cta {
            margin-top: 1.35rem;
            padding-top: 0.35rem;
          }

          .about.about-v2 .about-v2-end-cta .about-v2-end-cta-btn {
            background-color: var(--button-primary-bg, var(--primary-color));
            border-color: var(--button-primary-bg, var(--primary-color));
            color: var(--button-primary-text, var(--contrast-color));
          }

          .about.about-v2 .about-v2-end-cta .about-v2-end-cta-btn:hover {
            background-color: var(--button-primary-hover-bg, var(--secondary-color));
            border-color: var(--button-primary-hover-bg, var(--secondary-color));
            color: var(--button-primary-text, var(--contrast-color));
          }

          .navmenu a {
            font-weight: 500;
          }

          .top-info-bar {
            background: var(--dark-mode-color, hsl(210 46% 16%));
            color: color-mix(in srgb, var(--secondary-foreground, #fff), transparent 14%);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 0.78rem;
            line-height: 1.2;
          }

          .top-info-bar .top-info-bar-inner {
            min-height: 38px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            padding: 0.45rem 0;
          }

          .top-info-bar .top-info-left,
          .top-info-bar .top-info-right {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.8rem;
            flex: 1 1 0;
            min-width: 0;
          }

          .top-info-bar .top-info-left {
            justify-content: flex-start;
            padding-left: 14px;
          }

          .top-info-bar .top-info-right {
            justify-content: flex-end;
            text-align: right;
          }

          .top-info-bar .top-info-link {
            display: inline-flex;
            align-items: center;
            gap: 0.36rem;
            text-decoration: none;
            color: color-mix(in srgb, var(--secondary-foreground, #fff), transparent 14%);
            font-weight: 500;
            transition: color 0.2s ease;
          }

          .top-info-bar .top-info-link:hover {
            color: var(--secondary-foreground, #fff);
          }

          .top-info-bar .top-info-link i {
            font-size: 0.72rem;
            color: var(--primary-color);
            width: 1.2rem;
            height: 1.2rem;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: color-mix(in srgb, var(--primary-color), transparent 82%);
          }

          .top-info-bar .top-info-location {
            color: color-mix(in srgb, var(--secondary-foreground, #fff), transparent 22%);
            font-weight: 400;
          }

          .top-info-bar .top-info-separator {
            opacity: 0.35;
          }

          .top-info-bar .top-info-highlight {
            color: color-mix(in srgb, var(--accent-color), #ffd24a 42%);
            font-weight: 700;
            letter-spacing: 0.02em;
          }

          .top-info-bar .top-info-socials {
            display: inline-flex;
            align-items: center;
            gap: 0.42rem;
            margin-left: 0.15rem;
          }

          .top-info-bar .top-info-social-link {
            width: 1.62rem;
            height: 1.62rem;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            color: var(--primary-color);
            background: color-mix(in srgb, var(--primary-color), transparent 84%);
            border: 1px solid color-mix(in srgb, var(--primary-color), transparent 62%);
            transition: transform 0.2s ease, background-color 0.2s ease;
          }

          .top-info-bar .top-info-social-link:hover {
            transform: translateY(-1px);
            background: var(--primary-color);
            color: var(--button-primary-text, var(--contrast-color));
            border-color: var(--primary-color);
          }

          #header.header-v2 {
            background: var(--header-bg, #fff);
            border-bottom: 1px solid var(--header-border-color, hsl(30 20% 88%));
            box-shadow: var(--header-shadow, 0 6px 18px rgba(14, 28, 52, 0.07));
            padding: 10px 0;
          }

          #header.header-v2 .logo .sitename {
            letter-spacing: -0.01em;
            font-weight: 600;
          }

          #header.header-v2 .logo {
            gap: 0.35rem;
          }

          #header.header-v2 .logo .site-logo {
            margin-right: 0;
          }

          #header.header-v2 .navmenu > ul > li {
            padding: 8px 12px;
          }

          #header.header-v2 .navmenu > ul > li > a,
          #header.header-v2 .navmenu > ul > li > a:focus,
          #header.header-v2 .navmenu > ul > li > a:visited,
          #header.header-v2 .navmenu > ul > li > a:active,
          #header.header-v2 .navmenu > ul > li > a:link {
            position: relative;
            color: var(--header-text, hsl(210 40% 16%));
            font-weight: 500;
            padding: 0.32rem 0.2rem;
            font-size: 1.02rem;
          }

          /* Disable template's default nav underline so only one baseline is shown */
          #header.header-v2 .navmenu a::before,
          #header.header-v2 .navmenu .active::before,
          #header.header-v2 .navmenu li:hover > a::before {
            content: none !important;
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            visibility: hidden !important;
          }

          #header.header-v2 .navmenu > ul > li > a::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: -3px;
            height: 2px;
            border-radius: 999px;
            background: var(--accent-color);
            transform: scaleX(0);
            transform-origin: center;
            transition: transform 0.2s ease;
          }

          #header.header-v2 .navmenu > ul > li:hover > a,
          #header.header-v2 .navmenu > ul > li > a.active {
            color: var(--accent-color);
          }

          #header.header-v2 .navmenu > ul > li:hover > a::after,
          #header.header-v2 .navmenu > ul > li > a.active::after {
            transform: scaleX(1);
          }

          #header.header-v2 .btn-getstarted {
            border-radius: var(--button-radius, 0.95rem) !important;
            padding: var(--button-padding-y, 0.68rem) var(--button-padding-x, 1.45rem);
            box-shadow: 0 10px 22px color-mix(in srgb, var(--accent-color), transparent 76%);
            margin-left: 22px;
            background-color: var(--button-primary-bg, var(--secondary-color));
            border-color: var(--button-primary-bg, var(--secondary-color));
            color: var(--button-primary-text, var(--contrast-color));
          }

          #header.header-v2 .btn-getstarted:hover {
            background-color: var(--button-primary-hover-bg, var(--primary-color));
            border-color: var(--button-primary-hover-bg, var(--primary-color));
            color: var(--button-primary-text, var(--contrast-color));
          }

          .footer {
            background-color: var(--dark-mode-color, #0F1A24) !important;
            color: var(--secondary-foreground, #ffffff);
          }

          .footer .footer-top {
            border-top-color: color-mix(in srgb, var(--secondary-foreground, #ffffff), transparent 88%);
          }

          .footer .footer-about .logo span,
          .footer h4 {
            color: var(--secondary-foreground, #ffffff);
          }

          .footer .footer-about p,
          .footer .footer-links ul a,
          .footer .footer-contact p,
          .footer .copyright p {
            color: color-mix(in srgb, var(--secondary-foreground, #ffffff), transparent 16%);
          }

          .footer .footer-links ul a:hover,
          .footer .social-links a:hover {
            color: var(--primary-color);
            border-color: var(--primary-color);
          }

          .footer .copyright {
            background-color: color-mix(in srgb, var(--dark-mode-color, #0F1A24), #000 14%);
          }

          .navmenu .dropdown ul {
            border-radius: 12px;
            box-shadow: 0 12px 28px rgba(12, 32, 64, 0.15);
          }

          .rich-text-content blockquote,
          .content-section blockquote,
          .entry-content blockquote,
          .post-content blockquote,
          .about-content blockquote,
          .rich-text-block blockquote,
          .fr-richtext-inner blockquote {
            margin: 1.25rem 0;
            padding: 0.85rem 1rem;
            border-left: 4px solid var(--accent-color, #0d6efd);
            background: color-mix(in srgb, var(--accent-color, #0d6efd), transparent 92%);
            border-radius: 8px;
            font-style: italic;
          }
          
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

          @media (max-width: 991px) {
            .section {
              padding-top: calc(var(--section-spacing-y, 84px) * 0.76);
              padding-bottom: calc(var(--section-spacing-y, 84px) * 0.76);
            }

            .about.about-v2 .about-v2-content-col {
              order: 1;
            }

            .about.about-v2 .about-v2-image-col {
              order: 2;
            }

            .about.about-v2 .about-v2-content {
              text-align: center;
            }

            .about.about-v2 .about-v2-label-wrap {
              justify-content: center;
            }

            .about.about-v2 .about-v2-highlights {
              justify-content: center;
            }

            .section-title {
              margin-bottom: 26px;
            }

            #people-block .instructor-image {
              height: 250px;
            }
          }
        `}</style>

        {/* Floating Action Buttons CSS */}
        <style>{`
          .floating-buttons {
            position: fixed;
            bottom: 24px;
            z-index: 9999;
            display: flex;
            flex-direction: column-reverse;
            gap: 12px;
            align-items: center;
          }
          .floating-buttons-right { right: 24px; }
          .floating-buttons-left  { left: 24px; }

          .floating-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 52px;
            height: 52px;
            border-radius: 50%;
            text-decoration: none;
            box-shadow: 0 4px 14px rgba(0,0,0,0.25);
            transition: transform 0.25s ease, box-shadow 0.25s ease;
            position: relative;
          }
          .floating-btn:hover {
            transform: scale(1.12);
            box-shadow: 0 6px 20px rgba(0,0,0,0.35);
          }
          .floating-btn i {
            font-size: 24px;
            line-height: 1;
          }

          /* Tooltip */
          .floating-btn-tooltip {
            position: absolute;
            white-space: nowrap;
            background: #333;
            color: #fff;
            font-size: 13px;
            padding: 5px 12px;
            border-radius: 6px;
            pointer-events: none;
            opacity: 0;
            animation: floatTooltipIn 0.2s ease forwards;
          }
          .floating-buttons-right .floating-btn-tooltip {
            right: 100%;
            margin-right: 10px;
          }
          .floating-buttons-left .floating-btn-tooltip {
            left: 100%;
            margin-left: 10px;
          }
          @keyframes floatTooltipIn {
            from { opacity: 0; transform: translateY(2px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          /* Pulse animation on first button */
          .floating-buttons .floating-btn:first-child {
            animation: floatPulse 2s infinite;
          }
          @keyframes floatPulse {
            0%, 100% { box-shadow: 0 4px 14px rgba(0,0,0,0.25); }
            50%      { box-shadow: 0 4px 24px rgba(0,0,0,0.4); }
          }
          .floating-buttons .floating-btn:first-child:hover {
            animation: none;
          }

          @media (max-width: 768px) {
            .floating-buttons { bottom: 16px; }
            .floating-buttons-right { right: 16px; }
            .floating-buttons-left  { left: 16px; }
            .floating-btn { width: 46px; height: 46px; }
            .floating-btn i { font-size: 21px; }
          }
        `}</style>
      </head>
      <body className="index-page">
        <ScrollHandler />
        <AnnouncementPopup popup={announcementPopup} version={String((settings as any)?.updatedAt || '')} />
        <Header />
        <main className="main">{children}</main>
        <Footer />

        {/* Floating Action Buttons (WhatsApp, Phone, etc.) */}
        <FloatingButtons buttons={floatingButtons} />

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
