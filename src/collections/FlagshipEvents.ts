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

import { contentBlocksField } from '@/fields/contentBlocks'

type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  allowedCollections?: string[]
  [key: string]: unknown
}

export const FlagshipEvents: CollectionConfig = {
  slug: 'flagship-events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'status'],
    group: 'Content Management',
    hidden: ({ user }) => {
      const u = user as UserWithRole | null
      if (!u) return true
      if (u.role === 'author') {
        const allowed = u.allowedCollections || []
        if (!allowed.includes('flagship-events')) return true
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
        return allowed.includes('flagship-events')
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
        return allowed.includes('flagship-events')
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
        description: 'Event title',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of title (e.g., "annual-sports-day-2025")',
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
          TextSizeFeature({ customSize: false }),
          TextFontFamilyFeature({ customFontFamily: false }),
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          AlignFeature(),
          IndentFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
          ChecklistFeature(),
          LinkFeature({ enabledCollections: ['pages' as any] }),
          BlockquoteFeature(),
          HorizontalRuleFeature(),
          InlineCodeFeature(),
          SubscriptFeature(),
          SuperscriptFeature(),
        ],
      }),
      admin: {
        description: 'Full event detail content',
      },
    },
    contentBlocksField,
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
