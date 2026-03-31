const { MongoClient } = require('mongodb')
require('dotenv').config()

const uri =
  process.env.FIX_DB_URI ||
  process.env.DATABASE_URI ||
  process.env.MONGODB_URI

if (!uri) {
  console.error('Missing DB URI. Set FIX_DB_URI, DATABASE_URI, or MONGODB_URI in .env')
  process.exit(1)
}

const dbName = process.env.FIX_DB_NAME || 'test'

async function fixFooterText() {
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(dbName)
    const result = await db.collection('globals').updateOne(
      { globalType: 'settings' },
      {
        $set: {
          footerText: 'Cras fermentum odio eu feugiat lide par naso tierra. Justo eget nada terra videa magna derita valies darta donna mare fermentum iaculis eu non diam phasellus.'
        }
      }
    )
    
    console.log('✅ Updated:', result.modifiedCount, 'document(s)')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}

fixFooterText()
