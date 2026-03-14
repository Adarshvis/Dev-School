import type { GlobalConfig } from 'payload'

// Type for user with role field
type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  [key: string]: unknown
}

export const EnrollPage: GlobalConfig = {
  slug: 'apply-now',
  label: 'Apply Now',
  admin: {
    group: 'Content Management',
    hidden: ({ user }) => {
      const u = user as UserWithRole | null
      if (!u) return true
      // Only show to superadmin, admin, and editor
      if (u.role === 'author') return true
      return false
    },
  },
  access: {
    read: () => true,
    update: ({ req }) => {
      if (!req) return false
      const u = req.user as UserWithRole | null
      if (!u) return false
      // Only superadmin, admin, and editor can update
      if (!u.role || ['superadmin', 'admin', 'editor'].includes(u.role)) return true
      return false
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Apply Now',
      admin: {
        description: 'Title for admin reference (e.g., "Application Form Settings")',
      },
    },
    {
      name: 'redirectUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'External URL to redirect to (e.g., Google Forms, Typeform, custom enrollment system)',
        placeholder: 'https://forms.google.com/...',
      },
    },
    {
      name: 'openInNewTab',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Open enrollment link in a new tab',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description for admin reference',
        placeholder: 'e.g., "Main enrollment form for all courses"',
      },
    },
  ],
}
