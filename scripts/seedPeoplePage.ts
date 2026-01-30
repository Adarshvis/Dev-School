import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import * as fs from 'fs'
import * as path from 'path'

// Helper function to upload images
const uploadImage = async (payload: any, imagePath: string, alt: string) => {
  const fullPath = path.join(process.cwd(), 'public', imagePath)
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Image not found: ${imagePath}`)
    return null
  }

  try {
    const imageBuffer = fs.readFileSync(fullPath)
    const filename = path.basename(imagePath)
    
    const result = await payload.create({
      collection: 'media',
      data: { alt: alt },
      file: {
        data: imageBuffer,
        mimetype: `image/${path.extname(filename).slice(1)}`,
        name: filename,
        size: imageBuffer.length,
      },
    })
    
    console.log(`✅ Uploaded: ${filename}`)
    return result.id
  } catch (error) {
    console.log(`❌ Failed to upload ${imagePath}:`, error)
    return null
  }
}

async function seedPeoplePage() {
  const payload = await getPayload({ config })

  console.log('👥 Seeding PeoplePage content...'))

  try {

    console.log('\n📸 Uploading images...')
    
    const inst1 = await uploadImage(payload, 'assets/img/education/teacher-2.webp', 'Sarah Johnson')
    const inst2 = await uploadImage(payload, 'assets/img/education/teacher-7.webp', 'Michael Chen')
    const inst3 = await uploadImage(payload, 'assets/img/education/teacher-4.webp', 'Amanda Rodriguez')
    const inst4 = await uploadImage(payload, 'assets/img/education/teacher-9.webp', 'David Thompson')
    const inst5 = await uploadImage(payload, 'assets/img/education/teacher-6.webp', 'Lisa Williams')
    const inst6 = await uploadImage(payload, 'assets/img/education/teacher-1.webp', 'James Anderson')
    const inst7 = await uploadImage(payload, 'assets/img/education/teacher-8.webp', 'Rachel Martinez')
    const inst8 = await uploadImage(payload, 'assets/img/education/teacher-10.webp', 'Kevin Taylor')

    console.log('\n📄 Creating PeoplePage sections...\n')

    // PAGE TITLE
    await payload.create({
      collection: 'people-page',
      data: {
        sectionName: 'People Page Title',
        sectionType: 'page-title',
        status: 'active',
        pageTitle: {
          title: 'People',
          breadcrumbs: [
            { label: 'Home', link: '/index.html', isActive: false },
            { label: 'People', link: '', isActive: true },
          ],
        },
      },
    })
    console.log('✅ Page Title created')

    // PEOPLE GRID
    await payload.create({
      collection: 'people-page',
      data: {
        sectionName: 'People Grid',
        sectionType: 'people-grid',
        status: 'active',
        peopleGrid: {
          people: [
            {
              image: inst1,
              name: 'Sarah Johnson',
              specialty: 'Web Development',
              description: 'Nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet non curabitur gravida.',
              rating: 4.8,
              courseCount: 18,
              studentCount: '2.1k',
              profileLink: '#',
              socialLinks: [
                { platform: 'linkedin', url: '#' },
                { platform: 'twitter', url: '#' },
              ],
            },
            {
              image: inst2,
              name: 'Michael Chen',
              specialty: 'Data Science',
              description: 'Suspendisse potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi.',
              rating: 4.9,
              courseCount: 24,
              studentCount: '3.5k',
              profileLink: '#',
              socialLinks: [
                { platform: 'github', url: '#' },
                { platform: 'linkedin', url: '#' },
              ],
            },
            {
              image: inst3,
              name: 'Amanda Rodriguez',
              specialty: 'UX Design',
              description: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis.',
              rating: 4.6,
              courseCount: 15,
              studentCount: '1.8k',
              profileLink: '#',
              socialLinks: [
                { platform: 'dribbble', url: '#' },
                { platform: 'behance', url: '#' },
              ],
            },
            {
              image: inst4,
              name: 'David Thompson',
              specialty: 'Digital Marketing',
              description: 'Vivamus magna justo lacinia eget consectetur sed convallis at tellus curabitur non nulla.',
              rating: 4.7,
              courseCount: 21,
              studentCount: '2.9k',
              profileLink: '#',
              socialLinks: [
                { platform: 'instagram', url: '#' },
                { platform: 'facebook', url: '#' },
              ],
            },
            {
              image: inst5,
              name: 'Lisa Williams',
              specialty: 'Business Analytics',
              description: 'Mauris blandit aliquet elit eget tincidunt nibh pulvinar a proin gravida hendrerit lectus.',
              rating: 5.0,
              courseCount: 12,
              studentCount: '4.2k',
              profileLink: '#',
              socialLinks: [
                { platform: 'linkedin', url: '#' },
                { platform: 'youtube', url: '#' },
              ],
            },
            {
              image: inst6,
              name: 'James Anderson',
              specialty: 'Machine Learning',
              description: 'Donec rutrum congue leo eget malesuada vestibulum ac diam sit amet quam vehicula elementum.',
              rating: 4.5,
              courseCount: 16,
              studentCount: '3.1k',
              profileLink: '#',
              socialLinks: [
                { platform: 'github', url: '#' },
                { platform: 'twitter', url: '#' },
              ],
            },
            {
              image: inst7,
              name: 'Rachel Martinez',
              specialty: 'Cybersecurity',
              description: 'Sed porttitor lectus nibh cras ultricies ligula sed magna dictum porta lorem ipsum dolor.',
              rating: 4.8,
              courseCount: 19,
              studentCount: '2.7k',
              profileLink: '#',
              socialLinks: [
                { platform: 'linkedin', url: '#' },
                { platform: 'shield-check', url: '#' },
              ],
            },
            {
              image: inst8,
              name: 'Kevin Taylor',
              specialty: 'Cloud Computing',
              description: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.',
              rating: 4.9,
              courseCount: 22,
              studentCount: '3.8k',
              profileLink: '#',
              socialLinks: [
                { platform: 'linkedin', url: '#' },
                { platform: 'cloud', url: '#' },
              ],
            },
          ],
        },
      },
    })
    console.log('✅ People Grid created')

    console.log('\n🎉 PeoplePage seeding completed!')
    console.log('\n📋 Next steps:')
    console.log('1. Go to http://localhost:3000/admin')
    console.log('2. Navigate to "People Page" collection')
    console.log('3. Edit person details, ratings, and social links')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding PeoplePage:', error)
    process.exit(1)
  }
}

seedPeoplePage()
