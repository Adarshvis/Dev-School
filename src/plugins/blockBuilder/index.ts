import type { Config, Plugin } from 'payload'
import { blockBuilderField } from './fields/blockBuilderField.ts'

/**
 * Block Builder Plugin
 * Adds flexible content blocks to specified collections
 */
export const blockBuilderPlugin = (options?: {
  /**
   * Collection slugs to add block builder to
   * If not provided, adds to all collections
   */
  collections?: string[]
  /**
   * Field name for the blocks array
   * Default: 'contentBlocks'
   */
  fieldName?: string
  /**
   * Enable/disable specific block types
   */
  enabledBlocks?: {
    video?: boolean
    imageGallery?: boolean
    testimonials?: boolean
    cta?: boolean
    richText?: boolean
    stats?: boolean
    faq?: boolean
    form?: boolean
    countdown?: boolean
    socialFeed?: boolean
    customCode?: boolean
    map?: boolean
    people?: boolean
    flexibleRow?: boolean
  }
}): Plugin => {
  return (incomingConfig: Config): Config => {
    const fieldName = options?.fieldName || 'contentBlocks'
    const enabledCollections = options?.collections || []

    // Create the modified config
    const config: Config = {
      ...incomingConfig,
      collections: (incomingConfig.collections || [])?.map((collection) => {
        // Only add to specified collections, or all if none specified
        const shouldAddBlocks =
          enabledCollections.length === 0 ||
          (enabledCollections && enabledCollections.includes(collection.slug))

        if (!shouldAddBlocks) {
          return collection
        }

        // Add the block builder field to the collection
        return {
          ...collection,
          fields: [
            ...collection.fields,
            blockBuilderField(fieldName, options?.enabledBlocks),
          ],
        }
      }),
    }

    return config
  }
}
