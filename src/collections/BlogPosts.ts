import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedDate', '_status'],
    group: 'Content Management',
  },
  access: {
    read: () => true,
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
        description: 'Draft posts are hidden from website, Published posts are visible',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Main blog post title',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of title (e.g., "my-first-blog-post")',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief summary/excerpt shown on blog listing pages',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Main image shown on blog cards and detail page',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'Web Development', value: 'web-development' },
        { label: 'Data Science', value: 'data-science' },
        { label: 'Design', value: 'design' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Business', value: 'business' },
        { label: 'General', value: 'general' },
      ],
    },
    {
      name: 'authorType',
      type: 'select',
      required: true,
      defaultValue: 'manual',
      options: [
        { label: 'Manual Entry', value: 'manual' },
        { label: 'Select from Instructors', value: 'instructor' },
      ],
      admin: {
        description: 'Choose how to add author information',
      },
    },
    // Manual Author Fields
    {
      name: 'authorName',
      type: 'text',
      admin: {
        condition: (data) => data.authorType === 'manual',
        description: 'Author full name',
      },
      required: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (data?.authorType === 'manual' && !value) {
              throw new Error('Author name is required when using manual entry')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'authorImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data.authorType === 'manual',
        description: 'Author profile photo',
      },
    },
    {
      name: 'authorRole',
      type: 'text',
      admin: {
        condition: (data) => data.authorType === 'manual',
        description: 'Author job title/role (e.g., "Senior Developer")',
      },
    },
    {
      name: 'authorBio',
      type: 'textarea',
      admin: {
        condition: (data) => data.authorType === 'manual',
        description: 'Short bio about the author (optional)',
      },
    },
    // Person Relationship Field
    {
      name: 'instructor',
      type: 'relationship',
      relationTo: 'instructors' as any,
      admin: {
        condition: (data) => data.authorType === 'instructor',
        description: 'Select a person as the author',
      },
      required: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (data?.authorType === 'instructor' && !value) {
              throw new Error('Please select an instructor')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Main blog post content (rich text editor)',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        description: 'Publication date',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'readTime',
      type: 'text',
      admin: {
        description: 'Estimated reading time (e.g., "5 min read")',
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Related tags/keywords for this post',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        description: 'Publication status',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      admin: {
        description: 'SEO meta description (optional)',
      },
    },
  ],
}
