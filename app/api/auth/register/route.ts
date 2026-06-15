import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

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

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: { data: { name } },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // If email confirmation is disabled, a session is created and the user is
    // already signed in. Otherwise they must confirm via email before login.
    const needsConfirmation = !data.session;

    return NextResponse.json({ success: true, needsConfirmation }, { status: 201 });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
