// app/api/cart/add/route.ts
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { getCurrentUser } from "../../../lib/auth";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = new ObjectId(user._id);

  const body = await req.json();
  const { productId, qty = 1 } = body;
  if (!productId) return NextResponse.json({ error: "missing productId" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db();

  const now = new Date();
  const existing: any = await db.collection("carts").findOne({ userId });

  if (!existing) {
    const cart = { userId, items: [{ productId: new ObjectId(productId), qty, addedAt: now }], createdAt: now, updatedAt: now };
    await db.collection("carts").insertOne(cart);
    return NextResponse.json({ ok: true, cart });
  }

  // update existing
  const idx = existing.items.findIndex((i: any) => String(i.productId) === String(productId));
  if (idx >= 0) {
    existing.items[idx].qty += qty;
    existing.items[idx].addedAt = now;
  } else {
    existing.items.push({ productId: new ObjectId(productId), qty, addedAt: now });
  }
  existing.updatedAt = now;
  await db.collection("carts").updateOne({ _id: existing._id }, { $set: { items: existing.items, updatedAt: now } });
  return NextResponse.json({ ok: true, cart: existing });
}
