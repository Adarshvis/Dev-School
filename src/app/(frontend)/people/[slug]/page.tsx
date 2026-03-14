import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import InstructorProfileClient from '../../instructors/[slug]/InstructorProfileClient'

// Use ISR - revalidate every 60 seconds for better performance
export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

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

function extractIdFromProfileLink(value: string): string {
  const raw = String(value || '').trim()
  if (!raw) return ''

  const normalized = raw
    .replace(/^\/?people-id-/i, '/people/id-')
    .replace(/^\/?instructors-id-/i, '/people/id-')
    .replace(/^\/?instructors\//i, '/people/')
    .replace(/^\/?people-profile\//i, '/people/')
    .replace(/^\/?instructor-profile\//i, '/people/')

  const idMatch = normalized.match(/\/people\/id-([a-fA-F0-9]{24})(?:$|[/?#])/i)
  return idMatch?.[1] || ''
}

function getSectionBlocks(section: any): any[] {
  const fromCustom = Array.isArray(section?.customBlock) ? section.customBlock : []
  if (fromCustom.length > 0) return fromCustom

  const fromContent = Array.isArray(section?.contentBlocks) ? section.contentBlocks : []
  if (fromContent.length > 0) return fromContent

  return []
}

export default async function PeopleProfilePage({ params }: PageProps) {
  const { slug } = await params

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
    limit: 2000,
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

  if (!foundPerson) {
    // Fallback for manual Home featured cards that may store profileLink with legacy/mismatched IDs.
    const homeSections = await payload.find({
      collection: 'home-page' as any,
      where: {
        and: [
          { status: { equals: 'active' } },
          { sectionType: { equals: 'featured-instructors' } },
        ],
      },
      limit: 100,
      depth: 1,
      overrideAccess: true,
    })

    for (const section of homeSections.docs || []) {
      const cards = section?.featuredInstructors?.instructors || []
      const matchedCard = cards.find((card: any) => {
        const link = String(card?.profileLink || '').trim()
        if (!link) return false

        const extractedId = extractIdFromProfileLink(link)
        if (requestedId && extractedId && requestedId === extractedId) return true

        const normalizedLink = link
          .replace(/^\/?people-id-/i, '/people/id-')
          .replace(/^\/?instructors-id-/i, '/people/id-')
          .replace(/^\/?instructors\//i, '/people/')
          .replace(/^\/?people-profile\//i, '/people/')
          .replace(/^\/?instructor-profile\//i, '/people/')

        return normalizedLink.endsWith(`/people/${requestedSlug}`) || normalizedLink.includes(`/people/${requestedSlug}?`)
      })

      if (matchedCard) {
        foundPerson = {
          name: matchedCard?.name || 'Team Member',
          description: matchedCard?.description || '',
          specialty: matchedCard?.specialty || '',
          image: matchedCard?.image,
          socialLinks: matchedCard?.socialLinks || [],
        }
        break
      }
    }
  }

  if (!foundPerson) {
    // Fallback for embedded people block data used on home/custom sections.
    const homeSectionsAll = await payload.find({
      collection: 'home-page' as any,
      limit: 200,
      depth: 2,
      overrideAccess: true,
    })

    for (const section of homeSectionsAll.docs || []) {
      const blocks = getSectionBlocks(section)
      for (const block of blocks) {
        if (block?.blockType !== 'people') continue

        const people = Array.isArray(block?.people) ? block.people : []
        const matchedPerson = people.find((p: any) => {
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

        if (matchedPerson) {
          foundPerson = matchedPerson
          break
        }
      }

      if (foundPerson) break
    }
  }

  if (!foundPerson) notFound()

  return (
    <InstructorProfileClient
      person={foundPerson}
      blockTitle=""
      listingPath="/people"
      listingLabel="People"
    />
  )
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config })

    const instructors = await payload.find({
      collection: 'instructors' as any,
      limit: 500,
      overrideAccess: true,
    })

    const slugSet = new Set<string>()

    for (const person of instructors.docs || []) {
      const id = String(person?.id || '').trim()
      const explicitSlug = String(person?.slug || '').trim()
      const generatedSlug = generateSlug(person?.name || '')

      if (generatedSlug) slugSet.add(generatedSlug)
      if (explicitSlug) slugSet.add(explicitSlug)
      if (id) slugSet.add(`id-${id}`)
    }

    return Array.from(slugSet).map((entry) => ({ slug: entry }))
  } catch (error) {
    console.error('Error generating static params for people profile:', error)
    return []
  }
}

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

    const matchedPerson = (instructorsResult.docs || []).find((p: any) => {
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

    if (matchedPerson) {
      return {
        title: `${matchedPerson.name} - CyPSi Laboratory`,
        description:
          matchedPerson.description ||
          `${matchedPerson.name} - ${matchedPerson.specialty || 'Team Member'} at CyPSi Laboratory`,
      }
    }

    return {
      title: 'People Profile - CyPSi Laboratory',
    }
  } catch (error) {
    return {
      title: 'People Profile - CyPSi Laboratory',
    }
  }
}
