import type { Block } from 'payload'

export const cardGridBlock: Block = {
  slug: 'cardGrid',
  labels: {
    singular: 'Card Grid',
    plural: 'Card Grids',
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
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'icon',
          type: 'select',
          defaultValue: '',
          options: [
            { label: 'None', value: '' },
            { label: 'Star', value: 'bi-star' },
            { label: 'Heart', value: 'bi-heart' },
            { label: 'Check', value: 'bi-check-circle' },
            { label: 'Award', value: 'bi-award' },
            { label: 'Lightning', value: 'bi-lightning' },
            { label: 'Gear', value: 'bi-gear' },
            { label: 'Globe', value: 'bi-globe' },
            { label: 'People', value: 'bi-people' },
          ],
        },
        {
          name: 'link',
          type: 'text',
          required: false,
        },
        {
          name: 'linkText',
          type: 'text',
          defaultValue: 'Learn More',
          required: false,
        },
      ],
    },
  ],
}
