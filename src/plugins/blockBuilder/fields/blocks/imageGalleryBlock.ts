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
        { label: 'Carousel/Slider', value: 'carousel' },
        { label: 'Masonry', value: 'masonry' },
        { label: 'Lightbox Grid', value: 'lightbox' },
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
}
