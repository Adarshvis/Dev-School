const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const OLD_DB_URI = 'mongodb+srv://adarshsharma1552004_db_user:Adarsh%402004@cluster1.5u4qjdu.mongodb.net/?appName=Cluster1';
const NEW_DB_URI = 'mongodb+srv://adarshsharma1552004_db_user:oN9OIy7suRUzxb9w@devschool.t9lkktt.mongodb.net/?appName=devschool';

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
