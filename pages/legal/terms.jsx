import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function TermsPage() {
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
        <title>Terms of Service – Runway Prompt Studio</title>
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
                <h1 style={s.title}>Terms of Service</h1>
                <p style={s.subtitle}>
                  These terms govern your use of the Runway Prompt Studio Chrome
                  extension and the associated backend used for licensing and
                  payments.
                </p>
              </header>

              <section style={s.section}>
                <div style={s.sectionTitle}>1. Relationship to RunwayML</div>
                <p>
                  Runway Prompt Studio is an independent tool built to automate
                  workflows inside{" "}
                  <code style={{ fontSize: 11 }}>app.runwayml.com</code>.
                  It is not affiliated with, endorsed by, or sponsored by
                  Runway / RunwayML. Your Runway account remains subject to
                  RunwayML&apos;s own{" "}
                  <a
                    href="https://runwayml.com/terms"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#93c5fd", textDecoration: "underline" }}
                  >
                    Terms of Service
                  </a>
                  .
                </p>
              </section>

              <section style={s.section}>
                <div style={s.sectionTitle}>2. License &amp; usage</div>
                <ul style={s.list}>
                  <li>
                    A paid license is granted on a{" "}
                    <strong>per-Google account, per device</strong> basis.
                  </li>
                  <li>
                    You may not resell, share, or sub-license your access or
                    try to bypass the device-lock system.
                  </li>
                  <li>
                    The extension is provided for your own Runway projects and
                    compliant creative workflows only.
                  </li>
                </ul>
              </section>

              <section style={s.section}>
                <div style={s.sectionTitle}>3. Payments and renewals</div>
                <p>
                  Payments are processed manually through QR codes and reviewed
                  before activation:
                </p>
                <ul style={s.list}>
                  <li>
                    Each approved payment unlocks the extension for a defined
                    period (for example 30 days).
                  </li>
                  <li>
                    If a payment is rejected or refunded, access may be revoked
                    or shortened.
                  </li>
                  <li>
                    No guarantee is made that pricing will remain the same in
                    the future.
                  </li>
                </ul>
              </section>

              <section style={s.section}>
                <div style={s.sectionTitle}>4. Device lock &amp; resets</div>
                <p>
                  To prevent sharing, one license is tied to a single device
                  identifier. Moving to a new machine or browser may require a
                  manual reset via the admin panel, at the developer&apos;s
                  discretion.
                </p>
              </section>

              <section style={s.section}>
                <div style={s.sectionTitle}>5. Acceptable use</div>
                <p>
                  You agree not to use Runway Prompt Studio to violate any
                  applicable law, RunwayML&apos;s policies, or the terms of any
                  other platform or service. Abuse (including spam, scraping, or
                  automated harassment) may result in immediate termination.
                </p>
              </section>

              <section style={s.section}>
                <div style={s.sectionTitle}>6. Warranty &amp; liability</div>
                <p>
                  The extension and backend are provided on an{" "}
                  <strong>&quot;as-is&quot;</strong> basis without warranties of
                  any kind. To the maximum extent permitted by law, the
                  developer will not be liable for any indirect, incidental or
                  consequential damages arising from your use of this tool.
                </p>
              </section>

              <section style={s.section}>
                <div style={s.sectionTitle}>7. Changes to these terms</div>
                <p>
                  These terms may be updated over time. Continued use of the
                  extension after changes are published will mean you accept the
                  revised terms.
                </p>
              </section>

              <div style={s.footerLinks}>
                <Link href="/" style={s.chip}>
                  Back to portal
                </Link>
                <Link href="/user/payments" style={s.chip}>
                  Open payment page
                </Link>
                <Link href="/legal/privacy" style={s.chip}>
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
