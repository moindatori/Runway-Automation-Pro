// pages/legal/terms.jsx
import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function TermsPage() {
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
      maxWidth: 840,
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
        <title>Terms of Service – Runway Prompt Studio</title>
      </Head>
      <div style={s.page}>
        <div style={s.card}>
          <div style={s.glow} />
          <div style={s.inner}>
            <div style={s.tag}>Legal</div>
            <h1 style={s.h1}>Terms of Service</h1>
            <p style={s.subtitle}>
              By installing and using the Runway Prompt Studio Chrome extension
              or this backend, you agree to the terms below.
            </p>

            <h2 style={s.sectionTitle}>1. Service description</h2>
            <p style={s.text}>
              Runway Prompt Studio is an automation layer that interacts with{" "}
              <code>app.runwayml.com</code> in your browser. It automates prompt
              workflows, asset selection and related actions but does not
              provide any RunwayML credits or infrastructure itself.
            </p>

            <h2 style={s.sectionTitle}>2. Independent project</h2>
            <p style={s.text}>
              This project is{" "}
              <strong>not affiliated with or endorsed by Runway / RunwayML</strong>
              . You are responsible for complying with RunwayML&apos;s own
              Terms of Service and usage limits while using this automation.
            </p>

            <h2 style={s.sectionTitle}>3. License and device lock</h2>
            <ul style={s.list}>
              <li>
                A paid plan grants you a personal, non-transferable license to
                use the extension&apos;s automation features.
              </li>
              <li>
                Licenses are strictly{" "}
                <strong>locked to a single device / browser profile</strong> via
                a device identifier.
              </li>
              <li>
                Sharing a license, selling access, or bypassing device locks is
                not allowed and may result in immediate cancellation without
                refund.
              </li>
              <li>
                Admins may reset a device lock manually at their discretion (for
                example when you change computer), usually after verifying your
                email and transaction history.
              </li>
            </ul>

            <h2 style={s.sectionTitle}>4. Payments, duration and renewal</h2>
            <ul style={s.list}>
              <li>
                Payments are made via QR code in PKR or USD, as shown on the
                payment page.
              </li>
              <li>
                A standard plan currently activates automation access for{" "}
                <strong>30 days per approved payment</strong>.
              </li>
              <li>
                After expiry, the extension may switch to a restricted or
                disabled mode until a new payment is approved.
              </li>
            </ul>

            <h2 style={s.sectionTitle}>5. Refund and cancellation policy</h2>
            <ul style={s.list}>
              <li>
                Because payments are manual and licenses are granted digitally,
                all payments are generally{" "}
                <strong>non-refundable once approved</strong>.
              </li>
              <li>
                If you send the wrong amount or incorrect reference, approval
                may be delayed or rejected. Admins can decide on a case-by-case
                basis whether to adjust or refund.
              </li>
              <li>
                If suspicious activity or abuse is detected (for example
                reselling your license or circumventing the device lock), your
                access may be cancelled early without refund.
              </li>
            </ul>

            <h2 style={s.sectionTitle}>6. Acceptable use</h2>
            <p style={s.text}>
              You agree not to use the extension or backend to:
            </p>
            <ul style={s.list}>
              <li>violate RunwayML&apos;s own terms or content policies;</li>
              <li>
                run automation on accounts you do not own or have permission to
                control;
              </li>
              <li>
                attempt to reverse engineer, copy or redistribute the extension
                code, backend logic or license system;
              </li>
              <li>
                attack, overload, or otherwise disrupt the underlying services.
              </li>
            </ul>

            <h2 style={s.sectionTitle}>7. Availability and changes</h2>
            <p style={s.text}>
              The service is provided on a best-effort basis. There is no
              guarantee of uninterrupted uptime, compatibility with all RunwayML
              updates, or suitability for any particular project. Features,
              pricing and license rules may change in the future. If terms
              change, an updated version will be posted at this URL.
            </p>

            <h2 style={s.sectionTitle}>8. Disclaimers</h2>
            <p style={s.text}>
              The extension and backend are provided &quot;as is&quot; without
              any warranties. You are responsible for verifying outputs,
              respecting third-party rights, and keeping backups of important
              work. The project owner is not responsible for any loss of data,
              missed deadlines, or issues caused by RunwayML outages or API
              changes.
            </p>

            <h2 style={s.sectionTitle}>9. Limitation of liability</h2>
            <p style={s.text}>
              To the maximum extent permitted by law, any liability arising from
              the use of this service is limited to the amount you paid for your
              most recent 30-day license period. Indirect, consequential or
              special damages are excluded.
            </p>

            <h2 style={s.sectionTitle}>10. Governing law</h2>
            <p style={s.text}>
              These terms are governed by the laws of the jurisdiction indicated
              by the project owner. Any disputes should first be addressed
              informally via email support; if unresolved, they may be escalated
              under the applicable local law.
            </p>

            <div style={s.navRow}>
              <Link href="/" style={s.chip}>
                Back to main portal
              </Link>
              <Link href="/legal/privacy" style={s.chip}>
                View Privacy Policy
              </Link>
            </div>

            <p style={s.footnote}>
              This text is a general template and is not a substitute for
              professional legal advice. For formal compliance you should ask a
              qualified lawyer to review and adapt these terms.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
