import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const pageStatus = {
      about: true,
      courses: true,
      people: true,
      news: true,
      blog: true,
      contact: true,
      enroll: true,
    }

    return NextResponse.json(pageStatus)
  } catch (error) {
    console.error('Error fetching page status:', error)
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
