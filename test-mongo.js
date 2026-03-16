// test-connect.js
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function run() {
  const uri = process.env.MONGODB_URI;
  console.log('MONGODB_URI present:', !!uri);
  console.log('First 20 chars:', uri ? uri.slice(0, 20) : '(no uri)');

  if (!uri) {
    console.error('ERROR: MONGODB_URI not found in .env.local');
    return process.exit(1);
  }

  const client = new MongoClient(uri, {
    socketTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
  });

  try {
    await client.connect();
    console.log('Connected OK');
    const dbs = await client.db('admin').admin().listDatabases();
    console.log('Databases:', dbs.databases.map(d => d.name).slice(0,10));
  } catch (err) {
    console.error('CONNECT ERROR:', err && err.message ? err.message : err);
    console.error(err);
  } finally {
    await client.close().catch(()=>{});
  }
}

run();
