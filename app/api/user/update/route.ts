import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "../../../../lib/mongodb";

export async function PUT(request: Request) {
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth_user");

    if (!authCookie || !authCookie.value) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = authCookie.value;

    try {
        const body = await request.json();
        const { username, phone, bio, profilePicture } = body;

        const client = await clientPromise;
        const db = client.db("tee_store");

        const updateDoc: any = {};
        if (username) updateDoc.username = username;
        if (phone) updateDoc.phone = phone;
        if (bio) updateDoc.bio = bio;
        if (profilePicture) updateDoc.profilePicture = profilePicture;
        // Always update updatedAt
        updateDoc.updatedAt = new Date();

        const result = await db.collection("users").updateOne(
            { email },
            { $set: updateDoc }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Profile updated successfully" });

    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
