import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "../../../../lib/mongodb";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("tee_store");

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 🔑 SUPPORT BOTH PASSWORD FIELDS
    const hashedPassword =
      user.password || user.passwordHash;

    if (!hashedPassword) {
      console.error("User has no password field:", user.email);
      return NextResponse.json(
        { error: "Account misconfigured" },
        { status: 500 }
      );
    }

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ SET COOKIE
    cookies().set({
      name: "auth_user",
      value: user.email,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({
      success: true,
      role: user.role,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
