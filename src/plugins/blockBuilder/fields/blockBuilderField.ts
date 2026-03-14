import type { Field } from 'payload'
import { videoBlock } from './blocks/videoBlock.ts'
import { imageGalleryBlock } from './blocks/imageGalleryBlock.ts'
import { testimonialsBlock } from './blocks/testimonialsBlock.ts'
import { ctaBlock } from './blocks/ctaBlock.ts'
import { richTextBlock } from './blocks/richTextBlock.ts'
import { statsBlock } from './blocks/statsBlock.ts'
import { faqBlock } from './blocks/faqBlock.ts'
import { formBlock } from './blocks/formBlock.ts'
import { countdownBlock } from './blocks/countdownBlock.ts'
import { socialFeedBlock } from './blocks/socialFeedBlock.ts'
import { customCodeBlock } from './blocks/customCodeBlock.ts'
import { mapBlock } from './blocks/mapBlock.ts'
import { peopleBlock } from './blocks/peopleBlock.ts'
import { FlexibleRowBlock } from '../../../blocks/FlexibleRow.ts'

export const blockBuilderField = (
  fieldName: string = 'contentBlocks',
  enabledBlocks?: Record<string, boolean>
): Field => {
  // All available blocks
  const allBlocks = [
    videoBlock,
    imageGalleryBlock,
    testimonialsBlock,
    ctaBlock,
    richTextBlock,
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
    admin: {
      description: 'Add flexible content blocks to build your page',
      initCollapsed: true,
    },
  }
}
