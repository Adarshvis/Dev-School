const { MongoClient } = require('mongodb');
require('dotenv').config();

const OLD_DB_URI =
  process.env.MIGRATE_OLD_DB_URI ||
  process.env.OLD_DB_URI ||
  process.env.SOURCE_DATABASE_URI;

const NEW_DB_URI =
  process.env.MIGRATE_NEW_DB_URI ||
  process.env.NEW_DB_URI ||
  process.env.TARGET_DATABASE_URI ||
  process.env.DATABASE_URI;

if (!OLD_DB_URI || !NEW_DB_URI) {
  console.error('Missing required env vars for migration.');
  console.error('Set MIGRATE_OLD_DB_URI and MIGRATE_NEW_DB_URI (preferred),');
  console.error('or OLD_DB_URI / NEW_DB_URI.');
  process.exit(1);
}

async function migrateDatabase() {
  let oldClient, newClient;
  
  try {
    console.log('🔄 Connecting to old database...');
    oldClient = new MongoClient(OLD_DB_URI);
    await oldClient.connect();
    
    console.log('🔄 Connecting to new database...');
    newClient = new MongoClient(NEW_DB_URI);
    await newClient.connect();
    
    const oldDb = oldClient.db();
    const newDb = newClient.db();
    
    const collections = await oldDb.listCollections().toArray();
    console.log(`\n📦 Found ${collections.length} collections to migrate:\n`);
    
    for (const col of collections) {
      const collectionName = col.name;
      console.log(`  ⏳ Migrating "${collectionName}"...`);
      
      const oldCollection = oldDb.collection(collectionName);
      const newCollection = newDb.collection(collectionName);
      
      // Drop existing collection in new DB (if any)
      try {
        await newCollection.drop();
      } catch (err) {
        // Collection might not exist, that's fine
      }
      
      const documents = await oldCollection.find({}).toArray();
      
      if (documents.length > 0) {
        await newCollection.insertMany(documents);
        console.log(`  ✅ "${collectionName}": ${documents.length} documents migrated`);
      } else {
        console.log(`  ✅ "${collectionName}": empty collection migrated`);
      }
    }
    
    console.log('\n✨ Database migration completed successfully!');
    console.log('📝 All collections, users, and data have been transferred.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (oldClient) await oldClient.close();
    if (newClient) await newClient.close();
  }
}

migrateDatabase();
