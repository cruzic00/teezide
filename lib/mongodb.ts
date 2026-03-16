// lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Missing MONGODB_URI in environment variables");

let cachedPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(uri);
    // @ts-ignore
    globalThis._mongoClientPromise = client.connect();
  }
  // @ts-ignore
  cachedPromise = globalThis._mongoClientPromise;
} else {
  const client = new MongoClient(uri);
  cachedPromise = client.connect();
}

export default cachedPromise;
