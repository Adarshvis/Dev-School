import type { CollectionConfig } from 'payload'

export const Instructors: CollectionConfig = {
  slug: 'instructors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'specialty', 'studentCount', 'rating'],
    group: 'Content Management',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: '_status',
      type: 'select',
      required: false,
      defaultValue: 'published',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Draft instructors are hidden from website, Published instructors are visible',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Full name of the instructor',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Profile photo',
      },
    },
    {
      name: 'specialty',
      type: 'text',
      required: false,
      admin: {
        description: 'Role or title (e.g., "Professor", "Research Scholar")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Short bio or credentials',
      },
    },
    {
      name: 'studentCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total number of students taught',
      },
    },
    {
      name: 'rating',
      type: 'number',
      defaultValue: 5,
      min: 0,
      max: 5,
      admin: {
        description: 'Average rating (0-5)',
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      admin: {
        description: 'Social media profiles',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: false,
          options: [
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Twitter/X', value: 'twitter' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
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
}
