"use client";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "../lib/cart";
import { ToastProvider } from "../components/ToastProvider";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
