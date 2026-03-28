import type { GlobalConfig } from 'payload'
import { colorPickerField } from '@innovixx/payload-color-picker-field'

// Type for user with role field
type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  [key: string]: unknown
}

export const Settings: GlobalConfig = {
  slug: 'settings',
  admin: {
    group: 'Site Configuration',
    hidden: ({ user }) => {
      const u = user as UserWithRole | null
      if (!u) return true
      // Only show to superadmin, admin, and editor
      if (u.role === 'author') return true
      return false
    },
  },
  access: {
    read: () => true,
    update: ({ req }) => {
      if (!req) return false
      const u = req.user as UserWithRole | null
      if (!u) return false
      // Only superadmin, admin, and editor can update settings
      if (!u.role || ['superadmin', 'admin', 'editor'].includes(u.role)) return true
      return false
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Fix footerText if it's still in old richText array format
        if (data.footerText && Array.isArray(data.footerText)) {
          // Extract text from richText format
          const text = data.footerText
            .map((block: any) => 
              block.children?.map((child: any) => child.text).join('') || ''
            )
            .join('\n')
          data.footerText = text || 'Cras fermentum odio eu feugiat lide par naso tierra. Justo eget nada terra videa magna derita valies darta donna mare fermentum iaculis eu non diam phasellus.'
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'homePage',
              type: 'select',
              label: 'Home Page',
              defaultValue: 'home',
              options: [
                { label: '(home) Home', value: 'home' },
                { label: '(about) About', value: 'about' },
                { label: '(courses) Courses', value: 'courses' },
                { label: '(people) People', value: 'people' },
                { label: '(news) News', value: 'news' },
                { label: '(contact) Contact', value: 'contact' },
                { label: '(enroll) Enroll', value: 'enroll' },
              ],
              admin: {
                description: 'Select which page should be displayed as the home page',
              },
            },
            {
              name: 'useLogo',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Enable to use a logo image instead of site name text',
              },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media' as const,
              admin: {
                condition: (data) => data.useLogo === true,
                description: 'Upload your site logo (recommended size: 200x60px)',
              },
              label: 'Site Logo',
            },
            {
              name: 'siteName',
              type: 'text',
              required: false,
              admin: {
                placeholder: 'Enter school name (optional)',
                description: 'Optional name text to show in header (works with logo too)',
              },
              defaultValue: 'Learner',
            },
            colorPickerField({
              name: 'siteNameColor',
              defaultValue: '#3d8de3',
              admin: {
                description: 'Optional color for header name text',
              },
            }),
            {
              name: 'siteDescription',
              type: 'textarea',
              defaultValue: 'Professional online learning platform',
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media' as const,
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'contactEmail',
              type: 'email',
              defaultValue: 'info@learnerplatform.com',
            },
            {
              name: 'contactPhone',
              type: 'text',
              defaultValue: '+1 (212) 555-7890',
            },
            {
              name: 'address',
              type: 'group',
              fields: [
                {
                  name: 'street',
                  type: 'text',
                  defaultValue: '8721 Broadway Avenue',
                },
                {
                  name: 'city',
                  type: 'text',
                  defaultValue: 'New York',
                },
                {
                  name: 'state',
                  type: 'text',
                  defaultValue: 'NY',
                },
                {
                  name: 'zipCode',
                  type: 'text',
                  defaultValue: '10023',
                },
                {
                  name: 'country',
                  type: 'text',
                  defaultValue: 'United States',
                },
              ],
            },
            {
              name: 'businessHours',
              type: 'text',
              defaultValue: 'Monday-Friday: 9AM - 6PM',
            },
          ],
        },
        {
          label: 'Social Media',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Social Links',
              labels: {
                singular: 'Social Link',
                plural: 'Social Links',
              },
              admin: {
                description: 'Add social media links. They will appear in the footer.',
              },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Twitter / X', value: 'twitter-x' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'GitHub', value: 'github' },
                    { label: 'WhatsApp', value: 'whatsapp' },
                    { label: 'Telegram', value: 'telegram' },
                    { label: 'Pinterest', value: 'pinterest' },
                    { label: 'Snapchat', value: 'snapchat' },
                    { label: 'Discord', value: 'discord' },
                    { label: 'Reddit', value: 'reddit' },
                    { label: 'Twitch', value: 'twitch' },
                    { label: 'Dribbble', value: 'dribbble' },
                    { label: 'Behance', value: 'behance' },
                  ],
                  admin: {
                    description: 'Select the social media platform',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Full URL to your profile (e.g., https://facebook.com/yourpage)',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'defaultMetaTitle',
              type: 'text',
              defaultValue: 'Learner - Professional Online Learning Platform',
            },
            {
              name: 'defaultMetaDescription',
              type: 'textarea',
              maxLength: 160,
              defaultValue: 'Learn from industry experts with our comprehensive online courses in web development, data science, design, and more.',
            },
            {
              name: 'defaultMetaImage',
              type: 'upload',
              relationTo: 'media' as const,
            },
            {
              name: 'googleAnalyticsId',
              type: 'text',
            },
          ],
        },
        {
          label: 'Page Visibility',
          description: 'Control which pages are visible on the website',
          fields: [
            {
              name: 'aboutPageActive',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show/hide About page from website and navigation',
              },
            },
            {
              name: 'coursesPageActive',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show/hide Courses page from website and navigation',
              },
            },
            {
              name: 'peoplePageActive',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show/hide People page from website and navigation',
              },
            },
            {
              name: 'newsPageActive',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show/hide News page from website and navigation',
              },
            },
            {
              name: 'blogPageActive',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show/hide Blog page from website and navigation',
              },
            },
            {
              name: 'contactPageActive',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show/hide Contact page from website and navigation',
              },
            },
            {
              name: 'enrollPageActive',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show/hide Enroll page from website and navigation',
              },
            },
          ],
        },
        {
          label: 'Theme & Styling',
          description: 'Customize the look and feel of your website',
          fields: [
            {
              name: 'theme',
              type: 'group',
              fields: [
                colorPickerField({
                  name: 'primaryColor',
                  defaultValue: '#F0690F',
                  admin: {
                    description: 'Primary brand color',
                  },
                }),
                colorPickerField({
                  name: 'secondaryColor',
                  defaultValue: '#1C2E40',
                  admin: {
                    description: 'Secondary color',
                  },
                }),
                colorPickerField({
                  name: 'accentColor',
                  defaultValue: '#FAC219',
                  admin: {
                    description: 'Accent highlight color',
                  },
                }),
                colorPickerField({
                  name: 'backgroundColor',
                  defaultValue: '#F9F7F6',
                  admin: {
                    description: 'Page background color',
                  },
                }),
                colorPickerField({
                  name: 'darkModeColor',
                  defaultValue: '#0F1A24',
                  admin: {
                    description: 'Dark mode surface color (used for dark sections like stats)',
                  },
                }),
                colorPickerField({
                  name: 'primaryForegroundColor',
                  defaultValue: '#FFFFFF',
                  admin: {
                    description: 'Foreground text color on primary backgrounds',
                  },
                }),
                {
                  name: 'enableSoftGradientBackground',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Enable soft gradient background overlay across the site',
                  },
                },
                {
                  name: 'softGradientIntensity',
                  type: 'select',
                  defaultValue: 'medium',
                  options: [
                    { label: 'Low', value: 'low' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'High', value: 'high' },
                  ],
                  admin: {
                    condition: (data, siblingData) => siblingData?.enableSoftGradientBackground !== false,
                    description: 'Control how visible the soft gradient should be',
                  },
                },
              ],
            },
            {
              name: 'typography',
              type: 'group',
              fields: [
                {
                  name: 'headingFont',
                  type: 'select',
                  defaultValue: 'Raleway',
                  options: [
                    { label: 'Raleway', value: 'Raleway' },
                    { label: 'Roboto', value: 'Roboto' },
                    { label: 'Ubuntu', value: 'Ubuntu' },
                    { label: 'Open Sans', value: 'Open Sans' },
                    { label: 'Poppins', value: 'Poppins' },
                    { label: 'Montserrat', value: 'Montserrat' },
                    { label: 'Lato', value: 'Lato' },
                    { label: 'Inter', value: 'Inter' },
                  ],
                  admin: {
                    description: 'Font family for headings',
                  },
                },
                {
                  name: 'bodyFont',
                  type: 'select',
                  defaultValue: 'Roboto',
                  options: [
                    { label: 'Roboto', value: 'Roboto' },
                    { label: 'Open Sans', value: 'Open Sans' },
                    { label: 'Lato', value: 'Lato' },
                    { label: 'Ubuntu', value: 'Ubuntu' },
                    { label: 'Poppins', value: 'Poppins' },
                    { label: 'Inter', value: 'Inter' },
                    { label: 'Nunito', value: 'Nunito' },
                  ],
                  admin: {
                    description: 'Font family for body text',
                  },
                },
                {
                  name: 'baseFontSize',
                  type: 'select',
                  defaultValue: '16px',
                  options: [
                    { label: 'Small (14px)', value: '14px' },
                    { label: 'Normal (16px)', value: '16px' },
                    { label: 'Large (18px)', value: '18px' },
                    { label: 'Extra Large (20px)', value: '20px' },
                  ],
                  admin: {
                    description: 'Base font size for body text',
                  },
                },
              ],
            },
            {
              name: 'headerStyle',
              type: 'group',
              fields: [
                {
                  name: 'headerType',
                  type: 'select',
                  defaultValue: 'sticky',
                  options: [
                    { label: 'Sticky (Always Visible)', value: 'sticky' },
                    { label: 'Fixed (Transparent on Hero)', value: 'fixed-transparent' },
                    { label: 'Static (Scrolls Away)', value: 'static' },
                  ],
                  admin: {
                    description: 'Header behavior on scroll',
                  },
                },
                {
                  name: 'headerBackground',
                  type: 'select',
                  defaultValue: 'white',
                  options: [
                    { label: 'White', value: 'white' },
                    { label: 'Light', value: 'light' },
                    { label: 'Dark', value: 'dark' },
                    { label: 'Primary Color', value: 'primary' },
                    { label: 'Transparent', value: 'transparent' },
                  ],
                  admin: {
                    description: 'Header background style',
                  },
                },
                {
                  name: 'headerShadow',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    description: 'Show shadow under header',
                  },
                },
              ],
            },
            {
              name: 'buttonStyle',
              type: 'group',
              fields: [
                {
                  name: 'borderRadius',
                  type: 'select',
                  defaultValue: 'rounded',
                  options: [
                    { label: 'Square', value: 'square' },
                    { label: 'Slightly Rounded', value: 'slight' },
                    { label: 'Rounded', value: 'rounded' },
                    { label: 'Pill', value: 'pill' },
                  ],
                  admin: {
                    description: 'Button corner style',
                  },
                },
                {
                  name: 'buttonSize',
                  type: 'select',
                  defaultValue: 'medium',
                  options: [
                    { label: 'Small', value: 'small' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Large', value: 'large' },
                  ],
                  admin: {
                    description: 'Default button size',
                  },
                },
              ],
            },
            {
              name: 'layoutSettings',
              type: 'group',
              fields: [
                {
                  name: 'containerWidth',
                  type: 'select',
                  defaultValue: 'default',
                  options: [
                    { label: 'Narrow (960px)', value: 'narrow' },
                    { label: 'Default (1140px)', value: 'default' },
                    { label: 'Wide (1320px)', value: 'wide' },
                    { label: 'Full Width', value: 'full' },
                  ],
                  admin: {
                    description: 'Maximum content width',
                  },
                },
                {
                  name: 'sectionSpacing',
                  type: 'select',
                  defaultValue: 'normal',
                  options: [
                    { label: 'Compact', value: 'compact' },
                    { label: 'Normal', value: 'normal' },
                    { label: 'Spacious', value: 'spacious' },
                  ],
                  admin: {
                    description: 'Spacing between page sections',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footerText',
              type: 'textarea',
              defaultValue: 'Cras fermentum odio eu feugiat lide par naso tierra. Justo eget nada terra videa magna derita valies darta donna mare fermentum iaculis eu non diam phasellus.',
            },
            {
              name: 'copyrightText',
              type: 'text',
              defaultValue: '© Copyright Learner All Rights Reserved',
            },
            {
              name: 'footerLinks',
              type: 'array',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                },
                {
                  name: 'links',
                  type: 'array',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                    },
                    {
                      name: 'url',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
