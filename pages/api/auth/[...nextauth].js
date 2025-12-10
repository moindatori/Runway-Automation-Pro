import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { sql } from "../../../lib/db";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // 1) USER KO BLOCK NA KARO – hamesha true return karo agar profile sahi ho
    async signIn({ profile }) {
      if (!profile || !profile.email || !profile.sub) {
        console.error("signIn: missing profile fields", profile);
        return false; // yahan sirf tab false hai jab Google profile hi galat ho
      }

      try {
        // user ko DB me upsert karne ki koshish
        await sql`
          INSERT INTO users (google_id, email, name, avatar_url)
          VALUES (${profile.sub}, ${profile.email}, ${profile.name || ""}, ${
          profile.picture || ""
        })
          ON CONFLICT (google_id) DO UPDATE
          SET email = EXCLUDED.email,
              name = EXCLUDED.name,
              avatar_url = EXCLUDED.avatar_url
        `;
      } catch (err) {
        // IMPORTANT:
        // agar yahan error aata hai (table missing, permission, etc.)
        // to ab hum user ko BLOCK nahi kar rahe, sirf log likh rahe hain
        console.error("signIn upsert user error (IGNORED)", err);
        // yahan pe return false MAT likho, warna wohi "Try signing in..." aayega
      }

      return true; // login allow
    },

    // 2) JWT callback – yahan se appUserId attach karte hain
    async jwt({ token, profile }) {
      try {
        // first login ke waqt profile available hoti hai
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

    // 3) Session callback – frontend/api ke liye appUserId expose
    async session({ session, token }) {
      if (token && token.appUserId) {
        session.appUserId = token.appUserId;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
