import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import clientPromise from "../../lib/mongodb";
import ProfileForm from "../../components/ProfileForm";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get("auth_user");
  const email = authCookie?.value;

  if (!email) {
    redirect("/login?redirect=/profile");
  }

  const client = await clientPromise;
  const db = client.db("tee_store");

  const userDoc = await db.collection("users").findOne(
    { email },
    { projection: { password: 0 } }
  );

  if (!userDoc) {
    // If cookie exists but user doesn't in DB, clear cookie and redirect
    redirect("/logout");
  }

  // Serializable user object
  const user = {
    email: userDoc.email,
    role: userDoc.role,
    username: userDoc.username,
    phone: userDoc.phone,
    bio: userDoc.bio,
    profilePicture: userDoc.profilePicture,
    createdAt: userDoc.createdAt ? new Date(userDoc.createdAt).toISOString() : new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-white border border-bla relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-white rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-white rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <ProfileForm initialUser={user} />
      </div>
    </div>
  );
}
