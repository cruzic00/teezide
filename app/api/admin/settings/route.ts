import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/admin-utils";
import { createAdminClient } from "../../../../lib/supabase/admin";
import { normalizeSettings } from "../../../../lib/settings";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.code });

  const admin = createAdminClient();
  const { data } = await admin
    .from("site_settings")
    .select("data")
    .eq("id", 1)
    .single();

  return NextResponse.json(normalizeSettings(data?.data ?? {}));
}

export async function PUT(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.code });

  try {
    const body = await req.json();
    const admin = createAdminClient();
    const { error } = await admin
      .from("site_settings")
      .upsert({ id: 1, data: body, updated_at: new Date().toISOString() });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
