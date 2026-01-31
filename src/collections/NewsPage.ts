import type { CollectionConfig } from 'payload'

// Type for user with role field
type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  allowedCollections?: string[]
  [key: string]: unknown
}

export const NewsPage: CollectionConfig = {
  slug: 'news-page',
  labels: {
    singular: 'News Page',
    plural: 'News Page',
  },
  admin: {
    useAsTitle: 'sectionName',
    defaultColumns: ['sectionName', 'sectionType', 'status'],
    group: 'Content Management',
    description: 'Manage news page sections.',
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
      admin: {
        description: 'Internal name for this section',
      },
    },
    {
      name: 'sectionType',
      type: 'select',
      required: true,
      options: [
        { label: 'Page Title', value: 'page-title' },
        { label: 'News Hero', value: 'news-hero' },
        { label: 'News Listing', value: 'news-listing' },
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
          defaultValue: 'News',
        },
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

    // NEWS HERO SECTION (Featured News)
    {
      name: 'newsHero',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'news-hero',
        description: 'Configure featured news sections displayed at the top',
      },
      fields: [
        {
          name: 'showFeaturedNews',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Automatically show featured news articles',
          },
        },
        {
          name: 'featuredNewsCount',
          type: 'number',
          defaultValue: 3,
          min: 1,
          max: 6,
          admin: {
            description: 'Number of featured articles to display',
          },
        },
      ],
    },

    // NEWS LISTING SECTION
    {
      name: 'newsListing',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'news-listing',
      },
      fields: [
        {
          name: 'showTabs',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show sidebar tabs (Top Stories, Trending, Latest)',
          },
        },
        {
          name: 'tabs',
          type: 'array',
          admin: {
            condition: (data, siblingData) => siblingData?.showTabs,
          },
          fields: [
            {
              name: 'tabName',
              type: 'text',
              required: true,
            },
            {
              name: 'tabType',
              type: 'select',
              required: true,
              options: [
                { label: 'Top Stories', value: 'top-stories' },
                { label: 'Trending News', value: 'trending' },
                { label: 'Latest News', value: 'latest' },
              ],
            },
          ],
        },
        {
          name: 'newsPerPage',
          type: 'number',
          defaultValue: 9,
          admin: {
            description: 'Number of news articles per page',
          },
        },
        {
          name: 'showCategories',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show category filters',
          },
        },
      ],
    },
  ],
}
