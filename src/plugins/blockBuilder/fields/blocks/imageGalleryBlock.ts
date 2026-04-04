import type { Block } from 'payload'

export const imageGalleryBlock: Block = {
  slug: 'imageGallery',
  labels: {
    singular: 'Image Gallery',
    plural: 'Image Galleries',
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
      name: 'galleryType',
      type: 'select',
      required: true,
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Bento (Mixed Sizes)', value: 'bento' },
        { label: 'Carousel/Slider', value: 'carousel' },
        { label: 'Masonry', value: 'masonry' },
        { label: 'Lightbox Grid', value: 'lightbox' },
        { label: 'Animated Strip (Right to Left)', value: 'animatedStrip' },
      ],
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Media Item',
        plural: 'Media Items',
      },
      fields: [
        {
          name: 'mediaType',
          type: 'select',
          required: true,
          defaultValue: 'image',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType !== 'video',
          },
        },
        {
          name: 'videoSource',
          type: 'select',
          required: true,
          defaultValue: 'upload',
          options: [
            { label: 'Upload Video', value: 'upload' },
            { label: 'YouTube URL', value: 'youtube' },
          ],
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'video',
          },
        },
        {
          name: 'videoUpload',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'video' && siblingData?.videoSource !== 'youtube',
            description: 'Select a locally uploaded video from Media.',
          },
        },
        {
          name: 'youtubeUrl',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.mediaType === 'video' && siblingData?.videoSource === 'youtube',
            description: 'Paste full YouTube URL (watch or youtu.be).',
          },
        },
        {
          name: 'caption',
          type: 'text',
          required: false,
        },
        {
          name: 'alt',
          type: 'text',
          required: false,
          admin: {
            description: 'Alt text for accessibility',
          },
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
        condition: (data, siblingData) => siblingData.galleryType === 'grid' || siblingData.galleryType === 'lightbox',
      },
    },
    {
      name: 'spacing',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'small' },
        { label: 'Normal', value: 'normal' },
        { label: 'Large', value: 'large' },
      ],
    },
    {
      name: 'showViewMoreButton',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'When enabled, frontend shows only first 4 media items with a View More button',
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
}
