// components/AddToCartButton.tsx
"use client";
import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function AddToCartButton({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [busy, setBusy] = useState(false);

  async function onAdd() {
    if (!session) {
      // redirect to sign-in (credentials provider or modal)
      signIn("credentials", { callbackUrl: window.location.href });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, qty: 1 })
      });
      if (!res.ok) {
        const err = await res.json();
        alert("Add to cart failed: " + (err?.error || res.status));
      } else {
        // success
        alert("Added to cart");
      }
    } catch (e) {
      alert("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button onClick={onAdd} disabled={busy} className="px-4 py-2 bg-yellow-500 rounded">
      {busy ? "..." : "Add to cart"}
    </button>
  );
}
