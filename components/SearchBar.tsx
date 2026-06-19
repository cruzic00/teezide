"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ className = "" }: { className?: string }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/products?query=${encodeURIComponent(term)}`);
  };

  return (
    <form onSubmit={onSubmit} className={`flex items-center gap-2 ${className}`}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search T-shirts…"
        className="w-full rounded-xl bg-[#623903]/70 border border-neutral-700 px-4 py-2 outline-none
                   focus:border-neutral-400"
        aria-label="Search products"
      />
      <button
        type="submit"
        className="rounded-xl bg-white text-[#623903] font-semibold px-4 py-2
                   transition-transform duration-150 hover:scale-105 active:scale-95"
      >
        Search
      </button>
    </form>
  );
}
