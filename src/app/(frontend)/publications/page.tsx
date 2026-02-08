import CMSPublicationsPage from './cms-publications'

// Use ISR - revalidate every 60 seconds instead of force-dynamic
export const revalidate = 60

export default function PublicationsPage() {
  return <CMSPublicationsPage />
}
