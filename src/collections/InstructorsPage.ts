import type { CollectionConfig } from 'payload'

// Type for user with role field
type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  allowedCollections?: string[]
  [key: string]: unknown
}

export const InstructorsPage: CollectionConfig = {
  slug: 'instructors-page',
  labels: {
    singular: 'Instructors Page',
    plural: 'Instructors Page',
  },
  admin: {
    useAsTitle: 'sectionName',
    defaultColumns: ['sectionName', 'sectionType', 'updatedAt'],
    group: 'Content Management',
    description: 'Manage instructors page sections.',
    hidden: ({ user }) => {
      const u = user as UserWithRole | null
      if (!u) return true
      if (u.role === 'author') return true
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
  fields: [
    {
      name: 'order',
      type: 'number',
      required: false,
      defaultValue: 0,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'sectionName',
      type: 'text',
      required: true,
    },
    {
      name: 'sectionType',
      type: 'select',
      required: true,
      options: [
        { label: 'Page Title', value: 'page-title' },
        { label: 'Instructors Grid', value: 'instructors-grid' },
      ],
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

    // PAGE TITLE
    {
      name: 'pageTitle',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'page-title',
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'breadcrumbs',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'link', type: 'text' },
            { name: 'isActive', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },

    // INSTRUCTORS GRID
    {
      name: 'instructorsGrid',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'instructors-grid',
      },
      fields: [
        {
          name: 'instructors',
          type: 'array',
          label: 'Instructors',
          admin: {
            description: 'Add instructors to display in this section',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Profile photo',
              },
            },
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description: 'Full name',
              },
            },
            {
              name: 'specialty',
              type: 'text',
              required: false,
              admin: {
                description: 'Role or title (e.g., "Professor", "Research Scholar")',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              required: false,
              admin: {
                description: 'Short bio or credentials',
              },
            },
            {
              name: 'rating',
              type: 'number',
              required: false,
              defaultValue: 5,
              min: 0,
              max: 5,
              admin: {
                description: 'Rating (0-5)',
              },
            },
            {
              name: 'courseCount',
              type: 'number',
              required: false,
              defaultValue: 0,
              admin: {
                description: 'Number of courses',
              },
            },
            {
              name: 'studentCount',
              type: 'text',
              required: false,
              admin: {
                description: 'e.g., "2.1k" or "2100"',
              },
            },
            {
              name: 'profileLink',
              type: 'text',
              required: false,
              admin: {
                description: 'Link to profile page',
              },
            },
            {
              name: 'socialLinks',
              type: 'array',
              admin: {
                description: 'Social media profiles',
              },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: false,
                  options: [
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Twitter/X', value: 'twitter' },
                    { label: 'GitHub', value: 'github' },
                    { label: 'Dribbble', value: 'dribbble' },
                    { label: 'Behance', value: 'behance' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'YouTube', value: 'youtube' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
