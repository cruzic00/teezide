import { getAllUsers } from "../../../lib/admin-data";
import { PageHeader, Card, Badge, Th } from "../_components/AdminUI";
import DeleteUserButton from "./DeleteUserButton";

export default async function UsersPage() {
  const users = await getAllUsers();

  return (
    <div className="p-8 md:p-10">
      <PageHeader
        title="Users"
        subtitle={`${users.length} registered ${users.length === 1 ? "user" : "users"}`}
      />

      <Card>
        <table className="w-full text-sm">
          <thead className="bg-neutral-50/80 text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-100">
            <tr>
              <Th>User</Th>
              <Th>Role</Th>
              <Th>Joined</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {users.map((u: any) => (
              <tr key={u.id} className="hover:bg-neutral-50/60 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {(u.name || u.email || "?")[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-900 truncate">{u.name || "—"}</p>
                      <p className="text-neutral-500 text-xs truncate">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge value={u.role} />
                </td>
                <td className="px-6 py-4 text-neutral-500">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <DeleteUserButton id={u.id} email={u.email} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
