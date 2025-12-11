// pages/legal/terms.js
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function TermsPage() {
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
      background: "#0f0c29",
      fontFamily: "'Inter', system-ui, sans-serif",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      padding: "80px 20px",
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
      maxWidth: "1000px",
      position: "relative",
      zIndex: 10,
      display: "flex",
      flexDirection: "column",
      gap: "30px",
    },
    header: { textAlign: "center", marginBottom: "20px" },
    h1: {
      fontSize: "42px",
      fontWeight: "800",
      letterSpacing: "-1px",
      color: "#fff",
      margin: "0 0 10px 0",
      textShadow: "0 4px 20px rgba(0,0,0,0.3)",
    },
    subtitle: {
      fontSize: "16px",
      color: "rgba(255,255,255,0.7)",
      fontWeight: "500",
    },
    statusPill: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px 16px",
      borderRadius: "100px",
      fontSize: "13px",
      fontWeight: "600",
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.18)",
      color: "#e5e7eb",
      backdropFilter: "blur(10px)",
      margin: "0 auto 20px",
    },
    glassPanel: {
      background: "rgba(255, 255, 255, 0.03)",
      backdropFilter: "blur(40px)",
      WebkitBackdropFilter: "blur(40px)",
      borderRadius: "30px",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      borderTop: "1px solid rgba(255, 255, 255, 0.3)",
      borderLeft: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      padding: "32px 40px 30px",
      color: "#fff",
      overflow: "hidden",
      position: "relative",
    },
    section: { marginBottom: "16px" },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "700",
      marginBottom: "8px",
      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    paragraph: {
      fontSize: "14px",
      lineHeight: 1.75,
      color: "rgba(255,255,255,0.8)",
      marginBottom: "10px",
    },
    bulletList: {
      listStyle: "disc",
      paddingLeft: "20px",
      margin: 0,
      fontSize: "14px",
      color: "rgba(255,255,255,0.78)",
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginTop: "18px",
    },
    chipLink: {
      padding: "8px 16px",
      borderRadius: "999px",
      border: "1px solid rgba(255,255,255,0.22)",
      background: "rgba(0,0,0,0.35)",
      color: "#fff",
      fontSize: "13px",
      textDecoration: "none",
    },
  };

  return (
    <div style={s.page}>
      <div style={s.blob1} />
      <div style={s.blob2} />
      <div style={s.blob3} />

      <div style={s.container}>
        <div style={s.header}>
          <div style={s.statusPill}>Terms of Service</div>
          <h1 style={s.h1}>Rules for using this tool</h1>
          <div style={s.subtitle}>
            License scope, device locks, payments and your responsibilities when
            using the extension with RunwayML.
          </div>
        </div>

        <div style={s.glassPanel}>
          <div style={s.section}>
            <div style={s.sectionTitle}>1. Independent project</div>
            <p style={s.paragraph}>
              Runway Prompt Studio is an independent tool. It is not affiliated
              with, endorsed by or sponsored by Runway / RunwayML. Your use of
              RunwayML stays governed by RunwayML&apos;s own terms and
              policies.
            </p>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>2. License &amp; device lock</div>
            <ul style={s.bulletList}>
              <li>
                One paid license is linked to one Google account and one device
                at a time.
              </li>
              <li>
                The license may be moved to a new device via manual reset by
                admin, at the developer&apos;s discretion.
              </li>
              <li>
                You agree not to bypass the device lock or share your access
                publicly.
              </li>
            </ul>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>3. Payments and duration</div>
            <p style={s.paragraph}>
              Payments are collected via QR and manually reviewed. When a
              payment is approved, your license is activated for a defined
              period (for example, 30 days). If a payment is rejected,
              fraudulent or refunded, access can be limited or revoked.
            </p>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>4. Acceptable use</div>
            <p style={s.paragraph}>
              You must use the extension in a way that complies with all
              applicable laws, as well as RunwayML&apos;s own acceptable use
              policies. Any abuse (spam, harassment, automated misuse) may lead
              to immediate termination of your license without refund.
            </p>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>5. No warranty</div>
            <p style={s.paragraph}>
              This tool is provided on an &quot;as is&quot; basis, without
              warranties of any kind. To the maximum extent permitted by law,
              the developer is not liable for indirect or consequential damages
              resulting from your use of the extension or backend.
            </p>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>6. Changes to these terms</div>
            <p style={s.paragraph}>
              These terms may change over time. Continued use of the portal and
              extension after updates means you accept the updated version.
            </p>
          </div>

          <div style={s.chips}>
            <Link href="/" style={s.chipLink}>
              Back to portal
            </Link>
            <Link href="/user/payments" style={s.chipLink}>
              Payment &amp; License page
            </Link>
            <Link href="/legal/privacy" style={s.chipLink}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
