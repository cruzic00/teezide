import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json(
                { error: "Email query parameter required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("tee_store");

        const result = await db.collection("users").updateOne(
            { email },
            { $set: { role: "admin" } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `User ${email} is now an admin`,
            modifiedCount: result.modifiedCount,
        });
    } catch (err) {
        console.error("SETUP ADMIN ERROR:", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
