// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor, FixedToolbarFeature, InlineToolbarFeature, HeadingFeature, BoldFeature, ItalicFeature, UnderlineFeature, StrikethroughFeature, SubscriptFeature, SuperscriptFeature, AlignFeature, IndentFeature, UnorderedListFeature, OrderedListFeature, ChecklistFeature, LinkFeature, BlockquoteFeature, HorizontalRuleFeature, InlineCodeFeature } from '@payloadcms/richtext-lexical'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Users } from './collections/Users.ts'
import { Media } from './collections/Media.ts'
import { HomePage } from './collections/HomePage.ts'
import { AboutPage } from './collections/AboutPage.ts'
import { CoursesPage } from './collections/CoursesPage.ts'
import { InstructorsPage } from './collections/InstructorsPage.ts'
import { PeoplePage } from './collections/PeoplePage.ts'
import { Instructors } from './collections/Instructors.ts'
import { News } from './collections/News.ts'
import { NewsPage } from './collections/NewsPage.ts'
import { ResearchDomains } from './collections/ResearchDomains.ts'
import { WorkWithUs } from './collections/WorkWithUs.ts'
import { BlogPosts } from './collections/BlogPosts.ts'
import { ContactPage } from './collections/ContactPage.ts'
import { EnrollPage } from './collections/EnrollPage.ts'
import { Pages } from './collections/Pages.ts'
import { Publications } from './collections/Publications.ts'
import { PublicationsPage } from './collections/PublicationsPage.ts'
import { Invitations } from './collections/Invitations.ts'
import { Settings } from './globals/Settings.ts'
import { Navigation } from './globals/Navigation.ts'
import { blockBuilderPlugin } from './plugins/blockBuilder/index.ts'
import { sectionReorderPlugin } from './plugins/sectionReorder/index.ts'

type RevalidationSpec = {
  tags: string[]
  paths: string[]
}

const collectionRevalidationSpecs: Record<string, RevalidationSpec> = {
  'home-page': { tags: ['page-content', 'page-homepage'], paths: ['/', '/home'] },
  'about-page': { tags: ['page-content', 'page-about'], paths: ['/about'] },
  'courses-page': { tags: ['page-content', 'page-courses'], paths: ['/courses'] },
  'people-page': { tags: ['page-content', 'page-people'], paths: ['/people'] },
  'instructors-page': { tags: ['page-content', 'page-instructors'], paths: ['/instructors'] },
  'news-page': { tags: ['page-content', 'page-news'], paths: ['/news'] },
  'contact-page': { tags: ['page-content', 'page-contact'], paths: ['/contact'] },
  'blog-page': { tags: ['page-content', 'page-blog'], paths: ['/blog'] },
  'blog-details-page': { tags: ['page-content', 'page-blog-details'], paths: ['/blog-details'] },
  'publications-page': { tags: ['page-content', 'page-publications'], paths: ['/publications'] },
  pages: { tags: ['page-content'], paths: ['/'] },
  'blog-posts': { tags: ['page-content', 'page-blog'], paths: ['/blog', '/blog-details'] },
  news: { tags: ['page-content', 'page-news'], paths: ['/news'] },
  publications: { tags: ['page-content', 'page-publications'], paths: ['/publications'] },
  'research-domains': { tags: ['page-content'], paths: ['/research-domains'] },
  'work-with-us': { tags: ['page-content'], paths: ['/work-with-us'] },
}

const globalRevalidationSpecs: Record<string, RevalidationSpec> = {
  settings: { tags: ['settings', 'navigation', 'page-content'], paths: ['/'] },
  navigation: { tags: ['navigation', 'settings', 'page-content'], paths: ['/'] },
  'apply-now': { tags: ['page-content'], paths: ['/enroll'] },
}

async function runNextRevalidation(spec: RevalidationSpec) {
  try {
    const { revalidatePath, revalidateTag } = await import('next/cache')

    for (const tag of new Set(spec.tags)) {
      revalidateTag(tag)
    }

    // Revalidate app shell to refresh shared layout/header/footer data.
    revalidatePath('/', 'layout')

    for (const path of new Set(spec.paths)) {
      revalidatePath(path)
    }
  } catch (error) {
    console.error('Content cache revalidation failed:', error)
  }
}

function withCollectionRevalidation<T extends { slug?: string; hooks?: any }>(collection: T): T {
  const slug = collection?.slug
  const spec = slug ? collectionRevalidationSpecs[slug] : undefined

  if (!spec) return collection

  const hooks = collection.hooks || {}

  return {
    ...collection,
    hooks: {
      ...hooks,
      afterChange: [
        ...(hooks.afterChange || []),
        async () => {
          await runNextRevalidation(spec)
        },
      ],
      afterDelete: [
        ...(hooks.afterDelete || []),
        async () => {
          await runNextRevalidation(spec)
        },
      ],
    },
  }
}

function withGlobalRevalidation<T extends { slug?: string; hooks?: any }>(globalConfig: T): T {
  const slug = globalConfig?.slug
  const spec = slug ? globalRevalidationSpecs[slug] : undefined

  if (!spec) return globalConfig

  const hooks = globalConfig.hooks || {}

  return {
    ...globalConfig,
    hooks: {
      ...hooks,
      afterChange: [
        ...(hooks.afterChange || []),
        async () => {
          await runNextRevalidation(spec)
        },
      ],
    },
  }
}

const imageUploadField = {
  slug: 'imageUpload',
  labels: {
    singular: 'Image Upload',
    plural: 'Image Upload Fields',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      defaultValue: 'Upload Image',
    },
    {
      name: 'required',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'helpText',
      type: 'text',
      required: false,
    },
  ],
}

const documentUploadField = {
  slug: 'documentUpload',
  labels: {
    singular: 'Document Upload',
    plural: 'Document Upload Fields',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      defaultValue: 'Upload Document',
    },
    {
      name: 'required',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'helpText',
      type: 'text',
      required: false,
    },
  ],
}

const isProduction = process.env.NODE_ENV === 'production'
const isProductionBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

if (isProduction && !isProductionBuildPhase) {
  if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
    throw new Error('Refusing to start in production with NODE_TLS_REJECT_UNAUTHORIZED=0')
  }

  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET must be set in production')
  }
}

const configuredCollections = [
  Users,
  Media,
  Pages,
  HomePage,
  AboutPage,
  PeoplePage,
  Instructors,
  CoursesPage,
  InstructorsPage,
  News,
  NewsPage,
  ResearchDomains,
  WorkWithUs,
  BlogPosts,
  ContactPage,
  Publications,
  PublicationsPage,
  Invitations,
].map(withCollectionRevalidation)

const configuredGlobals = [Settings, Navigation, EnrollPage].map(withGlobalRevalidation)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: configuredCollections,
  globals: configuredGlobals,
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: './payload-types.ts',
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
    formBuilderPlugin({
      fields: {
        payment: false,
        imageUpload: imageUploadField as any,
        documentUpload: documentUploadField as any,
      },
      formOverrides: {
        fields: ({ defaultFields }) =>
          defaultFields.map((field: any) => {
            if (field?.name === 'title' && field?.type === 'text') {
              return {
                ...field,
                required: false,
              }
            }
            return field
          }),
      },
      redirectRelationships: ['pages'],
    }),
    sectionReorderPlugin({
      collections: [
        'home-page',
        'about-page',
        'courses-page',
        'instructors-page',
        'news-page',
        'contact-page',
      ],
    }),
    blockBuilderPlugin({
      // Add content blocks to all page collections
      collections: [
        'home-page',
        'about-page',
        'courses-page',
        'instructors-page',
        'news-page',
        'contact-page',
        'pages',
      ],
      // Optional: Customize which blocks are available
      enabledBlocks: {
        video: true,
        imageGallery: true,
        testimonials: true,
        cta: true,
        richText: true,
        stats: true,
        faq: true,
        form: true,
        countdown: true,
        socialFeed: true,
        customCode: true,
        map: true,
        people: true,
      },
    }),
  ],
})
