import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/admin-utils";
import { createAdminClient } from "../../../../lib/supabase/admin";
import { DEFAULT_CATEGORIES } from "../../../../lib/settings";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.code });

  const admin = createAdminClient();
  const { data } = await admin.from("site_settings").select("data").eq("id", 1).single();
  const cats = (data?.data as any)?.categories;
  return NextResponse.json({
    categories: Array.isArray(cats) && cats.length ? cats : DEFAULT_CATEGORIES,
  });
}

export async function PUT(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.code });

  try {
    const { categories } = await req.json();
    const admin = createAdminClient();
    const { data: existing } = await admin
      .from("site_settings")
      .select("data")
      .eq("id", 1)
      .single();
    const merged = { ...(existing?.data ?? {}), categories: categories ?? [] };
    const { error } = await admin
      .from("site_settings")
      .upsert({ id: 1, data: merged, updated_at: new Date().toISOString() });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
