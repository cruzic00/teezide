import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { username, phone, profilePicture } = await request.json();

    const updateDoc: Record<string, any> = {};
    if (username !== undefined) updateDoc.name = username;
    if (phone !== undefined) updateDoc.phone = phone;
    if (profilePicture !== undefined) updateDoc.avatar_url = profilePicture;

    const { error } = await supabase
      .from("profiles")
      .update(updateDoc)
      .eq("id", user.id);

    if (error) {
      console.error("Profile update error:", error.message);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
