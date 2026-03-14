import type { CollectionConfig } from 'payload'
import { hasAdminOnlyAccess, hasCollectionAccess } from '@/lib/access'

// Type for user with role field
type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  allowedCollections?: string[]
  [key: string]: unknown
}

export const ContactPage: CollectionConfig = {
  slug: 'contact-page',
  labels: {
    singular: 'Contact Page',
    plural: 'Contact Page',
  },
  admin: {
    useAsTitle: 'sectionName',
    defaultColumns: ['sectionName', 'sectionType', 'status'],
    group: 'Content Management',
    description: 'Manage contact page sections.',
    hidden: ({ user }) => {
      const u = user as UserWithRole | null
      if (!u) return true
      if (u.role === 'author') {
        const allowed = u.allowedCollections || []
        if (!allowed.includes('contact-page')) return true
      }
      return false
    },
  },
  access: {
    read: () => true,
    create: ({ req }) => hasCollectionAccess(req, 'contact-page'),
    update: ({ req }) => hasCollectionAccess(req, 'contact-page'),
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
      admin: {
        description: 'Internal name for this section (e.g., "Contact Page Title", "Contact Information")',
      },
    },
    {
      name: 'sectionType',
      type: 'select',
      required: true,
      options: [
        { label: 'Page Title', value: 'page-title' },
        { label: 'Contact Map', value: 'contact-map' },
        { label: 'Contact Information', value: 'contact-info' },
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

    // CONTACT MAP SECTION
    {
      name: 'contactMap',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'contact-map',
      },
      fields: [
        {
          name: 'mapEmbedUrl',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Google Maps embed URL',
          },
        },
      ],
    },

    // CONTACT INFO SECTION
    {
      name: 'contactInfo',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'contact-info',
      },
      fields: [
        {
          name: 'contactCards',
          type: 'array',
          minRows: 1,
          admin: {
            description: 'Contact information cards',
          },
          fields: [
            {
              name: 'icon',
              type: 'select',
              required: true,
              options: [
                { label: 'Location (bi-geo-alt)', value: 'bi-geo-alt' },
                { label: 'Email (bi-envelope)', value: 'bi-envelope' },
                { label: 'Phone (bi-telephone)', value: 'bi-telephone' },
                { label: 'Clock (bi-clock)', value: 'bi-clock' },
                { label: 'Calendar (bi-calendar)', value: 'bi-calendar' },
                { label: 'Chat (bi-chat-dots)', value: 'bi-chat-dots' },
              ],
            },
            {
              name: 'heading',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g., "Location", "Email", "Call"',
              },
            },
            {
              name: 'text',
              type: 'text',
              required: true,
              admin: {
                description: 'Contact information text',
              },
            },
          ],
        },
        {
          name: 'formSection',
          type: 'group',
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
              defaultValue: 'Get in Touch',
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
            {
              name: 'formAction',
              type: 'text',
              required: true,
              defaultValue: 'forms/contact.php',
              admin: {
                description: 'Form submission endpoint',
              },
            },
            {
              name: 'submitButtonText',
              type: 'text',
              required: true,
              defaultValue: 'Send Message',
            },
            {
              name: 'socialLinks',
              type: 'array',
              admin: {
                description: 'Social media links shown below submit button',
              },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Twitter', value: 'twitter' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'YouTube', value: 'youtube' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
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
