// pages/legal/privacy.js
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function PrivacyPage() {
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
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "700",
      marginBottom: "10px",
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
    section: {
      marginBottom: "16px",
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
          <div style={s.statusPill}>Privacy Policy</div>
          <h1 style={s.h1}>How your data is handled</h1>
          <div style={s.subtitle}>
            Minimal information, only what is needed to operate licensing and
            QR-based payments for the extension.
          </div>
        </div>

        <div style={s.glassPanel}>
          <div style={s.section}>
            <div style={s.sectionTitle}>1. Data we store</div>
            <p style={s.paragraph}>We store only a limited set of fields:</p>
            <ul style={s.bulletList}>
              <li>Your Google account email (for login and mapping license)</li>
              <li>
                A device identifier used to lock the license to one machine /
                browser
              </li>
              <li>
                QR payment references (transaction ID, region, status and
                validity period)
              </li>
              <li>
                Timestamps for creation, updates and license expiration
              </li>
            </ul>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>2. What we do not store</div>
            <p style={s.paragraph}>
              We do not store your bank / card details or actual wallet balance.
              QR payments are initiated from your own banking / wallet app.
            </p>
            <p style={s.paragraph}>
              We also do not store your Runway projects or media; the extension
              only automates clicks and prompt flows in your existing RunwayML
              account.
            </p>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>3. How data is used</div>
            <p style={s.paragraph}>
              Your data is used strictly to:
            </p>
            <ul style={s.bulletList}>
              <li>verify if you have an active paid license,</li>
              <li>
                enforce one-device-per-license (unless manually reset by admin),
              </li>
              <li>
                allow the extension to unlock features when running on{" "}
                <code style={{ fontSize: 12 }}>app.runwayml.com</code>.
              </li>
            </ul>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>4. Hosting & logs</div>
            <p style={s.paragraph}>
              The backend and database run on modern cloud providers (such as
              Vercel and Neon). These services may keep operational logs and
              metadata in line with their own privacy policies.
            </p>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>5. Retention & removal</div>
            <p style={s.paragraph}>
              License and payment records can be kept as long as necessary for
              support, fraud prevention and internal accounting. If you want to
              remove your data, you can request deletion through the support
              contact used in your extension or payment instructions.
            </p>
          </div>

          <div style={s.chips}>
            <Link href="/" style={s.chipLink}>
              Back to portal
            </Link>
            <Link href="/user/payments" style={s.chipLink}>
              Payment &amp; License page
            </Link>
            <Link href="/legal/terms" style={s.chipLink}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
