import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("tee_store");

    const payments = await db
      .collection("payments")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(payments);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
