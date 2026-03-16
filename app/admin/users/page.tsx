async function getUsers() {
  const res = await fetch("http://localhost:3000/api/admin/users", {
    cache: "no-store",
  });
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Users</h2>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
