import type { CollectionConfig } from 'payload'
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
  HeadingFeature,
  AlignFeature,
  IndentFeature,
  UnorderedListFeature,
  OrderedListFeature,
  ChecklistFeature,
  LinkFeature,
  BlockquoteFeature,
  HorizontalRuleFeature,
  InlineCodeFeature,
  SubscriptFeature,
  SuperscriptFeature,
} from '@payloadcms/richtext-lexical'
import { TextColorFeature, TextSizeFeature, TextFontFamilyFeature } from 'payload-lexical-typography'

// Type for user with role field
type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  allowedCollections?: string[]
  [key: string]: unknown
}

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedDate', 'status'],
    group: 'Content Management',
    hidden: ({ user }) => {
      const u = user as UserWithRole | null
      if (!u) return true
      if (u.role === 'author') {
        const allowed = u.allowedCollections || []
        if (!allowed.includes('news')) return true
      }
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
      if (u.role === 'author') {
        const allowed = u.allowedCollections || []
        return allowed.includes('news')
      }
      return false
    },
    update: ({ req }) => {
      if (!req) return false
      const u = req.user as UserWithRole | null
      if (!u) return false
      if (!u.role || ['superadmin', 'admin', 'editor'].includes(u.role)) return true
      if (u.role === 'author') {
        const allowed = u.allowedCollections || []
        return allowed.includes('news')
      }
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
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'News article headline',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of title (e.g., "campus-expansion-2025")',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const source = String(value || data?.title || '')
            if (!source) return value

            return source
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
          },
        ],
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief summary/excerpt shown on news listing pages',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Main image for the news article',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'Campus News', value: 'campus' },
        { label: 'Academic', value: 'academic' },
        { label: 'Events', value: 'events' },
        { label: 'Achievements', value: 'achievements' },
        { label: 'Research', value: 'research' },
        { label: 'Sports', value: 'sports' },
        { label: 'Technology', value: 'technology' },
        { label: 'General', value: 'general' },
      ],
      admin: {
        description: 'News category for filtering',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          TextColorFeature({
            colors: ['#111827', '#1f2937', '#374151', '#ef4444', '#f59e0b', '#10b981', '#3b82f6'],
            colorPicker: true,
          }),
          TextSizeFeature({
            customSize: false,
          }),
          TextFontFamilyFeature({
            customFontFamily: false,
          }),
          HeadingFeature({
            enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'],
          }),
          AlignFeature(),
          IndentFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
          ChecklistFeature(),
          LinkFeature({
            enabledCollections: ['pages' as any],
          }),
          BlockquoteFeature(),
          HorizontalRuleFeature(),
          InlineCodeFeature(),
          SubscriptFeature(),
          SuperscriptFeature(),
        ],
      }),
      required: true,
      admin: {
        description: 'Main news article content (rich text editor with blocks)',
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
        description: 'Related tags/keywords for this news article',
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
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as featured news (displayed prominently on news page)',
      },
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
