import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import ProfileForm from "../../components/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/profile");
  }

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
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-white rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-white rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <ProfileForm initialUser={initialUser} />
      </div>
    </div>
  );
}
