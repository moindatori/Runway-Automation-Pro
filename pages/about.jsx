// pages/about.js
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AboutPage() {
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
    header: {
      textAlign: "center",
      marginBottom: "20px",
    },
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
    grid: {
      display: isNarrow ? "flex" : "grid",
      flexDirection: isNarrow ? "column" : undefined,
      gridTemplateColumns: isNarrow ? undefined : "repeat(12, 1fr)",
      gap: "24px",
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
      padding: "40px",
      color: "#fff",
      overflow: "hidden",
      position: "relative",
    },
    leftCol: {
      gridColumn: isNarrow ? undefined : "span 7",
      marginBottom: isNarrow ? "20px" : 0,
    },
    rightCol: {
      gridColumn: isNarrow ? undefined : "span 5",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: "700",
      marginBottom: "16px",
      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    paragraph: {
      fontSize: "14px",
      lineHeight: 1.7,
      color: "rgba(255,255,255,0.78)",
      marginBottom: "10px",
    },
    bulletList: {
      listStyle: "disc",
      paddingLeft: "20px",
      margin: 0,
      fontSize: "14px",
      color: "rgba(255,255,255,0.75)",
    },
    chipRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginTop: "16px",
    },
    chipLink: {
      padding: "8px 16px",
      borderRadius: "999px",
      border: "1px solid rgba(255,255,255,0.22)",
      background: "rgba(0,0,0,0.35)",
      color: "#fff",
      fontSize: "13px",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  return (
    <div style={s.page}>
      <div style={s.blob1} />
      <div style={s.blob2} />
      <div style={s.blob3} />

      <div style={s.container}>
        <div style={s.header}>
          <div style={s.statusPill}>About Runway Prompt Studio</div>
          <h1 style={s.h1}>Independent automation toolkit</h1>
          <div style={s.subtitle}>
            Built to speed up RunwayML Gen-4 workflows with a secure,
            device-locked Chrome extension and backend.
          </div>
        </div>

        <div style={s.grid}>
          <div style={{ ...s.glassPanel, ...s.leftCol }}>
            <div style={s.sectionTitle}>What this project does</div>
            <p style={s.paragraph}>
              Runway Prompt Studio combines a Chrome extension, a backend and
              your own RunwayML account. The goal is simple: automate boring
              steps while you stay inside{" "}
              <code style={{ fontSize: 12 }}>app.runwayml.com</code>.
            </p>
            <ul style={s.bulletList}>
              <li>Floating UI over Runway&apos;s interface</li>
              <li>CSV-driven prompts and motion presets</li>
              <li>Image-to-video helper flows</li>
              <li>Secure license check tied to your Google account</li>
            </ul>
            <p style={{ ...s.paragraph, marginTop: "12px" }}>
              Only minimal data is stored: your email, device ID and
              payment-related reference so the license system can work.
            </p>
          </div>

          <div style={{ ...s.glassPanel, ...s.rightCol }}>
            <div style={s.sectionTitle}>Not affiliated with RunwayML</div>
            <p style={s.paragraph}>
              This is an independent project. It is not owned by or officially
              connected to Runway or RunwayML. All trademarks and product names
              belong to their respective owners.
            </p>
            <p style={s.paragraph}>
              You are responsible for how you use Runway Prompt Studio and
              RunwayML together. Always follow RunwayML&apos;s own terms and
              content policies.
            </p>

            <div style={s.chipRow}>
              <Link href="/user/payments" style={s.chipLink}>
                Open payment &amp; license page
              </Link>
              <Link href="/legal/privacy" style={s.chipLink}>
                Privacy Policy
              </Link>
              <Link href="/legal/terms" style={s.chipLink}>
                Terms of Service
              </Link>
              <Link href="/" style={s.chipLink}>
                Back to portal home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
