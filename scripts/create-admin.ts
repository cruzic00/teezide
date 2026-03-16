import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

async function createAdmin() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("❌ MONGODB_URI not found in .env.local");
        process.exit(1);
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db("tee_store");
        const users = db.collection("users");

        const email = "admin@example.com";
        const password = "admin123";
        const hashedPassword = await bcrypt.hash(password, 10);

        const adminUser = {
            email,
            password: hashedPassword,
            username: "Super Admin",
            role: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
            phone: "+1234567890",
            bio: "Default Admin Account",
            profilePicture: "https://ui-avatars.com/api/?name=Admin&background=000&color=fff"
        };

        const result = await users.updateOne(
            { email },
            { $set: adminUser },
            { upsert: true }
        );

        if (result.upsertedCount > 0) {
            console.log("✅ Admin account created successfully!");
        } else {
            console.log("✅ Admin account updated successfully!");
        }

        console.log("\n🔑 CREDENTIALS:");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

    } catch (error) {
        console.error("❌ Error creating admin:", error);
    } finally {
        await client.close();
    }
}

createAdmin();
