import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../../lib/admin-utils";
import { createAdminClient } from "../../../../../lib/supabase/admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.code });

  const { id } = await params;
  const { status, tracking } = await req.json();

  const admin = createAdminClient();

  // Merge tracking into the shipping jsonb (preserve any existing fields).
  const { data: existing } = await admin
    .from("orders")
    .select("shipping")
    .eq("id", id)
    .single();

  const shipping = {
    ...(existing?.shipping ?? {}),
    ...(tracking !== undefined ? { tracking } : {}),
  };

  const update: Record<string, any> = { shipping, updated_at: new Date().toISOString() };
  if (status) update.status = status;

  const { error } = await admin.from("orders").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.code });

  const { id } = await params;
  const admin = createAdminClient();
  const { error } = await admin.from("orders").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
