// pages/index.js
import React, { useState, useEffect } from "react";
import Link from "next/link";

// Minimal icon set reused from payments UI
const Icons = {
  Shield: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  ),
  ArrowRight: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  ),
};

export default function HomePage() {
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

  // Same base styles as user/payments.js
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

    // Background blobs
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
      gap: "8px",
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
      marginBottom: "20px",
      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },

    paragraph: {
      fontSize: "14px",
      lineHeight: 1.7,
      color: "rgba(255,255,255,0.75)",
      marginBottom: "14px",
    },

    bulletList: {
      listStyle: "disc",
      paddingLeft: "20px",
      margin: 0,
      fontSize: "14px",
      color: "rgba(255,255,255,0.75)",
    },

    navList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      marginTop: "10px",
    },
    navLink: (primary) => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 16px",
      borderRadius: "18px",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: primary ? 700 : 500,
      background: primary
        ? "linear-gradient(135deg, #ff0f7b 0%, #f89b29 100%)"
        : "rgba(0,0,0,0.3)",
      color: "#fff",
      border: primary
        ? "1px solid rgba(255,255,255,0.35)"
        : "1px solid rgba(255,255,255,0.12)",
      boxShadow: primary
        ? "0 12px 35px rgba(255,15,123,0.5)"
        : "0 8px 25px rgba(0,0,0,0.4)",
    }),
    navLabel: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
    },
    navTitle: {
      fontSize: "14px",
    },
    navSubtitle: {
      fontSize: "12px",
      opacity: 0.75,
    },
  };

  return (
    <div style={s.page}>
      <div style={s.blob1} />
      <div style={s.blob2} />
      <div style={s.blob3} />

      <div style={s.container}>
        <div style={s.header}>
          <div style={s.statusPill}>
            <Icons.Shield />
            Runway Prompt Studio – Portal
          </div>
          <h1 style={s.h1}>Control your extension access</h1>
          <div style={s.subtitle}>
            One place to manage payments, license status and legal information
            for the Chrome extension.
          </div>
        </div>

        <div style={s.grid}>
          {/* Left main description card */}
          <div style={{ ...s.glassPanel, ...s.leftCol }}>
            <div style={s.sectionTitle}>What you can do here</div>
            <p style={s.paragraph}>
              This portal connects your Google account, your browser device and
              your QR-based payments to the automation extension that runs
              inside{" "}
              <code style={{ fontSize: 12 }}>app.runwayml.com</code>.
            </p>
            <ul style={s.bulletList}>
              <li>Unlock or renew your license via QR payment</li>
              <li>Keep the license tied to your current device</li>
              <li>View privacy &amp; terms at any time</li>
              <li>Open the payment screen used by the extension</li>
            </ul>
            <p style={{ ...s.paragraph, marginTop: "14px" }}>
              To actually activate or extend your plan, go to the Payment page
              below, pay using the QR code and submit your transaction ID for
              manual approval.
            </p>
          </div>

          {/* Right column – navigation & info */}
          <div style={s.rightCol}>
            <div style={s.glassPanel}>
              <div style={s.sectionTitle}>Quick navigation</div>
              <div style={s.navList}>
                <Link href="/user/payments" style={s.navLink(true)}>
                  <div style={s.navLabel}>
                    <span style={s.navTitle}>Payment &amp; License</span>
                    <span style={s.navSubtitle}>
                      Scan QR, submit transaction ID, check status.
                    </span>
                  </div>
                  <Icons.ArrowRight />
                </Link>

                <Link href="/about" style={s.navLink(false)}>
                  <div style={s.navLabel}>
                    <span style={s.navTitle}>About Runway Prompt Studio</span>
                    <span style={s.navSubtitle}>
                      What this tool does and how it connects to RunwayML.
                    </span>
                  </div>
                  <Icons.ArrowRight />
                </Link>

                <Link href="/legal/privacy" style={s.navLink(false)}>
                  <div style={s.navLabel}>
                    <span style={s.navTitle}>Privacy Policy</span>
                    <span style={s.navSubtitle}>
                      How account, device and payment reference data is stored.
                    </span>
                  </div>
                  <Icons.ArrowRight />
                </Link>

                <Link href="/legal/terms" style={s.navLink(false)}>
                  <div style={s.navLabel}>
                    <span style={s.navTitle}>Terms of Service</span>
                    <span style={s.navSubtitle}>
                      License rules, allowed use and device lock conditions.
                    </span>
                  </div>
                  <Icons.ArrowRight />
                </Link>
              </div>
            </div>

            <div style={s.glassPanel}>
              <div style={s.sectionTitle}>How it links with the extension</div>
              <p style={s.paragraph}>
                The Chrome extension calls this backend using a secure token and
                your Google login session. When your license is active, the
                extension unlocks automation features inside RunwayML. When the
                license expires, it falls back to a free / locked state.
              </p>
              <p style={s.paragraph}>
                Always install the extension build that matches this backend
                token. If you reset devices or rotate tokens from the admin
                side, you may need to update the extension configuration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
