const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const TARGET_EMAIL = "admin1234@gmail.com";
const TARGET_PASSWORD = "admin123";

async function resetAdmin() {
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
        const users = db.collection("users");

        // 1. Hash the password
        const hashedPassword = await bcrypt.hash(TARGET_PASSWORD, 10);

        // 2. Upsert the user
        const result = await users.updateOne(
            { email: TARGET_EMAIL },
            {
                $set: {
                    password: hashedPassword,
                    role: "admin",
                    updatedAt: new Date(),
                },
                $setOnInsert: {
                    createdAt: new Date(),
                }
            },
            { upsert: true }
        );

        if (result.upsertedCount > 0) {
            console.log(`Created new admin user: ${TARGET_EMAIL}`);
        } else if (result.modifiedCount > 0) {
            console.log(`Updated existing user: ${TARGET_EMAIL}`);
        } else {
            console.log(`User ${TARGET_EMAIL} already exists and is up to date.`);
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

resetAdmin();
