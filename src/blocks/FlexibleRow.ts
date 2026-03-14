import type { Block } from 'payload'
import { colorPickerField } from '@innovixx/payload-color-picker-field'

const fontFamilyOptions = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Lato', value: 'Lato' },
  { label: 'Raleway', value: 'Raleway' },
]

const richTextColumnBlock: Block = {
  slug: 'frRichText',
  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text',
  },
  fields: [
    colorPickerField({
      name: 'backgroundColor',
      defaultValue: '#f8fafc',
    }),
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'fontFamily',
      type: 'select',
      defaultValue: 'Inter',
      options: fontFamilyOptions,
    },
    {
      name: 'fontSize',
      type: 'select',
      defaultValue: 'base',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Base', value: 'base' },
        { label: 'Large', value: 'lg' },
        { label: 'XL', value: 'xl' },
        { label: '2XL', value: '2xl' },
      ],
    },
    colorPickerField({
      name: 'textColor',
      defaultValue: '#111827',
    }),
  ],
}

const imageColumnBlock: Block = {
  slug: 'frImage',
  labels: {
    singular: 'Image',
    plural: 'Images',
  },
  fields: [
    colorPickerField({
      name: 'backgroundColor',
      defaultValue: '#f8fafc',
    }),
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
    colorPickerField({
      name: 'captionColor',
      defaultValue: '#111827',
    }),
    {
      name: 'objectFit',
      type: 'select',
      defaultValue: 'cover',
      options: [
        { label: 'Cover', value: 'cover' },
        { label: 'Contain', value: 'contain' },
        { label: 'None', value: 'none' },
      ],
    },
    {
      name: 'borderRadius',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Full Circle', value: 'full-circle' },
      ],
    },
  ],
}

const videoColumnBlock: Block = {
  slug: 'frVideo',
  labels: {
    singular: 'Video',
    plural: 'Video',
  },
  fields: [
    colorPickerField({
      name: 'backgroundColor',
      defaultValue: '#f8fafc',
    }),
    {
      name: 'sourceType',
      type: 'select',
      required: true,
      defaultValue: 'youtube',
      options: [
        { label: 'Upload', value: 'upload' },
        { label: 'YouTube URL', value: 'youtube' },
        { label: 'Vimeo URL', value: 'vimeo' },
        { label: 'External URL', value: 'external' },
      ],
    },
    {
      name: 'videoFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.sourceType === 'upload',
      },
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.sourceType === 'youtube',
      },
    },
    {
      name: 'vimeoUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.sourceType === 'vimeo',
      },
    },
    {
      name: 'externalUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.sourceType === 'external',
      },
    },
    {
      name: 'posterImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Autoplay videos are muted by default',
      },
    },
    {
      name: 'loop',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'showControls',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

const carouselColumnBlock: Block = {
  slug: 'frCarousel',
  labels: {
    singular: 'Carousel',
    plural: 'Carousel',
  },
  fields: [
    colorPickerField({
      name: 'backgroundColor',
      defaultValue: '#f8fafc',
    }),
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'mediaType',
          type: 'select',
          required: true,
          defaultValue: 'image',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video Upload', value: 'video' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.mediaType === 'image',
          },
        },
        {
          name: 'videoFile',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.mediaType === 'video',
          },
        },
        {
          name: 'youtubeUrl',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.mediaType === 'youtube',
          },
        },
      ],
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'interval',
      type: 'number',
      defaultValue: 4000,
      min: 1000,
    },
    {
      name: 'showDots',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showArrows',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

const mapEmbedColumnBlock: Block = {
  slug: 'frMapEmbed',
  labels: {
    singular: 'Map / Embed',
    plural: 'Map / Embed',
  },
  fields: [
    colorPickerField({
      name: 'backgroundColor',
      defaultValue: '#f8fafc',
    }),
    {
      name: 'embedType',
      type: 'select',
      required: true,
      defaultValue: 'iframeUrl',
      options: [
        { label: 'iFrame URL', value: 'iframeUrl' },
        { label: 'Raw HTML Embed Code', value: 'html' },
      ],
    },
    {
      name: 'iframeUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.embedType === 'iframeUrl',
      },
    },
    {
      name: 'embedHtml',
      type: 'code',
      admin: {
        language: 'html',
        condition: (_, siblingData) => siblingData?.embedType === 'html',
      },
    },
    {
      name: 'height',
      type: 'number',
      defaultValue: 360,
      min: 120,
    },
  ],
}

const animationColumnBlock: Block = {
  slug: 'frAnimation',
  labels: {
    singular: 'Animation',
    plural: 'Animation',
  },
  fields: [
    colorPickerField({
      name: 'backgroundColor',
      defaultValue: '#f8fafc',
    }),
    {
      name: 'animationType',
      type: 'select',
      required: true,
      defaultValue: 'lottie',
      options: [
        { label: 'Lottie JSON URL', value: 'lottie' },
        { label: 'GIF Upload', value: 'gif' },
      ],
    },
    {
      name: 'lottieUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.animationType === 'lottie',
      },
    },
    {
      name: 'gif',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.animationType === 'gif',
      },
    },
    {
      name: 'loop',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

const peopleColumnBlock: Block = {
  slug: 'frPeople',
  labels: {
    singular: 'People',
    plural: 'People',
  },
  fields: [
    colorPickerField({
      name: 'backgroundColor',
      defaultValue: '#f8fafc',
    }),
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'people',
      type: 'relationship',
      relationTo: 'instructors' as any,
      hasMany: true,
      required: true,
    },
    {
      name: 'showStats',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showSocialLinks',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

export const FlexibleRowBlock: Block = {
  slug: 'flexibleRow',
  labels: {
    singular: 'Flexible Row',
    plural: 'Flexible Rows',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    colorPickerField({
      name: 'sectionBackgroundColor',
      defaultValue: '#ffffff',
    }),
    {
      name: 'columnGap',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'XL', value: 'xl' },
      ],
    },
    {
      name: 'verticalAlignment',
      type: 'select',
      defaultValue: 'stretch',
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Center', value: 'center' },
        { label: 'Bottom', value: 'bottom' },
        { label: 'Stretch', value: 'stretch' },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          name: 'width',
          type: 'select',
          defaultValue: 'auto',
          options: [
            { label: 'Auto (Equal)', value: 'auto' },
            { label: '25%', value: '25' },
            { label: '33%', value: '33' },
            { label: '50%', value: '50' },
            { label: '66%', value: '66' },
            { label: '75%', value: '75' },
            { label: '100%', value: '100' },
          ],
        },
        colorPickerField({
          name: 'backgroundColor',
          defaultValue: '#ffffff',
        }),
        {
          name: 'padding',
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
          name: 'items',
          type: 'blocks',
          blocks: [
            richTextColumnBlock,
            imageColumnBlock,
            videoColumnBlock,
            carouselColumnBlock,
            mapEmbedColumnBlock,
            animationColumnBlock,
            peopleColumnBlock,
          ],
        },
      ],
    },
  ],
}
