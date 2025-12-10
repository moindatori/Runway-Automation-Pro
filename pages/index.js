// pages/index.js

import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function HomePage() {
  const pageStyle = {
    minHeight: "100vh",
    margin: 0,
    padding: "40px 16px",
    background:
      "radial-gradient(circle at top left, rgba(56,189,248,0.12), transparent 55%), #020617",
    color: "#e5e7eb",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  };

  const wrapperStyle = {
    maxWidth: "780px",
    margin: "0 auto",
  };

  const headerStyle = {
    marginBottom: "24px",
  };

  const tagStyle = {
    fontSize: "11px",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: "#64748b",
    marginBottom: "6px",
  };

  const titleStyle = {
    fontSize: "28px",
    fontWeight: 700,
    margin: 0,
    color: "#e5e7eb",
  };

  const subtitleStyle = {
    marginTop: "6px",
    fontSize: "13px",
    color: "#9ca3af",
  };

  const cardStyle = {
    borderRadius: "24px",
    border: "1px solid rgba(148,163,184,0.6)",
    background: "rgba(15,23,42,0.98)",
    boxShadow: "0 26px 80px rgba(15,23,42,0.95)",
    padding: "24px 22px",
  };

  const sectionTitleStyle = {
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "6px",
    color: "#e5e7eb",
  };

  const textStyle = {
    fontSize: "12px",
    lineHeight: 1.6,
    color: "#9ca3af",
  };

  const columnsStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    marginTop: "18px",
  };

  const columnStyle = {
    flex: "1 1 260px",
    borderRadius: "18px",
    border: "1px solid rgba(51,65,85,0.9)",
    background:
      "radial-gradient(circle at top left, rgba(129,140,248,0.08), transparent 55%), rgba(15,23,42,0.98)",
    padding: "14px 16px",
    fontSize: "12px",
  };

  const badgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    borderRadius: "999px",
    border: "1px solid rgba(148,163,184,0.65)",
    padding: "4px 10px",
    fontSize: "11px",
    color: "#cbd5f5",
    background: "#020617",
    marginTop: "10px",
  };

  const linkButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "18px",
    borderRadius: "999px",
    border: "0",
    padding: "9px 18px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    background: "linear-gradient(135deg,#6366f1,#ec4899)",
    color: "#ffffff",
    boxShadow: "0 14px 40px rgba(99,102,241,0.55)",
    textDecoration: "none",
  };

  const footnoteStyle = {
    marginTop: "16px",
    fontSize: "10px",
    color: "#6b7280",
  };

  return (
    <>
      <Head>
        <title>Runway Prompt Studio – Backend</title>
      </Head>

      <div style={pageStyle}>
        <div style={wrapperStyle}>
          {/* Header */}
          <header style={headerStyle}>
            <div style={tagStyle}>Runway Prompt Studio</div>
            <h1 style={titleStyle}>Backend & account portal</h1>
            <p style={subtitleStyle}>
              This site is used only for{" "}
              <span style={{ color: "#e5e7eb", fontWeight: 500 }}>
                Chrome extension subscriptions and manual payment review
              </span>
              . It is not needed for normal RunwayML usage.
            </p>
          </header>

          {/* Main card */}
          <main style={cardStyle}>
            <div style={sectionTitleStyle}>How this backend is used</div>
            <p style={textStyle}>
              If you installed the <strong>Runway Prompt Studio</strong> Chrome
              extension, you only need this backend for:
            </p>
            <ul
              style={{
                marginTop: "6px",
                paddingLeft: "18px",
                fontSize: "12px",
                color: "#9ca3af",
                lineHeight: 1.6,
              }}
            >
              <li>logging in once with Google (same account as the extension)</li>
              <li>viewing QR codes and payment instructions</li>
              <li>
                admins reviewing transactions, managing subscriptions, and
                credits
              </li>
            </ul>

            <div style={columnsStyle}>
              {/* Column 1: Extension users */}
              <section style={columnStyle}>
                <div style={{ ...sectionTitleStyle, marginBottom: "4px" }}>
                  For Chrome extension users
                </div>
                <p style={textStyle}>
                  You do not manage anything manually on this page. Simply:
                </p>
                <ol
                  style={{
                    marginTop: "6px",
                    paddingLeft: "18px",
                    fontSize: "12px",
                    color: "#9ca3af",
                    lineHeight: 1.6,
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
                    <span style={{ fontFamily: "monospace" }}>
                      app.runwayml.com
                    </span>
                    .
                  </li>
                </ol>

                <Link href="/user/payments" style={linkButtonStyle}>
                  Open subscription payment instructions
                </Link>
              </section>

              {/* Column 2: Admins */}
              <section style={columnStyle}>
                <div style={{ ...sectionTitleStyle, marginBottom: "4px" }}>
                  For admins & staff
                </div>
                <p style={textStyle}>
                  Admin tools (user list, payments, subscription control,
                  device reset, API tokens) are available on a{" "}
                  <strong>separate admin panel</strong>.
                </p>
                <p style={{ ...textStyle, marginTop: "8px" }}>
                  Use your private admin URL:
                  <br />
                  <span
                    style={{
                      fontFamily: "monospace",
                      color: "#e5e7eb",
                      fontSize: "11px",
                    }}
                  >
                    https://runway-automation-pro.vercel.app/admin
                  </span>
                </p>

                <div style={badgeStyle}>
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "999px",
                      backgroundColor: "#22c55e",
                    }}
                  />{" "}
                  Access restricted to authorized accounts
                </div>
              </section>
            </div>

            <p style={footnoteStyle}>
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
