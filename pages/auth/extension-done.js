// pages/auth/extension-done.js

export default function ExtensionDone() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 px-6 py-7 shadow-[0_25px_80px_rgba(15,23,42,0.9)]">
        <h1 className="text-lg font-semibold tracking-tight mb-2">
          Login successful
        </h1>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          Your Google account is now linked to{" "}
          <span className="font-medium">Runway Prompt Studio</span>.
        </p>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-5">
          You can close this tab and go back to{" "}
          <span className="font-mono text-slate-200">app.runwayml.com</span>, then
          open the Chrome extension floating panel again. If your subscription is
          active, automation will unlock automatically.
        </p>

        <div className="flex justify-end">
          <button
            onClick={() => window.close()}
            className="rounded-full px-4 py-2 text-xs font-medium
                       bg-slate-100 text-slate-950 border border-slate-200
                       hover:bg-white transition"
          >
            Close this tab
          </button>
        </div>
      </div>
    </div>
  );
}
