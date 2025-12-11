// pages/index.js

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

export default function HomePage() {
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setIsNarrow(window.innerWidth < 800);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const s = {
    page: {
      minHeight: "100vh",
      margin: 0,
      padding: "80px 20px",
      background: "#0f0c29",
      color: "#e5e7eb",
      fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
    },
    // Background blobs (same vibe as payments page)
    blob1: {
      position: "absolute",
      top: "-15%",
      left: "-10%",
      width: "60vw",
      height: "60vw",
      background:
        "radial-gradient(circle, #6366f1 0%, rgba(0,0,0,0) 70%)",
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
        "radial-gradient(circle, #ec4899 0%, rgba(0,0,0,0) 70%)",
      filter: "blur(80px)",
      opacity: 0.5,
      zIndex: 0,
    },
    blob3: {
      position: "absolute",
      top: "40%",
      left: "25%",
      width: "40vw",
      height: "40vw",
      background:
        "radial-gradient(circle, #0ea5e9 0%, rgba(0,0,0,0) 70%)",
      filter: "blur(90px)",
      opacity: 0.4,
      zIndex: 0,
    },
    wrapper: {
      maxWidth: "900px",
      width: "100%",
      margin: "0 auto",
      position: "relative",
      zIndex: 10,
    },
    header: {
      marginBottom: "24px",
      textAlign: "left",
    },
    tag: {
      fontSize: "11px",
      letterSpacing: "0.25em",
      textTransform: "uppercase",
      color: "#c4b5fd",
      marginBottom: "6px",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "4px 10px",
      borderRadius: "999px",
      background: "rgba(15,23,42,0.7)",
      border: "1px solid rgba(129,140,248,0.5)",
    },
    title: {
      fontSize: "32px",
      fontWeight: 800,
      margin: "10px 0 4px 0",
      color: "#f9fafb",
      letterSpacing: "-0.03em",
      textShadow: "0 4px 20px rgba(0,0,0,0.4)",
    },
    subtitle: {
      marginTop: "4px",
      fontSize: "14px",
      color: "rgba(226,232,240,0.8)",
      maxWidth: "640px",
      lineHeight: 1.6,
    },
    highlight: {
      color: "#f9fafb",
      fontWeight: 600,
    },

    // Main glass card
    mainCard: {
      borderRadius: "30px",
      background: "rgba(15,23,42,0.85)",
      backdropFilter: "blur(30px)",
      WebkitBackdropFilter: "blur(30px)",
      border: "1px solid rgba(148,163,184,0.5)",
      borderTop: "1px solid rgba(248,250,252,0.2)",
      borderLeft: "1px solid rgba(248,250,252,0.15)",
      boxShadow: "0 26px 80px rgba(15,23,42,0.95)",
      padding: "28px 26px",
    },
    sectionTitle: {
      fontSize: "15px",
      fontWeight: 700,
      marginBottom: "6px",
      color: "#e5e7eb",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    sectionText: {
      fontSize: "13px",
      lineHeight: 1.7,
      color: "#9ca3af",
    },
    list: {
      marginTop: "8px",
      paddingLeft: "20px",
      fontSize: "13px",
      color: "#9ca3af",
      lineHeight: 1.7,
    },

    // Columns (glass inside glass)
    columns: {
      display: "flex",
      flexDirection: isNarrow ? "column" : "row",
      gap: "18px",
      marginTop: "20px",
    },
    column: {
      flex: "1 1 0",
      borderRadius: "20px",
      border: "1px solid rgba(55,65,81,0.9)",
      background:
        "radial-gradient(circle at top left, rgba(129,140,248,0.12), transparent 55%), rgba(15,23,42,0.96)",
      padding: "16px 18px",
      fontSize: "13px",
      boxShadow: "0 18px 45px rgba(15,23,42,0.8)",
    },
    columnTitle: {
      fontSize: "14px",
      fontWeight: 600,
      marginBottom: "6px",
      color: "#f9fafb",
    },
    columnText: {
      fontSize: "13px",
      lineHeight: 1.7,
      color: "#9ca3af",
    },

    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      borderRadius: "999px",
      border: "1px solid rgba(148,163,184,0.7)",
      padding: "5px 11px",
      fontSize: "11px",
      color: "#cbd5f5",
      background: "rgba(15,23,42,0.95)",
      marginTop: "10px",
    },
    badgeDot: {
      width: "7px",
      height: "7px",
      borderRadius: "999px",
      backgroundColor: "#22c55e",
      boxShadow: "0 0 0 4px rgba(34,197,94,0.25)",
    },

    // CTA button (link)
    linkButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "16px",
      borderRadius: "999px",
      border: "0",
      padding: "10px 20px",
      fontSize: "13px",
      fontWeight: 600,
      cursor: "pointer",
      background: "linear-gradient(135deg,#6366f1,#ec4899)",
      color: "#ffffff",
      boxShadow: "0 18px 45px rgba(99,102,241,0.65)",
      textDecoration: "none",
      gap: "8px",
      letterSpacing: "0.01em",
    },

    footnote: {
      marginTop: "18px",
      fontSize: "11px",
      color: "#9ca3af",
      lineHeight: 1.6,
    },
    mono: {
      fontFamily: "monospace",
      color: "#e5e7eb",
      fontSize: "11px",
    },
  };

  return (
    <>
      <Head>
        <title>Runway Prompt Studio – Backend</title>
      </Head>

      <div style={s.page}>
        {/* Background blobs */}
        <div style={s.blob1} />
        <div style={s.blob2} />
        <div style={s.blob3} />

        <div style={s.wrapper}>
          {/* Header */}
          <header style={s.header}>
            <div style={s.tag}>
              <span>Runway Prompt Studio</span>
            </div>
            <h1 style={s.title}>Backend & account portal</h1>
            <p style={s.subtitle}>
              This site is used only for{" "}
              <span style={s.highlight}>
                Chrome extension subscriptions and manual payment review
              </span>
              . It is not needed for normal RunwayML usage.
            </p>
          </header>

          {/* Main glass card */}
          <main style={s.mainCard}>
            <div style={s.sectionTitle}>
              <span>How this backend is used</span>
            </div>
            <p style={s.sectionText}>
              If you installed the <strong>Runway Prompt Studio</strong> Chrome
              extension, you only need this backend for:
            </p>
            <ul style={s.list}>
              <li>logging in once with Google (same account as the extension)</li>
              <li>viewing QR codes and payment instructions</li>
              <li>
                admins reviewing transactions, managing subscriptions, and
                credits
              </li>
            </ul>

            <div style={s.columns}>
              {/* Column 1: Extension users */}
              <section style={s.column}>
                <div style={s.columnTitle}>For Chrome extension users</div>
                <p style={s.columnText}>
                  You do not manage anything manually on this page. Simply:
                </p>
                <ol
                  style={{
                    marginTop: "6px",
                    paddingLeft: "20px",
                    fontSize: "13px",
                    color: "#9ca3af",
                    lineHeight: 1.7,
                  }}
                >
                  <li>
                    Login with Google when the extension or this site asks you.
                  </li>
                  <li>
                    Scan the QR code and send payment from your bank / wallet.
                  </li>
                  <li>
                    Paste the transaction ID{" "}
                    <strong>inside the extension floating panel</strong> on{" "}
                    <span style={s.mono}>app.runwayml.com</span>.
                  </li>
                </ol>

                <Link href="/user/payments" style={s.linkButton}>
                  <span>Open subscription payment instructions</span>
                  <span
                    style={{
                      display: "inline-block",
                      transform: "translateY(1px)",
                    }}
                  >
                    →
                  </span>
                </Link>
              </section>

              {/* Column 2: Admins */}
              <section style={s.column}>
                <div style={s.columnTitle}>For admins & staff</div>
                <p style={s.columnText}>
                  Admin tools (user list, payments, subscription control, device
                  reset, API tokens) are available on a{" "}
                  <strong>separate admin panel</strong>.
                </p>
                <p style={{ ...s.columnText, marginTop: "8px" }}>
                  Use your private admin URL:
                  <br />
                  <span style={s.mono}>
                    https://runway-automation-pro.vercel.app/admin
                  </span>
                </p>

                <div style={s.badge}>
                  <span style={s.badgeDot} />
                  <span>Access restricted to authorized accounts</span>
                </div>
              </section>
            </div>

            <p style={s.footnote}>
              Note: This backend is independent from RunwayML itself. It only
              controls access to the{" "}
              <strong>Runway Prompt Studio Chrome extension</strong> and its
              automation features.
            </p>
          </main>
        </div>
      </div>
    </>
  );
}
