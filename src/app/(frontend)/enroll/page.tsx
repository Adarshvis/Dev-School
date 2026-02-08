import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'

// Use ISR - revalidate every 60 seconds for better performance
export const revalidate = 60

interface ApplyNowSettings {
  redirectUrl?: string
  openInNewTab?: boolean
}

export default async function EnrollPage() {
  try {
    const payload = await getPayload({ config })
    const applyNow = await payload.findGlobal({
      slug: 'apply-now' as 'settings',
    }) as unknown as ApplyNowSettings

    if (applyNow?.redirectUrl) {
      redirect(applyNow.redirectUrl)
    }

    // If no redirect URL is set, show message
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Apply Now</h2>
          <p>Please configure the application redirect URL in Apply Now settings</p>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Apply Now</h2>
          <p>Error loading application page. Please try again later.</p>
        </div>
      </div>
    )
  }
}
