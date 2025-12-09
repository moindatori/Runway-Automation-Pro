import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { sql } from "../../../lib/db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ profile }) {
      if (!profile || !profile.email || !profile.sub) return false;

      try {
        await sql`
          INSERT INTO users (google_id, email, name, avatar_url)
          VALUES (${profile.sub}, ${profile.email}, ${profile.name || ""}, ${profile.picture || ""})
          ON CONFLICT (google_id) DO UPDATE
          SET email = EXCLUDED.email,
              name = EXCLUDED.name,
              avatar_url = EXCLUDED.avatar_url
        `;
      } catch (err) {
        console.error("signIn upsert user error", err);
        return false;
      }
      return true;
    },
    async jwt({ token, profile }) {
      try {
        if (profile && profile.sub) {
          const rows = await sql`
            SELECT id FROM users WHERE google_id = ${profile.sub}
          `;
          if (rows && rows.length > 0) {
            token.appUserId = rows[0].id;
          }
        }
      } catch (err) {
        console.error("jwt callback error", err);
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token.appUserId) {
        session.appUserId = token.appUserId;
      }
      return session;
    }
  }
};

export default NextAuth(authOptions);
