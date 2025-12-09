import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { sql } from "../../../lib/db";

// yeh sab ENV se aa rahe hain (tum already Vercel / .env me set kar chuke ho)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
    })
  ],
  secret: NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  callbacks: {
    // 1) SIGN IN CALLBACK
    async signIn({ profile }) {
      // basic check
      if (!profile || !profile.email || !profile.sub) {
        console.error("signIn: missing profile fields", profile);
        return false;
      }

      try {
        // user ko users table me upsert
        await sql`
          INSERT INTO users (google_id, email, name, avatar_url)
          VALUES (${profile.sub}, ${profile.email}, ${profile.name || ""}, ${profile.picture || ""})
          ON CONFLICT (google_id) DO UPDATE
          SET email = EXCLUDED.email,
              name = EXCLUDED.name,
              avatar_url = EXCLUDED.avatar_url
        `;
      } catch (err) {
        // yahan pe signIn ko FAIL na karao, sirf log karo
        console.error("signIn upsert user error", err);
        // IMPORTANT:
        // pehle yahan return false tha, isi se "Try signing in with a different account."
        // aa raha tha. Ab hum user ko allow kar rahe hain.
      }

      return true; // hamesha allow (agar profile theek hai)
    },

    // 2) JWT CALLBACK – yahan se appUserId lagta hai
    async jwt({ token, profile }) {
      try {
        // first time login pe profile available hota hai
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

    // 3) SESSION CALLBACK – frontend / APIs ke liye appUserId expose
    async session({ session, token }) {
      if (token && token.appUserId) {
        session.appUserId = token.appUserId;
      }
      return session;
    }
  }
};

export default NextAuth(authOptions);
