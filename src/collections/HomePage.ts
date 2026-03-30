import type { CollectionConfig } from 'payload'
import { hasAdminOnlyAccess, hasCollectionAccess } from '@/lib/access'
import { colorPickerField } from '@innovixx/payload-color-picker-field'
import { FlexibleRowBlock } from '@/blocks/FlexibleRow'

// Type for user with role field
type UserWithRole = {
  id: string
  role?: 'superadmin' | 'admin' | 'editor' | 'author'
  allowedCollections?: string[]
  [key: string]: unknown
}

export const HomePage: CollectionConfig = {
  slug: 'home-page',
  labels: {
    singular: 'Home Page',
    plural: 'Home Page',
  },
  admin: {
    useAsTitle: 'sectionName',
    defaultColumns: ['sectionName', 'sectionType', 'updatedAt'],
    group: 'Content Management',
    description: 'Manage home page sections. Use the order field to control display order.',
    hidden: ({ user }) => {
      const u = user as UserWithRole | null
      if (!u) return true
      if (u.role === 'author') {
        const allowed = u.allowedCollections || []
        if (!allowed.includes('home-page')) return true
      }
      return false
    },
  },
  access: {
    read: () => true,
    create: ({ req }) => hasCollectionAccess(req, 'home-page'),
    update: ({ req }) => hasCollectionAccess(req, 'home-page'),
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
      name: 'sectionType',
      type: 'select',
      required: true,
      options: [
        { label: 'Hero Section', value: 'hero' },
        { label: 'Our Story', value: 'our-story' },
        { label: 'Work With Us', value: 'featured-courses' },
        { label: 'Course Categories', value: 'course-categories' },
        { label: 'Research Domains', value: 'featured-instructors' },
        { label: 'Testimonials', value: 'testimonials' },
        { label: 'Featured News', value: 'featured-news' },
        { label: 'Recent Blog Posts', value: 'blog-posts' },
        { label: 'CTA Section', value: 'cta' },
        { label: 'Custom Block', value: 'custom-block' },
      ],
      admin: {
        description: 'Select the section type',
      },
    },
    {
      name: 'sectionName',
      type: 'text',
      required: true,
      admin: {
        description: 'Custom name to identify this section (e.g., "Our Best Courses", "Popular Classes")',
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
    colorPickerField({
      name: 'sectionBackgroundColor',
      defaultValue: '#ffffff',
      admin: {
        description: 'Background color for this home page section',
      },
    }),

    // HERO SECTION FIELDS
    {
      name: 'hero',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'hero',
      },
      fields: [
        {
          name: 'layoutType',
          type: 'select',
          required: true,
          defaultValue: 'text-slider',
          options: [
            { label: 'Text + Slider (50/50) - Default', value: 'text-slider' },
            { label: 'Single Image (Full Width)', value: 'single-image' },
            { label: 'Slider (Full Width - Mixed Media)', value: 'slider-fullwidth' },
          ],
          admin: {
            description: 'Select the hero layout style',
          },
        },
        
        // DEFAULT TEXT + SLIDER FIELDS (shown when layoutType = 'text-slider')
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            condition: (data, siblingData) => siblingData?.layoutType === 'text-slider',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            condition: (data, siblingData) => siblingData?.layoutType === 'text-slider',
          },
        },
        {
          name: 'heroImages',
          type: 'array',
          label: 'Hero Media (Carousel)',
          minRows: 1,
          admin: {
            description: 'Add mixed media items for 50/50 hero carousel',
            condition: (data, siblingData) => siblingData?.layoutType === 'text-slider',
          },
          fields: [
            {
              name: 'mediaType',
              type: 'select',
              defaultValue: 'image',
              required: false,
              options: [
                { label: 'Text Content', value: 'text' },
                { label: 'Image Media', value: 'image' },
                { label: 'Video Media', value: 'video' },
                { label: 'Audio Media', value: 'audio' },
                { label: 'Document Media', value: 'document' },
                { label: 'Animation Media', value: 'animation' },
                { label: '3D & Immersive', value: '3d' },
                { label: 'YouTube/Vimeo', value: 'embed' },
                { label: 'Data Visualization', value: 'data' },
              ],
            },
            {
              name: 'textContent',
              type: 'group',
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === 'text',
              },
              fields: [
                { name: 'title', type: 'text' },
                { name: 'description', type: 'textarea' },
              ],
            },
            {
              name: 'imageFile',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === 'image' || !siblingData?.mediaType,
              },
            },
            {
              name: 'imageAlt',
              type: 'text',
              label: 'Image Alt Text',
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === 'image' || !siblingData?.mediaType,
              },
            },
            {
              name: 'videoFile',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === 'video',
              },
            },
            {
              name: 'videoPoster',
              type: 'upload',
              relationTo: 'media',
              label: 'Video Poster Image',
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === 'video',
              },
            },
            {
              name: 'videoAutoplay',
              type: 'checkbox',
              defaultValue: false,
              label: 'Autoplay Video',
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === 'video',
              },
            },
            {
              name: 'videoControls',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show Video Controls',
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === 'video',
              },
            },
            {
              name: 'audioFile',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === 'audio',
              },
            },
            {
              name: 'audioAutoplay',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === 'audio',
              },
            },
            {
              name: 'documentFile',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === 'document',
              },
            },
            {
              name: 'documentDisplayMode',
              type: 'select',
              options: [
                { label: 'Download Button', value: 'download' },
                { label: 'Embedded Viewer', value: 'embed' },
              ],
              defaultValue: 'download',
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === 'document',
              },
            },
            {
              name: 'animationFile',
              type: 'upload',
              relationTo: 'media',
              label: 'Lottie JSON or GIF',
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === 'animation',
              },
            },
            {
              name: 'animationLoop',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === 'animation',
              },
            },
            {
              name: 'model3DFile',
              type: 'upload',
              relationTo: 'media',
              label: '3D Model (GLB/GLTF)',
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === '3d',
              },
            },
            {
              name: 'model3DAutoRotate',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === '3d',
              },
            },
            {
              name: 'embedType',
              type: 'select',
              options: [
                { label: 'YouTube', value: 'youtube' },
                { label: 'Vimeo', value: 'vimeo' },
                { label: 'Custom iFrame', value: 'iframe' },
              ],
              defaultValue: 'youtube',
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === 'embed',
              },
            },
            {
              name: 'embedUrl',
              type: 'text',
              label: 'Video URL or Embed Code',
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === 'embed',
              },
            },
            {
              name: 'embedAutoplay',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === 'embed',
              },
            },
            {
              name: 'dataEmbedUrl',
              type: 'text',
              label: 'Dashboard/Chart Embed URL',
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === 'data',
              },
            },
            {
              name: 'dataHeight',
              type: 'number',
              defaultValue: 400,
              label: 'Embed Height (px)',
              admin: {
                condition: (data, siblingData) => siblingData?.mediaType === 'data',
              },
            },
            {
              name: 'alt',
              type: 'text',
              label: 'Alt Text',
              admin: {
                description: 'Alternative text for the image',
              },
            },
          ],
        },
        {
          name: 'textSliderSettings',
          type: 'group',
          label: 'Text Slider Controls',
          admin: {
            condition: (data, siblingData) => siblingData?.layoutType === 'text-slider',
            description: 'Control dots, arrows, and pause behavior for the 50/50 hero carousel.',
          },
          fields: [
            {
              name: 'showIndicators',
              type: 'checkbox',
              label: 'Show Dots (Indicators)',
              defaultValue: true,
            },
            {
              name: 'showArrows',
              type: 'checkbox',
              label: 'Show Left/Right Arrows',
              defaultValue: true,
            },
            {
              name: 'pauseOnHover',
              type: 'checkbox',
              label: 'Pause on Hover',
              defaultValue: true,
            },
            {
              name: 'interval',
              type: 'number',
              label: 'Slide Interval (seconds)',
              defaultValue: 5,
              admin: {
                description: 'Time between automatic slide transitions.',
              },
            },
          ],
        },
        {
          name: 'stats',
          type: 'array',
          label: 'Statistics',
          minRows: 3,
          maxRows: 3,
          admin: {
            condition: (data, siblingData) => siblingData?.layoutType === 'text-slider',
          },
          fields: [
            {
              name: 'number',
              type: 'number',
              required: true,
            },
            {
              name: 'label',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'primaryButton',
          type: 'group',
          admin: {
            condition: (data, siblingData) => siblingData?.layoutType === 'text-slider',
          },
          fields: [
            { name: 'text', type: 'text', required: true },
            { name: 'link', type: 'text', required: true },
          ],
        },
        {
          name: 'secondaryButton',
          type: 'group',
          admin: {
            condition: (data, siblingData) => siblingData?.layoutType === 'text-slider',
          },
          fields: [
            { name: 'text', type: 'text', required: true },
            { name: 'link', type: 'text', required: true },
          ],
        },
        {
          name: 'features',
          type: 'array',
          label: 'Hero Features',
          minRows: 3,
          maxRows: 3,
          admin: {
            condition: (data, siblingData) => siblingData?.layoutType === 'text-slider',
          },
          fields: [
            {
              name: 'icon',
              type: 'select',
              required: true,
              options: [
                { label: 'Shield Check', value: 'bi-shield-check' },
                { label: 'Clock', value: 'bi-clock' },
                { label: 'People', value: 'bi-people' },
                { label: 'Award', value: 'bi-award' },
                { label: 'Book', value: 'bi-book' },
                { label: 'Star', value: 'bi-star' },
              ],
            },
            {
              name: 'text',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'floatingCards',
          type: 'array',
          label: 'Floating Course Cards',
          minRows: 0,
          maxRows: 3,
          admin: {
            condition: (data, siblingData) => siblingData?.layoutType === 'text-slider',
          },
          fields: [
            {
              name: 'icon',
              type: 'select',
              required: false,
              options: [
                { label: 'Code Slash', value: 'bi-code-slash' },
                { label: 'Palette', value: 'bi-palette' },
                { label: 'Graph Up', value: 'bi-graph-up' },
                { label: 'Laptop', value: 'bi-laptop' },
                { label: 'Camera', value: 'bi-camera' },
                { label: 'Briefcase', value: 'bi-briefcase' },
              ],
            },
            {
              name: 'title',
              type: 'text',
              required: false,
            },
            {
              name: 'students',
              type: 'text',
              required: false,
            },
          ],
        },
        
        // SINGLE IMAGE LAYOUT FIELDS
        {
          name: 'singleImage',
          type: 'group',
          label: 'Single Image Configuration',
          admin: {
            condition: (data, siblingData) => siblingData?.layoutType === 'single-image',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'alt',
              type: 'text',
              label: 'Alt Text',
              required: true,
            },
            {
              name: 'caption',
              type: 'text',
              admin: {
                description: 'Optional caption overlay',
              },
            },
          ],
        },
        
        // FULL-WIDTH SLIDER LAYOUT FIELDS
        {
          name: 'fullWidthSlider',
          type: 'group',
          label: 'Full-Width Slider Configuration',
          admin: {
            condition: (data, siblingData) => siblingData?.layoutType === 'slider-fullwidth',
          },
          fields: [
            {
              name: 'height',
              type: 'select',
              label: 'Slider Height',
              defaultValue: '70vh',
              options: [
                { label: 'Compact (50vh)', value: '50vh' },
                { label: 'Medium (60vh)', value: '60vh' },
                { label: 'Standard (70vh)', value: '70vh' },
                { label: 'Large (80vh)', value: '80vh' },
                { label: 'Extra Large (85vh)', value: '85vh' },
                { label: 'Very Large (90vh)', value: '90vh' },
                { label: 'Full Screen (100vh)', value: '100vh' },
              ],
              admin: {
                description: 'Height of the slider section',
              },
            },
            {
              name: 'interval',
              type: 'number',
              label: 'Slide Interval (seconds)',
              defaultValue: 5,
              admin: {
                description: 'Time between automatic slide transitions',
              },
            },
            {
              name: 'showIndicators',
              type: 'checkbox',
              label: 'Show Dots (Indicators)',
              defaultValue: true,
            },
            {
              name: 'showArrows',
              type: 'checkbox',
              label: 'Show Left/Right Arrows',
              defaultValue: true,
            },
            {
              name: 'pauseOnHover',
              type: 'checkbox',
              label: 'Pause on Hover',
              defaultValue: true,
            },
            {
              name: 'slides',
              type: 'array',
              label: 'Slider Items',
              minRows: 1,
              fields: [
                {
                  name: 'mediaType',
                  type: 'select',
                  required: true,
                  options: [
                    { label: '� Text Content', value: 'text' },
                    { label: '📷 Image Media', value: 'image' },
                    { label: '🎬 Video Media', value: 'video' },
                    { label: '🎵 Audio Media', value: 'audio' },
                    { label: '📄 Document Media', value: 'document' },
                    { label: '✨ Animation Media', value: 'animation' },
                    { label: '🎮 3D & Immersive', value: '3d' },
                    { label: '📺 YouTube/Vimeo', value: 'embed' },
                    { label: '📊 Data Visualization', value: 'data' },
                  ],
                },
                
                // TEXT CONTENT
                {
                  name: 'textContent',
                  type: 'group',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'text',
                  },
                  fields: [
                    { name: 'title', type: 'text' },
                    { name: 'description', type: 'textarea' },
                  ],
                },
                
                // IMAGE MEDIA
                {
                  name: 'imageFile',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'image',
                  },
                },
                {
                  name: 'imageAlt',
                  type: 'text',
                  label: 'Image Alt Text',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'image',
                  },
                },
                
                // VIDEO MEDIA
                {
                  name: 'videoFile',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'video',
                  },
                },
                {
                  name: 'videoPoster',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Video Poster Image',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'video',
                  },
                },
                {
                  name: 'videoAutoplay',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Autoplay Video',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'video',
                  },
                },
                {
                  name: 'videoControls',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Show Video Controls',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'video',
                  },
                },
                
                // AUDIO MEDIA
                {
                  name: 'audioFile',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'audio',
                  },
                },
                {
                  name: 'audioAutoplay',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'audio',
                  },
                },
                
                // DOCUMENT MEDIA
                {
                  name: 'documentFile',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'document',
                  },
                },
                {
                  name: 'documentDisplayMode',
                  type: 'select',
                  options: [
                    { label: 'Download Button', value: 'download' },
                    { label: 'Embedded Viewer', value: 'embed' },
                  ],
                  defaultValue: 'download',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'document',
                  },
                },
                
                // ANIMATION MEDIA
                {
                  name: 'animationFile',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Lottie JSON or GIF',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'animation',
                  },
                },
                {
                  name: 'animationLoop',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'animation',
                  },
                },
                
                // 3D MEDIA
                {
                  name: 'model3DFile',
                  type: 'upload',
                  relationTo: 'media',
                  label: '3D Model (GLB/GLTF)',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === '3d',
                  },
                },
                {
                  name: 'model3DAutoRotate',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === '3d',
                  },
                },
                
                // EMBED MEDIA (YouTube/Vimeo)
                {
                  name: 'embedType',
                  type: 'select',
                  options: [
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Vimeo', value: 'vimeo' },
                    { label: 'Custom iFrame', value: 'iframe' },
                  ],
                  defaultValue: 'youtube',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'embed',
                  },
                },
                {
                  name: 'embedUrl',
                  type: 'text',
                  label: 'Video URL or Embed Code',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'embed',
                    description: 'YouTube, Vimeo URL, or iFrame embed code',
                  },
                },
                {
                  name: 'embedAutoplay',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'embed',
                  },
                },
                
                // DATA VISUALIZATION
                {
                  name: 'dataEmbedUrl',
                  type: 'text',
                  label: 'Dashboard/Chart Embed URL',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'data',
                  },
                },
                {
                  name: 'dataHeight',
                  type: 'number',
                  defaultValue: 400,
                  label: 'Embed Height (px)',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'data',
                  },
                },
                // Maps fields
                {
                  name: 'mapProvider',
                  type: 'select',
                  options: [
                    { label: 'Google Maps', value: 'google' },
                    { label: 'Mapbox', value: 'mapbox' },
                    { label: 'OpenStreetMap', value: 'osm' },
                  ],
                  defaultValue: 'google',
                  label: 'Map Provider',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'maps',
                  },
                },
                {
                  name: 'mapEmbedUrl',
                  type: 'text',
                  label: 'Map Embed URL',
                  required: true,
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'maps',
                    description: 'For best results, use Google Maps Embed URL (Share → Embed a map → Copy the iframe src URL). Sharing URLs (maps.app.goo.gl) will be auto-converted.',
                  },
                },
                {
                  name: 'mapHeight',
                  type: 'number',
                  defaultValue: 450,
                  label: 'Map Height (px)',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'maps',
                  },
                },
                {
                  name: 'mapInteractive',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Enable Interactive Controls',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaType === 'maps',
                  },
                },
                
                // GENERAL FIELDS
                {
                  name: 'alt',
                  type: 'text',
                  label: 'Alt Text / Description',
                },
              ],
            },
          ],
        },
        
        // TWO MEDIA FILES LAYOUT
        {
          name: 'twoMedia',
          type: 'group',
          label: 'Two Media Files Configuration',
          admin: {
            condition: (data, siblingData) => siblingData?.layoutType === 'two-media',
          },
          fields: [
            {
              name: 'media1',
              type: 'group',
              label: 'Media 1',
              fields: [
                {
                  name: 'mediaCategory',
                  type: 'select',
                  required: true,
                  label: 'Media Type',
                  options: [
                    { label: '📝 Text Content', value: 'text' },
                    { label: '📷 Image Media', value: 'image' },
                    { label: '🎬 Video Media', value: 'video' },
                    { label: '🎵 Audio Media', value: 'audio' },
                    { label: '📄 Document Media', value: 'document' },
                    { label: '✨ Animation Media', value: 'animation' },
                    { label: '🎮 3D & Immersive', value: '3d' },
                    { label: '📺 YouTube/Vimeo', value: 'embed' },
                    { label: '📊 Data Visualization', value: 'data' },
                    { label: '🗺️ Maps & Location', value: 'maps' },
                  ],
                },
                {
                  name: 'width',
                  type: 'select',
                  required: true,
                  defaultValue: '50',
                  options: [
                    { label: '30%', value: '30' },
                    { label: '40%', value: '40' },
                    { label: '50%', value: '50' },
                    { label: '60%', value: '60' },
                    { label: '70%', value: '70' },
                  ],
                },
                // Text content fields
                {
                  name: 'textTitle',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'text',
                  },
                },
                {
                  name: 'textDescription',
                  type: 'textarea',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'text',
                  },
                },
                // Image fields
                {
                  name: 'imageFile',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'image',
                  },
                },
                // Video fields
                {
                  name: 'videoFile',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'video',
                  },
                },
                {
                  name: 'videoPoster',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'video',
                  },
                },
                // Audio fields
                {
                  name: 'audioFile',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'audio',
                  },
                },
                // Document fields
                {
                  name: 'documentFile',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'document',
                  },
                },
                {
                  name: 'documentDisplayMode',
                  type: 'select',
                  options: [
                    { label: 'Download Button', value: 'download' },
                    { label: 'Embedded Viewer', value: 'embed' },
                  ],
                  defaultValue: 'download',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'document',
                  },
                },
                // Animation fields
                {
                  name: 'animationFile',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'animation',
                  },
                },
                // 3D fields
                {
                  name: 'model3D',
                  type: 'upload',
                  relationTo: 'media',
                  label: '3D Model File (GLB/GLTF)',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === '3d',
                  },
                },
                // Embed fields (YouTube/Vimeo)
                {
                  name: 'embedType',
                  type: 'select',
                  options: [
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Vimeo', value: 'vimeo' },
                    { label: 'Custom iFrame', value: 'iframe' },
                  ],
                  defaultValue: 'youtube',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'embed',
                  },
                },
                {
                  name: 'embedUrl',
                  type: 'text',
                  label: 'Video URL',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'embed',
                  },
                },
                // Data visualization fields
                {
                  name: 'dataEmbedUrl',
                  type: 'text',
                  label: 'Dashboard URL',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'data',
                  },
                },
                {
                  name: 'dataHeight',
                  type: 'number',
                  defaultValue: 400,
                  label: 'Height (px)',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'data',
                  },
                },
                // Maps fields
                {
                  name: 'mapProvider',
                  type: 'select',
                  options: [
                    { label: 'Google Maps', value: 'google' },
                    { label: 'Mapbox', value: 'mapbox' },
                    { label: 'OpenStreetMap', value: 'osm' },
                  ],
                  defaultValue: 'google',
                  label: 'Map Provider',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'maps',
                  },
                },
                {
                  name: 'mapEmbedUrl',
                  type: 'text',
                  label: 'Map Embed URL',
                  required: true,
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'maps',
                  },
                },
                {
                  name: 'mapHeight',
                  type: 'number',
                  defaultValue: 450,
                  label: 'Map Height (px)',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'maps',
                  },
                },
                {
                  name: 'mapInteractive',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Enable Interactive Controls',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'maps',
                  },
                },
              ],
            },
            {
              name: 'media2',
              type: 'group',
              label: 'Media 2',
              fields: [
                {
                  name: 'mediaCategory',
                  type: 'select',
                  required: true,
                  label: 'Media Type',
                  options: [
                    { label: '📝 Text Content', value: 'text' },
                    { label: '📷 Image Media', value: 'image' },
                    { label: '🎬 Video Media', value: 'video' },
                    { label: '🎵 Audio Media', value: 'audio' },
                    { label: '📄 Document Media', value: 'document' },
                    { label: '✨ Animation Media', value: 'animation' },
                    { label: '🎮 3D & Immersive', value: '3d' },
                    { label: '📺 YouTube/Vimeo', value: 'embed' },
                    { label: '📊 Data Visualization', value: 'data' },
                    { label: '🗺️ Maps & Location', value: 'maps' },
                  ],
                },
                {
                  name: 'width',
                  type: 'select',
                  required: true,
                  defaultValue: '50',
                  options: [
                    { label: '30%', value: '30' },
                    { label: '40%', value: '40' },
                    { label: '50%', value: '50' },
                    { label: '60%', value: '60' },
                    { label: '70%', value: '70' },
                  ],
                },
                {
                  name: 'textTitle',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'text',
                  },
                },
                {
                  name: 'textDescription',
                  type: 'textarea',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'text',
                  },
                },
                {
                  name: 'imageFile',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'image',
                  },
                },
                {
                  name: 'videoFile',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'video',
                  },
                },
                {
                  name: 'videoPoster',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'video',
                  },
                },
                {
                  name: 'audioFile',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'audio',
                  },
                },
                {
                  name: 'documentFile',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'document',
                  },
                },
                {
                  name: 'documentDisplayMode',
                  type: 'select',
                  options: [
                    { label: 'Download Button', value: 'download' },
                    { label: 'Embedded Viewer', value: 'embed' },
                  ],
                  defaultValue: 'download',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'document',
                  },
                },
                {
                  name: 'animationFile',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'animation',
                  },
                },
                {
                  name: 'model3D',
                  type: 'upload',
                  relationTo: 'media',
                  label: '3D Model File (GLB/GLTF)',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === '3d',
                  },
                },
                {
                  name: 'embedType',
                  type: 'select',
                  options: [
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Vimeo', value: 'vimeo' },
                    { label: 'Custom iFrame', value: 'iframe' },
                  ],
                  defaultValue: 'youtube',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'embed',
                  },
                },
                {
                  name: 'embedUrl',
                  type: 'text',
                  label: 'Video URL',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'embed',
                  },
                },
                {
                  name: 'dataEmbedUrl',
                  type: 'text',
                  label: 'Dashboard URL',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'data',
                  },
                },
                {
                  name: 'dataHeight',
                  type: 'number',
                  defaultValue: 400,
                  label: 'Height (px)',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'data',
                  },
                },
                // Maps fields
                {
                  name: 'mapProvider',
                  type: 'select',
                  options: [
                    { label: 'Google Maps', value: 'google' },
                    { label: 'Mapbox', value: 'mapbox' },
                    { label: 'OpenStreetMap', value: 'osm' },
                  ],
                  defaultValue: 'google',
                  label: 'Map Provider',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'maps',
                  },
                },
                {
                  name: 'mapEmbedUrl',
                  type: 'text',
                  label: 'Map Embed URL',
                  required: true,
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'maps',
                  },
                },
                {
                  name: 'mapHeight',
                  type: 'number',
                  defaultValue: 450,
                  label: 'Map Height (px)',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'maps',
                  },
                },
                {
                  name: 'mapInteractive',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Enable Interactive Controls',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'maps',
                  },
                },
              ],
            },
          ],
        },
        
        // MULTI-MEDIA LAYOUT (3-4 items)
        {
          name: 'multiMedia',
          type: 'group',
          label: 'Multi-Media Configuration',
          admin: {
            condition: (data, siblingData) => siblingData?.layoutType === 'multi-media',
          },
          fields: [
            {
              name: 'items',
              type: 'array',
              label: 'Media Items',
              minRows: 3,
              maxRows: 4,
              admin: {
                description: 'Add 3 to 4 media items with custom widths',
              },
              fields: [
                {
                  name: 'mediaCategory',
                  type: 'select',
                  required: true,
                  label: 'Media Type',
                  options: [
                    { label: '📝 Text Content', value: 'text' },
                    { label: '📷 Image Media', value: 'image' },
                    { label: '🎬 Video Media', value: 'video' },
                    { label: '🎵 Audio Media', value: 'audio' },
                    { label: '📄 Document Media', value: 'document' },
                    { label: '✨ Animation Media', value: 'animation' },
                    { label: '🎮 3D & Immersive', value: '3d' },
                    { label: '📺 YouTube/Vimeo', value: 'embed' },
                    { label: '📊 Data Visualization', value: 'data' },
                    { label: '🗺️ Maps & Location', value: 'maps' },
                  ],
                },
                {
                  name: 'width',
                  type: 'select',
                  required: true,
                  defaultValue: '33',
                  options: [
                    { label: '20%', value: '20' },
                    { label: '25%', value: '25' },
                    { label: '30%', value: '30' },
                    { label: '33%', value: '33' },
                    { label: '40%', value: '40' },
                    { label: '50%', value: '50' },
                  ],
                  admin: {
                    description: 'Percentage width (ensure total adds to ~100%)',
                  },
                },
                
                // TEXT CONTENT
                {
                  name: 'textContent',
                  type: 'group',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'text',
                  },
                  fields: [
                    { name: 'title', type: 'text' },
                    { name: 'description', type: 'textarea' },
                    {
                      name: 'buttons',
                      type: 'array',
                      maxRows: 2,
                      fields: [
                        { name: 'text', type: 'text' },
                        { name: 'link', type: 'text' },
                      ],
                    },
                  ],
                },
                
                // IMAGE MEDIA
                {
                  name: 'imageMedia',
                  type: 'group',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'image',
                  },
                  fields: [
                    {
                      name: 'format',
                      type: 'select',
                      options: [
                        { label: 'Auto-detect', value: 'auto' },
                        { label: 'JPEG/JPG', value: 'jpeg' },
                        { label: 'PNG', value: 'png' },
                        { label: 'GIF', value: 'gif' },
                        { label: 'SVG', value: 'svg' },
                        { label: 'WebP', value: 'webp' },
                        { label: 'AVIF', value: 'avif' },
                      ],
                      defaultValue: 'auto',
                    },
                    {
                      name: 'file',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                    { name: 'alt', type: 'text', required: true },
                    { name: 'caption', type: 'text' },
                  ],
                },
                
                // VIDEO MEDIA
                {
                  name: 'videoMedia',
                  type: 'group',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'video',
                  },
                  fields: [
                    {
                      name: 'format',
                      type: 'select',
                      options: [
                        { label: 'MP4 (H.264)', value: 'mp4-h264' },
                        { label: 'MP4 (H.265)', value: 'mp4-h265' },
                        { label: 'WebM', value: 'webm' },
                        { label: 'OGV', value: 'ogv' },
                      ],
                      defaultValue: 'mp4-h264',
                    },
                    {
                      name: 'file',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                    {
                      name: 'poster',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Poster Image',
                    },
                    { name: 'autoplay', type: 'checkbox', defaultValue: false },
                    { name: 'controls', type: 'checkbox', defaultValue: true },
                    { name: 'loop', type: 'checkbox', defaultValue: false },
                    { name: 'muted', type: 'checkbox', defaultValue: false },
                  ],
                },
                
                // AUDIO MEDIA
                {
                  name: 'audioMedia',
                  type: 'group',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'audio',
                  },
                  fields: [
                    {
                      name: 'format',
                      type: 'select',
                      options: [
                        { label: 'MP3', value: 'mp3' },
                        { label: 'WAV', value: 'wav' },
                        { label: 'OGG', value: 'ogg' },
                        { label: 'AAC/M4A', value: 'aac' },
                      ],
                      defaultValue: 'mp3',
                    },
                    {
                      name: 'file',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                    { name: 'controls', type: 'checkbox', defaultValue: true },
                    { name: 'autoplay', type: 'checkbox', defaultValue: false },
                  ],
                },
                
                // DOCUMENT MEDIA
                {
                  name: 'documentMedia',
                  type: 'group',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'document',
                  },
                  fields: [
                    {
                      name: 'format',
                      type: 'select',
                      options: [
                        { label: 'PDF', value: 'pdf' },
                        { label: 'DOC/DOCX', value: 'doc' },
                        { label: 'TXT', value: 'txt' },
                      ],
                      defaultValue: 'pdf',
                    },
                    {
                      name: 'file',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                    {
                      name: 'displayMode',
                      type: 'select',
                      options: [
                        { label: 'Download Button', value: 'download' },
                        { label: 'Embedded Viewer', value: 'embed' },
                      ],
                      defaultValue: 'download',
                    },
                    { name: 'buttonText', type: 'text', defaultValue: 'Download Document' },
                  ],
                },
                
                // ANIMATION MEDIA
                {
                  name: 'animationMedia',
                  type: 'group',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'animation',
                  },
                  fields: [
                    {
                      name: 'format',
                      type: 'select',
                      options: [
                        { label: 'Lottie JSON', value: 'lottie' },
                        { label: 'GIF', value: 'gif' },
                        { label: 'APNG', value: 'apng' },
                      ],
                      defaultValue: 'lottie',
                    },
                    {
                      name: 'file',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                    { name: 'autoplay', type: 'checkbox', defaultValue: true },
                    { name: 'loop', type: 'checkbox', defaultValue: true },
                  ],
                },
                
                // 3D MEDIA
                {
                  name: 'threeDMedia',
                  type: 'group',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === '3d',
                  },
                  fields: [
                    {
                      name: 'format',
                      type: 'select',
                      options: [
                        { label: 'GLB', value: 'glb' },
                        { label: 'GLTF', value: 'gltf' },
                        { label: 'OBJ', value: 'obj' },
                      ],
                      defaultValue: 'glb',
                    },
                    {
                      name: 'file',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                    { name: 'autoRotate', type: 'checkbox', defaultValue: true },
                    { name: 'enableZoom', type: 'checkbox', defaultValue: true },
                  ],
                },
                
                // EMBED MEDIA (YouTube/Vimeo)
                {
                  name: 'embedMedia',
                  type: 'group',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'embed',
                  },
                  fields: [
                    {
                      name: 'type',
                      type: 'select',
                      options: [
                        { label: 'YouTube', value: 'youtube' },
                        { label: 'Vimeo', value: 'vimeo' },
                        { label: 'Custom iFrame', value: 'iframe' },
                      ],
                      defaultValue: 'youtube',
                    },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Full URL or embed code',
                      },
                    },
                    { name: 'autoplay', type: 'checkbox', defaultValue: false },
                    { name: 'controls', type: 'checkbox', defaultValue: true },
                  ],
                },
                
                // DATA VISUALIZATION
                {
                  name: 'dataMedia',
                  type: 'group',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'data',
                  },
                  fields: [
                    {
                      name: 'type',
                      type: 'select',
                      options: [
                        { label: 'iFrame Embed', value: 'iframe' },
                        { label: 'JSON Data', value: 'json' },
                      ],
                      defaultValue: 'iframe',
                    },
                    { name: 'embedUrl', type: 'text' },
                    { name: 'height', type: 'number', defaultValue: 400 },
                  ],
                },
                
                // MAPS & LOCATION
                {
                  name: 'mapsMedia',
                  type: 'group',
                  admin: {
                    condition: (data, siblingData) => siblingData?.mediaCategory === 'maps',
                  },
                  fields: [
                    {
                      name: 'provider',
                      type: 'select',
                      options: [
                        { label: 'Google Maps', value: 'google' },
                        { label: 'Mapbox', value: 'mapbox' },
                        { label: 'OpenStreetMap', value: 'osm' },
                      ],
                      defaultValue: 'google',
                    },
                    { 
                      name: 'embedUrl', 
                      type: 'text', 
                      required: true,
                      label: 'Map Embed URL',
                    },
                    { 
                      name: 'height', 
                      type: 'number', 
                      defaultValue: 450,
                      label: 'Height (px)',
                    },
                    { 
                      name: 'interactive', 
                      type: 'checkbox', 
                      defaultValue: true,
                      label: 'Enable Interactive Controls',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // OUR STORY SECTION
    {
      name: 'ourStory',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'our-story',
      },
      fields: [
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'content-left',
          options: [
            { label: 'Content Left + Media Right', value: 'content-left' },
            { label: 'Media Left + Content Right', value: 'image-left' },
          ],
          admin: {
            description: 'Select layout for About Us section on homepage',
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          admin: {
            description: 'e.g., "Our Story"',
          },
        },
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'e.g., "Educating Minds, Inspiring Hearts"',
          },
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'formattedDescription',
          type: 'richText',
          admin: {
            description: 'Optional formatted content shown after description',
          },
        },
        {
          name: 'timelinePoints',
          type: 'array',
          label: 'Milestones',
          maxRows: 3,
          admin: {
            description: 'Add up to 3 milestones (not years)',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              admin: {
                description: 'Milestone title (e.g., "Expert Instructors", "Quality Education")',
              },
            },
            {
              name: 'description',
              type: 'textarea',
            },
          ],
        },
        {
          name: 'buttonText',
          type: 'text',
          defaultValue: 'Learn More About Us',
          admin: {
            description: 'Button text (replaces 4th timeline point)',
          },
        },
        {
          name: 'buttonLink',
          type: 'text',
          defaultValue: '/about',
          admin: {
            description: 'Button link (e.g., /about)',
          },
        },
        {
          name: 'mediaType',
          type: 'select',
          defaultValue: 'image',
          options: [
            { label: 'Text Content', value: 'text' },
            { label: 'Image Media', value: 'image' },
            { label: 'Video Media', value: 'video' },
            { label: 'Audio Media', value: 'audio' },
            { label: 'Document Media', value: 'document' },
            { label: 'Animation Media', value: 'animation' },
            { label: '3D & Immersive', value: '3d' },
            { label: 'YouTube/Vimeo', value: 'embed' },
            { label: 'Data Visualization', value: 'data' },
          ],
          admin: {
            description: 'Choose media type for About Us media panel',
          },
        },
        {
          name: 'textContent',
          type: 'group',
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'text',
          },
          fields: [
            { name: 'title', type: 'text' },
            { name: 'description', type: 'textarea' },
          ],
        },
        {
          name: 'imageFile',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'image',
            description: 'Main About Us image',
          },
        },
        {
          name: 'imageAlt',
          type: 'text',
          label: 'Image Alt Text',
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'image',
          },
        },
        {
          name: 'videoFile',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'video',
          },
        },
        {
          name: 'videoPoster',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'video',
          },
        },
        {
          name: 'videoAutoplay',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'video',
          },
        },
        {
          name: 'videoControls',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'video',
          },
        },
        {
          name: 'audioFile',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'audio',
          },
        },
        {
          name: 'audioAutoplay',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'audio',
          },
        },
        {
          name: 'documentFile',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'document',
          },
        },
        {
          name: 'documentDisplayMode',
          type: 'select',
          options: [
            { label: 'Download Button', value: 'download' },
            { label: 'Embedded Viewer', value: 'embed' },
          ],
          defaultValue: 'download',
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'document',
          },
        },
        {
          name: 'animationFile',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'animation',
          },
        },
        {
          name: 'model3DFile',
          type: 'upload',
          relationTo: 'media',
          label: '3D Model (GLB/GLTF)',
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === '3d',
          },
        },
        {
          name: 'embedType',
          type: 'select',
          options: [
            { label: 'YouTube', value: 'youtube' },
            { label: 'Vimeo', value: 'vimeo' },
            { label: 'Custom iFrame', value: 'iframe' },
          ],
          defaultValue: 'youtube',
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'embed',
          },
        },
        {
          name: 'embedUrl',
          type: 'text',
          label: 'Video URL or Embed Code',
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'embed',
          },
        },
        {
          name: 'embedAutoplay',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'embed',
          },
        },
        {
          name: 'dataEmbedUrl',
          type: 'text',
          label: 'Dashboard/Chart Embed URL',
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'data',
          },
        },
        {
          name: 'dataHeight',
          type: 'number',
          defaultValue: 400,
          label: 'Embed Height (px)',
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'data',
          },
        },
        {
          name: 'campusImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'image' || !siblingData?.mediaType,
            description: 'Main campus/building image (legacy fallback)',
          },
        },
        {
          name: 'missionVisionCards',
          type: 'array',
          label: 'Mission & Vision Cards',
          maxRows: 2,
          admin: {
            description: 'Add up to 2 cards for Mission & Vision',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              admin: {
                description: 'e.g., "Our Mission", "Our Vision"',
              },
            },
            {
              name: 'description',
              type: 'textarea',
            },
          ],
        },
        {
          name: 'coreValues',
          type: 'array',
          label: 'Core Values',
          maxRows: 4,
          admin: {
            description: 'Add up to 4 core values',
          },
          fields: [
            {
              name: 'icon',
              type: 'select',
              options: [
                { label: 'Book (Academic Excellence)', value: 'bi-book' },
                { label: 'People (Community)', value: 'bi-people' },
                { label: 'Lightbulb (Innovation)', value: 'bi-lightbulb' },
                { label: 'Globe (Global Perspective)', value: 'bi-globe' },
                { label: 'Award', value: 'bi-award' },
                { label: 'Heart', value: 'bi-heart' },
                { label: 'Star', value: 'bi-star' },
                { label: 'Shield', value: 'bi-shield' },
              ],
            },
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'description',
              type: 'textarea',
            },
          ],
        },
      ],
    },

    // FEATURED COURSES SECTION
    {
      name: 'featuredCourses',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'featured-courses',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'courses',
          type: 'array',
          label: 'Course Items',
          minRows: 0,
          maxRows: 6,
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
            {
              name: 'badge',
              type: 'select',
              options: [
                { label: 'Featured', value: 'featured' },
                { label: 'New', value: 'new' },
                { label: 'Certificate', value: 'certificate' },
                { label: 'Popular', value: 'popular' },
              ],
            },
            {
              name: 'price',
              type: 'text',
              required: false,
            },
            {
              name: 'level',
              type: 'select',
              required: false,
              options: [
                { label: 'Beginner', value: 'Beginner' },
                { label: 'Intermediate', value: 'Intermediate' },
                { label: 'Advanced', value: 'Advanced' },
              ],
            },
            {
              name: 'duration',
              type: 'text',
              required: false,
            },
            {
              name: 'title',
              type: 'text',
              required: false,
            },
            {
              name: 'description',
              type: 'textarea',
              required: false,
            },
            {
              name: 'instructorAvatar',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
            {
              name: 'instructorName',
              type: 'text',
              required: false,
            },
            {
              name: 'instructorSpecialty',
              type: 'text',
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
              name: 'studentCount',
              type: 'number',
              required: false,
            },
            {
              name: 'buttonText',
              type: 'text',
              required: false,
              admin: {
                description: 'Button text (e.g., "Enroll Now", "Learn More")',
              },
            },
            {
              name: 'buttonLink',
              type: 'text',
              required: false,
              admin: {
                description: 'Button link (e.g., "/enroll", "/course-details")',
              },
            },
          ],
        },
        {
          name: 'viewAllButton',
          type: 'group',
          fields: [
            { name: 'text', type: 'text', defaultValue: 'View All Courses' },
            { name: 'link', type: 'text', defaultValue: '/courses' },
          ],
        },
      ],
    },

    // COURSE CATEGORIES SECTION
    {
      name: 'courseCategories',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'course-categories',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'categories',
          type: 'array',
          label: 'Category Items',
          fields: [
            {
              name: 'icon',
              type: 'select',
              required: true,
              options: [
                { label: 'Laptop (Computer Science)', value: 'bi-laptop' },
                { label: 'Briefcase (Business)', value: 'bi-briefcase' },
                { label: 'Palette (Design)', value: 'bi-palette' },
                { label: 'Heart Pulse (Health)', value: 'bi-heart-pulse' },
                { label: 'Globe (Languages)', value: 'bi-globe' },
                { label: 'Diagram 3 (Science)', value: 'bi-diagram-3' },
                { label: 'Megaphone (Marketing)', value: 'bi-megaphone' },
                { label: 'Graph Up Arrow (Finance)', value: 'bi-graph-up-arrow' },
                { label: 'Camera (Photography)', value: 'bi-camera' },
                { label: 'Music Note (Music)', value: 'bi-music-note-beamed' },
                { label: 'Gear (Engineering)', value: 'bi-gear' },
                { label: 'Journal Text (Law)', value: 'bi-journal-text' },
                { label: 'Cup Hot (Culinary)', value: 'bi-cup-hot' },
                { label: 'Trophy (Sports)', value: 'bi-trophy' },
                { label: 'Pen (Writing)', value: 'bi-pen' },
                { label: 'Body Text (Psychology)', value: 'bi-body-text' },
                { label: 'Tree (Environment)', value: 'bi-tree' },
                { label: 'Chat Dots (Communication)', value: 'bi-chat-dots' },
              ],
            },
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'courseCount',
              type: 'number',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              defaultValue: '/courses',
            },
          ],
        },
      ],
    },

    // FEATURED INSTRUCTORS SECTION
    {
      name: 'featuredInstructors',
      type: 'group',
      label: 'Facilities',
      admin: {
        condition: (data) => data.sectionType === 'featured-instructors',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'showButton',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show one CTA button below all facility cards',
          },
        },
        {
          name: 'buttonText',
          type: 'text',
          defaultValue: 'View All Facilities',
          admin: {
            condition: (_data, siblingData) => siblingData?.showButton !== false,
          },
        },
        {
          name: 'buttonLink',
          type: 'text',
          defaultValue: '/facilities',
          admin: {
            condition: (_data, siblingData) => siblingData?.showButton !== false,
            description: 'Redirect URL for the section button',
          },
        },
        {
          name: 'buttonNewTab',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            condition: (_data, siblingData) => siblingData?.showButton !== false,
            description: 'Open the section button link in a new tab',
          },
        },
        {
          name: 'instructors',
          type: 'array',
          label: 'Facility Items',
          labels: {
            singular: 'Facility',
            plural: 'Facilities',
          },
          minRows: 0,
          maxRows: 6,
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
            {
              name: 'icon',
              type: 'select',
              label: 'Facility Icon',
              defaultValue: 'monitor',
              options: [
                { label: 'Monitor', value: 'monitor' },
                { label: 'Book', value: 'book' },
                { label: 'Computer', value: 'cpu' },
                { label: 'Sports', value: 'sports' },
                { label: 'Palette', value: 'palette' },
                { label: 'Bus', value: 'bus' },
              ],
              admin: {
                description: 'Select icon shown on the facility card',
              },
            },
            {
              name: 'name',
              type: 'text',
              label: 'Facility Name',
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
              type: 'number',
              required: false,
            },
            {
              name: 'profileLink',
              type: 'text',
              required: false,
              admin: {
                description: 'Link to facility details page',
              },
            },
            {
              name: 'profileButtonText',
              type: 'text',
              required: false,
              admin: {
                description: 'Custom text for profile button (e.g., "View Profile", "Learn More")',
              },
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

    // TESTIMONIALS SECTION
    {
      name: 'testimonials',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'testimonials',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: false,
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
        },
        {
          name: 'criticReviews',
          type: 'array',
          label: 'Critic Reviews',
          required: false,
          fields: [
            {
              name: 'source',
              type: 'text',
              required: false,
              admin: {
                placeholder: 'e.g., The New York Times',
              },
            },
            {
              name: 'rating',
              type: 'number',
              required: false,
              min: 0,
              max: 5,
              admin: {
                step: 0.5,
              },
            },
            {
              name: 'quote',
              type: 'textarea',
              required: false,
            },
          ],
        },
        {
          name: 'studentReviews',
          type: 'array',
          label: 'Student Reviews',
          required: false,
          fields: [
            {
              name: 'avatar',
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
              name: 'role',
              type: 'text',
              required: false,
            },
            {
              name: 'rating',
              type: 'number',
              required: false,
              min: 0,
              max: 5,
              admin: {
                step: 0.5,
              },
            },
            {
              name: 'review',
              type: 'textarea',
              required: false,
            },
          ],
        },
        {
          name: 'overallRating',
          type: 'group',
          fields: [
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
              name: 'reviewCount',
              type: 'text',
              required: false,
              defaultValue: '230+',
            },
            {
              name: 'platforms',
              type: 'array',
              required: false,
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    },

    // BLOG POSTS SECTION
    {
      name: 'blogPosts',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'blog-posts',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'posts',
          type: 'array',
          label: 'Blog Post Items',
          minRows: 1,
          maxRows: 3,
          fields: [
            {
              name: 'authorAvatar',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'authorName',
              type: 'text',
              required: true,
            },
            {
              name: 'likes',
              type: 'number',
              required: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              required: true,
              defaultValue: '/blog-details',
            },
          ],
        },
      ],
    },

    // FEATURED NEWS SECTION
    {
      name: 'featuredNews',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'featured-news',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: false,
          defaultValue: 'Featured News',
          admin: {
            description: 'Section heading (default: "Featured News")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
          defaultValue: 'Stay updated with our latest news and announcements',
          admin: {
            description: 'Section description',
          },
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable/disable this section',
          },
        },
      ],
    },

    // CTA SECTION
    {
      name: 'cta',
      type: 'group',
      admin: {
        condition: (data) => data.sectionType === 'cta',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'features',
          type: 'array',
          label: 'Feature List',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'primaryButton',
          type: 'group',
          fields: [
            { name: 'text', type: 'text', required: true },
            { name: 'link', type: 'text', required: true },
          ],
        },
        {
          name: 'secondaryButton',
          type: 'group',
          fields: [
            { name: 'text', type: 'text', required: true },
            { name: 'link', type: 'text', required: true },
          ],
        },
        {
          name: 'stats',
          type: 'array',
          label: 'Statistics',
          minRows: 3,
          maxRows: 3,
          fields: [
            {
              name: 'number',
              type: 'text',
              required: true,
            },
            {
              name: 'label',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'floatingCards',
          type: 'array',
          label: 'Floating Info Cards',
          maxRows: 2,
          fields: [
            {
              name: 'icon',
              type: 'select',
              options: [
                { label: 'Person Check', value: 'bi-person-check-fill' },
                { label: 'Play Circle', value: 'bi-play-circle-fill' },
                { label: 'Award', value: 'bi-award-fill' },
                { label: 'Check Circle', value: 'bi-check-circle-fill' },
              ],
            },
            {
              name: 'number',
              type: 'text',
              required: true,
            },
            {
              name: 'label',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },

    // CUSTOM BLOCK SECTION - Insert any block type between sections
    {
      name: 'customBlock',
      type: 'blocks',
      label: 'Custom Block Content',
      blocks: [
        {
          slug: 'video',
          labels: { singular: 'Video Block', plural: 'Video Blocks' },
          fields: [
            {
              name: 'videoType',
              type: 'select',
              required: true,
              defaultValue: 'youtube',
              options: [
                { label: 'YouTube', value: 'youtube' },
                { label: 'Vimeo', value: 'vimeo' },
                { label: 'Self-hosted', value: 'selfHosted' },
                { label: 'External URL', value: 'external' },
              ],
            },
            {
              name: 'videoUrl',
              type: 'text',
              admin: {
                description: 'Full YouTube URL (e.g., https://www.youtube.com/watch?v=xxxxx) or Vimeo URL',
                condition: (data, siblingData) => siblingData?.videoType === 'youtube' || siblingData?.videoType === 'vimeo' || siblingData?.videoType === 'external',
              },
            },
            {
              name: 'videoFile',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data, siblingData) => siblingData?.videoType === 'selfHosted',
              },
            },
            {
              name: 'thumbnail',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'autoplay',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'loop',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'aspectRatio',
              type: 'select',
              defaultValue: '16:9',
              options: [
                { label: '16:9 (Widescreen)', value: '16:9' },
                { label: '4:3 (Standard)', value: '4:3' },
                { label: '1:1 (Square)', value: '1:1' },
                { label: '21:9 (Ultrawide)', value: '21:9' },
              ],
            },
            {
              name: 'width',
              type: 'select',
              defaultValue: 'contained',
              options: [
                { label: 'Full Width', value: 'full' },
                { label: 'Contained', value: 'contained' },
                { label: 'Wide', value: 'wide' },
              ],
            },
          ],
        },
        {
          slug: 'imageGallery',
          labels: { singular: 'Image Gallery', plural: 'Image Galleries' },
          fields: [
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'galleryType',
              type: 'select',
              required: true,
              defaultValue: 'grid',
              options: [
                { label: 'Grid', value: 'grid' },
                { label: 'Carousel/Slider', value: 'carousel' },
                { label: 'Masonry', value: 'masonry' },
                { label: 'Lightbox', value: 'lightbox' },
              ],
            },
            {
              name: 'images',
              type: 'array',
              required: true,
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                },
                {
                  name: 'alt',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'columns',
              type: 'select',
              defaultValue: '3',
              options: [
                { label: '2 Columns', value: '2' },
                { label: '3 Columns', value: '3' },
                { label: '4 Columns', value: '4' },
                { label: '5 Columns', value: '5' },
              ],
              admin: {
                condition: (data, siblingData) => siblingData?.galleryType === 'grid' || siblingData?.galleryType === 'masonry',
              },
            },
            {
              name: 'spacing',
              type: 'select',
              defaultValue: 'medium',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Small', value: 'small' },
                { label: 'Medium', value: 'medium' },
                { label: 'Large', value: 'large' },
              ],
            },
            {
              name: 'showViewMoreButton',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'When enabled, frontend shows only first 4 images with a View More button',
              },
            },
            {
              name: 'viewMoreButtonText',
              type: 'text',
              defaultValue: 'View More',
              admin: {
                condition: (data, siblingData) => !!siblingData?.showViewMoreButton,
                description: 'Button label shown on frontend',
              },
            },
            {
              name: 'viewMoreLink',
              type: 'text',
              defaultValue: '/gallery',
              admin: {
                condition: (data, siblingData) => !!siblingData?.showViewMoreButton,
                description: 'Destination URL for View More button',
              },
            },
          ],
        },
        {
          slug: 'richText',
          labels: { singular: 'Rich Text', plural: 'Rich Text Blocks' },
          fields: [
            {
              name: 'content',
              type: 'richText',
              required: true,
            },
            {
              name: 'width',
              type: 'select',
              defaultValue: 'contained',
              options: [
                { label: 'Narrow', value: 'narrow' },
                { label: 'Contained', value: 'contained' },
                { label: 'Full Width', value: 'full' },
              ],
            },
          ],
        },
        FlexibleRowBlock,
      ],
      admin: {
        condition: (data) => data?.sectionType === 'custom-block',
        description: 'Add any custom block (Video, Gallery, Rich Text, etc.) to insert between sections',
      },
    },
  ],
}
