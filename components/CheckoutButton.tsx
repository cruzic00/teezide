"use client";
import React from "react";

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number; // paisa
  size?: string;
  qty: number;
};

export default function CheckoutButton({ items }: { items: CartItem[] }) {
  async function startCheckout() {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: "unknown" }));
        throw new Error(errBody?.error || `Status ${res.status}`);
      }

      const data = await res.json();
      if (data?.url) {
        // browser redirect to stripe checkout
        window.location.href = data.url;
        return;
      }
      throw new Error("No session url returned");
    } catch (err: any) {
      console.error("Checkout failed:", err);
      // show friendly error to user
      alert("Checkout failed: " + (err?.message ?? err));
    }
  }

  return (
    <button
      onClick={startCheckout}
      className="px-4 py-2 rounded bg-black text-white hover:opacity-90"
    >
      Checkout
    </button>
  );
}
