import CMSHomePage from '../cms-page-reordered'

// Use ISR - revalidate every 60 seconds for better performance
export const revalidate = 60

export default function HomeLandingPage() {
  return <CMSHomePage />
}
