const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;
console.log("MONGODB_URI present:", !!uri);

(async () => {
  if (!uri) {
    console.error("NO MONGODB_URI set");
    process.exit(1);
  }
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    const db = client.db();
    const cols = (await db.listCollections().toArray()).map(c => c.name);
    console.log("Collections:", cols);
  } catch (err) {
    console.error("Connection error:", err.message);
  } finally {
    await client.close();
  }
})();
