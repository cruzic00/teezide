import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "../../../lib/supabase/server";
import ProfileForm from "../../../components/ProfileForm";

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/profile/edit");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, phone, avatar_url, role, created_at")
    .eq("id", user.id)
    .single();

  const initialUser = {
    email: user.email ?? "",
    role: profile?.role ?? "user",
    username: profile?.name ?? "",
    phone: profile?.phone ?? "",
    profilePicture: profile?.avatar_url ?? "",
    createdAt: profile?.created_at ?? user.created_at ?? new Date().toISOString(),
  };

  return (
    <div className="py-8">
      <Link href="/profile" className="inline-flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-neutral-900 mb-6">
        <ChevronLeft size={16} /> Back to account
      </Link>
      <ProfileForm initialUser={initialUser} />
    </div>
  );
}
