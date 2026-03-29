import type { Block } from 'payload'
import { cardGridBlock } from './cardGridBlock.ts'
import { videoBlock } from './videoBlock.ts'
import { imageGalleryBlock } from './imageGalleryBlock.ts'
import { testimonialsBlock } from './testimonialsBlock.ts'
import { ctaBlock } from './ctaBlock.ts'
import { richTextBlock } from './richTextBlock.ts'
import { statsBlock } from './statsBlock.ts'
import { faqBlock } from './faqBlock.ts'
import { formBlock } from './formBlock.ts'
import { countdownBlock } from './countdownBlock.ts'
import { socialFeedBlock } from './socialFeedBlock.ts'
import { customCodeBlock } from './customCodeBlock.ts'
import { mapBlock } from './mapBlock.ts'
import { peopleBlock } from './peopleBlock.ts'
import { FlexibleRowBlock } from '../../../../blocks/FlexibleRow.ts'

const tabInnerBlocks: Block[] = [
  richTextBlock,
  cardGridBlock,
  videoBlock,
  imageGalleryBlock,
  testimonialsBlock,
  ctaBlock,
  statsBlock,
  faqBlock,
  formBlock,
  countdownBlock,
  socialFeedBlock,
  customCodeBlock,
  mapBlock,
  peopleBlock,
  FlexibleRowBlock,
]

export const tabsBlock: Block = {
  slug: 'tabs',
  labels: {
    singular: 'Tabs',
    plural: 'Tabs',
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
      name: 'tabStyle',
      type: 'select',
      defaultValue: 'underline',
      options: [
        { label: 'Underline', value: 'underline' },
        { label: 'Pills', value: 'pills' },
        { label: 'Buttons', value: 'buttons' },
      ],
    },
    {
      name: 'tabs',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Tab',
        plural: 'Tabs',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          defaultValue: '',
          required: false,
          options: [
            { label: 'None', value: '' },
            { label: 'Grid', value: 'bi bi-grid-3x3-gap' },
            { label: 'Book', value: 'bi bi-book' },
            { label: 'Play Circle', value: 'bi bi-play-circle' },
            { label: 'Image', value: 'bi bi-image' },
            { label: 'Question Circle', value: 'bi bi-question-circle' },
            { label: 'Graph Up', value: 'bi bi-graph-up' },
            { label: 'People', value: 'bi bi-people' },
            { label: 'Chat Quote', value: 'bi bi-chat-quote' },
            { label: 'Envelope', value: 'bi bi-envelope' },
            { label: 'Geo Alt', value: 'bi bi-geo-alt' },
            { label: 'Clock', value: 'bi bi-clock' },
            { label: 'Award', value: 'bi bi-award' },
            { label: 'Custom Icon Class', value: 'custom' },
          ],
          admin: {
            description: 'Optional icon shown next to the tab label.',
          },
        },
        {
          name: 'customIcon',
          type: 'text',
          required: false,
          admin: {
            description: 'Custom icon class (e.g., bi bi-mortarboard or fa fa-star).',
            condition: (_data, siblingData) => siblingData?.icon === 'custom',
          },
        },
        {
          name: 'content',
          type: 'blocks',
          blocks: tabInnerBlocks,
          required: false,
          admin: {
            description: 'Add any content blocks inside this tab.',
            initCollapsed: true,
          },
        },
      ],
    },
  ],
}
