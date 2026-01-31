import type { CollectionConfig } from 'payload'

// Type for user with role field
type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  allowedCollections?: string[]
  [key: string]: unknown
}

const formatSlug = (val: string): string => {
  return val
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .toLowerCase()             // Convert to lowercase
    .trim()
}

export const ResearchDomains: CollectionConfig = {
  slug: 'research-domains',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content Management',
    hidden: ({ user }) => {
      const u = user as UserWithRole | null
      if (!u) return true
      if (u.role === 'author' && !u.allowedCollections?.includes('research-domains')) return true
      return false
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      const u = user as UserWithRole | null
      if (!u) return false
      if (!u.role || ['superadmin', 'admin', 'editor'].includes(u.role)) return true
      if (u.role === 'author') return u.allowedCollections?.includes('research-domains') || false
      return false
    },
    update: ({ req: { user } }) => {
      const u = user as UserWithRole | null
      if (!u) return false
      if (!u.role || ['superadmin', 'admin', 'editor'].includes(u.role)) return true
      if (u.role === 'author') return u.allowedCollections?.includes('research-domains') || false
      return false
    },
    delete: ({ req: { user } }) => {
      const u = user as UserWithRole | null
      if (!u) return false
      if (!u.role || ['superadmin', 'admin'].includes(u.role)) return true
      return false
    },
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.title && !data?.slug) {
          data.slug = formatSlug(data.title)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Research domain title (e.g., "Artificial Intelligence", "Data Science")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version (auto-generated from title, but you can edit it)',
        readOnly: false,
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (data?.title && !value) {
              return formatSlug(data.title)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short description for preview cards (optional)',
      },
    },
    {
      name: 'effectiveDate',
      type: 'text',
      admin: {
        description: 'Optional effective date (e.g., "Last Updated: December 2025")',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Full content for the research domain detail page',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
  ],
}
