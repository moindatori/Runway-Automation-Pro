// pages/index.js

import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // Admin emails .env me rakho, jaise:
  // ADMIN_EMAILS="youradmin@gmail.com,anotheradmin@gmail.com"
  const rawAdmins = process.env.ADMIN_EMAILS || "";
  const adminEmails = rawAdmins
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const isAdmin =
    !!session?.user?.email && adminEmails.includes(session.user.email);

  // Session ko serializable bana dete hain (sirf basic fields)
  const safeSession = session
    ? {
        user: {
          name: session.user?.name || null,
          email: session.user?.email || null,
        },
      }
    : null;

  return {
    props: {
      session: safeSession,
      isAdmin,
    },
  };
}

export default function Home({ session, isAdmin }) {
  const loggedIn = !!session;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-slate-900/70 border border-slate-700/70 rounded-2xl shadow-2xl p-8 backdrop-blur">
        {/* Branding / Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Runway Prompt Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Secure access for the Chrome extension. Sign in with Google and then
            use the extension directly on RunwayML.
          </p>
        </div>

        {/* If NOT logged in: show simple login card */}
        {!loggedIn && (
          <div className="space-y-5">
            <p className="text-sm text-slate-300">
              Please sign in with your Google account to link your subscription
              and device with the Runway automation extension.
            </p>

            <a
              href="/api/auth/signin"
              className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 bg-white text-slate-900 text-sm font-medium shadow hover:bg-slate-100 transition"
            >
              <span>Continue with Google</span>
            </a>

            <div className="text-xs text-slate-500 border-t border-slate-800 pt-4">
              <p>
                After sign in, open the Chrome extension on{" "}
                <span className="font-mono text-slate-300">
                  app.runwayml.com
                </span>{" "}
                and use the floating panel to manage your subscription.
              </p>
            </div>
          </div>
        )}

        {/* If logged in: simple welcome + instructions */}
        {loggedIn && (
          <div className="space-y-5">
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
              <p className="text-sm font-medium text-emerald-300">
                You are signed in
              </p>
              <p className="text-xs text-emerald-100 mt-1">
                {session.user?.name
                  ? `${session.user.name} (${session.user.email})`
                  : session.user?.email}
              </p>
            </div>

            <div className="space-y-2 text-sm text-slate-300">
              <p>
                Your account is now connected. You can close this page and use
                the Chrome extension directly on RunwayML.
              </p>
              <ul className="list-disc list-inside text-slate-400 text-xs space-y-1">
                <li>Open RunwayML: app.runwayml.com</li>
                <li>Click the floating icon of Runway Prompt Studio</li>
                <li>
                  The extension will check your subscription and show payment or
                  automation options inside the panel
                </li>
              </ul>
            </div>

            {isAdmin && (
              <div className="mt-4 border-t border-slate-800 pt-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                  Admin tools
                </p>
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100"
                >
                  Open admin dashboard
                </Link>
              </div>
            )}

            <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-3">
              <p>
                For support or subscription issues, contact the developer of
                Runway Prompt Studio.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
