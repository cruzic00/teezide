import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("tee_store");

        const products = await db.collection("products")
            .find({ category: { $regex: /^gym$/i } })
            .toArray();

        return NextResponse.json(products);
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
