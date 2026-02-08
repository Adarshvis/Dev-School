import CMSContactPage from './cms-contact'

// Use ISR - revalidate every 60 seconds for better performance
export const revalidate = 60

export default function ContactPage() {
  return <CMSContactPage />
}
