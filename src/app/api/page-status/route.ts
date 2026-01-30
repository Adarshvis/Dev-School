import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Fetch from Settings global instead of individual page collections
    const settings = await payload.findGlobal({
      slug: 'settings',
    })

    const pageStatus = {
      about: (settings as any).aboutPageActive ?? true,
      courses: (settings as any).coursesPageActive ?? true,
      people: (settings as any).peoplePageActive ?? true,
      news: (settings as any).newsPageActive ?? true,
      blog: (settings as any).blogPageActive ?? true,
      contact: (settings as any).contactPageActive ?? true,
      enroll: (settings as any).enrollPageActive ?? true,
    }

    return NextResponse.json(pageStatus)
  } catch (error) {
    console.error('Error fetching page status from settings:', error)
    // Return all active by default if error
    return NextResponse.json({
      about: true,
      courses: true,
      people: true,
      news: true,
      blog: true,
      contact: true,
      enroll: true,
    })
  }
}
