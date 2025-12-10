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

  // JWT based session (simple)
  session: {
    strategy: "jwt",
  },

  // IMPORTANT: cookie config taake extension se cross-site request pe session mile
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        secure: true,     // https zaroori
        sameSite: "none", // cross-site fetch allow (Runway -> backend)
        path: "/",
      },
    },
  },

  useSecureCookies: process.env.NODE_ENV === "production",
};

export default NextAuth(authOptions);
