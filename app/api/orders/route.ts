import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth_user");

    if (!authCookie || !authCookie.value) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = authCookie.value;

    try {
        const client = await clientPromise;
        const db = client.db("tee_store");

        // Fetch orders for this user, sorted by newest first
        const orders = await db.collection("orders")
            .find({ userEmail: email })
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({ orders });
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth_user");

    if (!authCookie || !authCookie.value) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = authCookie.value;
    const body = await req.json();
    const { items, totalAmount, paymentId } = body;

    if (!items || !totalAmount) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db("tee_store");

        const newOrder = {
            userEmail: email,
            items,
            totalAmount,                    // stored in Rupees
            paymentStatus: "Paid",          // Assuming success page call implies success (simplified)
            paymentId: paymentId || "manual",
            orderStatus: "Processing",
            createdAt: new Date(),
        };

        const result = await db.collection("orders").insertOne(newOrder);

        return NextResponse.json({ success: true, orderId: result.insertedId });
    } catch (err) {
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
