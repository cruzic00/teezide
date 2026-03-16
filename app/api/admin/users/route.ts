import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("tee_store");

  const users = await db
    .collection("users")
    .find({}, { projection: { password: 0 } })
    .toArray();

  return NextResponse.json(users);
}
