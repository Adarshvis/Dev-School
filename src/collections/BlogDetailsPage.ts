import type { CollectionConfig } from 'payload'

// Type for user with role field
type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  allowedCollections?: string[]
  [key: string]: unknown
}

export const BlogDetailsPage: CollectionConfig = {
  slug: 'blog-details-page',
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
        description: 'Internal name for this section (e.g., "Blog Details Page Title", "Article Content")',
      },
    },
    {
      name: 'sectionType',
      type: 'select',
      required: true,
      options: [
        { label: 'Page Title', value: 'page-title' },
        { label: 'Article Header', value: 'article-header' },
        { label: 'Article Content', value: 'article-content' },
        { label: 'Comments Section', value: 'comments' },
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

    // ARTICLE HEADER SECTION
    {
      name: 'articleHeader',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'article-header',
      },
      fields: [
        {
          name: 'categories',
          type: 'array',
          minRows: 1,
          admin: {
            description: 'Article categories/tags shown above title',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              defaultValue: '#',
            },
          ],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Main article title',
          },
        },
        {
          name: 'author',
          type: 'group',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'role',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'postInfo',
          type: 'group',
          fields: [
            {
              name: 'date',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g., "April 15, 2025"',
              },
            },
            {
              name: 'readTime',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g., "10 min read"',
              },
            },
            {
              name: 'commentsCount',
              type: 'number',
              required: true,
            },
          ],
        },
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'tableOfContents',
          type: 'array',
          admin: {
            description: 'Table of contents items',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'anchor',
              type: 'text',
              required: true,
              admin: {
                description: 'Anchor ID without # (e.g., "introduction")',
              },
            },
          ],
        },
        {
          name: 'tags',
          type: 'array',
          admin: {
            description: 'Related topic tags shown at bottom',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              defaultValue: '#',
            },
          ],
        },
      ],
    },

    // ARTICLE CONTENT SECTION
    {
      name: 'articleContent',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'article-content',
      },
      fields: [
        {
          name: 'sections',
          type: 'array',
          admin: {
            description: 'Content sections of the article',
          },
          fields: [
            {
              name: 'sectionId',
              type: 'text',
              required: true,
              admin: {
                description: 'ID for anchor linking (e.g., "introduction")',
              },
            },
            {
              name: 'heading',
              type: 'text',
              admin: {
                description: 'Section heading (optional for introduction)',
              },
            },
            {
              name: 'content',
              type: 'textarea',
              required: true,
            },
            {
              name: 'hasQuote',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'quote',
              type: 'group',
              admin: {
                condition: (data, siblingData) => siblingData.hasQuote,
              },
              fields: [
                {
                  name: 'text',
                  type: 'textarea',
                  required: true,
                },
                {
                  name: 'author',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'hasImage',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'image',
              type: 'group',
              admin: {
                condition: (data, siblingData) => siblingData.hasImage,
              },
              fields: [
                {
                  name: 'file',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                },
                {
                  name: 'position',
                  type: 'select',
                  options: [
                    { label: 'Left', value: 'left' },
                    { label: 'Right', value: 'right' },
                    { label: 'Center', value: 'center' },
                  ],
                  defaultValue: 'center',
                },
              ],
            },
          ],
        },
      ],
    },

    // COMMENTS SECTION
    {
      name: 'comments',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'comments',
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Community Feedback',
        },
        {
          name: 'totalComments',
          type: 'number',
          required: true,
        },
        {
          name: 'commentThreads',
          type: 'array',
          admin: {
            description: 'Top-level comments with optional replies',
          },
          fields: [
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'authorName',
              type: 'text',
              required: true,
            },
            {
              name: 'timeAgo',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g., "2 hours ago"',
              },
            },
            {
              name: 'likes',
              type: 'number',
              defaultValue: 0,
            },
            {
              name: 'commentText',
              type: 'textarea',
              required: true,
            },
            {
              name: 'replies',
              type: 'array',
              admin: {
                description: 'Nested replies to this comment',
              },
              fields: [
                {
                  name: 'avatar',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'authorName',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'timeAgo',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'likes',
                  type: 'number',
                  defaultValue: 0,
                },
                {
                  name: 'commentText',
                  type: 'textarea',
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
