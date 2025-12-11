import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function PrivacyPage() {
  const s = {
    page: {
      minHeight: "100vh",
      background: "#0f0c29",
      fontFamily:
        "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      padding: "80px 20px",
      color: "#e5e7eb",
    },
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
      maxWidth: "900px",
      position: "relative",
      zIndex: 10,
    },
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
      gap: 18,
    },
    tag: {
      fontSize: 11,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "#9ca3af",
    },
    title: {
      margin: "4px 0 4px",
      fontSize: 26,
      fontWeight: 800,
      letterSpacing: "-0.02em",
      color: "#f9fafb",
    },
    subtitle: {
      fontSize: 13,
      color: "rgba(226,232,240,0.8)",
      maxWidth: 540,
    },
    section: {
      marginTop: 10,
      fontSize: 12,
      lineHeight: 1.75,
      color: "rgba(226,232,240,0.9)",
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 4,
      color: "#e5e7eb",
    },
    list: {
      marginTop: 4,
      paddingLeft: 18,
      fontSize: 12,
      lineHeight: 1.7,
      color: "#9ca3af",
    },
    footerLinks: {
      display: "flex",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 16,
      fontSize: 11,
    },
    chip: {
      padding: "5px 11px",
      borderRadius: 999,
      border: "1px solid rgba(148,163,184,0.5)",
      background:
        "radial-gradient(circle at 0 0, rgba(148,163,184,0.22), transparent 60%)",
      color: "#e5e7eb",
      textDecoration: "none",
    },
  };

  return (
    <>
      <Head>
        <title>Privacy Policy – Runway Prompt Studio</title>
      </Head>

      <div style={s.page}>
        <div style={s.blob1} />
        <div style={s.blob2} />
        <div style={s.blob3} />

        <div style={s.container}>
          <div style={s.shell}>
            <div style={s.shellInnerGlow} />
            <div style={s.shellContent}>
              <header>
                <div style={s.tag}>Legal</div>
                <h1 style={s.title}>Privacy Policy</h1>
                <p style={s.subtitle}>
                  How Runway Prompt Studio handles the data needed to operate
                  the Chrome extension, payment backend and device-locked
                  license system.
                </p>
              </header>

              <section style={s.section}>
                <div style={s.sectionTitle}>1. Data we collect</div>
                <p>
                  To run the automation and licensing system, we collect and
                  store only a minimal set of information:
                </p>
                <ul style={s.list}>
                  <li>Your Google account email address</li>
                  <li>
                    A generated device identifier used to lock your license to a
                    browser / machine
                  </li>
                  <li>
                    Payment-related references such as QR transaction IDs,
                    region (PK / INT) and status (pending, approved, expired,
                    rejected)
                  </li>
                  <li>Timestamps related to license validity and device usage</li>
                </ul>
              </section>

              <section style={s.section}>
                <div style={s.sectionTitle}>2. What we do not collect</div>
                <p>
                  We do <strong>not</strong> store your Runway projects, assets
                  or credit information. We also do not store card numbers or
                  bank credentials – payments are executed in your own wallet /
                  banking app via QR.
                </p>
              </section>

              <section style={s.section}>
                <div style={s.sectionTitle}>3. How your data is used</div>
                <p>
                  Your data is only used for:
                </p>
                <ul style={s.list}>
                  <li>verifying that you have an active paid license,</li>
                  <li>enforcing the one-device-per-account rule, and</li>
                  <li>
                    allowing the extension to check license status when it runs
                    on <code style={{ fontSize: 11 }}>app.runwayml.com</code>.
                  </li>
                </ul>
                <p style={{ marginTop: 6 }}>
                  We may also review transaction IDs during manual approval to
                  prevent abuse or fraudulent payments.
                </p>
              </section>

              <section style={s.section}>
                <div style={s.sectionTitle}>4. Third-party services</div>
                <p>
                  The backend is hosted on modern cloud infrastructure (for
                  example Vercel and Neon/Postgres). These providers may process
                  logs and metadata as part of their normal operations. Your use
                  of RunwayML itself is governed by{" "}
                  <a
                    href="https://runwayml.com/privacy"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#93c5fd", textDecoration: "underline" }}
                  >
                    RunwayML&apos;s own Privacy Policy
                  </a>
                  .
                </p>
              </section>

              <section style={s.section}>
                <div style={s.sectionTitle}>5. Retention and deletion</div>
                <p>
                  License and payment records may be kept as long as necessary
                  for accounting, support and abuse-prevention purposes. If you
                  would like your account and associated records removed, you
                  can contact support using the email shown in your payment or
                  extension documentation.
                </p>
              </section>

              <section style={s.section}>
                <div style={s.sectionTitle}>6. Contact</div>
                <p>
                  If you have questions about this policy or how your data is
                  handled, please reach out via the support email listed in the
                  extension or QR payment instructions.
                </p>
              </section>

              <div style={s.footerLinks}>
                <Link href="/" style={s.chip}>
                  Back to portal
                </Link>
                <Link href="/user/payments" style={s.chip}>
                  Open payment page
                </Link>
                <Link href="/legal/terms" style={s.chip}>
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
