import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";



type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number; // in paisa
  size: string;
  qty: number;
};

export async function POST(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20" as any,
    });
    const { items } = (await req.json()) as { items: CartItem[] };
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    const line_items = items.map((i) => ({
      quantity: i.qty,
      price_data: {
        currency: "inr",
        unit_amount: i.price, // already paisa
        product_data: {
          name: i.size ? `${i.name} (Size: ${i.size})` : i.name,
          images: i.image ? [i.image] : undefined,
          metadata: { id: i.id, size: i.size || "" },
        },
      },
      adjustable_quantity: { enabled: true, minimum: 1, maximum: 10 },
    }));

    const origin =
      process.env.NEXT_PUBLIC_BASE_URL ||
      req.headers.get("origin") ||
      "http://localhost:3001";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe error", err?.message || err);
    return NextResponse.json(
      { error: err?.message ?? "Stripe error" },
      { status: 500 }
    );
  }
}
