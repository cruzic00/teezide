"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteOrderButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function del() {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) router.refresh();
    else alert("Failed to delete order");
  }

  return (
    <button
      onClick={del}
      disabled={loading}
      className="text-neutral-400 hover:text-red-500 transition p-1.5 rounded hover:bg-red-50 disabled:opacity-50"
      aria-label="Delete order"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}
