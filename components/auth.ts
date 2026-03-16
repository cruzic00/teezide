// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// ...other providers if you use them

export const authOptions: NextAuthOptions = {
  // example provider - replace with your provider(s)
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // implement lookup using your users collection
        // return user object or null
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id ?? (user as any)._id;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).user = { ...(session.user || {}), id: token.id };
      return session;
    },
  },
  // add secret:
  secret: process.env.NEXTAUTH_SECRET,
};
