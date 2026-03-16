async function getPayments() {
  const res = await fetch("http://localhost:3000/api/admin/payments", {
    cache: "no-store",
  });
  return res.json();
}

export default async function AdminPaymentsPage() {
  const payments = await getPayments();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Payments</h1>

      {payments.length === 0 && (
        <p className="text-gray-500">No payments found</p>
      )}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">User</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Method</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Transaction</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p: any) => (
            <tr key={p._id}>
              <td className="border p-2">{p.userEmail}</td>
              <td className="border p-2">₹{p.amount}</td>
              <td className="border p-2">{p.method}</td>
              <td className="border p-2 capitalize">{p.status}</td>
              <td className="border p-2">{p.transactionId}</td>
              <td className="border p-2">
                {new Date(p.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
