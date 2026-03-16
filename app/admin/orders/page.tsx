async function getOrders() {
  const res = await fetch("http://localhost:3000/api/admin/orders", {
    cache: "no-store",
  });
  return res.json();
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {orders.length === 0 && (
        <p className="text-gray-500">No orders yet</p>
      )}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">User</th>
            <th className="border p-2">Items</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order: any) => (
            <tr key={order._id}>
              <td className="border p-2">{order.userEmail}</td>

              <td className="border p-2">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx}>
                    {item.name} ({item.size}) × {item.qty}
                  </div>
                ))}
              </td>

              <td className="border p-2">₹{order.total}</td>

              <td className="border p-2 capitalize">
                {order.status}
              </td>

              <td className="border p-2">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
