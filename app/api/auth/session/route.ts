// app/api/auth/session/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "../../../../lib/mongodb";

export async function GET() {
  const cookie = cookies().get("auth_user");
  if (!cookie) {
    return NextResponse.json({ loggedIn: false });
  }

  const client = await clientPromise;
  const db = client.db("tee_store");

  const user = await db
    .collection("users")
    .findOne({ email: cookie.value });

  if (!user) {
    return NextResponse.json({ loggedIn: false });
  }

  return NextResponse.json({
    loggedIn: true,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
