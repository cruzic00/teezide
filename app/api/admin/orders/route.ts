import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "../../../../lib/mongodb";

export async function GET() {
  const userEmail = cookies().get("userEmail")?.value;

  if (!userEmail) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const client = await clientPromise;
  const db = client.db("tee_store");

  const orders = await db
    .collection("orders")
    .find({ userEmail })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({ orders });
}
