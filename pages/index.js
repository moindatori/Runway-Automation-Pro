// pages/index.js
import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function HomePage() {
  // Reuse the same look & feel as the payment page
  const s = {
    page: {
      minHeight: "100vh",
      background: "#0f0c29", // same as payment page
      fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      padding: "80px 20px",
      color: "#e5e7eb",
    },

    // Background blobs (same palette as payment page)
    blob1: {
      position: "absolute",
      top: "-15%",
      left: "-10%",
      width: "60vw",
      height: "60vw",
      background:
        "radial-gradient(circle, #ff0f7b 0%, rgba(0,0,0,0) 70%)",
      filter: "blur(80px)",
      opacity: 0.5,
      zIndex: 0,
    },
    blob2: {
      position: "absolute",
      bottom: "-10%",
      right: "-10%",
      width: "50vw",
      height: "50vw",
      background:
        "radial-gradient(circle, #f89b29 0%, rgba(0,0,0,0) 70%)",
      filter: "blur(80px)",
      opacity: 0.5,
      zIndex: 0,
    },
    blob3: {
      position: "absolute",
      top: "40%",
      left: "30%",
      width: "40vw",
      height: "40vw",
      background:
        "radial-gradient(circle, #8A2387 0%, rgba(0,0,0,0) 70%)",
      filter: "blur(90px)",
      opacity: 0.4,
      zIndex: 0,
    },

    container: {
      width: "100%",
      maxWidth: "1000px",
      position: "relative",
      zIndex: 10,
    },

    // Main glass card (full page style)
    shell: {
      borderRadius: "30px",
      border: "1px solid rgba(255, 255, 255, 0.14)",
      borderTop: "1px solid rgba(255, 255, 255, 0.32)",
      borderLeft: "1px solid rgba(255, 255, 255, 0.32)",
      background: "rgba(15, 23, 42, 0.96)",
      boxShadow:
        "0 25px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(15,23,42,0.85)",
      padding: "26px 26px 24px",
      position: "relative",
      overflow: "hidden",
    },
    shellInnerGlow: {
      position: "absolute",
      inset: "-35%",
      background:
        "radial-gradient(circle at 0 0, rgba(255,15,123,0.18), transparent 60%)," +
        "radial-gradient(circle at 100% 0, rgba(59,130,246,0.18), transparent 60%)," +
        "radial-gradient(circle at 50% 100%, rgba(34,197,94,0.18), transparent 65%)",
      opacity: 0.9,
      pointerEvents: "none",
    },
    shellContent: {
      position: "relative",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 22,
    },

    // Header
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 16,
      flexWrap: "wrap",
    },
    leftTitleBlock: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
    },
    tag: {
      fontSize: 11,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "#9ca3af",
    },
    title: {
      margin: 0,
      fontSize: 26,
      fontWeight: 800,
      letterSpacing: "-0.02em",
      color: "#f9fafb",
    },
    subtitle: {
      fontSize: 13,
      color: "rgba(226,232,240,0.78)",
      maxWidth: 520,
    },

    // Top-right nav buttons (Login / Admin optional)
    topNav: {
      display: "flex",
      flexWrap: "wrap",
      gap: 10,
    },
    ghostBtn: {
      borderRadius: 999,
      border: "1px solid rgba(148,163,184,0.45)",
      padding: "6px 12px",
      fontSize: 11,
      fontWeight: 500,
      background:
        "radial-gradient(circle at 0 0, rgba(148,163,184,0.15), transparent 60%)",
      color: "#e5e7eb",
      cursor: "pointer",
      textDecoration: "none",
    },

    // Main layout
    mainGrid: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1.1fr)",
      gap: 22,
      marginTop: 4,
    },
    mainGridNarrow: {
      display: "flex",
      flexDirection: "column",
      gap: 18,
      marginTop: 4,
    },

    // Left column
    leftPanel: {
      borderRadius: 22,
      padding: "20px 18px 18px",
      border: "1px solid rgba(148,163,184,0.45)",
      background:
        "radial-gradient(circle at 0 0, rgba(59,130,246,0.25), transparent 55%), rgba(15,23,42,0.96)",
      boxShadow: "0 22px 60px rgba(15,23,42,0.9)",
      fontSize: 12,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: 600,
      marginBottom: 6,
      color: "#e5e7eb",
    },
    bodyText: {
      fontSize: 12,
      lineHeight: 1.65,
      color: "rgba(226,232,240,0.8)",
      maxWidth: 540,
    },
    bulletList: {
      marginTop: 8,
      paddingLeft: 18,
      fontSize: 12,
      lineHeight: 1.7,
      color: "#9ca3af",
    },

    primaryBtn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 16,
      padding: "11px 22px",
      borderRadius: 999,
      border: "none",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      textDecoration: "none",
      background:
        "linear-gradient(135deg, #ff0f7b 0%, #6366f1 50%, #22c55e 100%)",
      color: "#ffffff",
      boxShadow: "0 20px 50px rgba(59,130,246,0.78)",
      gap: 8,
    },
    secondaryBtn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px 16px",
      borderRadius: 999,
      border: "1px solid rgba(148,163,184,0.5)",
      fontSize: 11,
      fontWeight: 500,
      cursor: "pointer",
      textDecoration: "none",
      color: "#e5e7eb",
      background:
        "radial-gradient(circle at 0 0, rgba(148,163,184,0.2), transparent 60%)",
      marginLeft: 10,
    },
    smallLinksRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 10,
      fontSize: 11,
    },
    tinyLinkChip: {
      padding: "6px 12px",
      borderRadius: 999,
      border: "1px solid rgba(148,163,184,0.4)",
      textDecoration: "none",
      color: "#cbd5f5",
      background:
        "radial-gradient(circle at 0 0, rgba(30,64,175,0.22), transparent 60%)",
    },
    footnote: {
      marginTop: 14,
      fontSize: 11,
      color: "#9ca3af",
    },

    // Right column cards
    rightCol: {
      display: "flex",
      flexDirection: "column",
      gap: 14,
    },
    infoCard: {
      borderRadius: 20,
      padding: "16px 16px 14px",
      border: "1px solid rgba(148,163,184,0.45)",
      background:
        "radial-gradient(circle at 100% 0, rgba(129,140,248,0.3), transparent 55%), rgba(15,23,42,0.96)",
      fontSize: 12,
      boxShadow: "0 18px 50px rgba(15,23,42,0.95)",
    },
    infoTitle: {
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 4,
      color: "#e5e7eb",
    },
    infoText: {
      fontSize: 12,
      lineHeight: 1.65,
      color: "rgba(226,232,240,0.85)",
    },
    pillRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 10,
      fontSize: 11,
    },
    pill: {
      padding: "4px 10px",
      borderRadius: 999,
      border: "1px solid rgba(45,212,191,0.6)",
      background:
        "radial-gradient(circle at 0 0, rgba(45,212,191,0.2), transparent 60%)",
      color: "#bbf7d0",
      fontWeight: 500,
    },
  };

  // Very small layout switch (pure clientless – based on CSS grid fallback)
  const isNarrow =
    typeof window !== "undefined" ? window.innerWidth < 900 : false;
  const mainLayout = isNarrow ? s.mainGridNarrow : s.mainGrid;

  return (
    <>
      <Head>
        <title>Runway Prompt Studio – Extension Portal</title>
      </Head>

      <div style={s.page}>
        <div style={s.blob1} />
        <div style={s.blob2} />
        <div style={s.blob3} />

        <div style={s.container}>
          <div style={s.shell}>
            <div style={s.shellInnerGlow} />
            <div style={s.shellContent}>
              {/* Header row */}
              <div style={s.headerRow}>
                <div style={s.leftTitleBlock}>
                  <span style={s.tag}>Runway Prompt Studio</span>
                  <h1 style={s.title}>Chrome extension account portal</h1>
                  <p style={s.subtitle}>
                    This website connects your Chrome extension to a Google
                    account, manages your device-locked license, and lets you
                    handle payments for the automation plan.
                  </p>
                </div>

                <div style={s.topNav}>
                  <Link href="/api/auth/signin" style={s.ghostBtn}>
                    Sign in with Google
                  </Link>
                  <Link href="/user/payments" style={s.ghostBtn}>
                    Open payment page
                  </Link>
                </div>
              </div>

              {/* Main content layout – same glass style as payment page */}
              <div style={mainLayout}>
                {/* LEFT */}
                <section style={s.leftPanel}>
                  <div style={s.sectionTitle}>How to use this portal</div>
                  <p style={s.bodyText}>
                    If you already installed the{" "}
                    <strong>Runway Prompt Studio</strong> Chrome extension,
                    follow these steps to unlock automation:
                  </p>
                  <ul style={s.bulletList}>
                    <li>Sign in here using the same Google account.</li>
                    <li>Go to the payment page and complete a QR payment.</li>
                    <li>
                      Copy the transaction / reference ID from your banking app.
                    </li>
                    <li>
                      Paste that ID inside the extension&apos;s payment screen
                      on{" "}
                      <code style={{ fontSize: 11 }}>app.runwayml.com</code>.
                    </li>
                  </ul>

                  <div>
                    <Link href="/user/payments" style={s.primaryBtn}>
                      Go to payment &amp; subscription
                      <span style={{ fontSize: 16 }}>↗</span>
                    </Link>
                    <Link href="/about" style={s.secondaryBtn}>
                      Learn more about this project
                    </Link>
                  </div>

                  <div style={s.smallLinksRow}>
                    <Link href="/legal/privacy" style={s.tinyLinkChip}>
                      Privacy Policy
                    </Link>
                    <Link href="/legal/terms" style={s.tinyLinkChip}>
                      Terms of Service
                    </Link>
                  </div>

                  <p style={s.footnote}>
                    This portal only controls access to the{" "}
                    <strong>Runway Prompt Studio Chrome extension</strong>. You
                    still use your own RunwayML account and credits for
                    rendering.
                  </p>
                </section>

                {/* RIGHT */}
                <aside style={s.rightCol}>
                  <div style={s.infoCard}>
                    <div style={s.infoTitle}>What this backend stores</div>
                    <p style={s.infoText}>
                      Only minimal data is kept: your Google email, a generated{" "}
                      device ID, QR transaction IDs, and license status
                      (pending, active, expired). No Runway projects or media
                      files are stored here.
                    </p>
                    <div style={s.pillRow}>
                      <div style={s.pill}>Device-locked license</div>
                      <div style={s.pill}>Manual approval</div>
                      <div style={s.pill}>One account = one device</div>
                    </div>
                  </div>

                  <div
                    style={{
                      ...s.infoCard,
                      background:
                        "radial-gradient(circle at 100% 0, rgba(236,72,153,0.35), transparent 55%), rgba(15,23,42,0.96)",
                    }}
                  >
                    <div style={s.infoTitle}>Independent from RunwayML</div>
                    <p style={s.infoText}>
                      Runway Prompt Studio is an independent automation tool.
                      It is not affiliated with, endorsed by, or sponsored by
                      Runway / RunwayML. Use it only with your own account and
                      always follow RunwayML&apos;s own terms.
                    </p>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
