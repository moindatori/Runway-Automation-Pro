// pages/user/payments.js

import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

export async function getServerSideProps(context) {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const safeSession = {
    user: {
      name: session.user?.name || null,
      email: session.user?.email || null,
    },
  };

  return {
    props: {
      session: safeSession,
    },
  };
}

export default function UserPayments({ session }) {
  const userLabel =
    session.user?.name
      ? `${session.user.name} (${session.user.email})`
      : session.user?.email;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Subscription payment
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Scan the QR code with your banking app and complete the payment.
              After that, paste your transaction ID inside the Chrome extension
              panel.
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-400">Signed in as</p>
            <p className="text-xs font-medium text-slate-200">{userLabel}</p>
          </div>
        </header>

        {/* Main layout */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)] gap-6">
          {/* Pakistan plan */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇵🇰</span>
                <div>
                  <p className="text-sm font-semibold">Pakistan plan</p>
                  <p className="text-xs text-slate-400">
                    Rs1000 &mdash; 30 days access
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-300 text-[11px] px-2 py-0.5 border border-emerald-500/40">
                Bank transfer / QR code
              </span>
            </div>

            <div className="mt-3 flex flex-col items-center gap-3">
              <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 shadow-lg">
                <Image
                  src="/qr/pk_1000.png"
                  alt="Pakistan QR Rs1000"
                  width={260}
                  height={260}
                  className="rounded-xl bg-white"
                />
              </div>
              <p className="text-[11px] text-slate-400 text-center max-w-xs">
                Scan this QR code with your Pakistani banking app or wallet and
                pay <span className="font-semibold">Rs1000</span> for 30 days
                subscription.
              </p>
            </div>
          </section>

          {/* International plan */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌐</span>
                <div>
                  <p className="text-sm font-semibold">International plan</p>
                  <p className="text-xs text-slate-400">
                    $10 &mdash; 30 days access
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-sky-500/10 text-sky-300 text-[11px] px-2 py-0.5 border border-sky-500/40">
                Bank transfer / QR code
              </span>
            </div>

            <div className="mt-3 flex flex-col items-center gap-3">
              <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 shadow-lg">
                <Image
                  src="/qr/intl_10usd.png"
                  alt="International QR $10"
                  width={260}
                  height={260}
                  className="rounded-xl bg-white"
                />
              </div>
              <p className="text-[11px] text-slate-400 text-center max-w-xs">
                Scan this QR code with your international payment app and pay{" "}
                <span className="font-semibold">$10</span> for 30 days
                subscription.
              </p>
            </div>
          </section>
        </div>

        {/* Instructions */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <h2 className="text-sm font-semibold mb-2">How to confirm payment</h2>
          <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1">
            <li>Scan the correct QR code and complete the payment.</li>
            <li>
              Note down the transaction ID from your banking confirmation
              screen.
            </li>
            <li>
              Go to <span className="font-mono text-slate-200">
                app.runwayml.com
              </span>{" "}
              and open the Runway Prompt Studio extension panel.
            </li>
            <li>
              In the panel, paste your transaction ID into the{" "}
              <span className="font-semibold">Transaction ID</span> field and
              click <span className="font-semibold">Submit payment request</span>.
            </li>
          </ol>

          <div className="mt-4 flex justify-between items-center text-[11px] text-slate-500">
            <p>
              Your request will be reviewed manually. Once approved, the
              extension will unlock automatically on your device.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-3 py-1.5 rounded-full border border-slate-700 text-[11px] hover:bg-slate-800"
            >
              Back to home
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
