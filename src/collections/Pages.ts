import type { CollectionConfig } from 'payload'
import { FlexibleRowBlock } from '@/blocks/FlexibleRow'

// Type for user with role field
type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  allowedCollections?: string[]
  [key: string]: unknown
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Create Page',
    plural: 'Create Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'template', 'status', 'updatedAt'],
    group: 'Content Management',
    description: 'Create and manage dynamic pages. These pages can be accessed via their custom URL slug.',
    hidden: ({ user }) => {
      const u = user as UserWithRole | null
      if (!u) return true
      if (u.role === 'author') return true  // Authors typically can't create new pages
      return false
    },
  },
  access: {
    read: () => true,
    create: ({ req }) => {
      if (!req) return false
      const u = req.user as UserWithRole | null
      if (!u) return false
      if (!u.role || ['superadmin', 'admin', 'editor'].includes(u.role)) return true
      return false
    },
    update: ({ req }) => {
      if (!req) return false
      const u = req.user as UserWithRole | null
      if (!u) return false
      if (!u.role || ['superadmin', 'admin', 'editor'].includes(u.role)) return true
      return false
    },
    delete: ({ req }) => {
      if (!req) return false
      const u = req.user as UserWithRole | null
      if (!u) return false
      if (!u.role || ['superadmin', 'admin'].includes(u.role)) return true
      return false
    },
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Add to navigation when page is published (on create or update)
        if (doc.status === 'published') {
          try {
            // Get current navigation
            const navigation = await req.payload.findGlobal({
              slug: 'navigation' as 'settings',
            })

            // Get existing menu items or empty array
            const menuItems = (navigation as any)?.menuItems || []

            const pageId = String(doc.id)
            const pageSlug = doc.slug ? `/${doc.slug}` : null
            const normalizePath = (value: string | null | undefined): string | null => {
              if (!value) return null
              const trimmed = value.trim().toLowerCase()
              if (!trimmed) return null
              if (trimmed === '/') return '/'
              return trimmed.replace(/\/+$/, '')
            }
            const normalizedPageSlug = normalizePath(pageSlug)
            const navigationParentLabel = typeof (doc as any).navigationParentLabel === 'string'
              ? (doc as any).navigationParentLabel.trim()
              : ''
            const navigationParentLabelLower = navigationParentLabel.toLowerCase()
            const parentId = doc.parentPage
              ? String(typeof doc.parentPage === 'object' ? (doc.parentPage as any).id : doc.parentPage)
              : null
            const parentSlugFromRelation =
              doc.parentPage && typeof doc.parentPage === 'object' && (doc.parentPage as any).slug
                ? `/${(doc.parentPage as any).slug}`
                : null

            const getDynamicPageId = (item: any): string | null => {
              if (!item?.dynamicPageLink) return null
              if (typeof item.dynamicPageLink === 'object' && item.dynamicPageLink?.id) {
                return String(item.dynamicPageLink.id)
              }
              if (typeof item.dynamicPageLink === 'string') {
                return item.dynamicPageLink
              }
              return null
            }

            const isSamePageItem = (item: any): boolean => {
              const dynamicId = getDynamicPageId(item)
              if (dynamicId === pageId) return true

              if (!normalizedPageSlug) return false

              const customLink = normalizePath(item?.customLink)
              if (customLink === normalizedPageSlug) return true

              const internalLink = normalizePath(item?.internalLink)
              if (internalLink === normalizedPageSlug) return true

              if (item?.dynamicPageLink && typeof item.dynamicPageLink === 'object' && item.dynamicPageLink?.slug) {
                const dynamicSlugPath = normalizePath(`/${String(item.dynamicPageLink.slug)}`)
                if (dynamicSlugPath === normalizedPageSlug) return true
              }

              if (typeof item?.dynamicPageLink === 'string') {
                const dynamicPath = normalizePath(`/${item.dynamicPageLink}`)
                if (dynamicPath === normalizedPageSlug) return true
              }

              return false
            }

            const removePageFromChildren = (items: any[]) => {
              return items.map((item) => {
                if (!Array.isArray(item?.children)) return item
                return {
                  ...item,
                  children: item.children.filter((child: any) => !isSamePageItem(child)),
                }
              })
            }

            const pageExistsTopLevel = menuItems.some((item: any) => isSamePageItem(item))

            const pageExistsAsChild = menuItems.some(
              (item: any) => Array.isArray(item?.children) && item.children.some((child: any) => isSamePageItem(child)),
            )

            // Check if page already exists in navigation
            const pageExists = pageExistsTopLevel || pageExistsAsChild

            const childMenuItem = {
              label: doc.title,
              linkType: 'dynamic',
              dynamicPageLink: doc.id,
              customLink: `/${doc.slug}`,
              isVisible: true,
            }

            const topLevelMenuItem = {
              label: doc.title,
              linkType: 'custom',
              customLink: `/${doc.slug}`,
              dynamicPageLink: doc.id,
              isVisible: true,
            }

            // Resolve target parent menu item using explicit navigation label first,
            // then fall back to parentPage relation when available.
            let parentSlugPath = parentSlugFromRelation

            if (!navigationParentLabelLower && parentId && !parentSlugPath) {
              try {
                const parentDoc = await req.payload.findByID({
                  collection: 'pages' as 'media',
                  id: parentId,
                  depth: 0,
                })
                if ((parentDoc as any)?.slug) {
                  parentSlugPath = `/${(parentDoc as any).slug}`
                }
              } catch (error) {
                console.error('Error resolving parent page slug for navigation nesting:', error)
              }
            }

            const hasParentTarget = !!navigationParentLabelLower || !!parentId

            const isTargetParentItem = (item: any): boolean => {
              if (navigationParentLabelLower) {
                return typeof item?.label === 'string' && item.label.trim().toLowerCase() === navigationParentLabelLower
              }

              if (parentId) {
                const parentDynamicId = getDynamicPageId(item)
                return parentDynamicId === parentId || (parentSlugPath ? item?.customLink === parentSlugPath : false)
              }

              return false
            }

            if (hasParentTarget) {
              const menuWithoutThisPage = menuItems.filter((item: any) => !isSamePageItem(item))
              const menuWithoutThisPageInChildren = removePageFromChildren(menuWithoutThisPage)
              const adjustedParentIndex = menuWithoutThisPageInChildren.findIndex((item: any) => isTargetParentItem(item))

              if (adjustedParentIndex !== -1) {
                const parentItem = menuWithoutThisPageInChildren[adjustedParentIndex]
                const existingChildren = Array.isArray(parentItem.children) ? parentItem.children : []
                const childExists = existingChildren.some((child: any) => isSamePageItem(child))

                const updatedChildren = childExists ? existingChildren : [...existingChildren, childMenuItem]
                const updatedMenuItems = [...menuWithoutThisPageInChildren]
                updatedMenuItems[adjustedParentIndex] = {
                  ...parentItem,
                  children: updatedChildren,
                }

                await req.payload.updateGlobal({
                  slug: 'navigation' as 'settings',
                  data: {
                    menuItems: updatedMenuItems,
                  } as any,
                })

                console.log(`✅ Added "${doc.title}" as child page in navigation`)
                return doc
              }
            }

            if (!pageExists) {
              await req.payload.updateGlobal({
                slug: 'navigation' as 'settings',
                data: {
                  menuItems: [...menuItems, topLevelMenuItem],
                } as any,
              })

              console.log(`✅ Added "${doc.title}" to navigation`)
            }
          } catch (error) {
            console.error('Error adding page to navigation:', error)
          }
        }
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Page Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'Page title (displayed in browser tab and page header)',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                description: 'URL-friendly identifier (e.g., "services" creates /services page). Auto-generated from title if left empty.',
              },
              hooks: {
                beforeValidate: [
                  ({ value, data }) => {
                    if (!value && data?.title) {
                      return data.title
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
              name: 'template',
              type: 'select',
              required: true,
              defaultValue: 'default',
              options: [
                { label: 'Default (Full Width)', value: 'default' },
                { label: 'With Sidebar', value: 'sidebar' },
                { label: 'Landing Page (No Header/Footer)', value: 'landing' },
                { label: 'Minimal (Clean)', value: 'minimal' },
              ],
              admin: {
                description: 'Choose a page layout template',
              },
            },
            {
              name: 'showPageTitle',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Display the page title section with breadcrumbs',
              },
            },
            {
              name: 'breadcrumbs',
              type: 'array',
              admin: {
                description: 'Custom breadcrumb trail (leave empty for auto-generated)',
                condition: (data) => data.showPageTitle === true,
              },
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
              ],
            },
            {
              name: 'content',
              type: 'richText',
              admin: {
                description: 'Main page content (rich text with formatting)',
              },
            },
            {
              name: 'layout',
              type: 'blocks',
              label: 'Layout Blocks',
              blocks: [FlexibleRowBlock],
              admin: {
                description: 'Add advanced layout sections like Flexible Row / Content Grid.',
                initCollapsed: true,
              },
            },
            {
              name: 'sections',
              type: 'array',
              label: 'Page Sections',
              admin: {
                description: 'Add flexible content sections to your page. Drag to reorder.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'sectionType',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Rich Text Block', value: 'richText' },
                    { label: 'Hero Section', value: 'hero' },
                    { label: 'Cards Grid', value: 'cards' },
                    { label: 'Image Gallery', value: 'gallery' },
                    { label: 'Call to Action', value: 'cta' },
                    { label: 'FAQ Accordion', value: 'faq' },
                    { label: 'Testimonials', value: 'testimonials' },
                    { label: 'Stats/Counters', value: 'stats' },
                    { label: 'Team/People', value: 'team' },
                    { label: 'Contact Form', value: 'contactForm' },
                    { label: 'Video Embed', value: 'video' },
                    { label: 'Custom HTML', value: 'customHtml' },
                    { label: 'Spacer', value: 'spacer' },
                  ],
                },
                {
                  name: 'sectionTitle',
                  type: 'text',
                  admin: {
                    description: 'Optional section heading',
                  },
                },
                {
                  name: 'sectionSubtitle',
                  type: 'text',
                  admin: {
                    description: 'Optional section subtitle',
                  },
                },
                {
                  name: 'backgroundColor',
                  type: 'select',
                  defaultValue: 'white',
                  options: [
                    { label: 'White', value: 'white' },
                    { label: 'Light Gray', value: 'light' },
                    { label: 'Primary Color', value: 'primary' },
                    { label: 'Secondary Color', value: 'secondary' },
                    { label: 'Dark', value: 'dark' },
                  ],
                },
                // Rich Text Section
                {
                  name: 'richTextContent',
                  type: 'richText',
                  admin: {
                    condition: (data, siblingData) => siblingData?.sectionType === 'richText',
                  },
                },
                // Hero Section
                {
                  name: 'heroContent',
                  type: 'group',
                  admin: {
                    condition: (data, siblingData) => siblingData?.sectionType === 'hero',
                  },
                  fields: [
                    { name: 'headline', type: 'text' },
                    { name: 'subheadline', type: 'textarea' },
                    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
                    { name: 'buttonText', type: 'text' },
                    { name: 'buttonLink', type: 'text' },
                  ],
                },
                // Cards Grid
                {
                  name: 'cards',
                  type: 'array',
                  admin: {
                    condition: (data, siblingData) => siblingData?.sectionType === 'cards',
                  },
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'description', type: 'textarea' },
                    { name: 'image', type: 'upload', relationTo: 'media' },
                    { name: 'icon', type: 'select', options: [
                      { label: 'None', value: '' },
                      { label: 'Star', value: 'bi-star' },
                      { label: 'Heart', value: 'bi-heart' },
                      { label: 'Check', value: 'bi-check-circle' },
                      { label: 'Award', value: 'bi-award' },
                      { label: 'Lightning', value: 'bi-lightning' },
                      { label: 'Gear', value: 'bi-gear' },
                      { label: 'Globe', value: 'bi-globe' },
                      { label: 'People', value: 'bi-people' },
                    ]},
                    { name: 'link', type: 'text' },
                  ],
                },
                // Image Gallery
                {
                  name: 'galleryImages',
                  type: 'array',
                  admin: {
                    condition: (data, siblingData) => siblingData?.sectionType === 'gallery',
                  },
                  fields: [
                    { name: 'image', type: 'upload', relationTo: 'media', required: true },
                    { name: 'caption', type: 'text' },
                  ],
                },
                // CTA Section
                {
                  name: 'ctaContent',
                  type: 'group',
                  admin: {
                    condition: (data, siblingData) => siblingData?.sectionType === 'cta',
                  },
                  fields: [
                    { name: 'headline', type: 'text' },
                    { name: 'description', type: 'textarea' },
                    { name: 'primaryButtonText', type: 'text' },
                    { name: 'primaryButtonLink', type: 'text' },
                    { name: 'secondaryButtonText', type: 'text' },
                    { name: 'secondaryButtonLink', type: 'text' },
                  ],
                },
                // FAQ Section
                {
                  name: 'faqItems',
                  type: 'array',
                  admin: {
                    condition: (data, siblingData) => siblingData?.sectionType === 'faq',
                  },
                  fields: [
                    { name: 'question', type: 'text', required: true },
                    { name: 'answer', type: 'textarea', required: true },
                  ],
                },
                // Testimonials
                {
                  name: 'testimonialItems',
                  type: 'array',
                  admin: {
                    condition: (data, siblingData) => siblingData?.sectionType === 'testimonials',
                  },
                  fields: [
                    { name: 'quote', type: 'textarea', required: true },
                    { name: 'authorName', type: 'text', required: true },
                    { name: 'authorRole', type: 'text' },
                    { name: 'authorImage', type: 'upload', relationTo: 'media' },
                    { name: 'rating', type: 'number', min: 1, max: 5 },
                  ],
                },
                // Stats Section
                {
                  name: 'statsItems',
                  type: 'array',
                  admin: {
                    condition: (data, siblingData) => siblingData?.sectionType === 'stats',
                  },
                  fields: [
                    { name: 'number', type: 'text', required: true },
                    { name: 'label', type: 'text', required: true },
                    { name: 'icon', type: 'select', options: [
                      { label: 'None', value: '' },
                      { label: 'People', value: 'bi-people' },
                      { label: 'Trophy', value: 'bi-trophy' },
                      { label: 'Star', value: 'bi-star' },
                      { label: 'Book', value: 'bi-book' },
                      { label: 'Globe', value: 'bi-globe' },
                    ]},
                  ],
                },
                // Team Section
                {
                  name: 'teamMembers',
                  type: 'array',
                  admin: {
                    condition: (data, siblingData) => siblingData?.sectionType === 'team',
                  },
                  fields: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'role', type: 'text' },
                    { name: 'image', type: 'upload', relationTo: 'media' },
                    { name: 'bio', type: 'textarea' },
                    { name: 'socialLinks', type: 'array', fields: [
                      { name: 'platform', type: 'select', options: [
                        { label: 'LinkedIn', value: 'linkedin' },
                        { label: 'Twitter', value: 'twitter' },
                        { label: 'Facebook', value: 'facebook' },
                        { label: 'Instagram', value: 'instagram' },
                      ]},
                      { name: 'url', type: 'text' },
                    ]},
                  ],
                },
                // Contact Form
                {
                  name: 'contactFormSettings',
                  type: 'group',
                  admin: {
                    condition: (data, siblingData) => siblingData?.sectionType === 'contactForm',
                  },
                  fields: [
                    { name: 'formTitle', type: 'text', defaultValue: 'Get in Touch' },
                    { name: 'submitButtonText', type: 'text', defaultValue: 'Send Message' },
                    { name: 'successMessage', type: 'text', defaultValue: 'Thank you! Your message has been sent.' },
                  ],
                },
                // Video Embed
                {
                  name: 'videoContent',
                  type: 'group',
                  admin: {
                    condition: (data, siblingData) => siblingData?.sectionType === 'video',
                  },
                  fields: [
                    { name: 'videoType', type: 'select', options: [
                      { label: 'YouTube', value: 'youtube' },
                      { label: 'Vimeo', value: 'vimeo' },
                      { label: 'Self-hosted', value: 'self' },
                    ]},
                    { name: 'videoUrl', type: 'text' },
                    { name: 'videoFile', type: 'upload', relationTo: 'media', admin: {
                      condition: (data, siblingData) => siblingData?.videoType === 'self',
                    }},
                    { name: 'posterImage', type: 'upload', relationTo: 'media' },
                  ],
                },
                // Custom HTML
                {
                  name: 'customHtmlContent',
                  type: 'code',
                  admin: {
                    condition: (data, siblingData) => siblingData?.sectionType === 'customHtml',
                    language: 'html',
                    description: 'Add custom HTML code (use with caution)',
                  },
                },
                // Spacer
                {
                  name: 'spacerHeight',
                  type: 'select',
                  defaultValue: 'medium',
                  admin: {
                    condition: (data, siblingData) => siblingData?.sectionType === 'spacer',
                  },
                  options: [
                    { label: 'Small (20px)', value: 'small' },
                    { label: 'Medium (40px)', value: 'medium' },
                    { label: 'Large (80px)', value: 'large' },
                    { label: 'Extra Large (120px)', value: 'xlarge' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              admin: {
                description: 'Custom meta title (defaults to page title if empty)',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              maxLength: 160,
              admin: {
                description: 'Meta description for search engines (max 160 characters)',
              },
            },
            {
              name: 'metaImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Social sharing image (Open Graph)',
              },
            },
            {
              name: 'noIndex',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Prevent search engines from indexing this page',
              },
            },
            {
              name: 'canonicalUrl',
              type: 'text',
              admin: {
                description: 'Custom canonical URL (optional)',
              },
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            {
              name: 'status',
              type: 'select',
              required: true,
              defaultValue: 'draft',
              options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
              ],
              admin: {
                description: 'Only published pages are visible on the website',
              },
            },
            {
              name: 'publishedAt',
              type: 'date',
              admin: {
                description: 'Publication date (for scheduling)',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'users',
              admin: {
                description: 'Page author',
              },
            },
            {
              name: 'parentPage',
              type: 'relationship',
              relationTo: 'pages' as 'media',
              admin: {
                description: 'Parent page (for hierarchical structure)',
              },
            },
            {
              name: 'navigationParentLabel',
              type: 'text',
              admin: {
                description: 'Optional navigation parent label (e.g., Academics). Use this when the parent is a menu level, not a page.',
              },
            },
            {
              name: 'order',
              type: 'number',
              defaultValue: 0,
              admin: {
                description: 'Display order (lower numbers first)',
              },
            },
          ],
        },
      ],
    },
  ],
}
