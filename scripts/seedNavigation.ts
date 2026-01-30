import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function seedNavigation() {
  console.log('🚀 Seeding Navigation...')
  
  const payload = await getPayload({ config })

  const navigationData = {
    menuItems: [
      {
        label: 'Home',
        linkType: 'internal',
        internalLink: '/',
        isVisible: true,
      },
      {
        label: 'About',
        linkType: 'internal',
        internalLink: '/about',
        isVisible: true,
      },
      {
        label: 'Courses',
        linkType: 'internal',
        internalLink: '/courses',
        isVisible: true,
      },
      {
        label: 'People',
        linkType: 'internal',
        internalLink: '/people',
        isVisible: true,
      },
      {
        label: 'News',
        linkType: 'internal',
        internalLink: '/news',
        isVisible: true,
      },
      {
        label: 'Blog',
        linkType: 'internal',
        internalLink: '/blog',
        isVisible: true,
      },
      {
        label: 'Contact',
        linkType: 'internal',
        internalLink: '/contact',
        isVisible: true,
      },
    ],
    ctaButton: {
      isVisible: true,
      text: 'Enroll Now',
      linkType: 'internal',
      internalLink: '/enroll',
      openInNewTab: false,
    },
    mobileSettings: {
      showIcons: true,
      collapseSubmenusByDefault: true,
    },
  }

  try {
    await payload.updateGlobal({
      slug: 'navigation' as any,
      data: navigationData as any,
    })
    console.log('✅ Navigation seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding navigation:', error)
  }

  process.exit(0)
}

seedNavigation()
