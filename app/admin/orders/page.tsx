import { getAllOrders } from "../../../lib/admin-data";
import { PageHeader, Card, Badge, Th, EmptyState } from "../_components/AdminUI";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="p-8 md:p-10">
      <PageHeader title="Orders" subtitle={`${orders.length} total`} />

      <Card>
        {orders.length === 0 ? (
          <EmptyState text="No orders yet." />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-neutral-50/80 text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-100">
              <tr>
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th>Items</Th>
                <Th>Total</Th>
                <Th>Status</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((o: any) => {
                const count = (o.items ?? []).reduce(
                  (s: number, i: any) => s + (i.qty || 0),
                  0
                );
                return (
                  <tr key={o.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-neutral-500">
                      #{String(o.id).slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-900">{o.userEmail}</td>
                    <td className="px-6 py-4 text-neutral-600">{count} item(s)</td>
                    <td className="px-6 py-4 font-bold text-neutral-900">
                      ₹{(o.total / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge value={o.status} />
                    </td>
                    <td className="px-6 py-4 text-neutral-500">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
