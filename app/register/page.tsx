"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useAuth } from "../context/AuthContext";



function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { user } = useAuth();

  // Redirect if already logged in
  // Redirect if already logged in
  // Use useEffect to handle redirection to avoid client-side exceptions during render
  useEffect(() => {
    if (user) {
      router.replace(redirect);
    }
  }, [user, router, redirect]);

  if (user) {
    return null;
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }

    // After successful register → login page
    router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600">
      <form
        onSubmit={handleRegister}
        className="bg-white rounded-xl p-8 w-[360px] space-y-4 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center">Create Account</h2>

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={() =>
            signIn("google", { callbackUrl: redirect })
          }
          className="w-full border py-2 rounded font-semibold hover:bg-gray-50"
        >
          Continue with Google
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a
            href={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="font-semibold underline"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
