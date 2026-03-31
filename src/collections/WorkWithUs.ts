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

export const WorkWithUs: CollectionConfig = {
  slug: 'work-with-us',
  labels: {
    singular: 'Work With Us',
    plural: 'Work With Us',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content Management',
    hidden: ({ user }) => {
      const u = user as UserWithRole | null
      if (!u) return true
      if (u.role === 'author') return true  // Authors typically can't edit Work With Us
      return false
    },
  },
  access: {
    read: () => true,
    create: ({ req }) => {
      if (!req) return false
      const u = req.user as UserWithRole | null
      if (!u) return false
      if (!u.role || ['superadmin', 'admin', 'editor'].includes(u.role)) return true
      return false
    },
    update: ({ req }) => {
      if (!req) return false
      const u = req.user as UserWithRole | null
      if (!u) return false
      if (!u.role || ['superadmin', 'admin', 'editor'].includes(u.role)) return true
      return false
    },
    delete: ({ req }) => {
      if (!req) return false
      const u = req.user as UserWithRole | null
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
      name: '_status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Draft programs are hidden from website, Published programs are visible',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Program title (e.g., "PhD Programme", "Incubation")',
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
        description: 'Full content for the program detail page',
      },
    },
    {
      name: 'problemDomainsTitle',
      type: 'text',
      defaultValue: 'Problem Domains',
      admin: {
        description: 'Section title shown above the problem domains accordion',
      },
    },
    {
      name: 'problemDomainsSubtitle',
      type: 'textarea',
      admin: {
        description: 'Optional subtitle shown below the problem domains title',
      },
    },
    {
      name: 'problemDomains',
      type: 'array',
      admin: {
        description: 'Expandable problem domains  (only for Job Posting)',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Domain title (e.g., "ML/DL Based Systems for Education 4.0")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Overview of the problem domain',
          },
        },
        {
          name: 'challenges',
          type: 'array',
          admin: {
            description: 'Research challenges/tasks for interns',
          },
          fields: [
            {
              name: 'challenge',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'technicalSkills',
          type: 'array',
          admin: {
            description: 'Required technical skills',
          },
          fields: [
            {
              name: 'skill',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'nonTechnicalSkills',
          type: 'array',
          admin: {
            description: 'Required non-technical skills',
          },
          fields: [
            {
              name: 'skill',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'applyButtonText',
      type: 'text',
      admin: {
        description: 'Apply button text (e.g., "Apply Now")',
      },
    },
    {
      name: 'applyButtonLink',
      type: 'text',
      admin: {
        description: 'Apply button URL (e.g., "https://forms.du.ac.in/...")',
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
