import { getSettings } from '@/lib/settings'
import { redirect } from 'next/navigation'
import CMSHomePage from './cms-page-reordered'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const settings = await getSettings() as any
  const selectedHomePage = settings?.homePage || 'home'
  
  // If a different page is selected as home, redirect to it
  if (selectedHomePage !== 'home') {
    redirect(`/${selectedHomePage}`)
  }
  
  // Default: render the original home page
  return <CMSHomePage />
}
