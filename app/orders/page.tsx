"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Order = {
  _id: string;
  items: {
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/orders")
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/login?redirect=/orders");
          return;
        }
        const data = await res.json();
        setOrders(data.orders);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No orders found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-5 shadow-sm bg-white"
          >
            <div className="flex justify-between mb-3 text-sm text-gray-600">
              <span>
                Ordered on{" "}
                {new Date(order.createdAt).toDateString()}
              </span>
              <span className="font-semibold">
                ₹{order.totalAmount}
              </span>
            </div>

            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{item.price}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4 text-sm">
              <span>
                Payment:{" "}
                <strong>{order.paymentStatus}</strong>
              </span>
              <span>
                Status:{" "}
                <strong>{order.orderStatus}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
