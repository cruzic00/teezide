import "../styles/globals.css";
import React from "react";
import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import MarqueeBanner from "../components/MarqueeBanner";
import Providers from "./providers";

export const metadata = {
  title: "Teezide",
  description: "Customize your T-shirt with your designs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-secondary text-primary antialiased font-sans">
        <Providers>



          <MarqueeBanner />
          <Navbar />


          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
