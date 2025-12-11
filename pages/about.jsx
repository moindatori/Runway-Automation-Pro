// pages/about.jsx
import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function AboutPage() {
  const s = {
    page: {
      minHeight: "100vh",
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
      padding: "60px 20px",
    },
    card: {
      width: "100%",
      maxWidth: 900,
      borderRadius: 32,
      border: "1px solid rgba(148,163,184,0.45)",
      background:
        "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.9))",
      boxShadow:
        "0 32px 120px rgba(15,23,42,0.95), 0 0 0 1px rgba(15,23,42,0.8)",
      padding: "30px 26px 26px",
      position: "relative",
      overflow: "hidden",
    },
    glow: {
      position: "absolute",
      inset: "-40%",
      background:
        "radial-gradient(circle at 10% 0%, rgba(236,72,153,0.12), transparent 60%)," +
        "radial-gradient(circle at 90% 0%, rgba(59,130,246,0.1), transparent 60%)," +
        "radial-gradient(circle at 50% 100%, rgba(45,212,191,0.12), transparent 60%)",
      pointerEvents: "none",
    },
    inner: { position: "relative", zIndex: 1 },
    tag: {
      fontSize: 11,
      letterSpacing: "0.25em",
      textTransform: "uppercase",
      color: "#9ca3af",
      marginBottom: 6,
    },
    h1: {
      fontSize: 26,
      fontWeight: 800,
      margin: 0,
      color: "#e5e7eb",
    },
    subtitle: {
      marginTop: 6,
      fontSize: 13,
      color: "#9ca3af",
      maxWidth: 520,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 600,
      marginTop: 18,
      marginBottom: 6,
      color: "#e5e7eb",
    },
    text: {
      fontSize: 12,
      lineHeight: 1.7,
      color: "#cbd5f5",
      maxWidth: 760,
    },
    list: {
      paddingLeft: 18,
      marginTop: 6,
      fontSize: 12,
      lineHeight: 1.7,
      color: "#9ca3af",
    },
    navRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 18,
    },
    primaryBtn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
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
    },
    footnote: {
      marginTop: 16,
      fontSize: 10,
      color: "#9ca3af",
    },
  };

  return (
    <>
      <Head>
        <title>About – Runway Prompt Studio</title>
      </Head>
      <div style={s.page}>
        <div style={s.card}>
          <div style={s.glow} />
          <div style={s.inner}>
            <div style={s.tag}>About</div>
            <h1 style={s.h1}>What is Runway Prompt Studio?</h1>
            <p style={s.subtitle}>
              A Chrome extension + backend that automates prompt workflows for
              RunwayML Gen-4 image-to-video projects.
            </p>

            <h2 style={s.sectionTitle}>Independent automation layer</h2>
            <p style={s.text}>
              Runway Prompt Studio is an independent tool that helps you manage
              prompts, motion templates and bulk automation for{" "}
              <code>app.runwayml.com</code>. It does not replace RunwayML – it
              simply automates actions inside your own account, using your
              existing Runway subscription and credits.
            </p>

            <h2 style={s.sectionTitle}>Not affiliated with RunwayML</h2>
            <p style={s.text}>
              This project is{" "}
              <strong>not endorsed by, affiliated with, or sponsored by</strong>{" "}
              Runway, RunwayML, or any of their partners. All trademarks and
              product names are the property of their respective owners. You
              remain responsible for complying with RunwayML&apos;s own Terms of
              Service while using this extension.
            </p>

            <h2 style={s.sectionTitle}>What the backend does</h2>
            <ul style={s.list}>
              <li>Links your Chrome extension to a Google account.</li>
              <li>Stores a device-locked license for your automation plan.</li>
              <li>Receives QR payments and lets admins approve or reject them.</li>
              <li>Prevents sharing one license across many devices.</li>
            </ul>

            <h2 style={s.sectionTitle}>Support & contact</h2>
            <p style={s.text}>
              For support, billing questions, or device reset requests, contact
              the project owner using the email shown inside the Chrome
              extension or payment instructions screen. Include your{" "}
              <strong>transaction ID</strong> and <strong>device ID</strong> so
              your request can be processed faster.
            </p>

            <div style={s.navRow}>
              <Link href="/user/payments" style={s.primaryBtn}>
                Go to payment / subscription page
              </Link>
              <Link href="/" style={s.secondaryBtn}>
                Back to main portal
              </Link>
              <Link href="/legal/privacy" style={s.secondaryBtn}>
                Privacy &amp; terms
              </Link>
            </div>

            <p style={s.footnote}>
              This page is informational and does not override the legal
              language in the official Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
