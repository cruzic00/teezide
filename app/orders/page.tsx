"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type OrderItem = {
  name: string;
  price: number; // paisa
  qty: number;
  size?: string;
};

type Order = {
  id: string;
  items: OrderItem[];
  total: number; // paisa
  payment: { status?: string };
  status: string;
  created_at: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/orders").then(async (res) => {
      if (res.status === 401) {
        router.push("/login?redirect=/orders");
        return;
      }
      const data = await res.json();
      setOrders(data.orders ?? []);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">Loading orders...</div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <p className="text-neutral-500">No orders yet.</p>
        <Link href="/" className="underline">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-5 shadow-sm bg-white">
            <div className="flex justify-between mb-3 text-sm text-gray-600">
              <span>Ordered on {new Date(order.created_at).toDateString()}</span>
              <span className="font-semibold">₹{(order.total / 100).toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.name}
                    {item.size ? ` (${item.size})` : ""} × {item.qty}
                  </span>
                  <span>₹{(item.price / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4 text-sm">
              <span>
                Payment: <strong className="capitalize">{order.payment?.status ?? order.status}</strong>
              </span>
              <span>
                Status: <strong className="capitalize">{order.status}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
