const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://teezide:soorajcruzico1000m@cluster0.f66vbog.mongodb.net/tee_store?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    console.log("Connected successfully to server");
  } catch (err) {
    console.error("Connection failed! Your IP is likely not whitelisted on MongoDB Atlas.");
    console.error(err.message);
  } finally {
    await client.close();
  }
}

run();
