import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth_user");

    if (!authCookie || !authCookie.value) {
        return NextResponse.json({ cart: [] });
    }

    const email = authCookie.value;

    try {
        const client = await clientPromise;
        const db = client.db("tee_store");
        const user = await db.collection("users").findOne({ email });

        if (!user) {
            return NextResponse.json({ cart: [] });
        }

        return NextResponse.json({ cart: user.cart || [] });
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth_user");

    if (!authCookie || !authCookie.value) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = authCookie.value;
    const { cart } = await req.json();

    try {
        const client = await clientPromise;
        const db = client.db("tee_store");

        // Replace the entire cart array
        await db.collection("users").updateOne(
            { email },
            { $set: { cart, updatedAt: new Date() } }
        );

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
    }
}
