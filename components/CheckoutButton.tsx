"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../lib/cart";
import { useAuth } from "../app/context/AuthContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

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

  async function startCheckout() {
    if (!user) {
      router.push("/login?redirect=/cart");
      return;
    }
    if (items.length === 0) return;

    setLoading(true);
    try {
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Failed to load payment SDK. Check your connection.");

      const res = await fetch("/api/checkout/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Checkout failed");

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        name: "Teezide",
        description: `${items.length} item(s)`,
        order_id: data.orderId,
        prefill: { name: user.name, email: user.email },
        theme: { color: "#000000" },
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, items, total }),
          });
          if (verifyRes.ok) {
            clear();
            router.push("/checkout/success");
          } else {
            router.push("/checkout/cancel");
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.on("payment.failed", () => {
        setLoading(false);
        router.push("/checkout/cancel");
      });

      rzp.open();
    } catch (e: any) {
      alert(e?.message || "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <button onClick={startCheckout} disabled={loading} className={className}>
      {loading ? "Processing..." : label}
    </button>
  );
}
