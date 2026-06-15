"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3 text-neutral-500">
        <svg className="animate-spin h-7 w-7 text-neutral-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span className="font-medium">Redirecting…</span>
      </div>
    );
  }

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
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl">
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
