import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createAdminClient } from "../../../../lib/supabase/admin";
import { listUserEmails } from "../../../../lib/admin-data";
import { Card } from "../../_components/AdminUI";
import OrderManager from "./OrderManager";

export default async function AdminOrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data: order } = await admin.from("orders").select("*").eq("id", id).single();
  if (!order) notFound();

  let email = "Guest";
  if (order.user_id) {
    const emails = await listUserEmails();
    email = emails.get(order.user_id) ?? "—";
  }

  return (
    <div className="p-8 md:p-10 max-w-4xl">
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-[#623903] mb-6">
        <ChevronLeft size={16} /> Back to orders
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#623903]">Order #{String(order.id).slice(0, 8)}</h1>
          <p className="text-neutral-500 text-sm mt-1">
            {email} · {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <p className="text-2xl font-black text-[#623903]">₹{(order.total / 100).toFixed(2)}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items */}
        <Card className="md:col-span-2">
          <div className="p-6 space-y-4">
            <h2 className="font-bold text-[#623903]">Items</h2>
            {(order.items ?? []).map((it: any, i: number) => (
              <div key={i} className="flex items-center gap-4 border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.image || "/placeholder.png"}
                  alt={it.name}
                  className="w-16 h-16 rounded-lg object-cover border border-neutral-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#623903] truncate">{it.name}</p>
                  <p className="text-sm text-neutral-500">
                    {it.size ? `Size ${it.size} · ` : ""}Qty {it.qty}
                  </p>
                </div>
                <p className="font-bold text-[#623903]">₹{((it.price * it.qty) / 100).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Manager */}
        <OrderManager
          id={order.id}
          status={order.status}
          tracking={order.shipping?.tracking ?? ""}
          payment={order.payment}
        />
      </div>
    </div>
  );
}
