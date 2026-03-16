import { cookies } from "next/headers";
import clientPromise from "./mongodb";

export async function getUser() {
  const email = cookies().get("userEmail")?.value;
  if (!email) return null;

  const client = await clientPromise;
  const db = client.db("tee_store");

  const user = await db
    .collection("users")
    .findOne(
      { email },
      { projection: { password: 0 } }
    );

  return user;
}
