import type { Field } from 'payload'
import { cardGridBlock } from './blocks/cardGridBlock.ts'
import { videoBlock } from './blocks/videoBlock.ts'
import { imageGalleryBlock } from './blocks/imageGalleryBlock.ts'
import { testimonialsBlock } from './blocks/testimonialsBlock.ts'
import { ctaBlock } from './blocks/ctaBlock.ts'
import { richTextBlock } from './blocks/richTextBlock.ts'
import { statsBlock } from './blocks/statsBlock.ts'
import { faqBlock } from './blocks/faqBlock.ts'
import { formBlock } from './blocks/formBlock.ts'
import { formBuilderBlock } from './blocks/formBuilderBlock.ts'
import { countdownBlock } from './blocks/countdownBlock.ts'
import { socialFeedBlock } from './blocks/socialFeedBlock.ts'
import { customCodeBlock } from './blocks/customCodeBlock.ts'
import { mapBlock } from './blocks/mapBlock.ts'
import { peopleBlock } from './blocks/peopleBlock.ts'
import { tabsBlock } from './blocks/tabsBlock.ts'
import { FlexibleRowBlock } from '../../../blocks/FlexibleRow.ts'

export const blockBuilderField = (
  fieldName: string = 'contentBlocks',
  enabledBlocks?: Record<string, boolean>
): Field => {
  // All available blocks
  const allBlocks = [
    cardGridBlock,
    videoBlock,
    imageGalleryBlock,
    testimonialsBlock,
    ctaBlock,
    richTextBlock,
    statsBlock,
    faqBlock,
    formBlock,
    formBuilderBlock,
    countdownBlock,
    socialFeedBlock,
    customCodeBlock,
    mapBlock,
    peopleBlock,
    tabsBlock,
    FlexibleRowBlock,
  ]

  // Filter blocks based on enabled options
  const blocks = enabledBlocks
    ? allBlocks.filter((block) => {
        const blockType = block.slug
        return enabledBlocks[blockType] !== false
      })
    : allBlocks

  return {
    name: fieldName,
    type: 'blocks',
    label: 'Content Blocks',
    blocks: blocks,
    hooks: {
      beforeValidate: [
        ({ value }) => {
          if (!Array.isArray(value)) return value

          return value.filter((item) => {
            if (!item || typeof item !== 'object') return false
            const blockType = (item as { blockType?: unknown }).blockType
            return typeof blockType === 'string' && blockType.trim().length > 0
          })
        },
      ],
    },
    admin: {
      description: 'Add flexible content blocks to build your page',
      initCollapsed: true,
    },
  }
}
