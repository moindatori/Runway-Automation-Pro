// pages/legal/privacy.jsx
import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function PrivacyPolicyPage() {
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
      maxWidth: 980,
      borderRadius: 32,
      border: "1px solid rgba(148,163,184,0.45)",
      background:
        "linear-gradient(145deg, rgba(15,23,42,0.97), rgba(15,23,42,0.92))",
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
      fontSize: 12,
      color: "#9ca3af",
      maxWidth: 640,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 600,
      marginTop: 18,
      marginBottom: 4,
      color: "#e5e7eb",
    },
    text: {
      fontSize: 12,
      lineHeight: 1.7,
      color: "#cbd5f5",
      maxWidth: 820,
    },
    list: {
      paddingLeft: 18,
      marginTop: 4,
      fontSize: 12,
      lineHeight: 1.7,
      color: "#9ca3af",
    },
    navRow: {
      marginTop: 18,
      display: "flex",
      flexWrap: "wrap",
      gap: 10,
      fontSize: 11,
    },
    chip: {
      borderRadius: 999,
      border: "1px solid rgba(148,163,184,0.6)",
      padding: "5px 12px",
      textDecoration: "none",
      color: "#e5e7eb",
      background:
        "radial-gradient(circle at 0 0, rgba(148,163,184,0.18), transparent 60%)",
    },
    footnote: {
      marginTop: 18,
      fontSize: 10,
      color: "#9ca3af",
    },
  };

  return (
    <>
      <Head>
        <title>Privacy Policy – Runway Prompt Studio</title>
      </Head>
      <div style={s.page}>
        <div style={s.card}>
          <div style={s.glow} />
          <div style={s.inner}>
            <div style={s.tag}>Legal</div>
            <h1 style={s.h1}>Privacy Policy</h1>
            <p style={s.subtitle}>
              This Privacy Policy explains how this backend and the Chrome
              extension collect, use, and store data for the Runway Prompt
              Studio automation service.
            </p>

            <h2 style={s.sectionTitle}>1. Data we collect</h2>
            <p style={s.text}>
              We collect only the information required to run the Chrome
              extension, manage licenses, and process payments:
            </p>
            <ul style={s.list}>
              <li>
                <strong>Account data:</strong> Google account email and display
                name obtained through Google OAuth sign-in.
              </li>
              <li>
                <strong>Device data:</strong> a generated device identifier used
                to lock your automation license to a single browser or machine.
              </li>
              <li>
                <strong>Payment data:</strong> QR payment region (PK / INT),
                transaction ID or reference number, status (pending / approved /
                rejected), and license expiry date.
              </li>
              <li>
                <strong>Service logs:</strong> basic technical logs for error
                diagnosis and abuse prevention (e.g. timestamps, API endpoint,
                success / failure).
              </li>
            </ul>

            <h2 style={s.sectionTitle}>2. How we use your data</h2>
            <p style={s.text}>We use this data to:</p>
            <ul style={s.list}>
              <li>Authenticate you in the backend and Chrome extension.</li>
              <li>Verify payments and activate or reject licenses.</li>
              <li>
                Enforce a <strong>single-device license lock</strong> and
                prevent license sharing.
              </li>
              <li>
                Communicate with you about support, billing issues, or suspected
                abuse.
              </li>
            </ul>

            <h2 style={s.sectionTitle}>3. Data storage and retention</h2>
            <p style={s.text}>
              Data is stored in a managed Postgres database (Neon) and on the
              hosting provider used for this backend (for example, Vercel). We
              keep:
            </p>
            <ul style={s.list}>
              <li>
                Account and device data as long as your extension account could
                still be in use or reasonably reactivated.
              </li>
              <li>
                Payment records for bookkeeping, fraud prevention, and audit
                purposes.
              </li>
              <li>
                Logs for a limited time necessary to investigate incidents and
                maintain service reliability.
              </li>
            </ul>

            <h2 style={s.sectionTitle}>4. Third-party services</h2>
            <p style={s.text}>
              We rely on third parties to provide core infrastructure:
            </p>
            <ul style={s.list}>
              <li>Google OAuth for sign-in and basic user profile data.</li>
              <li>Database and hosting providers to store and serve data.</li>
              <li>
                Optional analytics or error-tracking tools, if enabled in the
                future (these will be described in an updated version of this
                policy).
              </li>
            </ul>
            <p style={s.text}>
              These third parties process data under their own privacy policies
              and security practices.
            </p>

            <h2 style={s.sectionTitle}>5. Cookies and similar technologies</h2>
            <p style={s.text}>
              The backend may use session cookies or tokens to keep you signed
              in after logging in with Google. If additional tracking or
              analytics cookies are added, this page will be updated to describe
              them. You can clear cookies in your browser to sign out and reset
              sessions.
            </p>

            <h2 style={s.sectionTitle}>6. Your choices and rights</h2>
            <p style={s.text}>
              Depending on your location, you may have rights to access, update,
              or delete certain information. You can:
            </p>
            <ul style={s.list}>
              <li>
                Sign out and stop using the Chrome extension and this backend.
              </li>
              <li>
                Request that your account and license records be removed, where
                technically and legally possible.
              </li>
            </ul>
            <p style={s.text}>
              To make a request, contact the project owner using the support
              email advertised inside the extension or payment page.
            </p>

            <h2 style={s.sectionTitle}>7. Data security</h2>
            <p style={s.text}>
              Reasonable technical and organizational measures are used to
              protect your data (encrypted connections, restricted admin panel,
              server-side checks). No online service can guarantee perfect
              security, but we aim to minimise the data stored and limit access
              to it.
            </p>

            <h2 style={s.sectionTitle}>8. Changes to this policy</h2>
            <p style={s.text}>
              This Privacy Policy may be updated from time to time as the
              service evolves. When changes are made, a revised version will be
              published at this URL. Continued use of the extension or backend
              after an update means you accept the new version.
            </p>

            <div style={s.navRow}>
              <Link href="/" style={s.chip}>
                Back to main portal
              </Link>
              <Link href="/legal/terms" style={s.chip}>
                View Terms of Service
              </Link>
            </div>

            <p style={s.footnote}>
              This document is provided for transparency and does not constitute
              legal advice. If you have strict legal or regulatory requirements,
              you should have this policy reviewed by a qualified professional.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
