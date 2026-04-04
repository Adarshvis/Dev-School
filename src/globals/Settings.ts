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
              name: 'logoWidth',
              type: 'number',
              label: 'Logo Width (px)',
              defaultValue: 52,
              admin: {
                condition: (data) => data.useLogo === true,
                description: 'Set logo width in pixels.',
                step: 1,
              },
              min: 20,
              max: 800,
            },
            {
              name: 'logoHeight',
              type: 'number',
              label: 'Logo Height (px)',
              defaultValue: 52,
              admin: {
                condition: (data) => data.useLogo === true,
                description: 'Set logo height in pixels. Increase for a larger logo (e.g., ADNOC-style prominent logo).',
                step: 1,
              },
              min: 20,
              max: 2000,
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
            {
              name: 'siteNameFontSize',
              type: 'number',
              label: 'Site Name Font Size (px)',
              defaultValue: 26,
              admin: {
                description: 'Set header site name font size in pixels.',
                step: 1,
              },
              min: 12,
              max: 96,
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
                    description: 'Primary color (used for headings and primary buttons)',
                  },
                }),
                colorPickerField({
                  name: 'secondaryColor',
                  defaultValue: '#1C2E40',
                  admin: {
                    description: 'Secondary color (used for subheadings and labels)',
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
                  defaultValue: 'Playfair Display',
                  options: [
                    { label: 'Playfair Display', value: 'Playfair Display' },
                    { label: 'DM Sans', value: 'DM Sans' },
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
                  name: 'subHeadingFont',
                  type: 'select',
                  defaultValue: 'DM Sans',
                  options: [
                    { label: 'DM Sans', value: 'DM Sans' },
                    { label: 'Playfair Display', value: 'Playfair Display' },
                    { label: 'Poppins', value: 'Poppins' },
                    { label: 'Montserrat', value: 'Montserrat' },
                    { label: 'Raleway', value: 'Raleway' },
                    { label: 'Roboto', value: 'Roboto' },
                    { label: 'Open Sans', value: 'Open Sans' },
                    { label: 'Lato', value: 'Lato' },
                    { label: 'Inter', value: 'Inter' },
                    { label: 'Nunito', value: 'Nunito' },
                  ],
                  admin: {
                    description: 'Font family for subheadings and section labels',
                  },
                },
                {
                  name: 'bodyFont',
                  type: 'select',
                  defaultValue: 'DM Sans',
                  options: [
                    { label: 'DM Sans', value: 'DM Sans' },
                    { label: 'Playfair Display', value: 'Playfair Display' },
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
                  name: 'headerLayout',
                  type: 'select',
                  defaultValue: 'default',
                  options: [
                    { label: 'Default (Logo Left, Menu Right)', value: 'default' },
                    { label: 'Centered (Menu Top, Large Logo Center)', value: 'centered' },
                  ],
                  admin: {
                    description: 'Choose header layout. "Centered" shows the menu on top with a larger centered logo below. On scroll it collapses to the default layout.',
                  },
                },
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
          label: 'Announcement Popup',
          fields: [
            {
              name: 'announcementPopup',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Enable popup banner on frontend.',
                  },
                },
                {
                  name: 'showOn',
                  type: 'select',
                  defaultValue: 'home',
                  options: [
                    { label: 'Home Page Only', value: 'home' },
                    { label: 'All Pages', value: 'all' },
                  ],
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                    description: 'Choose where popup should appear.',
                  },
                },
                {
                  name: 'campaignKey',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                    description: 'Optional key to reset dismissal when campaign changes (e.g., admission-2026).',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'Admissions Open 2026-27',
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                  },
                },
                {
                  name: 'subtitle',
                  type: 'textarea',
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                    description: 'Optional short text below title.',
                  },
                },
                {
                  name: 'mediaType',
                  type: 'select',
                  defaultValue: 'image',
                  options: [
                    { label: 'Image', value: 'image' },
                    { label: 'Video', value: 'video' },
                  ],
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                  },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media' as const,
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true && siblingData?.mediaType === 'image',
                  },
                },
                {
                  name: 'videoType',
                  type: 'select',
                  defaultValue: 'youtube',
                  options: [
                    { label: 'YouTube URL', value: 'youtube' },
                    { label: 'Uploaded Video', value: 'upload' },
                  ],
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true && siblingData?.mediaType === 'video',
                  },
                },
                {
                  name: 'videoUrl',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) =>
                      siblingData?.enabled === true &&
                      siblingData?.mediaType === 'video' &&
                      siblingData?.videoType === 'youtube',
                    description: 'Paste full YouTube URL.',
                  },
                },
                {
                  name: 'videoFile',
                  type: 'upload',
                  relationTo: 'media' as const,
                  admin: {
                    condition: (data, siblingData) =>
                      siblingData?.enabled === true &&
                      siblingData?.mediaType === 'video' &&
                      siblingData?.videoType === 'upload',
                  },
                },
                {
                  name: 'modalSize',
                  type: 'select',
                  defaultValue: 'comfortable',
                  options: [
                    { label: 'Compact', value: 'compact' },
                    { label: 'Comfortable', value: 'comfortable' },
                    { label: 'Large', value: 'large' },
                  ],
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                    description: 'Popup size preset for desktop.',
                  },
                },
                {
                  name: 'delaySeconds',
                  type: 'number',
                  defaultValue: 0,
                  min: 0,
                  max: 30,
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                    description: 'Delay before showing popup after page load.',
                    step: 1,
                  },
                },
                {
                  name: 'frequency',
                  type: 'select',
                  defaultValue: 'once-per-session',
                  options: [
                    { label: 'Every Visit', value: 'every-visit' },
                    { label: 'Once Per Session', value: 'once-per-session' },
                    { label: 'Once Per Day', value: 'once-per-day' },
                  ],
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                  },
                },
                {
                  name: 'closeOnBackdrop',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                    description: 'Allow closing popup by clicking outside.',
                  },
                },
                {
                  name: 'startAt',
                  type: 'date',
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                    description: 'Optional schedule start date/time.',
                  },
                },
                {
                  name: 'endAt',
                  type: 'date',
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                    description: 'Optional schedule end date/time.',
                  },
                },
                {
                  name: 'showCta',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true,
                  },
                },
                {
                  name: 'ctaText',
                  type: 'text',
                  defaultValue: 'Learn More',
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true && siblingData?.showCta === true,
                  },
                },
                {
                  name: 'ctaLink',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true && siblingData?.showCta === true,
                  },
                },
                {
                  name: 'ctaNewTab',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    condition: (data, siblingData) => siblingData?.enabled === true && siblingData?.showCta === true,
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
              name: 'footerTitle',
              type: 'text',
              defaultValue: 'Learner',
              admin: {
                description: 'The title shown in the footer (separate from the header site name).',
              },
            },
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
