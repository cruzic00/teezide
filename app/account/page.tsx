import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export default async function AccountOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/account");

  const { data: orders } = await supabase
    .from("orders")
    .select("id, items, total, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">My Orders</h1>
      <div className="mt-3 space-y-3">
        {!orders || orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map((o: any) => (
            <div key={o.id} className="p-3 border rounded">
              <div>Order: {o.id}</div>
              <div>Items: {Array.isArray(o.items) ? o.items.length : 0}</div>
              <div>Total: ₹{(o.total / 100).toFixed(2)}</div>
              <div className="capitalize">Status: {o.status}</div>
              <div>Date: {new Date(o.created_at).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
