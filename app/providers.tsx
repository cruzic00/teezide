"use client";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "../lib/cart";
import { ToastProvider } from "../components/ToastProvider";
import SmoothScroll from "../components/SmoothScroll";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </SmoothScroll>
  );
}
