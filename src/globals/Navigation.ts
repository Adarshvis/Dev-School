import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Site Configuration',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Main Menu',
          description: 'Configure the main navigation menu. Drag items to reorder them.',
          fields: [
            {
              name: 'menuItems',
              type: 'array',
              label: 'Menu Items',
              labels: {
                singular: 'Menu Item',
                plural: 'Menu Items',
              },
              defaultValue: [
                { label: 'Home', linkType: 'internal', internalLink: '/', isVisible: true },
                { label: 'About', linkType: 'internal', internalLink: '/about', isVisible: true },
                { label: 'Courses', linkType: 'internal', internalLink: '/courses', isVisible: true },
                { label: 'Instructors', linkType: 'internal', internalLink: '/instructors', isVisible: true },
                { label: 'Publications', linkType: 'internal', internalLink: '/publications', isVisible: true },
                { label: 'News', linkType: 'internal', internalLink: '/news', isVisible: true },
                { label: 'Blog', linkType: 'internal', internalLink: '/blog', isVisible: true },
                { label: 'Contact', linkType: 'internal', internalLink: '/contact', isVisible: true },
              ],
              admin: {
                description: 'Drag and drop to reorder menu items. The order here determines the order in the navigation.',
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Text displayed in the menu',
                  },
                },
                {
                  name: 'linkType',
                  type: 'select',
                  required: true,
                  defaultValue: 'internal',
                  options: [
                    { label: 'Internal Page', value: 'internal' },
                    { label: 'Custom URL', value: 'custom' },
                    { label: 'External URL', value: 'external' },
                    { label: 'Anchor Link', value: 'anchor' },
                    { label: 'Dropdown (No Link)', value: 'dropdown' },
                  ],
                  admin: {
                    description: 'Type of link',
                  },
                },
                {
                  name: 'internalLink',
                  type: 'select',
                  admin: {
                    condition: (data, siblingData) => siblingData?.linkType === 'internal',
                    description: 'Select an internal page',
                  },
                  options: [
                    { label: 'Home', value: '/' },
                    { label: 'About', value: '/about' },
                    { label: 'Courses', value: '/courses' },
                    { label: 'Instructors', value: '/instructors' },
                    { label: 'Publications', value: '/publications' },
                    { label: 'News', value: '/news' },
                    { label: 'Blog', value: '/blog' },
                    { label: 'Contact', value: '/contact' },
                    { label: 'Enroll', value: '/enroll' },
                    { label: 'Events', value: '/events' },
                    { label: 'Research Domains', value: '/research-domains' },
                    { label: 'Work With Us', value: '/work-with-us' },
                  ],
                },
                {
                  name: 'dynamicPageLink',
                  type: 'relationship',
                  relationTo: 'pages' as 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.linkType === 'internal',
                    description: 'Or select a dynamic page (optional - overrides internal link if set)',
                  },
                },
                {
                  name: 'externalUrl',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData?.linkType === 'external',
                    description: 'Full URL including https://',
                  },
                },
                {
                  name: 'customLink',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData?.linkType === 'custom',
                    description: 'Custom URL path (e.g., /demo, /services)',
                  },
                },
                {
                  name: 'anchorLink',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData?.linkType === 'anchor',
                    description: 'Anchor ID (e.g., #contact-section)',
                  },
                },
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    condition: (data, siblingData) => siblingData?.linkType === 'external',
                    description: 'Open link in a new browser tab',
                  },
                },
                {
                  name: 'isVisible',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Show/hide this menu item without deleting it',
                  },
                },
                {
                  name: 'icon',
                  type: 'select',
                  admin: {
                    description: 'Optional icon to display (Bootstrap Icons)',
                  },
                  options: [
                    { label: 'None', value: '' },
                    { label: 'Home', value: 'bi-house' },
                    { label: 'Info', value: 'bi-info-circle' },
                    { label: 'Book', value: 'bi-book' },
                    { label: 'People', value: 'bi-people' },
                    { label: 'Newspaper', value: 'bi-newspaper' },
                    { label: 'Chat', value: 'bi-chat-text' },
                    { label: 'Envelope', value: 'bi-envelope' },
                    { label: 'Calendar', value: 'bi-calendar-event' },
                    { label: 'Briefcase', value: 'bi-briefcase' },
                    { label: 'Gear', value: 'bi-gear' },
                  ],
                },
                {
                  name: 'highlight',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Highlight this menu item (different styling)',
                  },
                },
                // Nested submenu items (one level deep)
                {
                  name: 'children',
                  type: 'array',
                  label: 'Submenu Items',
                  admin: {
                    description: 'Add dropdown/submenu items under this menu item',
                    condition: (data, siblingData) => siblingData?.linkType === 'dropdown' || siblingData?.linkType === 'internal',
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'linkType',
                      type: 'select',
                      required: true,
                      defaultValue: 'internal',
                      options: [
                        { label: 'Internal Page', value: 'internal' },
                        { label: 'External URL', value: 'external' },
                        { label: 'Dynamic Page', value: 'dynamic' },
                      ],
                    },
                    {
                      name: 'internalLink',
                      type: 'select',
                      admin: {
                        condition: (data, siblingData) => siblingData?.linkType === 'internal',
                      },
                      options: [
                        { label: 'Home', value: '/' },
                        { label: 'About', value: '/about' },
                        { label: 'Courses', value: '/courses' },
                        { label: 'Course Details', value: '/course-details' },
                        { label: 'Instructors', value: '/instructors' },
                        { label: 'Instructor Profile', value: '/instructor-profile' },
                        { label: 'Publications', value: '/publications' },
                        { label: 'News', value: '/news' },
                        { label: 'Blog', value: '/blog' },
                        { label: 'Blog Details', value: '/blog-details' },
                        { label: 'Contact', value: '/contact' },
                        { label: 'Enroll', value: '/enroll' },
                        { label: 'Events', value: '/events' },
                        { label: 'Research Domains', value: '/research-domains' },
                        { label: 'Work With Us', value: '/work-with-us' },
                        { label: 'Terms', value: '/terms' },
                        { label: 'Privacy', value: '/privacy' },
                      ],
                    },
                    {
                      name: 'dynamicPageLink',
                      type: 'relationship',
                      relationTo: 'pages' as 'media',
                      admin: {
                        condition: (data, siblingData) => siblingData?.linkType === 'dynamic',
                      },
                    },
                    {
                      name: 'externalUrl',
                      type: 'text',
                      admin: {
                        condition: (data, siblingData) => siblingData?.linkType === 'external',
                      },
                    },
                    {
                      name: 'openInNewTab',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        condition: (data, siblingData) => siblingData?.linkType === 'external',
                      },
                    },
                    {
                      name: 'isVisible',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                    {
                      name: 'icon',
                      type: 'select',
                      options: [
                        { label: 'None', value: '' },
                        { label: 'Arrow Right', value: 'bi-arrow-right' },
                        { label: 'Check', value: 'bi-check' },
                        { label: 'Star', value: 'bi-star' },
                        { label: 'Book', value: 'bi-book' },
                        { label: 'Person', value: 'bi-person' },
                        { label: 'Calendar', value: 'bi-calendar' },
                        { label: 'File', value: 'bi-file-text' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'CTA Button',
          description: 'Configure the call-to-action button in the header',
          fields: [
            {
              name: 'ctaButton',
              type: 'group',
              fields: [
                {
                  name: 'isVisible',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Show/hide the CTA button',
                  },
                },
                {
                  name: 'text',
                  type: 'text',
                  defaultValue: 'Enroll Now',
                  admin: {
                    description: 'Button text',
                  },
                },
                {
                  name: 'linkType',
                  type: 'select',
                  defaultValue: 'internal',
                  options: [
                    { label: 'Internal Page', value: 'internal' },
                    { label: 'External URL', value: 'external' },
                  ],
                },
                {
                  name: 'internalLink',
                  type: 'select',
                  admin: {
                    condition: (data, siblingData) => siblingData?.linkType === 'internal',
                  },
                  options: [
                    { label: 'Enroll', value: '/enroll' },
                    { label: 'Contact', value: '/contact' },
                    { label: 'Courses', value: '/courses' },
                    { label: 'About', value: '/about' },
                  ],
                  defaultValue: '/enroll',
                },
                {
                  name: 'externalUrl',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData?.linkType === 'external',
                  },
                },
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  defaultValue: false,
                },
              ],
            },
          ],
        },
        {
          label: 'Mobile Menu',
          description: 'Additional settings for mobile navigation',
          fields: [
            {
              name: 'mobileSettings',
              type: 'group',
              fields: [
                {
                  name: 'showIcons',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Show icons in mobile menu',
                  },
                },
                {
                  name: 'collapseSubmenusByDefault',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Keep submenus collapsed by default on mobile',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
