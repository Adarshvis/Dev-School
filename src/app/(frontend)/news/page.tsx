import CMSNewsPage from './cms-news'

// Use ISR - revalidate every 60 seconds for better performance
export const revalidate = 60

export default function NewsPage() {
  return <CMSNewsPage />
}
