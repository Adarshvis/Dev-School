'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { lexicalToHtml } from '@/lib/lexicalToHtml'
import { BlockRenderer } from '@/app/(frontend)/components/BlockRenderer'
import AOS from 'aos'
// @ts-ignore
import 'aos/dist/aos.css'

interface FlagshipEvent {
  id: string
  title: string
  slug: string
  content: any
  contentBlocks?: any[]
}

interface Props {
  slug: string
}

export default function FlagshipEventDetail({ slug }: Props) {
  const [event, setEvent] = useState<FlagshipEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [contentHtml, setContentHtml] = useState('')

  useEffect(() => {
    AOS.init({ duration: 800, once: true })
  }, [])

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/flagship-events?where[slug][equals]=${encodeURIComponent(slug)}&depth=2&limit=1`)
        const data = await res.json()
        if (data.docs && data.docs.length > 0) {
          const doc = data.docs[0]
          setEvent(doc)
          if (doc.content) {
            const html = await lexicalToHtml(doc.content)
            setContentHtml(html)
          }
        }
      } catch (error) {
        console.error('Error fetching flagship event:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [slug])

  if (loading) {
    return (
      <main className="main">
        <div className="container py-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </main>
    )
  }

  if (!event) {
    return (
      <main className="main">
        <div className="container py-5 text-center">
          <h2>Event Not Found</h2>
          <p>The event you are looking for does not exist.</p>
          <Link href="/" className="btn btn-primary mt-3">Back to Home</Link>
        </div>
      </main>
    )
  }

  const imageUrl = null
  const formattedDate = null

  return (
    <main className="main">
      {/* Page Title / Breadcrumb */}
      <div className="page-title light-background">
        <div className="container d-lg-flex justify-content-between align-items-center">
          <h1 className="mb-2 mb-lg-0">{event.title}</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li className="current">{event.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Content */}
      <section className="section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8" data-aos="fade-up">
              <div
                className="flagship-event-content"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
                style={{ fontSize: '1.05rem', lineHeight: 1.8 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Blocks */}
      {event.contentBlocks && event.contentBlocks.length > 0 && (
        <BlockRenderer blocks={event.contentBlocks} />
      )}

      <style jsx>{`
        .flagship-event-content h2,
        .flagship-event-content h3 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .flagship-event-content p {
          margin-bottom: 1em;
        }
        .flagship-event-content img {
          max-width: 100%;
          border-radius: 8px;
          margin: 1em 0;
        }
      `}</style>
    </main>
  )
}
