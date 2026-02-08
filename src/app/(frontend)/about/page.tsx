import CMSAboutPage from './cms-about'

// Use ISR - revalidate every 60 seconds for better performance
export const revalidate = 60

export default function AboutPage() {
  return <CMSAboutPage />
}
