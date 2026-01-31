import type { CollectionConfig } from 'payload'

// Type for user with role field
type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  allowedCollections?: string[]
  [key: string]: unknown
}

export const BlogPage: CollectionConfig = {
  slug: 'blog-page',
  admin: {
    useAsTitle: 'sectionName',
    defaultColumns: ['sectionName', 'sectionType', 'status'],
    group: 'Content Management',
    hidden: ({ user }) => {
      const u = user as UserWithRole | null
      if (!u) return true
      if (u.role === 'author') return true
      return false
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      const u = user as UserWithRole | null
      if (!u) return false
      if (!u.role || ['superadmin', 'admin', 'editor'].includes(u.role)) return true
      return false
    },
    update: ({ req: { user } }) => {
      const u = user as UserWithRole | null
      if (!u) return false
      if (!u.role || ['superadmin', 'admin', 'editor'].includes(u.role)) return true
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
      name: 'sectionName',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal name for this section (e.g., "Blog Page Title", "Hero Posts Grid")',
      },
    },
    {
      name: 'sectionType',
      type: 'select',
      required: true,
      options: [
        { label: 'Page Title', value: 'page-title' },
        { label: 'Blog Hero Grid', value: 'blog-hero' },
        { label: 'Blog Posts List', value: 'blog-posts' },
      ],
      admin: {
        description: 'Select the type of section',
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

    // PAGE TITLE SECTION
    {
      name: 'pageTitle',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'page-title',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'breadcrumbs',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
            },
            {
              name: 'isActive',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },

    // BLOG HERO GRID SECTION
    {
      name: 'blogHero',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'blog-hero',
      },
      fields: [
        {
          name: 'posts',
          type: 'array',
          minRows: 1,
          maxRows: 5,
          admin: {
            description: 'First post will be featured (large), rest will be regular size',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'date',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g., "Apr. 14th, 2025"',
              },
            },
            {
              name: 'category',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g., "Technology", "Security", "Career"',
              },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              required: true,
              defaultValue: '/blog-details',
            },
          ],
        },
      ],
    },

    // BLOG POSTS LIST SECTION
    {
      name: 'blogPosts',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'blog-posts',
      },
      fields: [
        {
          name: 'posts',
          type: 'array',
          minRows: 1,
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'date',
              type: 'group',
              fields: [
                {
                  name: 'day',
                  type: 'number',
                  required: true,
                  admin: {
                    description: 'e.g., 12',
                  },
                },
                {
                  name: 'month',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'e.g., "December"',
                  },
                },
              ],
            },
            {
              name: 'author',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g., "John Doe"',
              },
            },
            {
              name: 'category',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g., "Politics", "Economics", "Sports"',
              },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              required: true,
              defaultValue: '/blog-details',
            },
          ],
        },
      ],
    },
  ],
}
