// test-mongo-insecure.js  — TEMPORARY DEBUG ONLY
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;
console.log("URI present:", !!uri);
if (!uri) process.exit(1);

(async () => {
  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true
    });
    await client.connect();
    console.log("Connected OK (insecure mode)");
    await client.close();
  } catch (err) {
    console.error("connect failed (insecure):", err);
    process.exit(2);
  }
})();
