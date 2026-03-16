import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("tee_store");

        // Case-insensitive search for "Anime"
        const products = await db.collection("products")
            .find({ category: { $regex: /^anime$/i } })
            .toArray();

        // Transform _id to id if necessary, though typical consumption handles _id
        return NextResponse.json(products);
    } catch (err) {
        console.error("Anime fetch error:", err);
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
