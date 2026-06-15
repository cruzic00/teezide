import "../styles/globals.css";
import React from "react";
import Providers from "./providers";
import LayoutShell from "../components/LayoutShell";

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
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
