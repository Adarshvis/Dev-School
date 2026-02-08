import CMSCoursesPage from './cms-courses'

// Use ISR - revalidate every 60 seconds for better performance
export const revalidate = 60

export default function CoursesPage() {
  return <CMSCoursesPage />
}
