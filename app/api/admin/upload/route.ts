import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/admin-utils";
import { createAdminClient } from "../../../../lib/supabase/admin";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.code });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const admin = createAdminClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `home/${Date.now()}-${safeName}`;

    const { error } = await admin.storage
      .from("media")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (error) {
      return NextResponse.json(
        { error: error.message + " (make sure the 'media' storage bucket exists)" },
        { status: 500 }
      );
    }

    const { data } = admin.storage.from("media").getPublicUrl(path);
    return NextResponse.json({
      url: data.publicUrl,
      type: file.type.startsWith("video") ? "video" : "image",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
