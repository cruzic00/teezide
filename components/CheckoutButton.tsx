"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../lib/cart";
import { useAuth } from "../app/context/AuthContext";

// Online payment (Razorpay) is temporarily disabled — Cash on Delivery.
export default function CheckoutButton({
  className = "px-6 py-3 bg-[#623903] text-white rounded",
  label = "PROCEED TO BUY",
}: {
  className?: string;
  label?: string;
}) {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    landmark: "",
    district: "",
    state: "",
    pincode: "",
  });

  function openCheckout() {
    if (!user) {
      router.push("/login?redirect=/cart");
      return;
    }
    if (items.length === 0) return;
    setForm((f) => ({ ...f, name: f.name || user.name || "" }));
    setOpen(true);
  }

  function update(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total, shipping: form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to place order");
      clear();
      router.push("/checkout/success");
    } catch (e: any) {
      alert(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={openCheckout} disabled={loading} className={className}>
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4">
          <form
            onSubmit={placeOrder}
            className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#623903]">Delivery Details</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-neutral-400 hover:text-neutral-700 text-xl">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full Name" className="input-c" />
              <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone Number" className="input-c" />
            </div>
            <textarea required value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Address (house, street, area)" rows={2} className="input-c w-full" />
            <input value={form.landmark} onChange={(e) => update("landmark", e.target.value)} placeholder="Landmark (optional)" className="input-c w-full" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input required value={form.district} onChange={(e) => update("district", e.target.value)} placeholder="District" className="input-c" />
              <input required value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="State" className="input-c" />
              <input required value={form.pincode} onChange={(e) => update("pincode", e.target.value)} placeholder="Pincode" className="input-c" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#623903] text-white py-3 rounded-lg font-bold hover:bg-[#7a4a05] transition disabled:opacity-50"
            >
              {loading ? "Placing order…" : `Place Order · ₹${(total / 100).toFixed(0)} (COD)`}
            </button>

            <style jsx>{`
              .input-c {
                padding: 0.6rem 0.85rem;
                border: 1px solid #e5e7eb;
                border-radius: 0.6rem;
                outline: none;
              }
              .input-c:focus {
                border-color: #623903;
                box-shadow: 0 0 0 3px rgba(98, 57, 3, 0.12);
              }
            `}</style>
          </form>
        </div>
      )}
    </>
  );
}
