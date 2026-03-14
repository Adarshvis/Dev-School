import type { CollectionConfig } from 'payload'
import { contentBlocksField } from '@/fields/contentBlocks'

// Type for user with role field
type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  allowedCollections?: string[]
  [key: string]: unknown
}

export const PeoplePage: CollectionConfig = {
  slug: 'people-page',
  labels: {
    singular: 'People Page',
    plural: 'People Page',
  },
  admin: {
    useAsTitle: 'sectionName',
    defaultColumns: ['sectionName', 'sectionType', 'updatedAt'],
    group: 'Content Management',
    description: 'Manage people/instructors page sections.',
    hidden: ({ user }) => {
      const u = user as UserWithRole | null
      if (!u) return true
      if (u.role === 'author') return true  // Authors typically can't edit page layouts
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
        { label: 'People Grid', value: 'people-grid' },
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
    {
      ...contentBlocksField,
      admin: {
        ...contentBlocksField.admin,
        description: 'Optional content blocks rendered after this People section.',
      },
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

    // PEOPLE GRID
    {
      name: 'peopleGrid',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'people-grid',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: false,
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
        },
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'grid-4',
          options: [
            { label: '3 Columns', value: 'grid-3' },
            { label: '4 Columns', value: 'grid-4' },
            { label: '5 Columns', value: 'grid-5' },
            { label: '6 Columns', value: 'grid-6' },
          ],
        },
        {
          name: 'showStats',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show student count and rating',
          },
        },
        {
          name: 'showSocialLinks',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Display social media links',
          },
        },
        {
          name: 'autoFetch',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Automatically fetch published instructors',
          },
        },
      ],
    },
  ],
}
