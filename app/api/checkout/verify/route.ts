import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentUser } from "../../../../lib/auth";
import { createAdminClient } from "../../../../lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shipping,
      total,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    // Verify the signature server-side — never trust the client.
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data: order, error } = await admin
      .from("orders")
      .insert({
        user_id: user.id,
        items: items ?? [],
        total: total ?? 0,
        shipping: shipping ?? {},
        payment: {
          provider: "razorpay",
          status: "paid",
          razorpay_order_id,
          razorpay_payment_id,
        },
        status: "paid",
      })
      .select("id")
      .single();

    if (error) {
      console.error("order insert error:", error.message);
      return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
    }

    // Clear the user's cart now that the order is placed.
    await admin.from("carts").delete().eq("user_id", user.id);

    return NextResponse.json({ success: true, orderId: order?.id });
  } catch (err) {
    console.error("verify error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
