'use client'

import { useParams } from 'next/navigation'
import SectionReorder from '../../../../../components/admin/SectionReorder'

const collectionTitles: { [key: string]: string } = {
  'home-page': 'Home Page Sections',
  'about-page': 'About Page Sections',
  'courses-page': 'Courses Page Sections',
  'people-page': 'People Page Sections',
  'contact-page': 'Contact Page Sections',
  'news-page': 'News Page Sections',
}

export default function ReorderPage() {
  const params = useParams()
  const collection = params.collection as string

  const title = collectionTitles[collection] || `${collection} Sections`

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ marginBottom: '20px' }}>
        <a 
          href={`/admin/collections/${collection}`}
          style={{
            color: '#0066cc',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          ← Back to {title}
        </a>
      </div>
      <SectionReorder collectionSlug={collection} title={`Reorder ${title}`} />
    </div>
  )
}
