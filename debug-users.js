const { MongoClient } = require("mongodb");
require("dotenv").config({ path: ".env.local" }); // Load environment variables

async function listUsers() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("Missing MONGODB_URI");
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db("tee_store");
        const users = await db.collection("users").find({}).project({ email: 1, role: 1, roles: 1 }).toArray();
        console.log("Users:", JSON.stringify(users, null, 2));
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

listUsers();
