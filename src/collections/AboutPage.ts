import type { CollectionConfig } from 'payload'

// Type for user with role field
type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  allowedCollections?: string[]
  [key: string]: unknown
}

export const AboutPage: CollectionConfig = {
  slug: 'about-page',
  labels: {
    singular: 'About Page',
    plural: 'About Page',
  },
  admin: {
    useAsTitle: 'sectionName',
    defaultColumns: ['sectionName', 'sectionType', 'updatedAt'],
    group: 'Content Management',
    description: 'Manage about page sections.',
    hidden: ({ user }) => {
      const u = user as UserWithRole | null
      if (!u) return true
      if (u.role === 'author' && !u.allowedCollections?.includes('about-page')) return true
      return false
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      const u = user as UserWithRole | null
      if (!u) return false
      if (!u.role || ['superadmin', 'admin', 'editor'].includes(u.role)) return true
      if (u.role === 'author') return u.allowedCollections?.includes('about-page') || false
      return false
    },
    update: ({ req: { user } }) => {
      const u = user as UserWithRole | null
      if (!u) return false
      if (!u.role || ['superadmin', 'admin', 'editor'].includes(u.role)) return true
      if (u.role === 'author') return u.allowedCollections?.includes('about-page') || false
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
        description: 'Name to identify this section (e.g., "Page Title", "About Main")',
      },
    },
    {
      name: 'sectionType',
      type: 'select',
      required: true,
      options: [
        { label: 'Page Title', value: 'page-title' },
        { label: 'About Main Section', value: 'about-main' },
        { label: 'Our Story', value: 'our-story' },
        { label: 'Mission Vision Values', value: 'mission-vision-values' },
        { label: 'Why Choose Us', value: 'why-choose-us' },
      ],
      admin: {
        description: 'Select the section type',
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
          label: 'Breadcrumb Items',
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

    // ABOUT MAIN SECTION
    {
      name: 'aboutMain',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'about-main',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
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
          name: 'stats',
          type: 'array',
          label: 'Statistics',
          minRows: 3,
          maxRows: 3,
          fields: [
            {
              name: 'count',
              type: 'text',
              required: true,
            },
            {
              name: 'label',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },

    // OUR STORY SECTION
    {
      name: 'ourStory',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'our-story',
      },
      fields: [
        {
          name: 'subtitle',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., "Our Story"',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., "Educating Minds, Inspiring Hearts"',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'timeline',
          type: 'array',
          label: 'Timeline Items',
          fields: [
            {
              name: 'year',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g., "1965", "1982"',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
          ],
        },
        {
          name: 'campusImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Main campus/building image',
          },
        },
        {
          name: 'missionVisionCards',
          type: 'array',
          label: 'Mission & Vision Cards',
          minRows: 2,
          maxRows: 2,
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g., "Our Mission", "Our Vision"',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
          ],
        },
        {
          name: 'coreValues',
          type: 'array',
          label: 'Core Values',
          fields: [
            {
              name: 'icon',
              type: 'select',
              required: true,
              options: [
                { label: 'Book (Academic Excellence)', value: 'bi-book' },
                { label: 'People (Community)', value: 'bi-people' },
                { label: 'Lightbulb (Innovation)', value: 'bi-lightbulb' },
                { label: 'Globe (Global Perspective)', value: 'bi-globe' },
                { label: 'Award', value: 'bi-award' },
                { label: 'Heart', value: 'bi-heart' },
                { label: 'Star', value: 'bi-star' },
                { label: 'Shield', value: 'bi-shield' },
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
          ],
        },
      ],
    },

    // MISSION VISION VALUES SECTION
    {
      name: 'missionVisionValues',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'mission-vision-values',
      },
      fields: [
        {
          name: 'cards',
          type: 'array',
          label: 'Mission/Vision/Values Cards',
          minRows: 3,
          maxRows: 3,
          fields: [
            {
              name: 'icon',
              type: 'select',
              required: true,
              options: [
                { label: 'Bullseye (Mission)', value: 'bi-bullseye' },
                { label: 'Eye (Vision)', value: 'bi-eye' },
                { label: 'Award (Values)', value: 'bi-award' },
                { label: 'Target', value: 'bi-target' },
                { label: 'Lightbulb', value: 'bi-lightbulb' },
                { label: 'Heart', value: 'bi-heart' },
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
          ],
        },
      ],
    },

    // WHY CHOOSE US SECTION
    {
      name: 'whyChooseUs',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'why-choose-us',
      },
      fields: [
        {
          name: 'subtitle',
          type: 'text',
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
          name: 'features',
          type: 'array',
          label: 'Feature List',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'buttonText',
          type: 'text',
          required: true,
        },
        {
          name: 'buttonLink',
          type: 'text',
          required: true,
        },
        {
          name: 'galleryImages',
          type: 'array',
          label: 'Gallery Images',
          minRows: 3,
          maxRows: 3,
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'alt',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
