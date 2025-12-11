// pages/user/payments.js

import React, { useState, useEffect } from "react";

// --- Icons (Clean & Sharp) ---
const Icons = {
  Check: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  Clock: () => (
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
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  Alert: () => (
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
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  ),
  Globe: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  ),
  Shield: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  ),
  Flag: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
      <line x1="4" y1="22" x2="4" y2="15"></line>
    </svg>
  ),
  CreditCard: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
      <line x1="1" y1="10" x2="23" y2="10"></line>
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

export default function UserPaymentsPage() {
  const [region, setRegion] = useState("PK");

  // Payment logic
  const [paymentStatus, setPaymentStatus] = useState("checking"); // checking | none | pending | active | rejected
  const [existingTxId, setExistingTxId] = useState("");
  const [txIdInput, setTxIdInput] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // For responsive grid without breaking SSR
  const [isNarrow, setIsNarrow] = useState(false);

  const isPK = region === "PK";
  const qrUrl = isPK ? "/qr/pk_1000.png" : "/qr/intl_10usd.png";
  const amountText = isPK ? "Rs1000 / 30 days" : "$10 / 30 days";

  // If pending/active: show form + button but keep them disabled
  const isFormReadOnly =
    paymentStatus === "pending" || paymentStatus === "active";

  // Load current payment / subscription status
  useEffect(() => {
    let cancelled = false;
    async function fetchStatus() {
      try {
        setPaymentStatus("checking");
        setSubmitError("");
        const res = await fetch("/api/user/payments/status");
        if (!res.ok) throw new Error("Unable to read payment status.");
        const data = await res.json();
        if (cancelled) return;

        // Normalize status in case backend uses different casing/field
        const rawStatus = (
          data.status ||
          data.subscriptionStatus ||
          "none"
        )
          .toString()
          .toLowerCase();

        const normalizedStatus =
          rawStatus === "active" ||
          rawStatus === "pending" ||
          rawStatus === "rejected" ||
          rawStatus === "none"
            ? rawStatus
            : "none";

        setPaymentStatus(normalizedStatus);

        // Try a few common keys for transaction id
        setExistingTxId(
          data.transactionId ||
            data.txId ||
            (data.payment && data.payment.transactionId) ||
            ""
        );
      } catch (err) {
        if (cancelled) return;
        setPaymentStatus("none");
        setExistingTxId("");
      }
    }
    fetchStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  // Responsive: detect width on client only
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setIsNarrow(window.innerWidth < 800);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Submit transaction ID
  async function handleSubmitTransaction(e) {
    e.preventDefault();
    if (isFormReadOnly) return;

    const cleanTx = txIdInput.trim();
    if (!cleanTx) {
      setSubmitError("Please enter your payment transaction ID.");
      setSubmitSuccess("");
      return;
    }
    try {
      setSubmitLoading(true);
      setSubmitError("");
      setSubmitSuccess("");

      const res = await fetch("/api/user/payments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: cleanTx, region }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        throw new Error(
          data.message || "Unable to submit transaction. Try again."
        );
      }

      setPaymentStatus("pending");
      setExistingTxId(cleanTx);
      setTxIdInput("");
      setSubmitSuccess("Transaction submitted. Pending manual review.");
    } catch (err) {
      setSubmitError(
        err && err.message ? err.message : "Unexpected error. Please try again."
      );
    } finally {
      setSubmitLoading(false);
    }
  }

  // ----------------------------------------------------------------
  // VIBRANT GLASS STYLES
  // ----------------------------------------------------------------
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

    // Header
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
      marginBottom: "24px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },

    // Region tabs
    tabs: {
      display: "flex",
      gap: "12px",
      marginBottom: "30px",
    },
    tabBtn: (active) => ({
      flex: 1,
      padding: "16px",
      borderRadius: "20px",
      border: active
        ? "1px solid rgba(255,255,255,0.4)"
        : "1px solid rgba(255,255,255,0.1)",
      background: active
        ? "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))"
        : "rgba(0,0,0,0.2)",
      color: active ? "#fff" : "rgba(255,255,255,0.5)",
      fontSize: "15px",
      fontWeight: active ? "700" : "500",
      cursor: "pointer",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
      boxShadow: active ? "0 8px 32px rgba(0,0,0,0.2)" : "none",
    }),

    // QR
    qrBox: {
      background: "rgba(0,0,0,0.3)",
      borderRadius: "24px",
      padding: "30px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    qrImg: {
      width: "220px",
      height: "220px",
      borderRadius: "16px",
      marginBottom: "20px",
      boxShadow: "0 0 0 8px rgba(255,255,255,0.1)",
    },
    priceBadge: {
      background: "rgba(255,255,255,0.15)",
      padding: "8px 20px",
      borderRadius: "100px",
      fontSize: "16px",
      fontWeight: "600",
      border: "1px solid rgba(255,255,255,0.2)",
    },

    // Steps
    stepList: { listStyle: "none", padding: 0, margin: 0 },
    stepItem: {
      display: "flex",
      gap: "15px",
      marginBottom: "20px",
      alignItems: "flex-start",
    },
    stepNum: {
      background: "linear-gradient(135deg, #ff0f7b, #f89b29)",
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "700",
      fontSize: "12px",
      flexShrink: 0,
      boxShadow: "0 4px 10px rgba(248,155,41,0.4)",
    },
    stepText: {
      fontSize: "14px",
      color: "rgba(255,255,255,0.8)",
      lineHeight: "1.6",
    },

    // Input & Button
    input: {
      width: "100%",
      background: "rgba(0,0,0,0.2)",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: "16px",
      padding: "18px 20px",
      fontSize: "16px",
      color: "#fff",
      outline: "none",
      marginBottom: "16px",
      transition: "all 0.2s",
      fontFamily: "monospace",
    },
    btn: {
      width: "100%",
      padding: "18px",
      borderRadius: "16px",
      border: "none",
      background: isFormReadOnly
        ? "rgba(255,255,255,0.1)"
        : "linear-gradient(135deg, #ff0f7b 0%, #f89b29 100%)",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "700",
      cursor: isFormReadOnly || submitLoading ? "not-allowed" : "pointer",
      boxShadow: isFormReadOnly
        ? "none"
        : "0 10px 40px -10px rgba(255, 15, 123, 0.5)",
      opacity: isFormReadOnly ? 0.6 : 1,
      transition: "transform 0.1s ease",
    },

    // Status pill
    statusPill: (status) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      borderRadius: "100px",
      fontSize: "13px",
      fontWeight: "600",
      background:
        status === "active"
          ? "rgba(34, 197, 94, 0.2)"
          : status === "pending"
          ? "rgba(234, 179, 8, 0.2)"
          : status === "rejected"
          ? "rgba(248, 113, 113, 0.2)"
          : "rgba(255,255,255,0.1)",
      border: "1px solid rgba(255,255,255,0.1)",
      color:
        status === "active"
          ? "#86efac"
          : status === "pending"
          ? "#fde047"
          : status === "rejected"
          ? "#fecaca"
          : "#fff",
      backdropFilter: "blur(10px)",
      margin: "0 auto",
      marginBottom: "20px",
    }),
  };

  const statusLabel =
    paymentStatus === "active"
      ? "Active Plan"
      : paymentStatus === "pending"
      ? "Verification Pending"
      : paymentStatus === "rejected"
      ? "Payment Rejected"
      : paymentStatus === "checking"
      ? "Checking Status"
      : "No Active Plan";

  const buttonLabel =
    submitLoading
      ? "Verifying..."
      : paymentStatus === "active"
      ? "Payment Approved"
      : paymentStatus === "pending"
      ? "Waiting for Approval"
      : "Unlock Now";

  return (
    <div style={s.page}>
      {/* Background Blobs */}
      <div style={s.blob1} />
      <div style={s.blob2} />
      <div style={s.blob3} />

      <div style={s.container}>
        <div style={s.header}>
          <div style={s.statusPill(paymentStatus)}>
            {paymentStatus === "active" ? <Icons.Check /> : <Icons.Shield />}
            {statusLabel}
          </div>
          <h1 style={s.h1}>Unlock Pro Access</h1>
          <div style={s.subtitle}>
            Secure, one-time payment to activate your automation plan.
          </div>
        </div>

        <div style={s.grid}>
          {/* Main Glass Panel (Region + QR) */}
          <div style={{ ...s.glassPanel, ...s.leftCol }}>
            <div style={s.sectionTitle}>
              <Icons.CreditCard /> Choose Region
            </div>

            <div style={s.tabs}>
              <button
                onClick={() => setRegion("PK")}
                style={s.tabBtn(isPK)}
                type="button"
                disabled={submitLoading}
              >
                🇵🇰 PKR
              </button>
              <button
                onClick={() => setRegion("INT")}
                style={s.tabBtn(!isPK)}
                type="button"
                disabled={submitLoading}
              >
                🌐 USD
              </button>
            </div>

            <div style={s.qrBox}>
              <img src={qrUrl} alt="Payment QR Code" style={s.qrImg} />
              <div style={s.priceBadge}>{amountText}</div>
              <p
                style={{
                  marginTop: "15px",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                Scan with your banking / wallet app and send the exact amount
                shown above.
              </p>
            </div>
          </div>

          {/* Side Glass Panels (Steps + Transaction Form) */}
          <div style={s.rightCol}>
            {/* Steps */}
            <div style={s.glassPanel}>
              <div style={s.sectionTitle}>How it works</div>
              <ul style={s.stepList}>
                <li style={s.stepItem}>
                  <div style={s.stepNum}>1</div>
                  <div style={s.stepText}>
                    Scan the QR code shown on the left using your banking or
                    wallet app.
                  </div>
                </li>
                <li style={s.stepItem}>
                  <div style={s.stepNum}>2</div>
                  <div style={s.stepText}>
                    Send exactly <strong>{amountText}</strong>.
                  </div>
                </li>
                <li style={s.stepItem}>
                  <div style={s.stepNum}>3</div>
                  <div style={s.stepText}>
                    Copy the{" "}
                    <strong>transaction ID / reference number</strong> from your
                    payment confirmation screen.
                  </div>
                </li>
                <li style={s.stepItem}>
                  <div style={s.stepNum}>4</div>
                  <div style={s.stepText}>
                    Paste that transaction ID here. After manual review, your
                    device will be unlocked and this form will be locked.
                  </div>
                </li>
              </ul>
            </div>

            {/* Transaction Form */}
            <div style={s.glassPanel}>
              <div style={s.sectionTitle}>Verify Payment</div>
              <form onSubmit={handleSubmitTransaction}>
                <input
                  style={s.input}
                  placeholder="Enter Transaction ID"
                  value={
                    isFormReadOnly && existingTxId ? existingTxId : txIdInput
                  }
                  onChange={(e) =>
                    !isFormReadOnly && setTxIdInput(e.target.value)
                  }
                  disabled={isFormReadOnly || submitLoading}
                />

                {submitError && (
                  <div
                    style={{
                      color: "#ff4d4d",
                      fontSize: "13px",
                      marginBottom: "12px",
                      display: "flex",
                      gap: "6px",
                      alignItems: "center",
                    }}
                  >
                    <Icons.Alert /> {submitError}
                  </div>
                )}
                {submitSuccess && (
                  <div
                    style={{
                      color: "#4ade80",
                      fontSize: "13px",
                      marginBottom: "12px",
                      display: "flex",
                      gap: "6px",
                      alignItems: "center",
                    }}
                  >
                    <Icons.Check /> {submitSuccess}
                  </div>
                )}
                {paymentStatus === "rejected" && !submitError && (
                  <div
                    style={{
                      color: "#fecaca",
                      fontSize: "13px",
                      marginBottom: "12px",
                    }}
                  >
                    Last payment request was rejected. Please double-check your
                    details and submit a new transaction ID.
                  </div>
                )}

                <button
                  style={s.btn}
                  type="submit"
                  disabled={submitLoading || isFormReadOnly}
                >
                  {buttonLabel}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
