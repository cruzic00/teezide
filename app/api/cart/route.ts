import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ cart: [] });

  const { data } = await supabase
    .from("carts")
    .select("items")
    .eq("user_id", user.id)
    .single();

  return NextResponse.json({ cart: data?.items ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cart } = await req.json();

  const { error } = await supabase.from("carts").upsert({
    user_id: user.id,
    items: cart ?? [],
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("cart upsert error:", error.message);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
