// lib/auth.ts
// Returns the currently authenticated user (with profile role) or null.
// Backed by Supabase Auth — the session lives in secure http-only cookies,
// not a forgeable email cookie.
import { createClient } from "./supabase/server";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? "",
    name: profile?.name ?? (user.user_metadata?.name as string) ?? "",
    role: profile?.role ?? "user",
  };
}
