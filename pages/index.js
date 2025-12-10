// pages/index.js

import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  let safeSession = null;
  if (session?.user) {
    safeSession = {
      user: {
        name: session.user.name || null,
        email: session.user.email || null,
      },
    };
  }

  return {
    props: {
      session: safeSession,
    },
  };
}

export default function Home({ session }) {
  const isLoggedIn = !!session;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/80 px-6 py-7 shadow-[0_25px_80px_rgba(15,23,42,0.9)]">
        {/* Logo / Title */}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Runway Prompt Studio
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">
            Chrome extension access portal
          </h1>
        </div>

        {/* Info text */}
        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          This website is used only for{" "}
          <span className="font-medium text-slate-200">
            Google login, subscription and payment verification
          </span>{" "}
          for the Runway Prompt Studio Chrome extension.
          All tools and automation run inside the extension on{" "}
          <span className="font-mono">app.runwayml.com</span>.
        </p>

        {/* Session state */}
        {isLoggedIn ? (
          <div className="mb-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 px-4 py-3 text-xs flex justify-between items-start gap-3">
            <div>
              <p className="text-emerald-300 font-medium mb-1">
                You are signed in
              </p>
              <p className="text-slate-300">
                {session.user?.name && (
                  <span className="font-semibold">{session.user.name}</span>
                )}
                {session.user?.email && (
                  <span className="text-slate-400">
                    {" "}
                    ({session.user.email})
                  </span>
                )}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                To use the automation, open{" "}
                <span className="font-mono">app.runwayml.com</span>,
                then open the Chrome extension panel.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs">
            <p className="text-slate-200 font-medium mb-1">
              Not signed in yet
            </p>
            <p className="text-slate-400">
              Please sign in with your Google account to link your subscription
              with the extension.
            </p>
          </div>
        )}

        {/* Main actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          {!isLoggedIn && (
            <a
              href="/api/auth/signin"
              className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-xs font-medium
                         bg-slate-100 text-slate-900 hover:bg-white transition border border-slate-200"
            >
              Continue with Google
            </a>
          )}

          <Link
            href="/user/payments"
            className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-xs font-medium
                       border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
          >
            Open payment page
          </Link>
        </div>

        {/* Small footer note */}
        <div className="mt-5 border-t border-slate-800 pt-3">
          <p className="text-[10px] text-slate-500 leading-relaxed">
            If you already submitted a transaction ID inside the extension,
            your subscription will be approved manually.
            Once approved, the extension will unlock automatically on your
            registered device.
          </p>
        </div>
      </div>
    </div>
  );
}
