"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 text-sm font-bold text-[#623903] hover:bg-neutral-50 transition"
    >
      <Printer size={16} /> Print
    </button>
  );
}
