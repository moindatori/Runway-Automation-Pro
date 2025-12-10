// pages/user/payments.js

import React, { useState } from "react";

export default function UserPaymentsPage() {
  const [region, setRegion] = useState("PK");

  const isPK = region === "PK";
  const qrUrl = isPK ? "/qr/pk_1000.png" : "/qr/intl_10usd.png";
  const amountText = isPK ? "Rs1000 / 30 days" : "$10 / 30 days";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar / header strip */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
              Runway Prompt Studio
            </p>
            <h1 className="text-sm font-semibold text-slate-100">
              Extension subscription payment
            </h1>
          </div>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[10px] text-slate-300">
            Manual review • QR based
          </span>
        </div>
      </header>

      {/* Main content area */}
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:py-10">
        {/* Intro + location selector row */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-50">
              Pay for your Chrome extension subscription
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              This page only shows{" "}
              <span className="font-medium text-slate-200">
                QR codes and payment instructions
              </span>{" "}
              for the Runway Prompt Studio Chrome extension. You must submit
              your payment transaction ID{" "}
              <span className="font-medium text-slate-100">
                inside the extension floating panel on app.runwayml.com
              </span>
              . No payments are processed directly on this page.
            </p>

            {/* Region toggle */}
            <div className="mt-5">
              <div className="mb-1 text-[11px] text-slate-400">
                Choose your location
              </div>
              <div className="flex max-w-xs gap-2 rounded-full border border-slate-800 bg-slate-950 p-1">
                <button
                  type="button"
                  onClick={() => setRegion("PK")}
                  className={`flex-1 rounded-full px-3 py-2 text-[11px] font-medium border transition ${
                    isPK
                      ? "bg-emerald-400 text-slate-900 border-emerald-300 shadow-[0_8px_25px_rgba(16,185,129,0.5)]"
                      : "bg-transparent text-slate-200 border-transparent hover:bg-slate-900"
                  }`}
                >
                  🇵🇰 Pakistan
                </button>
                <button
                  type="button"
                  onClick={() => setRegion("INT")}
                  className={`flex-1 rounded-full px-3 py-2 text-[11px] font-medium border transition ${
                    !isPK
                      ? "bg-sky-400 text-slate-900 border-sky-300 shadow-[0_8px_25px_rgba(56,189,248,0.5)]"
                      : "bg-transparent text-slate-200 border-transparent hover:bg-slate-900"
                  }`}
                >
                  🌐 International
                </button>
              </div>
              <p className="mt-1 text-[10px] text-slate-500">
                Plan selected:{" "}
                <span className="font-semibold text-slate-200">
                  {amountText}
                </span>
                .
              </p>
            </div>
          </div>

          {/* Small info card on the right */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4 text-[11px] text-slate-300 shadow-[0_18px_50px_rgba(15,23,42,0.9)]">
            <div className="mb-2 text-xs font-semibold text-slate-100">
              Important
            </div>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                Login with the same Google account in both the{" "}
                <span className="font-mono text-slate-100">
                  extension
                </span>{" "}
                and this website.
              </li>
              <li>
                After sending payment, copy the{" "}
                <span className="font-semibold">transaction ID</span> from your
                bank / wallet app.
              </li>
              <li>
                Open the extension floating panel on{" "}
                <span className="font-mono text-slate-100">
                  app.runwayml.com
                </span>{" "}
                and paste the transaction ID there.
              </li>
              <li>
                Your subscription will be activated manually after verification.
              </li>
            </ul>
          </div>
        </section>

        {/* QR and details section */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          {/* QR card */}
          <div className="rounded-3xl border border-indigo-600/70 bg-slate-950/95 p-4 shadow-[0_22px_70px_rgba(15,23,42,0.95)]">
            <div className="rounded-2xl bg-white/95 p-3 flex items-center justify-center">
              <img
                src={qrUrl}
                alt="Payment QR"
                className="h-[320px] w-[320px] max-w-full object-contain"
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-300">
              <span>
                Scan this code in your banking / wallet app and pay{" "}
                <span className="font-semibold text-emerald-300">
                  {amountText}
                </span>
                .
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] text-slate-400">
                QR • one-time payment
              </span>
            </div>
          </div>

          {/* Steps + notes – matches floating-panel style */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4 text-[11px] text-slate-300 leading-relaxed">
              <div className="mb-1 text-xs font-semibold text-slate-100">
                How to complete your payment
              </div>
              <ol className="list-decimal list-inside space-y-1.5">
                <li>Open your banking / wallet app.</li>
                <li>Scan the QR code shown on this page.</li>
                <li>Pay {amountText} for your Runway Prompt Studio license.</li>
                <li>
                  Copy the{" "}
                  <span className="font-semibold">transaction ID</span> or
                  reference number from the confirmation screen.
                </li>
                <li>
                  Go back to{" "}
                  <span className="font-semibold text-slate-100">
                    Chrome extension floating panel
                  </span>{" "}
                  on <span className="font-mono">app.runwayml.com</span> and
                  paste the transaction ID into the payment form.
                </li>
              </ol>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-[10px] text-slate-400 leading-relaxed">
              <p>
                This page does not unlock the extension by itself. It is only a{" "}
                <span className="font-semibold text-slate-200">
                  visual QR + instruction page
                </span>
                . All license checks happen between your browser extension and
                the backend.
              </p>
              <p className="mt-2">
                After you submit your transaction ID inside the extension, your
                request will be reviewed manually. Once approved, the automation
                will unlock automatically on your registered device. You do not
                need to keep this tab open.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
