import CMSBlogDetailsPage from '../cms-blog-details'

interface BlogDetailsProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogDetailsPage({ params }: BlogDetailsProps) {
  const { slug } = await params
  return <CMSBlogDetailsPage slug={slug} />
}
