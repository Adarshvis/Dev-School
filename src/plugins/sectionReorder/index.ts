import type { Config, Plugin } from 'payload'

export interface SectionReorderPluginConfig {
  collections: string[]
}

export const sectionReorderPlugin = (pluginConfig: SectionReorderPluginConfig): Plugin => {
  return (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }

    // Add the reorder component to specified collections
    config.collections = (config.collections || []).map((collection) => {
      if (typeof collection === 'object' && pluginConfig?.collections && pluginConfig.collections.includes(collection.slug)) {
        return {
          ...collection,
          admin: {
            ...collection.admin,
            components: {
              ...collection.admin?.components,
              beforeListTable: [
                ...(collection.admin?.components?.beforeListTable || []),
                '@/plugins/sectionReorder/components/ReorderButton',
              ],
            },
          },
        }
      }
      return collection
    })

    return config
  }
}

export default sectionReorderPlugin
