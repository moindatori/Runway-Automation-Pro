// pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // Simple JWT session – user ka email hum token me rakhte hain
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account, user }) {
      // First login ke waqt user ki info token me daal do
      if (account && user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      // Frontend / APIs ke liye session.user me email waghaira bhejo
      if (token?.email) {
        session.user = session.user || {};
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // External / random domain par kabhi mat bhejna
      if (!url.startsWith(baseUrl)) {
        return baseUrl;
      }

      // Agar admin panel se login hua hai (callbackUrl = /admin)
      if (url.includes("/admin")) {
        return url;
      }

      // Agar user payment page se login hua hai
      if (url.includes("/user/payments")) {
        return url;
      }

      // Baaki sab (extension ka /api/auth/signin, normal login, etc.)
      // ko safe extension-complete page par bhej do
      return baseUrl + "/auth/extension-done";
    },
  },

  // YAHAN se main cookie ko cross-site compatible bana raha hoon
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        secure: true,     // https zaroori
        sameSite: "none", // IMPORTANT: Runway (app.runwayml.com) se request aye to bhi cookie bheje
        path: "/",
      },
    },
  },

  useSecureCookies: process.env.NODE_ENV === "production",
};

export default NextAuth(authOptions);
