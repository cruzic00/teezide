"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../../lib/cart";

export default function CartPage() {
  const { items, total, removeItem, updateQty, clear } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const hasItems = items.length > 0;

  const checkout = async () => {
    // 🔐 AUTH GUARD
    if (!user) {
      router.push("/login?redirect=/cart");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Checkout failed");

      window.location.href = data.url;
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid gap-6">
      <h2 className="text-4xl font-bold">Your Cart</h2>

      {!hasItems && (
        <div className="text-center grid gap-4">
          <p className="text-neutral-400">Your cart is empty</p>
          <Link href="/" className="underline">
            Go shopping
          </Link>
        </div>
      )}

      {hasItems && (
        <>
          <ul className="grid gap-3">
            {items.map((it) => (
              <li key={`${it.id}-${it.size}`} className="flex gap-4">
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-16 h-16 rounded object-cover"
                />

                <div>
                  <div className="font-bold">{it.name}</div>
                  <div>Size: {it.size}</div>
                  <div>₹{(it.price / 100).toFixed(2)}</div>
                </div>

                <div className="ml-auto flex gap-2 items-center">
                  <button onClick={() => updateQty(it.id, it.size, it.qty - 1)}>
                    -
                  </button>
                  <span>{it.qty}</span>
                  <button onClick={() => updateQty(it.id, it.size, it.qty + 1)}>
                    +
                  </button>

                  <button onClick={() => removeItem(it.id, it.size)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center">
            <div className="font-bold">
              Total: ₹{(total / 100).toFixed(2)}
            </div>

            <button
              onClick={checkout}
              disabled={loading}
              className="px-6 py-3 bg-black text-white rounded"
            >
              {loading ? "Redirecting..." : "PROCEED TO BUY"}
            </button>
          </div>

          <button
            onClick={clear}
            className="text-sm underline text-right"
          >
            Clear cart
          </button>
        </>
      )}
    </section>
  );
}
