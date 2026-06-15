import { getAllOrders } from "../../../lib/admin-data";
import { PageHeader, Card, Badge, Th, EmptyState } from "../_components/AdminUI";

export default async function AdminPaymentsPage() {
  const orders = await getAllOrders();
  const payments = orders.filter((o: any) => o.payment?.provider);

  return (
    <div className="p-8 md:p-10">
      <PageHeader
        title="Payments"
        subtitle={`${payments.length} transaction${payments.length === 1 ? "" : "s"}`}
      />

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
                  <td className="px-6 py-4 font-bold text-neutral-900">
                    ₹{(p.total / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge value={p.payment?.provider} />
                  </td>
                  <td className="px-6 py-4">
                    <Badge value={p.payment?.status ?? p.status} />
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-neutral-500">
                    {p.payment?.razorpay_payment_id ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-neutral-500">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
