import { notFound, redirect } from 'next/navigation'
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
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function isMongoObjectId(value: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(value)
}

export default async function InstructorProfilePage({ params }: PageProps) {
  const { slug } = await params

  try {
    const payload = await getPayload({ config })
    const requestedSlug = decodeURIComponent(String(slug || '')).trim()
    const normalizedRequestedSlug = normalizeSlug(requestedSlug)
    const requestedId = requestedSlug.startsWith('id-')
      ? requestedSlug.slice(3)
      : isMongoObjectId(requestedSlug)
        ? requestedSlug
        : ''
    const instructorsResult = await payload.find({
      collection: 'instructors' as any,
      limit: 500,
      overrideAccess: true,
    })

    const instructors = instructorsResult.docs || []

    let foundPerson = instructors.find((p: any) => {
      const personId = String(p?.id || p?._id || '').trim()
      const personSlug = String(p?.slug || '').trim()
      const generatedSlug = generateSlug(p?.name || '')
      const normalizedPersonSlug = normalizeSlug(personSlug)
      const normalizedGeneratedSlug = normalizeSlug(generatedSlug)

      return (
        (requestedId !== '' && requestedId === personId) ||
        requestedSlug === personId ||
        requestedSlug === `id-${personId}` ||
        (personSlug !== '' && requestedSlug === personSlug) ||
        requestedSlug === generatedSlug ||
        (normalizedPersonSlug !== '' && normalizedRequestedSlug === normalizedPersonSlug) ||
        (normalizedGeneratedSlug !== '' && normalizedRequestedSlug === normalizedGeneratedSlug)
      )
    })

    if (foundPerson) {
      return <InstructorProfileClient person={foundPerson} blockTitle="" />
    }

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

    // Find the person by slug in instructors-page block relations
    let blockTitle: string = ''

    for (const block of peopleBlocks) {
      const person = block.people?.find((p: any) => {
        const personId = String(p?.id || p?._id || '').trim()
        const personSlug = String(p?.slug || '').trim()
        const generatedSlug = generateSlug(p?.name || '')
        const normalizedPersonSlug = normalizeSlug(personSlug)
        const normalizedGeneratedSlug = normalizeSlug(generatedSlug)
        return (
          (requestedId !== '' && requestedId === personId) ||
          requestedSlug === personId ||
          requestedSlug === `id-${personId}` ||
          (personSlug !== '' && requestedSlug === personSlug) ||
          requestedSlug === generatedSlug ||
          (normalizedPersonSlug !== '' && normalizedRequestedSlug === normalizedPersonSlug) ||
          (normalizedGeneratedSlug !== '' && normalizedRequestedSlug === normalizedGeneratedSlug)
        )
      })
      if (person) {
        foundPerson = person
        blockTitle = block.title || ''
        break
      }
    }

    if (!foundPerson) {
      // Avoid hard 404 for legacy/invalid links and send users to instructors listing.
      redirect('/instructors')
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

    const slugSet = new Set<string>()

    for (const block of peopleBlocks) {
      for (const person of block.people || []) {
        const slug = person.slug || generateSlug(person.name || '')
        if (slug) {
          slugSet.add(slug)
        }
      }
    }

    // Include direct instructor collection slugs as fallback route targets.
    const instructors = await payload.find({
      collection: 'instructors' as any,
      limit: 200,
      overrideAccess: true,
    })

    for (const person of instructors.docs || []) {
      const id = String(person?.id || '').trim()
      const explicitSlug = String(person?.slug || '').trim()
      const generatedSlug = generateSlug(person?.name || '')

      if (generatedSlug) slugSet.add(generatedSlug)
      if (explicitSlug) slugSet.add(explicitSlug)
      if (id) slugSet.add(`id-${id}`)
    }

    return Array.from(slugSet).map((slug) => ({ slug }))
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
    const requestedSlug = decodeURIComponent(String(slug || '')).trim()
    const instructorsResult = await payload.find({
      collection: 'instructors' as any,
      limit: 500,
      overrideAccess: true,
    })

    const matchedFromCollection = (instructorsResult.docs || []).find((p: any) => {
      const personId = String(p?.id || '').trim()
      const personSlug = String(p?.slug || '').trim()
      const generatedSlug = generateSlug(p?.name || '')
      return (
        requestedSlug === personId ||
        requestedSlug === `id-${personId}` ||
        (personSlug !== '' && requestedSlug === personSlug) ||
        requestedSlug === generatedSlug
      )
    })

    if (matchedFromCollection) {
      return {
        title: `${matchedFromCollection.name} - CyPSi Laboratory`,
        description:
          matchedFromCollection.description ||
          `${matchedFromCollection.name} - ${matchedFromCollection.specialty || 'Team Member'} at CyPSi Laboratory`,
      }
    }

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
        const personId = String(p?.id || '').trim()
        const personSlug = String(p?.slug || '').trim()
        const generatedSlug = generateSlug(p?.name || '')
        return (
          requestedSlug === personId ||
          requestedSlug === `id-${personId}` ||
          (personSlug !== '' && requestedSlug === personSlug) ||
          requestedSlug === generatedSlug
        )
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
