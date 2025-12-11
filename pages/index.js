import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

// --- Icons (Clean & Sharp) ---
const Icons = {
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  Shield: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  ),
  Zap: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
  ),
  Info: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  ),
  External: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  )
};

export default function HomePage() {
  // For responsive grid without breaking SSR
  const [isNarrow, setIsNarrow] = useState(false);

  // Responsive: detect width on client only
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setIsNarrow(window.innerWidth < 850);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ----------------------------------------------------------------
  // VIBRANT GLASS STYLES
  // ----------------------------------------------------------------
  const s = {
    page: {
      minHeight: "100vh",
      background: "#0f0c29",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      position: "relative",
      overflowX: "hidden",
      display: "flex",
      justifyContent: "center",
      padding: "80px 20px",
    },

    // Background blobs
    blob1: {
      position: "absolute",
      top: "-15%",
      left: "-10%",
      width: "60vw",
      height: "60vw",
      background: "radial-gradient(circle, #ff0f7b 0%, rgba(0,0,0,0) 70%)",
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
      background: "radial-gradient(circle, #f89b29 0%, rgba(0,0,0,0) 70%)",
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
      background: "radial-gradient(circle, #8A2387 0%, rgba(0,0,0,0) 70%)",
      filter: "blur(90px)",
      opacity: 0.4,
      zIndex: 0,
    },

    container: {
      width: "100%",
      maxWidth: "1100px",
      position: "relative",
      zIndex: 10,
      display: "flex",
      flexDirection: "column",
      gap: "30px",
    },

    // Header
    header: {
      textAlign: "center",
      marginBottom: "20px",
    },
    headerTag: {
      fontSize: "12px",
      letterSpacing: "0.25em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.6)",
      marginBottom: "12px",
      fontWeight: 600,
    },
    h1: {
      fontSize: "48px",
      fontWeight: "800",
      letterSpacing: "-1.5px",
      color: "#fff",
      margin: "0 0 16px 0",
      textShadow: "0 4px 20px rgba(0,0,0,0.3)",
      lineHeight: 1.1,
    },
    subtitle: {
      fontSize: "18px",
      color: "rgba(255,255,255,0.7)",
      fontWeight: "400",
      maxWidth: "600px",
      margin: "0 auto",
      lineHeight: 1.6,
    },
    highlight: {
      color: "#fff",
      fontWeight: 600,
      position: "relative",
      display: "inline-block",
    },

    // Grid
    grid: {
      display: isNarrow ? "flex" : "grid",
      flexDirection: isNarrow ? "column" : undefined,
      gridTemplateColumns: isNarrow ? undefined : "repeat(12, 1fr)",
      gap: "24px",
    },

    // Glass card
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
      display: "flex",
      flexDirection: "column",
    },

    leftCol: {
      gridColumn: isNarrow ? undefined : "span 7",
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
      display: "flex",
      alignItems: "center",
      gap: "10px",
      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    text: {
      fontSize: "15px",
      lineHeight: "1.7",
      color: "rgba(255,255,255,0.7)",
      marginBottom: "20px",
    },

    // Lists
    stepList: { listStyle: "none", padding: 0, margin: "0 0 30px 0" },
    stepItem: {
      display: "flex",
      gap: "15px",
      marginBottom: "16px",
      alignItems: "flex-start",
    },
    stepIcon: {
      background: "rgba(255,255,255,0.1)",
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      flexShrink: 0,
      marginTop: "2px",
    },

    // Buttons
    btnRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      marginTop: "auto",
    },
    primaryBtn: {
      flex: 1,
      minWidth: "200px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px 24px",
      borderRadius: "16px",
      border: "none",
      background: "linear-gradient(135deg, #ff0f7b 0%, #f89b29 100%)",
      color: "#fff",
      fontSize: "15px",
      fontWeight: "700",
      cursor: "pointer",
      boxShadow: "0 10px 40px -10px rgba(255, 15, 123, 0.5)",
      textDecoration: "none",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      gap: "8px",
    },
    secondaryBtn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px 24px",
      borderRadius: "16px",
      border: "1px solid rgba(255,255,255,0.2)",
      background: "rgba(255,255,255,0.05)",
      color: "#fff",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      textDecoration: "none",
      transition: "background 0.2s ease",
    },

    // Footer Links
    tinyLinkRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      marginTop: "30px",
      paddingTop: "20px",
      borderTop: "1px solid rgba(255,255,255,0.1)",
    },
    tinyLink: {
      fontSize: "12px",
      color: "rgba(255,255,255,0.4)",
      textDecoration: "none",
      transition: "color 0.2s",
    },

    // Status pill
    statusPill: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "6px 14px",
      borderRadius: "100px",
      fontSize: "12px",
      fontWeight: "600",
      background: "rgba(34, 197, 94, 0.15)",
      border: "1px solid rgba(34, 197, 94, 0.3)",
      color: "#86efac",
      backdropFilter: "blur(10px)",
      margin: "0 auto",
      marginBottom: "20px",
    },
  };

  return (
    <>
      <Head>
        <title>Runway Prompt Studio – Backend</title>
      </Head>

      <div style={s.page}>
        {/* Background Blobs */}
        <div style={s.blob1} />
        <div style={s.blob2} />
        <div style={s.blob3} />

        <div style={s.container}>
          {/* Header */}
          <header style={s.header}>
            <div style={s.headerTag}>Runway Prompt Studio</div>
            <div style={s.statusPill}>
              <Icons.Check /> Signed in with Google
            </div>
            
            <h1 style={s.h1}>Chrome Extension Portal</h1>
            <p style={s.subtitle}>
              Link your device and manage your{" "}
              <span style={s.highlight}>automation license</span> from here.
            </p>
          </header>

          <div style={s.grid}>
            {/* Left Column: Main Info & Actions */}
            <div style={{ ...s.glassPanel, ...s.leftCol }}>
              <div style={s.sectionTitle}>
                <Icons.Zap /> How this backend is used
              </div>
              
              <p style={s.text}>
                If you installed the <strong>Runway Prompt Studio</strong> Chrome extension,
                this site is your control center. You don't need to stay here; just use it for:
              </p>

              <ul style={s.stepList}>
                <li style={s.stepItem}>
                  <div style={s.stepIcon}><Icons.Check /></div>
                  <div style={{...s.text, marginBottom: 0}}>Signing in securely with your Google account</div>
                </li>
                <li style={s.stepItem}>
                  <div style={s.stepIcon}><Icons.Check /></div>
                  <div style={{...s.text, marginBottom: 0}}>Viewing QR codes and payment instructions</div>
                </li>
                <li style={s.stepItem}>
                  <div style={s.stepIcon}><Icons.Check /></div>
                  <div style={{...s.text, marginBottom: 0}}>Linking your device and reviewing subscription status</div>
                </li>
              </ul>

              <div style={s.btnRow}>
                <Link href="/user/payments" style={s.primaryBtn}>
                  Open Payment / Subscription Page <Icons.ArrowRight />
                </Link>

                <Link href="/about" style={s.secondaryBtn}>
                  About Project
                </Link>
              </div>

              <div style={s.tinyLinkRow}>
                <Link href="/legal/privacy" style={s.tinyLink}>
                  Privacy Policy
                </Link>
                <Link href="/legal/terms" style={s.tinyLink}>
                  Terms &amp; License
                </Link>
                <span style={s.tinyLink}>
                  Independent from RunwayML.
                </span>
              </div>
            </div>

            {/* Right Column: Side Info Cards */}
            <div style={s.rightCol}>
              
              {/* Card 1: Users */}
              <div style={s.glassPanel}>
                <div style={s.sectionTitle}>
                  <Icons.Users /> For extension users
                </div>
                <div style={{...s.text, fontSize: '14px', marginBottom: 0}}>
                  1. Log in with the same Google account you use inside <code>app.runwayml.com</code>.
                  <br /><br />
                  2. Complete a QR payment once.
                  <br /><br />
                  3. Enter the transaction ID inside the <strong>floating panel</strong> on Runway.
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}