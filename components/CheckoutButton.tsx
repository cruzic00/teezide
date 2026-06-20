"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Check } from "lucide-react";
import { useCart } from "../lib/cart";
import { useAuth } from "../app/context/AuthContext";

type Address = {
  name: string;
  phone: string;
  address: string;
  landmark: string;
  district: string;
  state: string;
  pincode: string;
};

const EMPTY: Address = {
  name: "",
  phone: "",
  address: "",
  landmark: "",
  district: "",
  state: "",
  pincode: "",
};

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
  const [view, setView] = useState<"select" | "form">("form");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<Address[]>([]);
  const [form, setForm] = useState<Address>(EMPTY);

  const addrKey = () => `mello:addresses:${user?.email || "guest"}`;

  function loadSaved(): Address[] {
    try {
      const raw = localStorage.getItem(addrKey());
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function persist(addr: Address) {
    try {
      const list = loadSaved();
      const dup = list.findIndex((a) => JSON.stringify(a) === JSON.stringify(addr));
      const next = dup >= 0 ? list : [addr, ...list].slice(0, 5);
      localStorage.setItem(addrKey(), JSON.stringify(next));
    } catch {}
  }

  function openCheckout() {
    if (!user) {
      router.push("/login?redirect=/cart");
      return;
    }
    if (items.length === 0) return;
    const list = loadSaved();
    setSaved(list);
    if (list.length > 0) {
      setView("select");
    } else {
      setForm({ ...EMPTY, name: user.name || "" });
      setView("form");
    }
    setOpen(true);
  }

  function update(k: keyof Address, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submitOrder(shipping: Address) {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total, shipping }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to place order");
      persist(shipping);
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
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#623903]">
                {view === "select" ? "Choose Delivery Address" : "Delivery Details"}
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-xl"
              >
                ✕
              </button>
            </div>

            {/* SELECT saved address */}
            {view === "select" && (
              <div className="space-y-3">
                {saved.map((a, i) => (
                  <div
                    key={i}
                    className="border border-neutral-200 rounded-xl p-4 hover:border-[#623903] transition"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-[#7a4a05] mt-0.5 shrink-0" />
                      <div className="text-sm flex-1 min-w-0">
                        <p className="font-bold text-[#623903]">
                          {a.name} · {a.phone}
                        </p>
                        <p className="text-neutral-600 mt-0.5">
                          {a.address}
                          {a.landmark ? `, ${a.landmark}` : ""}
                        </p>
                        <p className="text-neutral-600">
                          {a.district}, {a.state} - {a.pincode}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => submitOrder(a)}
                      disabled={loading}
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-[#623903] text-white py-2.5 rounded-lg font-bold hover:bg-[#7a4a05] transition disabled:opacity-50"
                    >
                      <Check size={16} />
                      {loading ? "Placing order…" : `Deliver here · ₹${(total / 100).toFixed(0)} (COD)`}
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => {
                    setForm({ ...EMPTY, name: user?.name || "" });
                    setView("form");
                  }}
                  className="w-full flex items-center justify-center gap-2 border border-dashed border-neutral-300 text-[#623903] py-3 rounded-xl font-bold hover:bg-neutral-50 transition"
                >
                  <Plus size={16} /> Add New Address
                </button>
              </div>
            )}

            {/* FORM new address */}
            {view === "form" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitOrder(form);
                }}
                className="space-y-4"
              >
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

                {saved.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setView("select")}
                    className="w-full text-sm text-neutral-500 hover:text-[#623903] transition"
                  >
                    ← Back to saved addresses
                  </button>
                )}

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
            )}
          </div>
        </div>
      )}
    </>
  );
}
