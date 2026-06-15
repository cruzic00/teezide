"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteUserButton({ id, email }: { id: string; email: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm(`Delete ${email}? This permanently removes the account and cannot be undone.`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      alert(data.error || "Failed to delete user");
      return;
    }
    router.refresh();
  }

  return (
    <button
      onClick={remove}
      disabled={busy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-50"
    >
      {busy ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
      Delete
    </button>
  );
}
