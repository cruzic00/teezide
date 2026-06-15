"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../lib/cart";
import { useAuth } from "../app/context/AuthContext";

// NOTE: Online payment (Razorpay) is temporarily disabled. Orders are placed
// directly as Cash on Delivery. The Razorpay routes are still in the codebase
// (app/api/checkout/*) and can be re-enabled later.
export default function CheckoutButton({
  className = "px-6 py-3 bg-black text-white rounded",
  label = "PROCEED TO BUY",
}: {
  className?: string;
  label?: string;
}) {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function placeOrder() {
    if (!user) {
      router.push("/login?redirect=/cart");
      return;
    }
    if (items.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to place order");

      clear();
      alert("✅ Order placed successfully!");
      router.push("/checkout/success");
    } catch (e: any) {
      alert(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={placeOrder} disabled={loading} className={className}>
      {loading ? "Placing order..." : label}
    </button>
  );
}
