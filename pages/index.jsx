// pages/index.js

import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const backgroundStyle = {
    minHeight: "100vh",
    margin: 0,
    padding: "40px 16px",
    background:
      "radial-gradient(circle at top, rgba(56,189,248,0.12), transparent 55%)," +
      "radial-gradient(circle at bottom, rgba(244,114,182,0.12), transparent 55%)," +
      "#020617",
    color: "#e5e7eb",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
  };

  const shellStyle = {
    width: "100%",
    maxWidth: "980px",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: 700,
    letterSpacing: "0.03em",
  };

  const subtitleStyle = {
    marginTop: "4px",
    fontSize: "13px",
    color: "#9ca3af",
  };

  const userBadgeStyle = {
    fontSize: "12px",
    color: "#9ca3af",
    padding: "6px 10px",
    borderRadius: "999px",
    border: "1px solid rgba(148,163,184,0.5)",
    background: "rgba(15,23,42,0.9)",
  };

  const buttonPrimary = {
    borderRadius: "999px",
    border: 0,
    padding: "10px 18px",
    background:
      "linear-gradient(135deg, rgba(129,140,248,1), rgba(244,114,182,1))",
    color: "#0b1120",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 16px 40px rgba(15,23,42,0.8)",
  };

  const buttonGhost = {
    borderRadius: "999px",
    border: "1px solid rgba(148,163,184,0.6)",
    padding: "8px 14px",
    background: "transparent",
    color: "#e5e7eb",
    fontSize: "12px",
    cursor: "pointer",
  };

  const cardStyle = {
    background: "rgba(15,23,42,0.96)",
    borderRadius: "18px",
    border: "1px solid rgba(30,64,175,0.6)",
    boxShadow: "0 24px 80px rgba(15,23,42,0.9)",
    padding: "24px 24px 22px",
    maxWidth: "620px",
  };

  const cardTitle = {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "8px",
  };

  const cardText = {
    fontSize: "13px",
    color: "#9ca3af",
    lineHeight: 1.6,
    marginBottom: "18px",
  };

  const bulletList = {
    margin: 0,
    paddingLeft: "18px",
    fontSize: "12px",
    color: "#94a3b8",
    lineHeight: 1.7,
  };

  return (
    <>
      <Head>
        <title>Runway Prompt Studio – Account link</title>
      </Head>

      <main style={backgroundStyle}>
        <div style={shellStyle}>
          {/* Top bar */}
          <header style={headerStyle}>
            <div>
              <div style={titleStyle}>Runway Prompt Studio</div>
              <div style={subtitleStyle}>
                Chrome extension account link page – sign in once, then use the
                extension on app.runwayml.com.
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {loading ? (
                <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                  Checking session…
                </span>
              ) : session?.user ? (
                <>
                  <span style={userBadgeStyle}>
                    Signed in as {session.user.email}
                  </span>
                  <button
                    type="button"
                    style={buttonGhost}
                    onClick={() => signOut()}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  style={buttonPrimary}
                  onClick={() => signIn("google")}
                >
                  Sign in with Google
                </button>
              )}
            </div>
          </header>

          {/* Main card */}
          <section style={cardStyle}>
            {loading ? (
              <>
                <div style={cardTitle}>Connecting…</div>
                <p style={cardText}>
                  Please wait a moment while we check your login status.
                </p>
              </>
            ) : session?.user ? (
              <>
                <div style={cardTitle}>You are connected</div>
                <p style={cardText}>
                  Your Google account is now linked to Runway Prompt Studio.
                  The Chrome extension will use this login to verify your
                  subscription and device automatically.
                </p>

                <ul style={bulletList}>
                  <li>
                    Make sure you are logged in with the same Google account
                    inside the extension login popup.
                  </li>
                  <li>
                    Open{" "}
                    <strong>app.runwayml.com</strong>, click the Runway Prompt
                    Studio floating icon, and follow the on-screen steps.
                  </li>
                  <li>
                    If you ever change your browser or clear cookies, just come
                    back to this page and sign in again.
                  </li>
                </ul>

                <p
                  style={{
                    marginTop: "16px",
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  You can safely close this tab now and continue in the Chrome
                  extension.
                </p>
              </>
            ) : (
              <>
                <div style={cardTitle}>Sign in to connect the extension</div>
                <p style={cardText}>
                  This page is only used to authenticate your Google account for
                  the Runway Prompt Studio Chrome extension. No payments are
                  processed here, and no extension settings are shown.
                </p>

                <ul style={bulletList}>
                  <li>Click “Sign in with Google” at the top of the page.</li>
                  <li>
                    Use the same Google account you will use inside the Chrome
                    extension.
                  </li>
                  <li>
                    After signing in, return to{" "}
                    <strong>app.runwayml.com</strong> and open the extension’s
                    floating panel.
                  </li>
                </ul>

                <div style={{ marginTop: "18px" }}>
                  <button
                    type="button"
                    style={buttonPrimary}
                    onClick={() => signIn("google")}
                  >
                    Sign in with Google
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
