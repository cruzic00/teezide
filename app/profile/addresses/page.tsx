"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, MapPin, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

type Address = {
  name: string;
  phone: string;
  address: string;
  landmark: string;
  district: string;
  state: string;
  pincode: string;
};

export default function AddressesPage() {
  const { user } = useAuth();
  const [list, setList] = useState<Address[]>([]);

  const key = () => `mello:addresses:${user?.email || "guest"}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key());
      setList(raw ? JSON.parse(raw) : []);
    } catch {
      setList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function remove(i: number) {
    const next = list.filter((_, idx) => idx !== i);
    setList(next);
    try {
      localStorage.setItem(key(), JSON.stringify(next));
    } catch {}
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link href="/profile" className="inline-flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-[#623903] mb-6">
        <ChevronLeft size={16} /> Back to account
      </Link>
      <h1 className="text-3xl font-bold text-[#623903] mb-2">My Addresses</h1>
      <p className="text-neutral-500 mb-8">Your saved delivery addresses.</p>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-3xl border border-neutral-200/70 shadow-sm">
          <div className="p-5 rounded-full bg-neutral-100 text-[#7a4a05] mb-5">
            <MapPin size={28} />
          </div>
          <p className="text-lg font-bold text-[#623903]">No saved addresses</p>
          <p className="text-neutral-500 text-sm mt-1">
            Addresses you use at checkout are saved here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((a, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-white rounded-2xl border border-neutral-200/70 shadow-sm p-5"
            >
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
              <button
                onClick={() => remove(i)}
                className="text-neutral-400 hover:text-red-500 transition p-1.5 rounded hover:bg-red-50 shrink-0"
                aria-label="Remove address"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
