import type { Block } from 'payload'

export const peopleBlock: Block = {
  slug: 'people',
  labels: {
    singular: 'People Block',
    plural: 'People Blocks',
  },
  imageURL: '/assets/img/person/testimonial-1.webp',
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
      name: 'profileButtonText',
      type: 'text',
      defaultValue: 'View More',
      admin: {
        description: 'Label for the profile button (e.g., "View More", "Read Message", "View Profile")',
      },
    },
    {
      name: 'profileButtonNewTab',
      type: 'checkbox',
      defaultValue: false,
      label: 'Open Profile in New Tab',
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
            description: 'External profile link (e.g., university page)',
          },
        },
        {
          name: 'slug',
          type: 'text',
          required: false,
          admin: {
            description: 'URL slug for internal profile page (auto-generated from name if empty)',
          },
        },
        // === PROFILE PAGE FIELDS (About Tab) ===
        {
          name: 'biography',
          type: 'textarea',
          label: 'Message',
          required: false,
          admin: {
            description: 'Message from this person (displayed on profile page)',
          },
        },
        {
          name: 'researchInterests',
          type: 'array',
          required: false,
          admin: {
            description: 'Research areas/interests (displayed as tags)',
          },
          fields: [
            {
              name: 'interest',
              type: 'text',
              required: false,
            },
          ],
        },
        // === PROFILE PAGE FIELDS (Experience Tab) ===
        {
          name: 'education',
          type: 'array',
          required: false,
          admin: {
            description: 'Educational background',
          },
          fields: [
            {
              name: 'degree',
              type: 'text',
              required: false,
              admin: { description: 'e.g., Ph.D. in Computer Science' },
            },
            {
              name: 'institution',
              type: 'text',
              required: false,
            },
            {
              name: 'year',
              type: 'text',
              required: false,
            },
          ],
        },
        {
          name: 'experience',
          type: 'array',
          required: false,
          admin: {
            description: 'Work experience',
          },
          fields: [
            {
              name: 'position',
              type: 'text',
              required: false,
            },
            {
              name: 'organization',
              type: 'text',
              required: false,
            },
            {
              name: 'duration',
              type: 'text',
              required: false,
              admin: { description: 'e.g., 2018 - Present' },
            },
            {
              name: 'description',
              type: 'textarea',
              required: false,
            },
          ],
        },
        {
          name: 'awards',
          type: 'array',
          required: false,
          admin: {
            description: 'Awards and honors',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: false,
            },
            {
              name: 'year',
              type: 'text',
              required: false,
            },
            {
              name: 'organization',
              type: 'text',
              required: false,
            },
          ],
        },
        // === PROFILE PAGE FIELDS (Courses Tab) ===
        {
          name: 'courses',
          type: 'array',
          required: false,
          admin: {
            description: 'Courses taught',
          },
          fields: [
            {
              name: 'courseName',
              type: 'text',
              required: false,
            },
            {
              name: 'courseCode',
              type: 'text',
              required: false,
            },
            {
              name: 'semester',
              type: 'text',
              required: false,
              admin: { description: 'e.g., Fall 2025' },
            },
            {
              name: 'description',
              type: 'textarea',
              required: false,
            },
          ],
        },
        // === PROFILE PAGE FIELDS (Publications/Reviews Tab) ===
        {
          name: 'publications',
          type: 'array',
          required: false,
          admin: {
            description: 'Research publications',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: false,
            },
            {
              name: 'journal',
              type: 'text',
              required: false,
              admin: { description: 'Journal or conference name' },
            },
            {
              name: 'year',
              type: 'text',
              required: false,
            },
            {
              name: 'link',
              type: 'text',
              required: false,
              admin: { description: 'Link to publication' },
            },
          ],
        },
        // === CONTACT INFO ===
        {
          name: 'email',
          type: 'email',
          required: false,
          admin: {
            description: 'Contact email',
          },
        },
        {
          name: 'phone',
          type: 'text',
          required: false,
          admin: {
            description: 'Contact phone number',
          },
        },
        {
          name: 'office',
          type: 'text',
          required: false,
          admin: {
            description: 'Office location',
          },
        },
        {
          name: 'academicLinks',
          type: 'array',
          required: false,
          admin: {
            description: 'Academic profile links (Google Scholar, ResearchGate, ORCID, etc.)',
          },
          fields: [
            {
              name: 'platform',
              type: 'select',
              options: [
                { label: 'Google Scholar', value: 'google-scholar' },
                { label: 'ResearchGate', value: 'researchgate' },
                { label: 'ORCID', value: 'orcid' },
                { label: 'Academia.edu', value: 'academia' },
                { label: 'Scopus', value: 'scopus' },
                { label: 'Web of Science', value: 'wos' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'url',
              type: 'text',
              required: false,
            },
          ],
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
