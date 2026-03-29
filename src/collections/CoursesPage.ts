import type { CollectionConfig } from 'payload'
import { hasAdminOnlyAccess, hasCollectionAccess } from '@/lib/access'

// Type for user with role field
type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  allowedCollections?: string[]
  [key: string]: unknown
}

export const CoursesPage: CollectionConfig = {
  slug: 'courses-page',
  labels: {
    singular: 'Facilites',
    plural: 'Facilites',
  },
  admin: {
    useAsTitle: 'sectionName',
    defaultColumns: ['sectionName', 'sectionType', 'updatedAt'],
    group: 'Content Management',
    description: 'Manage courses page sections.',
    hidden: ({ user }) => {
      const u = user as UserWithRole | null
      if (!u) return true
      if (u.role === 'author') {
        const allowed = u.allowedCollections || []
        if (!allowed.includes('courses-page')) return true
      }
      return false
    },
  },
  access: {
    read: () => true,
    create: ({ req }) => hasCollectionAccess(req, 'courses-page'),
    update: ({ req }) => hasCollectionAccess(req, 'courses-page'),
    delete: ({ req }) => hasAdminOnlyAccess(req),
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
        { label: 'Facilities Grid', value: 'courses-grid' },
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

    // FACILITIES GRID
    {
      name: 'coursesGrid',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'courses-grid',
      },
      fields: [
        {
          name: 'courses',
          type: 'array',
          label: 'Facility Cards',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
            {
              name: 'showViewMoreButton',
              type: 'checkbox',
              defaultValue: false,
              label: 'Show View More Button',
            },
            {
              name: 'viewMoreText',
              type: 'text',
              defaultValue: 'View More',
              admin: {
                condition: (data, siblingData) => siblingData?.showViewMoreButton === true,
              },
            },
            {
              name: 'viewMoreLink',
              type: 'text',
              defaultValue: '',
              admin: {
                condition: (data, siblingData) => siblingData?.showViewMoreButton === true,
                description: 'Optional URL for the View More button',
              },
            },
          ],
        },
      ],
    },
  ],
}
