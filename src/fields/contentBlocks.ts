import { FlexibleRowBlock } from '@/blocks/FlexibleRow'
import { cardGridBlock } from '@/plugins/blockBuilder/fields/blocks/cardGridBlock'
import { countdownBlock } from '@/plugins/blockBuilder/fields/blocks/countdownBlock'
import { ctaBlock } from '@/plugins/blockBuilder/fields/blocks/ctaBlock'
import { customCodeBlock } from '@/plugins/blockBuilder/fields/blocks/customCodeBlock'
import { faqBlock } from '@/plugins/blockBuilder/fields/blocks/faqBlock'
import { formBlock } from '@/plugins/blockBuilder/fields/blocks/formBlock'
import { imageGalleryBlock } from '@/plugins/blockBuilder/fields/blocks/imageGalleryBlock'
import { mapBlock } from '@/plugins/blockBuilder/fields/blocks/mapBlock'
import { peopleBlock } from '@/plugins/blockBuilder/fields/blocks/peopleBlock'
import { richTextBlock } from '@/plugins/blockBuilder/fields/blocks/richTextBlock'
import { socialFeedBlock } from '@/plugins/blockBuilder/fields/blocks/socialFeedBlock'
import { statsBlock } from '@/plugins/blockBuilder/fields/blocks/statsBlock'
import { testimonialsBlock } from '@/plugins/blockBuilder/fields/blocks/testimonialsBlock'
import { videoBlock } from '@/plugins/blockBuilder/fields/blocks/videoBlock'

export const contentBlocksField: any = {
  name: 'contentBlocks',
  type: 'blocks',
  admin: {
    description: 'Flexible content blocks rendered on frontend for this section',
  },
  blocks: [
    cardGridBlock,
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
  ],
}
