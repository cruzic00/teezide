import { IndianRupee, Receipt, Clock, CheckCircle2 } from "lucide-react";
import { getAllOrders } from "../../../lib/admin-data";
import { PageHeader, Card, Badge, Th, EmptyState } from "../_components/AdminUI";

export default async function AdminPaymentsPage() {
  const orders = await getAllOrders();
  const payments = orders.filter((o: any) => o.payment?.provider);

  const total = payments.reduce((s: number, p: any) => s + (p.total || 0), 0);
  const paid = payments.filter((p: any) => (p.payment?.status || p.status) === "paid");
  const collected = paid.reduce((s: number, p: any) => s + (p.total || 0), 0);
  const pending = payments.length - paid.length;

  const stats = [
    { label: "Total Value", value: `₹${(total / 100).toLocaleString()}`, icon: IndianRupee, tint: "bg-neutral-900 text-white" },
    { label: "Collected", value: `₹${(collected / 100).toLocaleString()}`, icon: CheckCircle2, tint: "bg-emerald-50 text-emerald-700" },
    { label: "Transactions", value: payments.length, icon: Receipt, tint: "bg-blue-50 text-blue-700" },
    { label: "Pending", value: pending, icon: Clock, tint: "bg-amber-50 text-amber-700" },
  ];

  return (
    <div className="p-8 md:p-10">
      <PageHeader title="Payments" subtitle={`${payments.length} transaction${payments.length === 1 ? "" : "s"}`} />

      {/* SUMMARY */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-neutral-200/70 shadow-sm p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.tint}`}>
              <s.icon size={20} />
            </div>
            <p className="text-2xl font-extrabold text-neutral-900">{s.value}</p>
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        {payments.length === 0 ? (
          <EmptyState text="No payments found." />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-neutral-50/80 text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-100">
              <tr>
                <Th>Customer</Th>
                <Th>Amount</Th>
                <Th>Method</Th>
                <Th>Status</Th>
                <Th>Transaction</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {payments.map((p: any) => (
                <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900">{p.userEmail}</td>
                  <td className="px-6 py-4 font-bold text-neutral-900">₹{(p.total / 100).toFixed(2)}</td>
                  <td className="px-6 py-4 uppercase text-xs font-semibold text-neutral-600">{p.payment?.provider}</td>
                  <td className="px-6 py-4">
                    <Badge value={p.payment?.status ?? p.status} />
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-neutral-500">{p.payment?.razorpay_payment_id ?? "—"}</td>
                  <td className="px-6 py-4 text-neutral-500">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
