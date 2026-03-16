import { cookies } from "next/headers";
import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

export async function getCurrentUser() {
  const cookie = cookies().get("auth_user");
  if (!cookie) return null;

  const client = await clientPromise;
  const db = client.db("tee_store");

  return db.collection("users").findOne({
    email: cookie.value,
  });
}
