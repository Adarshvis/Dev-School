import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import InstructorProfileClient from './InstructorProfileClient'

// Use ISR - revalidate every 60 seconds for better performance
export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default async function InstructorProfilePage({ params }: PageProps) {
  const { slug } = await params

  try {
    const payload = await getPayload({ config })

    // Fetch instructors-page sections
    const instructorsPageSections = await payload.find({
      collection: 'instructors-page' as any,
      where: {
        status: { equals: 'active' }
      },
    })

    const sections = instructorsPageSections.docs || []
    const instructorsGridSection = sections.find((section: any) => section.sectionType === 'instructors-grid')

    // Get all people blocks
    const peopleBlocks = instructorsGridSection?.contentBlocks?.filter((block: any) => block.blockType === 'people') || []

    // Find the person by slug
    let foundPerson: any = null
    let blockTitle: string = ''

    for (const block of peopleBlocks) {
      const person = block.people?.find((p: any) => {
        const personSlug = p.slug || generateSlug(p.name || '')
        return personSlug === slug
      })
      if (person) {
        foundPerson = person
        blockTitle = block.title || ''
        break
      }
    }

    if (!foundPerson) {
      notFound()
    }

    return <InstructorProfileClient person={foundPerson} blockTitle={blockTitle} />
  } catch (error) {
    console.error('Error loading instructor profile:', error)
    notFound()
  }
}

// Generate static params for all instructors
export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config })

    const instructorsPageSections = await payload.find({
      collection: 'instructors-page' as any,
      where: {
        status: { equals: 'active' }
      },
    })

    const sections = instructorsPageSections.docs || []
    const instructorsGridSection = sections.find((section: any) => section.sectionType === 'instructors-grid')
    const peopleBlocks = instructorsGridSection?.contentBlocks?.filter((block: any) => block.blockType === 'people') || []

    const slugs: { slug: string }[] = []

    for (const block of peopleBlocks) {
      for (const person of block.people || []) {
        const slug = person.slug || generateSlug(person.name || '')
        if (slug) {
          slugs.push({ slug })
        }
      }
    }

    return slugs
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params

  try {
    const payload = await getPayload({ config })

    const instructorsPageSections = await payload.find({
      collection: 'instructors-page' as any,
      where: {
        status: { equals: 'active' }
      },
    })

    const sections = instructorsPageSections.docs || []
    const instructorsGridSection = sections.find((section: any) => section.sectionType === 'instructors-grid')
    const peopleBlocks = instructorsGridSection?.contentBlocks?.filter((block: any) => block.blockType === 'people') || []

    for (const block of peopleBlocks) {
      const person = block.people?.find((p: any) => {
        const personSlug = p.slug || generateSlug(p.name || '')
        return personSlug === slug
      })
      if (person) {
        return {
          title: `${person.name} - CyPSi Laboratory`,
          description: person.description || `${person.name} - ${person.specialty || 'Team Member'} at CyPSi Laboratory`,
        }
      }
    }

    return {
      title: 'Instructor Profile - CyPSi Laboratory',
    }
  } catch (error) {
    return {
      title: 'Instructor Profile - CyPSi Laboratory',
    }
  }
}
