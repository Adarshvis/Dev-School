import CMSNewsDetailsPage from '../cms-news-details'

// Use ISR - revalidate every 60 seconds for better performance
export const revalidate = 60

interface NewsDetailsProps {
  params: Promise<{
    slug: string
  }>
}

export default async function NewsDetailsPage({ params }: NewsDetailsProps) {
  const { slug } = await params
  
  return <CMSNewsDetailsPage slug={slug} />
}
