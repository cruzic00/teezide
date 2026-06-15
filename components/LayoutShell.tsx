"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MarqueeBanner from "./MarqueeBanner";

// Renders the customer-site chrome (marquee, navbar, footer, constrained main)
// for normal pages, but nothing for /admin — the admin panel has its own layout.
export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <MarqueeBanner />
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <Footer />
    </>
  );
}
