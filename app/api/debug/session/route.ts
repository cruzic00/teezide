// app/api/debug/session/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ session: { user } }); // mocking session structure or just returning user
}
