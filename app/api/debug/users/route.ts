import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("tee_store");
        const users = await db.collection("users").find({}).project({ email: 1, role: 1, roles: 1 }).toArray();

        return NextResponse.json({
            count: users.length,
            users: users.map(u => ({ email: u.email, role: u.role, roles: u.roles }))
        });
    } catch (err) {
        console.error("DEBUG USER ERROR:", err);
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
