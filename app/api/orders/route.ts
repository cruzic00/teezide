import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { getCurrentUser } from "../../../lib/auth";
import { createAdminClient } from "../../../lib/supabase/admin";

// Place an order directly (payment temporarily disabled — Cash on Delivery).
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items, total, shipping } = await req.json();
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("orders")
    .insert({
      user_id: user.id,
      items,
      total: total ?? 0,
      shipping: shipping ?? {},
      payment: { provider: "cod", status: "pending" },
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("order create error:", error.message);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  await admin.from("carts").delete().eq("user_id", user.id);
  return NextResponse.json({ success: true, orderId: data.id });
}

// Returns the signed-in user's orders. Order creation happens server-side in
// /api/checkout/verify after a verified Razorpay payment.
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("orders")
    .select("id, items, total, payment, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
}
