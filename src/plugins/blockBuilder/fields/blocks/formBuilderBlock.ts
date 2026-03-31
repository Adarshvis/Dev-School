import type { Block } from 'payload'

export const formBuilderBlock: Block = {
  slug: 'formBuilder',
  labels: {
    singular: 'Form Builder',
    plural: 'Form Builder Blocks',
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
      name: 'form',
      type: 'relationship',
      relationTo: 'forms' as any,
      required: true,
      admin: {
        description: 'Select a form created from Payload Form Builder (forms collection).',
      },
    },
    {
      name: 'submitButtonText',
      type: 'text',
      required: false,
      admin: {
        description: 'Optional override for button text.',
      },
    },
  ],
}
