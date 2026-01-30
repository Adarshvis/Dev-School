// @ts-nocheck
import { getPayload } from 'payload'
import config from '@payload-config'

async function updateAllItemsToPublished() {
  const payload = await getPayload({ config })

  try {
    console.log('🚀 Updating all collection items to published status...\n')

    // Update News (uses 'status' field, not '_status')
    console.log('📰 Updating News...')
    const news = await payload.find({
      collection: 'news' as any,
      limit: 1000,
    })
    
    for (const item of news.docs) {
      await payload.update({
        collection: 'news' as any,
        id: item.id,
        data: {
          status: 'published',
        } as any,
      })
    }
    console.log(`✅ Updated ${news.docs.length} news items to published\n`)

    // Update BlogPosts
    console.log('📝 Updating Blog Posts...')
    const blogPosts = await payload.find({
      collection: 'blog-posts',
      limit: 1000,
    })
    
    for (const post of blogPosts.docs) {
      await payload.update({
        collection: 'blog-posts',
        id: post.id,
        data: {
          _status: 'published',
        } as any,
      })
    }
    console.log(`✅ Updated ${blogPosts.docs.length} blog posts to published\n`)

    // Update People
    console.log('👥 Updating People...')
    const people = await payload.find({
      collection: 'people' as any,
      limit: 1000,
    })
    
    for (const person of people.docs) {
      await payload.update({
        collection: 'people' as any,
        id: person.id,
        data: {
          _status: 'published',
        } as any,
      })
    }
    console.log(`✅ Updated ${people.docs.length} people to published\n`)

    // Update WorkWithUs
    console.log('🤝 Updating Work With Us programs...')
    const workWithUs = await payload.find({
      collection: 'work-with-us' as any,
      limit: 1000,
    })
    
    for (const program of workWithUs.docs) {
      await payload.update({
        collection: 'work-with-us' as any,
        id: program.id,
        data: {
          _status: 'published',
        } as any,
      })
    }
    console.log(`✅ Updated ${workWithUs.docs.length} work-with-us programs to published\n`)

    console.log('🎉 All items updated successfully!')
  } catch (error) {
    console.error('❌ Error updating items:', error)
  }

  process.exit(0)
}

updateAllItemsToPublished()
