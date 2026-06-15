// lib/admin-utils.ts
import { getCurrentUser, type CurrentUser } from "./auth";

type AdminResult =
  | { ok: true; user: CurrentUser }
  | { ok: false; code: number; message: string };

export async function requireAdmin(): Promise<AdminResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, code: 401, message: "Not authenticated" };
  if (user.role !== "admin") {
    return { ok: false, code: 403, message: "Admin access required" };
  }
  return { ok: true, user };
}
