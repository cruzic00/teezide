// app/api/orders/create/route.ts
import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { getCurrentUser } from "../../../../lib/auth";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = new ObjectId(user._id);

  const payload = await req.json(); // { shipping, paymentMethod }
  const client = await clientPromise;
  const db = client.db();

  const cart = await db.collection("carts").findOne({ userId });
  if (!cart || !cart.items || cart.items.length === 0) {
    return NextResponse.json({ error: "Cart empty" }, { status: 400 });
  }

  // get products to snapshot prices
  const prodIds = cart.items.map((i: any) => new ObjectId(i.productId));
  const products = await db.collection("products").find({ _id: { $in: prodIds } }).toArray();

  const items = cart.items.map((it: any) => {
    const prod = products.find((p: any) => String(p._id) === String(it.productId));
    const price = prod ? (prod.price ?? 0) : (it.priceSnapshot ?? 0);
    return { productId: new ObjectId(it.productId), qty: it.qty, priceSnapshot: price };
  });

  const total = items.reduce((s: number, it: any) => s + it.qty * it.priceSnapshot, 0);

  const order = {
    userId,
    items,
    total,
    shipping: payload.shipping || {},
    payment: { method: payload.paymentMethod || "cod", status: "pending" },
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const res = await db.collection("orders").insertOne(order);

  // clear cart
  await db.collection("carts").deleteOne({ userId });

  // audit log
  await db.collection("audit").insertOne({ type: "order", action: "create", userId, orderId: res.insertedId, ts: new Date() });

  return NextResponse.json({ ok: true, orderId: String(res.insertedId) }, { status: 201 });
}
