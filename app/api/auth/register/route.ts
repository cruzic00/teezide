import { NextResponse } from "next/server";
import { createAdminClient } from "../../../../lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email and password required" },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Create the user already confirmed via the admin API. This avoids
    // Supabase's confirmation-email flow (and its strict email rate limit),
    // so users can log in immediately after registering.
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.createUser({
      email: cleanEmail,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (error) {
      const msg = /already/i.test(error.message)
        ? "An account with this email already exists. Please log in."
        : error.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
