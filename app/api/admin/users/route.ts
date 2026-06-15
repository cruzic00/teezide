import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/admin-utils";
import { createAdminClient } from "../../../../lib/supabase/admin";

export async function DELETE(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.code });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

  if (id === auth.user.id) {
    return NextResponse.json({ error: "You can't delete your own account." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  // profiles row cascades via FK on delete.
  return NextResponse.json({ success: true });
}
