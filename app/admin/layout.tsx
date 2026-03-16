import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import clientPromise from "../../lib/mongodb";
import Sidebar from "./_components/Sidebar"; // Client component we will create

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();
    const authCookie = cookieStore.get("auth_user");
    const email = authCookie?.value;

    if (!email) {
        redirect("/login?redirect=/admin");
    }

    const client = await clientPromise;
    const db = client.db("tee_store");

    const user = await db.collection("users").findOne(
        { email },
        { projection: { role: 1, username: 1, email: 1, profilePicture: 1 } }
    );

    if (!user || user.role !== "admin") {
        redirect("/");
    }

    // Pass necessary user data to sidebar
    const adminUser = {
        username: user.username || "Admin",
        email: user.email,
        profilePicture: user.profilePicture || "",
    }

    return (
        <div className="min-h-screen bg-neutral-100 flex font-sans text-neutral-900">
            {/* Sidebar - Desktop */}
            <aside className="w-72 bg-neutral-900 text-white flex-col hidden md:flex shadow-2xl z-20 sticky top-0 h-screen">
                <Sidebar user={adminUser} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
