import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const email = cookieStore.get("userEmail")?.value;

  if (!email) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("tee_store");

  const user = await db.collection("users").findOne(
    { email },
    { projection: { password: 0 } } // never send password
  );

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
