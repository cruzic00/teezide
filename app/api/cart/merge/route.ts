// app/api/cart/merge/route.ts
import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { getCurrentUser } from "../../../../lib/auth";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = new ObjectId(user._id);
  const items = await req.json(); // [{ productId, qty }]

  const client = await clientPromise;
  const db = client.db();

  let cart: any = await db.collection("carts").findOne({ userId });
  const now = new Date();
  if (!cart) {
    cart = { userId, items: items.map((i: any) => ({ productId: new ObjectId(i.productId), qty: i.qty, addedAt: now })), createdAt: now, updatedAt: now };
    await db.collection("carts").insertOne(cart);
    return NextResponse.json({ ok: true, cart });
  }

  // merge
  for (const i of items) {
    const pid = String(i.productId);
    const idx = cart.items.findIndex((it: any) => String(it.productId) === pid);
    if (idx >= 0) cart.items[idx].qty += i.qty;
    else cart.items.push({ productId: new ObjectId(i.productId), qty: i.qty, addedAt: now });
  }
  cart.updatedAt = now;
  await db.collection("carts").updateOne({ _id: cart._id }, { $set: { items: cart.items, updatedAt: now } });
  return NextResponse.json({ ok: true, cart });
}
