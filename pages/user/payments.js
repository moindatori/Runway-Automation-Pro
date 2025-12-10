// pages/user/payments.js

import React, { useState } from "react";

export default function UserPaymentsPage() {
  // Simple JS state – no TypeScript generics
  const [region, setRegion] = useState("PK");

  const isPK = region === "PK";
  const qrUrl = isPK ? "/qr/pk_1000.png" : "/qr/intl_10usd.png";
  const amountText = isPK ? "Rs1000 / 30 days" : "$10 / 30 days";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/90 px-6 py-7 shadow-[0_25px_80px_rgba(15,23,42,0.9)]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
              Runway Prompt Studio
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight">
              Extension subscription payment
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Use this page only to view payment QR codes and instructions.
              <span className="block">
                The actual transaction ID must be submitted{" "}
                <span className="font-semibold text-slate-200">
                  inside the Chrome extension panel
                </span>
                .
              </span>
            </p>
          </div>
          <span className="text-[10px] px-3 py-1 rounded-full border border-slate-700 text-slate-300 bg-slate-900">
            Manual verification
          </span>
        </div>

        {/* Region toggle – match floating panel style */}
        <div className="mb-5">
          <div className="inline-flex items-center text-[11px] text-slate-400 mb-1">
            Choose your location
          </div>
          <div className="flex gap-2 bg-slate-950 border border-slate-800 rounded-full p-1 w-full max-w-xs">
            <button
              type="button"
              onClick={() => setRegion("PK")}
              className={`flex-1 rounded-full px-3 py-2 text-[11px] font-medium border ${
                isPK
                  ? "bg-emerald-400 text-slate-900 border-emerald-300"
                  : "bg-transparent text-slate-200 border-transparent"
              }`}
            >
              🇵🇰 Pakistan
            </button>
            <button
              type="button"
              onClick={() => setRegion("INT")}
              className={`flex-1 rounded-full px-3 py-2 text-[11px] font-medium border ${
                !isPK
                  ? "bg-sky-400 text-slate-900 border-sky-300"
                  : "bg-transparent text-slate-200 border-transparent"
              }`}
            >
              🌐 International
            </button>
          </div>
        </div>

        {/* QR + details – synced with floating panel look */}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-stretch mb-5">
          <div className="bg-slate-950/90 border border-indigo-600/70 rounded-3xl shadow-[0_18px_40px_rgba(15,23,42,0.95)] p-4">
            <div className="bg-white rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={qrUrl}
                alt="Payment QR"
                className="w-[260px] h-[260px] object-contain"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[180px] flex flex-col gap-3">
            <div>
              <div className="text-sm font-semibold mb-1">Payment details</div>
              <div className="text-xs text-slate-200 mb-1">
                Plan:{" "}
                <span className="font-semibold text-emerald-300">
                  {amountText}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Method: QR / bank transfer, with manual review.
              </div>
            </div>

            <div className="text-[11px] text-slate-300 border border-slate-700 rounded-2xl bg-slate-950 px-3 py-3 leading-relaxed">
              <div className="font-semibold text-slate-200 mb-1">
                How to pay
              </div>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open your banking / payment app.</li>
                <li>Scan the QR code shown on this page.</li>
                <li>Send payment for {amountText}.</li>
                <li>
                  After payment, copy the{" "}
                  <span className="font-semibold">transaction ID</span>.
                </li>
                <li>
                  Go back to the{" "}
                  <span className="font-semibold text-slate-100">
                    Chrome extension floating panel
                  </span>{" "}
                  and paste the transaction ID there.
                </li>
              </ol>
            </div>

            <div className="text-[10px] text-slate-500">
              Note: This page does not accept payments directly. It only shows
              QR codes and instructions. All payment requests are submitted from
              inside the extension.
            </div>
          </div>
        </div>

        {/* Small footer */}
        <div className="border-t border-slate-800 pt-3 mt-2">
          <p className="text-[10px] text-slate-500 leading-relaxed">
            After you submit your transaction ID in the extension, your
            subscription will be approved manually.
            Once approved, the extension will unlock automatically on your
            registered device. You do not need to keep this page open.
          </p>
        </div>
      </div>
    </div>
  );
}
