import type { Block } from 'payload'

export const dimensionStepsBlock: Block = {
  slug: 'dimensionSteps',
  labels: {
    singular: 'Dimension Steps',
    plural: 'Dimension Steps',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
      admin: {
        description: 'Section heading (e.g., "SIX DIMENSIONS THAT SHAPE OUR STUDENTS")',
      },
    },
    {
      name: 'sectionBgColor',
      type: 'text',
      defaultValue: '#f5f0e8',
      admin: {
        description: 'Section background color (hex)',
      },
    },
    {
      name: 'titleColor',
      type: 'text',
      defaultValue: '#1a472a',
      admin: {
        description: 'Title text color (hex)',
      },
    },
    {
      name: 'cubeSize',
      type: 'number',
      defaultValue: 80,
      min: 50,
      max: 140,
      admin: {
        description: 'Cube size in pixels (default: 80)',
        step: 10,
      },
    },
    {
      name: 'animationSpeed',
      type: 'number',
      defaultValue: 6,
      min: 2,
      max: 20,
      admin: {
        description: 'Cube rotation cycle in seconds (default: 6)',
        step: 1,
      },
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 12,
      labels: { singular: 'Step', plural: 'Steps' },
      admin: {
        description: 'Each step gets an animated 3D cube and a content card.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'number',
              type: 'text',
              defaultValue: '01',
              admin: {
                width: '20%',
                description: 'Displayed on cube face',
              },
            },
            {
              name: 'cubeColor',
              type: 'text',
              defaultValue: '#4CAF50',
              admin: {
                width: '20%',
                description: 'Cube color (hex)',
              },
            },
            {
              name: 'cardPosition',
              type: 'select',
              defaultValue: 'right',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ],
              admin: {
                width: '20%',
              },
            },
            {
              name: 'cardBgColor',
              type: 'text',
              defaultValue: '#ffffff',
              admin: {
                width: '20%',
                description: 'Card background (hex)',
              },
            },
            {
              name: 'cardTextColor',
              type: 'text',
              defaultValue: '#222222',
              admin: {
                width: '20%',
                description: 'Card text color (hex)',
              },
            },
          ],
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Optional icon displayed next to the title in the card',
          },
        },
        {
          name: 'titleRich',
          type: 'richText',
          label: 'Title (Rich Text)',
          required: false,
          admin: {
            description: 'Card title — supports bold, colors, etc.',
          },
        },
        {
          name: 'descriptionRich',
          type: 'richText',
          label: 'Description (Rich Text)',
          required: false,
          admin: {
            description: 'Card body text — supports formatting.',
          },
        },
      ],
    },
  ],
}
