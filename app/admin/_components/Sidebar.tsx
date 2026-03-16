"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, Package, LogOut, Settings, ClipboardList } from "lucide-react";

export default function Sidebar({ user }: { user: any }) {
    const pathname = usePathname();

    const links = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
        { name: "Products", href: "/admin/stocks", icon: Package },
        { name: "Stock Management", href: "/admin/stocks", icon: ClipboardList },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-8 border-b border-neutral-800">
                <h1 className="text-3xl font-black tracking-tighter text-white">
                    TEE<span className="text-yellow-400">STORE</span> ADMIN
                </h1>
            </div>

            {/* Nav */}
            <div className="flex-1 py-6 px-4 space-y-2">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-4 px-6 py-4 rounded-xl text-base font-medium transition-all ${isActive
                                ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                                }`}
                        >
                            <link.icon size={24} />
                            {link.name}
                        </Link>
                    );
                })}
            </div>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-neutral-800">
                <div className="bg-neutral-800 rounded-xl p-4 flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-700 overflow-hidden">
                        {user.profilePicture ? (
                            <img src={user.profilePicture} alt="Admin" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-yellow-500 flex items-center justify-center font-bold text-black">{user.username[0]}</div>
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-white font-bold text-sm truncate">{user.username}</p>
                        <p className="text-neutral-400 text-xs truncate">{user.email}</p>
                    </div>
                </div>
                <button
                    onClick={async () => {
                        await fetch("/api/auth/logout", { method: "POST" });
                        window.location.href = "/login";
                    }}
                    className="flex items-center gap-2 justify-center w-full py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg text-sm font-semibold transition"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </div>
    );
}
