import type { Block } from 'payload'

export const peopleBlock: Block = {
  slug: 'people',
  labels: {
    singular: 'People Block',
    plural: 'People Blocks',
  },
  imageURL: '/assets/img/blocks/people-block.png',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
      admin: {
        description: 'Section heading (e.g., "Faculty Members", "Research Scholars")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Optional description text below the heading',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid-4',
      options: [
        { label: '3 Columns', value: 'grid-3' },
        { label: '4 Columns', value: 'grid-4' },
        { label: '5 Columns', value: 'grid-5' },
        { label: '6 Columns', value: 'grid-6' },
      ],
      admin: {
        description: 'Number of columns per row',
      },
    },
    {
      name: 'showStats',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show student count and rating statistics',
      },
    },
    {
      name: 'showSocialLinks',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Display social media links',
      },
    },
    {
      name: 'people',
      type: 'array',
      label: 'People',
      admin: {
        description: 'Add people/members to display in this section',
      },
      fields: [
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
          name: 'name',
          type: 'text',
          required: false,
          admin: {
            description: 'Full name',
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
          name: 'rating',
          type: 'number',
          required: false,
          min: 0,
          max: 5,
          admin: {
            step: 0.1,
            description: 'Rating out of 5 (optional)',
          },
        },
        {
          name: 'courseCount',
          type: 'number',
          required: false,
          admin: {
            description: 'Number of courses (optional)',
          },
        },
        {
          name: 'studentCount',
          type: 'text',
          required: false,
          admin: {
            description: 'e.g., "2.1k" or "2100" (optional)',
          },
        },
        {
          name: 'profileLink',
          type: 'text',
          required: false,
          admin: {
            description: 'Link to full profile page',
          },
        },
        {
          name: 'socialLinks',
          type: 'array',
          label: 'Social Links',
          maxRows: 6,
          fields: [
            {
              name: 'platform',
              type: 'select',
              options: [
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Twitter', value: 'twitter-x' },
                { label: 'GitHub', value: 'github' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Google Scholar', value: 'google' },
                { label: 'Website', value: 'globe' },
                { label: 'Email', value: 'envelope' },
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
}
