// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor, FixedToolbarFeature, InlineToolbarFeature, HeadingFeature, BoldFeature, ItalicFeature, UnderlineFeature, StrikethroughFeature, SubscriptFeature, SuperscriptFeature, AlignFeature, IndentFeature, UnorderedListFeature, OrderedListFeature, ChecklistFeature, LinkFeature, BlockquoteFeature, HorizontalRuleFeature, InlineCodeFeature } from '@payloadcms/richtext-lexical'
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
import { Settings } from './globals/Settings.ts'
import { Navigation } from './globals/Navigation.ts'
import { blockBuilderPlugin } from './plugins/blockBuilder/index.ts'
import { sectionReorderPlugin } from './plugins/sectionReorder/index.ts'

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [
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
  ],
  globals: [Settings, Navigation, EnrollPage],
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
