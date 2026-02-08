import CMSBlogPage from './cms-blog'

// Use ISR - revalidate every 60 seconds for better performance
export const revalidate = 60

export default function BlogPage() {
  return <CMSBlogPage />
}
