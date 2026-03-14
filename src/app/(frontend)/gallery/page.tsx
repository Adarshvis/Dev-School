import Link from 'next/link'
import { getPageContent } from '@/lib/payload'

// Use ISR
export const revalidate = 60

type GalleryImage = {
  image: any
  caption?: string
  alt?: string
}

type GalleryBlock = {
  title?: string
  description?: string
  images?: GalleryImage[]
}

function getSectionBlocks(section: any): any[] {
  const fromCustom = Array.isArray(section?.customBlock) ? section.customBlock : []
  if (fromCustom.length > 0) return fromCustom

  const fromContent = Array.isArray(section?.contentBlocks) ? section.contentBlocks : []
  if (fromContent.length > 0) return fromContent

  return []
}

export default async function GalleryPage() {
  const homeSections = await getPageContent('home')
  const sections = Array.isArray(homeSections) ? homeSections : []

  const galleryBlocks: GalleryBlock[] = []

  for (const section of sections) {
    const blocks = getSectionBlocks(section)
    for (const block of blocks) {
      if (block?.blockType === 'imageGallery' && Array.isArray(block?.images) && block.images.length > 0) {
        galleryBlocks.push({
          title: block?.title,
          description: block?.description,
          images: block.images,
        })
      }
    }
  }

  const totalImages = galleryBlocks.reduce((sum, block) => sum + (block.images?.length || 0), 0)

  return (
    <>
      <div className="page-title light-background">
        <div className="container d-lg-flex justify-content-between align-items-center">
          <h1 className="mb-2 mb-lg-0">Gallery</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li className="current">Gallery</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          {galleryBlocks.length === 0 ? (
            <div className="text-center py-4">
              <h3>No gallery images found</h3>
              <p className="mb-3">Add an Image Gallery block on Home page to show images here.</p>
              <Link href="/" className="btn btn-primary">Back to Home</Link>
            </div>
          ) : (
            <>
              <div className="section-title text-center mb-4">
                <h2>All Gallery Images</h2>
                <p>{totalImages} images</p>
              </div>

              {galleryBlocks.map((gallery, galleryIndex) => (
                <div key={galleryIndex} className="mb-5">
                  {(gallery.title || gallery.description) && (
                    <div className="mb-3">
                      {gallery.title ? <h4>{gallery.title}</h4> : null}
                      {gallery.description ? <p className="mb-0">{gallery.description}</p> : null}
                    </div>
                  )}

                  <div className="row gy-4">
                    {(gallery.images || []).map((item: GalleryImage, imageIndex: number) => (
                      <div key={`${galleryIndex}-${imageIndex}`} className="col-xl-3 col-lg-4 col-md-6">
                        <div className="gallery-item">
                          <img
                            src={typeof item.image === 'object' ? item.image?.url : item.image}
                            alt={item.alt || item.caption || `Gallery image ${imageIndex + 1}`}
                            className="img-fluid rounded"
                          />
                          {item.caption ? <p className="mt-2 mb-0 text-center">{item.caption}</p> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </>
  )
}
