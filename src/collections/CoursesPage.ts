import type { CollectionConfig } from 'payload'

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
    singular: 'Courses Page',
    plural: 'Courses Page',
  },
  admin: {
    useAsTitle: 'sectionName',
    defaultColumns: ['sectionName', 'sectionType', 'updatedAt'],
    group: 'Content Management',
    description: 'Manage courses page sections.',
    hidden: ({ user }) => {
      const u = user as UserWithRole | null
      if (!u) return true
      if (u.role === 'author' && !u.allowedCollections?.includes('courses-page')) return true
      return false
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      const u = user as UserWithRole | null
      if (!u) return false
      if (!u.role || ['superadmin', 'admin', 'editor'].includes(u.role)) return true
      if (u.role === 'author') return u.allowedCollections?.includes('courses-page') || false
      return false
    },
    update: ({ req: { user } }) => {
      const u = user as UserWithRole | null
      if (!u) return false
      if (!u.role || ['superadmin', 'admin', 'editor'].includes(u.role)) return true
      if (u.role === 'author') return u.allowedCollections?.includes('courses-page') || false
      return false
    },
    delete: ({ req: { user } }) => {
      const u = user as UserWithRole | null
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
        { label: 'Filters Sidebar', value: 'filters' },
        { label: 'Courses Grid', value: 'courses-grid' },
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

    // FILTERS SIDEBAR
    {
      name: 'filters',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'filters',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Filter Courses',
        },
        {
          name: 'categoryFilters',
          type: 'array',
          label: 'Category Filters',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },
        {
          name: 'levelFilters',
          type: 'array',
          label: 'Level Filters',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },
        {
          name: 'durationFilters',
          type: 'array',
          label: 'Duration Filters',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },
        {
          name: 'priceFilters',
          type: 'array',
          label: 'Price Filters',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },
      ],
    },

    // COURSES GRID
    {
      name: 'coursesGrid',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'courses-grid',
      },
      fields: [
        {
          name: 'searchPlaceholder',
          type: 'text',
          defaultValue: 'Search courses...',
        },
        {
          name: 'sortOptions',
          type: 'array',
          label: 'Sort Options',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },
        {
          name: 'courses',
          type: 'array',
          label: 'Course Cards',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'badge',
              type: 'select',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Best Seller', value: 'best-seller' },
                { label: 'New', value: 'new' },
                { label: 'Popular', value: 'popular' },
                { label: 'Free', value: 'free' },
                { label: 'Certificate', value: 'certificate' },
              ],
            },
            {
              name: 'price',
              type: 'text',
              required: true,
            },
            {
              name: 'category',
              type: 'text',
              required: true,
            },
            {
              name: 'level',
              type: 'select',
              required: true,
              options: [
                { label: 'Beginner', value: 'Beginner' },
                { label: 'Intermediate', value: 'Intermediate' },
                { label: 'Advanced', value: 'Advanced' },
              ],
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
              name: 'duration',
              type: 'text',
              required: true,
            },
            {
              name: 'studentCount',
              type: 'text',
              required: true,
            },
            {
              name: 'rating',
              type: 'number',
              required: true,
              min: 0,
              max: 5,
              admin: {
                step: 0.1,
              },
            },
            {
              name: 'reviewCount',
              type: 'number',
              required: true,
            },
            {
              name: 'instructorAvatar',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'instructorName',
              type: 'text',
              required: true,
            },
            {
              name: 'enrollLink',
              type: 'text',
              defaultValue: '/enroll',
            },
          ],
        },
      ],
    },
  ],
}
