import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import Sidebar from "./_components/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  const adminUser = {
    username: profile.name || "Admin",
    email: user.email ?? "",
    profilePicture: profile.avatar_url || "",
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex font-sans text-neutral-900">
      <aside className="w-72 bg-neutral-900 text-white flex-col hidden md:flex shadow-2xl z-20 sticky top-0 h-screen">
        <Sidebar user={adminUser} />
      </aside>

      <main className="flex-1 relative overflow-y-auto">{children}</main>
    </div>
  );
}
