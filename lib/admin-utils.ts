// lib/admin-utils.ts
import { getCurrentUser } from "./auth";
import clientPromise from "./mongodb";

export async function requireAdmin(session?: any) {
  // session can be passed in
  let user = session?.user;
  if (!user) {
    user = await getCurrentUser();
  }

  if (!user) return { ok: false, code: 401, message: "Not authenticated" };
  const roles = user.roles ?? user.role ?? [];
  const isAdmin = Array.isArray(roles) ? roles.includes("admin") : roles === "admin";
  if (!isAdmin) {
    return { ok: false, code: 403, message: "Admin access required" };
  }
  return { ok: true, session: { user } };
}

// helper to get DB client and db
export async function getDb() {
  const client = await clientPromise;
  const db = client.db(); // uses DB from connection string
  return { client, db };
}
