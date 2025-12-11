// pages/index.js
import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function HomePage() {
  const s = {
    page: {
      minHeight: "100vh",
      margin: 0,
      padding: "0",
      background: "#050816",
      backgroundImage:
        "radial-gradient(circle at 0% 0%, rgba(244,63,94,0.22), transparent 55%)," +
        "radial-gradient(circle at 100% 0%, rgba(56,189,248,0.18), transparent 55%)," +
        "radial-gradient(circle at 50% 100%, rgba(168,85,247,0.22), transparent 60%)",
      color: "#e5e7eb",
      fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    container: {
      width: "100%",
      maxWidth: "980px",
      padding: "60px 20px",
    },
    cardOuter: {
      borderRadius: "32px",
      border: "1px solid rgba(148,163,184,0.45)",
      background:
        "linear-gradient(145deg, rgba(15,23,42,0.92), rgba(15,23,42,0.86))",
      boxShadow:
        "0 32px 120px rgba(15,23,42,0.95), 0 0 0 1px rgba(15,23,42,0.8)",
      padding: "32px 30px 28px",
      position: "relative",
      overflow: "hidden",
    },
    glow: {
      position: "absolute",
      inset: "-40%",
      background:
        "radial-gradient(circle at 10% 0%, rgba(236,72,153,0.09), transparent 60%)," +
        "radial-gradient(circle at 90% 0%, rgba(59,130,246,0.08), transparent 60%)," +
        "radial-gradient(circle at 50% 100%, rgba(45,212,191,0.09), transparent 60%)",
      opacity: 1,
      pointerEvents: "none",
    },
    inner: {
      position: "relative",
      zIndex: 1,
    },
    headerTag: {
      fontSize: 11,
      letterSpacing: "0.25em",
      textTransform: "uppercase",
      color: "#9ca3af",
      marginBottom: 6,
    },
    title: {
      fontSize: 30,
      fontWeight: 800,
      margin: 0,
      color: "#e5e7eb",
    },
    subtitle: {
      marginTop: 8,
      fontSize: 13,
      color: "#9ca3af",
      maxWidth: 520,
    },
    loginPill: {
      position: "absolute",
      top: 22,
      right: 24,
      fontSize: 11,
      borderRadius: 999,
      border: "1px solid rgba(148,163,184,0.4)",
      padding: "4px 10px",
      color: "#cbd5f5",
      background:
        "radial-gradient(circle at 0 0, rgba(96,165,250,0.32), transparent 60%)",
      boxShadow: "0 10px 35px rgba(15,23,42,0.75)",
    },

    mainRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: 18,
      marginTop: 26,
    },
    mainCol: {
      flex: "2 1 320px",
      borderRadius: 20,
      border: "1px solid rgba(148,163,184,0.4)",
      background:
        "radial-gradient(circle at 0 0, rgba(59,130,246,0.25), transparent 55%), rgba(15,23,42,0.96)",
      padding: "20px 18px 18px",
      boxShadow: "0 22px 60px rgba(15,23,42,0.85)",
      fontSize: 12,
    },
    sideCol: {
      flex: "1.4 1 260px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 600,
      marginBottom: 6,
      color: "#e5e7eb",
    },
    text: {
      fontSize: 12,
      lineHeight: 1.6,
      color: "#9ca3af",
    },
    bulletList: {
      marginTop: 6,
      paddingLeft: 18,
      fontSize: 12,
      lineHeight: 1.6,
      color: "#9ca3af",
    },

    // Buttons / nav
    primaryBtn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 18,
      borderRadius: 999,
      border: "0",
      padding: "9px 18px",
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      background:
        "linear-gradient(135deg, #ec4899 0%, #6366f1 50%, #22c55e 100%)",
      color: "#ffffff",
      boxShadow: "0 18px 55px rgba(59,130,246,0.75)",
      textDecoration: "none",
      gap: 8,
    },
    secondaryBtn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 999,
      border: "1px solid rgba(148,163,184,0.5)",
      padding: "7px 14px",
      fontSize: 11,
      fontWeight: 500,
      cursor: "pointer",
      background:
        "radial-gradient(circle at 0 0, rgba(148,163,184,0.16), transparent 60%)",
      color: "#e5e7eb",
      textDecoration: "none",
      gap: 6,
    },
    navRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 14,
    },
    tinyLinkRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 10,
      fontSize: 11,
      color: "#9ca3af",
    },

    sideCard: {
      borderRadius: 18,
      border: "1px solid rgba(148,163,184,0.5)",
      background:
        "radial-gradient(circle at 100% 0, rgba(129,140,248,0.25), transparent 60%), rgba(15,23,42,0.96)",
      padding: "14px 16px 13px",
      fontSize: 12,
      boxShadow: "0 18px 55px rgba(15,23,42,0.9)",
    },
    sideLabel: {
      fontSize: 12,
      fontWeight: 600,
      color: "#e5e7eb",
      marginBottom: 4,
    },
    footnote: {
      marginTop: 14,
      fontSize: 10,
      color: "#6b7280",
    },
  };

  return (
    <>
      <Head>
        <title>Runway Prompt Studio – Backend</title>
      </Head>

      <div style={s.page}>
        <div style={s.container}>
          <div style={s.cardOuter}>
            <div style={s.glow} />
            <div style={s.inner}>
              <div style={s.headerTag}>Runway Prompt Studio</div>

              <h1 style={s.title}>Chrome extension account portal</h1>
              <p style={s.subtitle}>
                Sign in once with Google, link your device, and manage your{" "}
                <span style={{ color: "#e5e7eb", fontWeight: 500 }}>
                  Runway Prompt Studio automation license
                </span>{" "}
                from here.
              </p>

              <div style={s.mainRow}>
                {/* Main explanation + buttons */}
                <section style={s.mainCol}>
                  <div style={s.sectionTitle}>How this backend is used</div>
                  <p style={s.text}>
                    If you installed the{" "}
                    <strong>Runway Prompt Studio</strong> Chrome extension,
                    this site is only needed for:
                  </p>
                  <ul style={s.bulletList}>
                    <li>signing in once with your Google account</li>
                    <li>viewing QR codes and payment instructions</li>
                    <li>linking your device and reviewing subscription status</li>
                  </ul>

                  <div style={s.navRow}>
                    <Link href="/user/payments" style={s.primaryBtn}>
                      Open payment / subscription page
                      <span style={{ fontSize: 14 }}>↗</span>
                    </Link>

                    <Link href="/about" style={s.secondaryBtn}>
                      About this project
                    </Link>
                  </div>

                  <div style={s.tinyLinkRow}>
                    <Link href="/legal/privacy" style={{ ...s.secondaryBtn, padding: "4px 10px", fontSize: 10, borderRadius: 999 }}>
                      Privacy Policy
                    </Link>
                    <Link href="/legal/terms" style={{ ...s.secondaryBtn, padding: "4px 10px", fontSize: 10, borderRadius: 999 }}>
                      Terms &amp; License
                    </Link>
                  </div>

                  <p style={s.footnote}>
                    Note: This backend is independent from RunwayML itself. It
                    only controls access to the{" "}
                    <strong>Runway Prompt Studio Chrome extension</strong> and
                    its automation features.
                  </p>
                </section>

                {/* Side info cards */}
                <aside style={s.sideCol}>
                  <div style={s.sideCard}>
                    <div style={s.sideLabel}>For extension users</div>
                    <p style={s.text}>
                      1. Log in with the same Google account that you use inside{" "}
                      <code>app.runwayml.com</code>.
                      <br />
                      2. Complete a QR payment once.
                      <br />
                      3. Enter the transaction ID inside the{" "}
                      <strong>floating panel</strong> on Runway.
                    </p>
                  </div>

                  <div style={s.sideCard}>
                    <div style={s.sideLabel}>For admins &amp; staff</div>
                    <p style={s.text}>
                      User list, extension payments, subscription control,
                      device resets and API tokens live in the separate admin
                      dashboard:
                      <br />
                      <span
                        style={{
                          fontFamily: "monospace",
                          color: "#e5e7eb",
                          fontSize: 11,
                        }}
                      >
                        /admin
                      </span>
                    </p>
                  </div>
                </aside>
              </div>
            </div>

            <div style={s.loginPill}>
              Signed in with your Google account via NextAuth
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
