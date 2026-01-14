import { redirect } from 'next/navigation'

export default function BlogDetailsPage() {
  // Redirect to blog page if no slug is provided
  redirect('/blog')
}
