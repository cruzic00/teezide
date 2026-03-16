// app/account/orders/page.tsx
import React from "react";
import clientPromise from "../../lib/mongodb";
import { getCurrentUser } from "../../lib/auth";
import { ObjectId } from "mongodb";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) return <div className="p-6">Please sign in to view orders.</div>;
  const userId = new ObjectId(user._id);

  const client = await clientPromise;
  const db = client.db();
  const orders = await db.collection("orders").find({ userId }).sort({ createdAt: -1 }).toArray();

  return (
    <main className="p-6">
      <h1 className="text-2xl">My Orders</h1>
      <div className="mt-3 space-y-3">
        {orders.length === 0 ? <p>No orders yet.</p> : orders.map((o: any) => (
          <div key={String(o._id)} className="p-3 border rounded">
            <div>Order: {String(o._id)}</div>
            <div>Items: {o.items.length}</div>
            <div>Total: ₹{o.total}</div>
            <div>Status: {o.status}</div>
            <div>Date: {new Date(o.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
