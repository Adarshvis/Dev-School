import CMSInstructorsPage from './cms-instructors'

// Use ISR - revalidate every 60 seconds for better performance
export const revalidate = 60

export default function InstructorsPage() {
  return <CMSInstructorsPage />
}
