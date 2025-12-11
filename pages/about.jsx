import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function AboutPage() {
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
      gap: 20,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 16,
      flexWrap: "wrap",
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
      maxWidth: 520,
    },
    main: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1.1fr)",
      gap: 20,
    },
    column: {
      borderRadius: 22,
      padding: "18px 18px 16px",
      border: "1px solid rgba(148,163,184,0.45)",
      background:
        "radial-gradient(circle at 0 0, rgba(59,130,246,0.25), transparent 55%), rgba(15,23,42,0.96)",
      boxShadow: "0 22px 60px rgba(15,23,42,0.9)",
      fontSize: 12,
    },
    columnAlt: {
      borderRadius: 22,
      padding: "18px 18px 16px",
      border: "1px solid rgba(148,163,184,0.45)",
      background:
        "radial-gradient(circle at 100% 0, rgba(236,72,153,0.32), transparent 55%), rgba(15,23,42,0.96)",
      boxShadow: "0 22px 60px rgba(15,23,42,0.9)",
      fontSize: 12,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 600,
      marginBottom: 6,
      color: "#e5e7eb",
    },
    body: {
      fontSize: 12,
      lineHeight: 1.7,
      color: "rgba(226,232,240,0.85)",
    },
    list: {
      marginTop: 6,
      paddingLeft: 18,
      fontSize: 12,
      lineHeight: 1.7,
      color: "#9ca3af",
    },
    chipsRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 10,
      fontSize: 11,
    },
    chip: {
      padding: "4px 10px",
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
        <title>About – Runway Prompt Studio</title>
      </Head>

      <div style={s.page}>
        <div style={s.blob1} />
        <div style={s.blob2} />
        <div style={s.blob3} />

        <div style={s.container}>
          <div style={s.shell}>
            <div style={s.shellInnerGlow} />
            <div style={s.shellContent}>
              <header style={s.header}>
                <div>
                  <div style={s.tag}>Runway Prompt Studio</div>
                  <h1 style={s.title}>About this project</h1>
                  <p style={s.subtitle}>
                    A Chrome extension and backend that automate prompt
                    workflows for RunwayML&apos;s Gen-4 tools, with device-locked
                    licensing and QR-based subscriptions.
                  </p>
                </div>
              </header>

              <main style={s.main}>
                <section style={s.column}>
                  <div style={s.sectionTitle}>What it does</div>
                  <p style={s.body}>
                    Runway Prompt Studio is built to speed up everyday work
                    inside <code style={{ fontSize: 11 }}>app.runwayml.com</code>
                    . It focuses on:
                  </p>
                  <ul style={s.list}>
                    <li>floating UI panels and automation helpers</li>
                    <li>bulk prompt generation and CSV-driven flows</li>
                    <li>image-to-video prompt presets and fine-tuned motion</li>
                    <li>simple QR payments and manual license control</li>
                  </ul>
                  <p style={{ ...s.body, marginTop: 8 }}>
                    The backend you are viewing stores only what is required to
                    link your browser device, your Google account and your
                    payment reference.
                  </p>
                </section>

                <aside style={s.columnAlt}>
                  <div style={s.sectionTitle}>Independent tool</div>
                  <p style={s.body}>
                    Runway Prompt Studio is an independent project. It is{" "}
                    <strong>not</strong> affiliated with, endorsed by, or
                    sponsored by Runway / RunwayML. All trademarks are the
                    property of their respective owners.
                  </p>

                  <p style={{ ...s.body, marginTop: 10 }}>
                    You remain responsible for how you use RunwayML. Always
                    follow RunwayML&apos;s own{" "}
                    <a
                      href="https://runwayml.com/terms"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#93c5fd", textDecoration: "underline" }}
                    >
                      Terms
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://runwayml.com/privacy"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#93c5fd", textDecoration: "underline" }}
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>

                  <div style={s.chipsRow}>
                    <Link href="/legal/privacy" style={s.chip}>
                      Privacy Policy
                    </Link>
                    <Link href="/legal/terms" style={s.chip}>
                      Terms of Service
                    </Link>
                    <Link href="/user/payments" style={s.chip}>
                      Open payment page
                    </Link>
                  </div>
                </aside>
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
