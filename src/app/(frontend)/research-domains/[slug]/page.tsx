import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

interface ResearchDomainData {
  title: string
  slug: string
  content: any
  effectiveDate?: string
  excerpt?: string
}

async function getResearchDomain(slug: string): Promise<ResearchDomainData | null> {
  try {
    const payload = await getPayload({ config })
    const data = await payload.find({
      collection: 'research-domains' as 'media',
      where: {
        slug: { equals: slug },
        status: { equals: 'active' },
      },
      limit: 1,
      depth: 2,
    })
    return data.docs && data.docs.length > 0 ? (data.docs[0] as unknown as ResearchDomainData) : null
  } catch (error) {
    return null
  }
}

function renderRichText(content: any): string {
  if (!content || !content.root || !content.root.children) return ''
  
  let html = ''
  
  content.root.children.forEach((node: any) => {
    if (node.type === 'heading') {
      const level = node.tag || 'h2'
      const text = node.children?.map((child: any) => child.text).join('') || ''
      html += `<${level}>${text}</${level}>`
    } else if (node.type === 'paragraph') {
      const text = node.children?.map((child: any) => {
        if (child.bold) return `<strong>${child.text}</strong>`
        if (child.italic) return `<em>${child.text}</em>`
        return child.text || ''
      }).join('') || ''
      html += `<p>${text}</p>`
    } else if (node.type === 'list') {
      const tag = node.listType === 'number' ? 'ol' : 'ul'
      const items = node.children?.map((item: any) => {
        const itemText = item.children?.map((child: any) => child.children?.map((c: any) => c.text).join('')).join('') || ''
        return `<li>${itemText}</li>`
      }).join('') || ''
      html += `<${tag}>${items}</${tag}>`
    }
  })
  
  return html
}

export default async function ResearchDomainDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const domain = await getResearchDomain(slug)
  
  if (!domain) {
    notFound()
  }
  
  const contentHTML = renderRichText(domain.content)
  
  return (
    <main className="main">
      {/* Page Title */}
      <div className="page-title light-background">
        <div className="container d-lg-flex justify-content-between align-items-center">
          <h1 className="mb-2 mb-lg-0">{domain.title}</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li className="current">{domain.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Research Domain Content Section */}
      <section id="research-domain" className="privacy section">
        <div className="container" data-aos="fade-up">
          {/* Header */}
          {domain.effectiveDate && (
            <div className="privacy-header" data-aos="fade-up">
              <div className="header-content">
                <div className="last-updated">{domain.effectiveDate}</div>
                <h1>{domain.title}</h1>
                {domain.excerpt && <p className="intro-text">{domain.excerpt}</p>}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="privacy-content" data-aos="fade-up">
            <div className="content-section" dangerouslySetInnerHTML={{ __html: contentHTML }} />
          </div>
        </div>
      </section>
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const domain = await getResearchDomain(slug)
  
  if (!domain) {
    return {
      title: 'Research Domain Not Found'
    }
  }
  
  return {
    title: `${domain.title} - Research Domains`,
    description: domain.excerpt || `Learn about ${domain.title}`,
  }
}
