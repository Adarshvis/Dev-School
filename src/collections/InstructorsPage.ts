import type { CollectionConfig } from 'payload'

export const InstructorsPage: CollectionConfig = {
  slug: 'instructors-page',
  labels: {
    singular: 'Instructors Page',
    plural: 'Instructors Page',
  },
  admin: {
    useAsTitle: 'sectionName',
    defaultColumns: ['sectionName', 'sectionType', 'updatedAt'],
    group: 'Content Management',
    description: 'Manage instructors page sections.',
  },
  access: {
    read: () => true,
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
      required: false,
    },
    {
      name: 'sectionType',
      type: 'select',
      required: false,
      options: [
        { label: 'Page Title', value: 'page-title' },
        { label: 'Instructors Grid', value: 'instructors-grid' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: false,
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
        { name: 'title', type: 'text', required: false },
        {
          name: 'breadcrumbs',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: false },
            { name: 'link', type: 'text' },
            { name: 'isActive', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },

    // INSTRUCTORS GRID
    {
      name: 'instructorsGrid',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'instructors-grid',
      },
      fields: [
        {
          name: 'instructors',
          type: 'array',
          label: 'Instructor Cards',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
            {
              name: 'name',
              type: 'text',
              required: false,
            },
            {
              name: 'specialty',
              type: 'text',
              required: false,
            },
            {
              name: 'description',
              type: 'textarea',
              required: false,
            },
            {
              name: 'rating',
              type: 'number',
              required: false,
              min: 0,
              max: 5,
              admin: {
                step: 0.1,
              },
            },
            {
              name: 'courseCount',
              type: 'number',
              required: false,
            },
            {
              name: 'studentCount',
              type: 'text',
              required: false,
              admin: {
                description: 'e.g., "2.1k" or "2100"',
              },
            },
            {
              name: 'profileLink',
              type: 'text',
              defaultValue: '#',
            },
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Social Links',
              maxRows: 4,
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  options: [
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Twitter', value: 'twitter' },
                    { label: 'GitHub', value: 'github' },
                    { label: 'Dribbble', value: 'dribbble' },
                    { label: 'Behance', value: 'behance' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Shield Check', value: 'shield-check' },
                    { label: 'Cloud', value: 'cloud' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
