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
      defaultValue: 'draft',
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
      required: false,
      admin: {
        description: 'Full name of the instructor',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: false,
      admin: {
        description: 'URL-friendly version of name (auto-generated if left empty)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Profile photo of the instructor',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Background image for profile hero section',
      },
    },
    {
      name: 'specialty',
      type: 'text',
      required: false,
      admin: {
        description: 'Main area of expertise (e.g., "Machine Learning & AI Specialist")',
      },
    },
    {
      name: 'credentials',
      type: 'array',
      admin: {
        description: 'Credentials shown in hero (e.g., "Ph.D. MIT", "10+ Years")',
      },
      fields: [
        {
          name: 'credential',
          type: 'text',
          required: false,
        },
      ],
    },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show verified badge',
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
      name: 'courseCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of active courses',
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
      name: 'reviewCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total number of reviews',
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
            { label: 'Twitter/X', value: 'twitter-x' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'GitHub', value: 'github' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: false,
        },
      ],
    },
    // About Tab Content
    {
      type: 'collapsible',
      label: 'About Section',
      fields: [
        {
          name: 'biography',
          type: 'richText',
          required: false,
          admin: {
            description: 'Professional biography',
          },
        },
        {
          name: 'expertise',
          type: 'array',
          admin: {
            description: 'Core expertise areas',
          },
          fields: [
            {
              name: 'skill',
              type: 'text',
              required: false,
            },
            {
              name: 'icon',
              type: 'select',
              options: [
                { label: 'CPU', value: 'cpu' },
                { label: 'Diagram', value: 'diagram-3' },
                { label: 'Graph', value: 'graph-up' },
                { label: 'Code', value: 'code-slash' },
                { label: 'Cloud', value: 'cloud' },
                { label: 'Robot', value: 'robot' },
                { label: 'Lightbulb', value: 'lightbulb' },
                { label: 'Database', value: 'database' },
                { label: 'Gear', value: 'gear' },
                { label: 'Terminal', value: 'terminal' },
              ],
              defaultValue: 'cpu',
            },
          ],
        },
      ],
    },
    // Experience Tab Content
    {
      type: 'collapsible',
      label: 'Experience Section',
      fields: [
        {
          name: 'experience',
          type: 'array',
          admin: {
            description: 'Work experience timeline',
          },
          fields: [
            {
              name: 'year',
              type: 'text',
              required: false,
              admin: {
                description: 'Year or year range (e.g., "2019" or "2019-2023")',
              },
            },
            {
              name: 'position',
              type: 'text',
              required: false,
              admin: {
                description: 'Job title',
              },
            },
            {
              name: 'institution',
              type: 'text',
              required: false,
              admin: {
                description: 'Company or organization name',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              required: false,
            },
          ],
        },
      ],
    },
    // Reviews Tab Content
    {
      type: 'collapsible',
      label: 'Reviews Section',
      fields: [
        {
          name: 'reviews',
          type: 'array',
          admin: {
            description: 'Student testimonials and reviews',
          },
          fields: [
            {
              name: 'studentName',
              type: 'text',
              required: false,
            },
            {
              name: 'studentRole',
              type: 'text',
              required: false,
              admin: {
                description: 'Job title and company (e.g., "Data Scientist at Amazon")',
              },
            },
            {
              name: 'studentImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'rating',
              type: 'number',
              required: false,
              min: 1,
              max: 5,
              defaultValue: 5,
            },
            {
              name: 'review',
              type: 'textarea',
              required: false,
            },
          ],
        },
      ],
    },
    // Sidebar Widgets
    {
      type: 'collapsible',
      label: 'Teaching Impact Stats',
      fields: [
        {
          name: 'yearsTeaching',
          type: 'text',
          admin: {
            description: 'Years of teaching experience (e.g., "10+")',
          },
        },
        {
          name: 'completionRate',
          type: 'text',
          admin: {
            description: 'Course completion rate (e.g., "94%")',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Awards & Recognition',
      fields: [
        {
          name: 'awards',
          type: 'array',
          admin: {
            description: 'Achievements and awards',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: false,
            },
            {
              name: 'organization',
              type: 'text',
              required: false,
            },
            {
              name: 'year',
              type: 'text',
              required: false,
            },
            {
              name: 'icon',
              type: 'select',
              options: [
                { label: 'Trophy', value: 'trophy' },
                { label: 'Patch Check', value: 'patch-check' },
                { label: 'Mortarboard', value: 'mortarboard' },
                { label: 'Award', value: 'award' },
                { label: 'Star', value: 'star' },
              ],
              defaultValue: 'trophy',
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Contact Information',
      fields: [
        {
          name: 'email',
          type: 'email',
          admin: {
            description: 'Contact email address',
          },
        },
        {
          name: 'phone',
          type: 'text',
          admin: {
            description: 'Contact phone number',
          },
        },
        {
          name: 'location',
          type: 'text',
          admin: {
            description: 'Office location (e.g., "Room 304, Computer Science Building")',
          },
        },
        {
          name: 'officeHours',
          type: 'textarea',
          admin: {
            description: 'Office hours schedule',
          },
        },
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
      admin: {
        description: 'Instructor status',
      },
    },
  ],
}
