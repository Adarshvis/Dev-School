import type { Block } from 'payload'

export const countdownBlock: Block = {
  slug: 'countdown',
  labels: {
    singular: 'Countdown Timer',
    plural: 'Countdown Timers',
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
      name: 'targetDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Date and time to count down to',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endMessage',
      type: 'text',
      defaultValue: 'Event has started!',
      admin: {
        description: 'Message to show when countdown reaches zero',
      },
    },
    {
      name: 'showDays',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showHours',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showMinutes',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showSeconds',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'ctaButton',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: false,
        },
        {
          name: 'link',
          type: 'text',
          required: false,
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
          label: 'Open in New Tab',
        },
      ],
    },
  ],
}
