// pages/user/payments.js

import React, { useState, useEffect } from "react";

export default function UserPaymentsPage() {
  const [region, setRegion] = useState("PK");

  // NEW: Payment status for this user (linked to backend)
  const [paymentStatus, setPaymentStatus] = useState("checking"); // checking | none | pending | active | rejected
  const [existingTxId, setExistingTxId] = useState("");
  const [txIdInput, setTxIdInput] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const isPK = region === "PK";
  const qrUrl = isPK ? "/qr/pk_1000.png" : "/qr/intl_10usd.png";
  const amountText = isPK ? "Rs1000 / 30 days" : "$10 / 30 days";

  const isFormReadOnly =
    paymentStatus === "pending" || paymentStatus === "active";

  // =========================================================
  // 1. Load current payment / subscription status from backend
  // =========================================================
  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      try {
        setPaymentStatus("checking");
        setSubmitError("");
        // Adjust this URL to match your backend route if needed
        const res = await fetch("/api/user/payments/status");
        if (!res.ok) {
          throw new Error("Unable to read payment status.");
        }
        const data = await res.json();
        if (cancelled) return;

        const status = data.status || "none";
        setPaymentStatus(status);
        setExistingTxId(data.transactionId || "");
      } catch (err) {
        if (cancelled) return;
        // Fallback to "none" if API not implemented yet
        setPaymentStatus("none");
        setExistingTxId("");
      }
    }

    fetchStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================================================
  // 2. Submit transaction ID from this page (same flow as extension)
  // =========================================================
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

      // Adjust this URL / body shape to match your backend route
      const res = await fetch("/api/user/payments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: cleanTx,
          region,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.ok === false) {
        throw new Error(
          data.message || "Unable to submit transaction. Try again."
        );
      }

      // Treat same as extension: mark as pending until admin approves
      setPaymentStatus("pending");
      setExistingTxId(cleanTx);
      setTxIdInput("");
      setSubmitSuccess(
        "Transaction submitted. Your payment is now pending manual review."
      );
    } catch (err) {
      setSubmitError(
        err && err.message ? err.message : "Unexpected error, please try again."
      );
    } finally {
      setSubmitLoading(false);
    }
  }

  // ----------------------------------------------------------------
  // UI STYLE OBJECTS
  // ----------------------------------------------------------------
  const pageStyle = {
    minHeight: "100vh",
    margin: 0,
    padding: "32px 16px",
    background:
      "radial-gradient(circle at top left, rgba(59,130,246,0.15), transparent 55%), #020617",
    color: "#e5e7eb",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  };

  const wrapperStyle = {
    maxWidth: "1120px",
    margin: "0 auto",
  };

  const smallTagStyle = {
    fontSize: "10px",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: "#64748b",
    marginBottom: "4px",
  };

  const h1Style = {
    fontSize: "26px",
    fontWeight: 700,
    color: "#e5e7eb",
    margin: 0,
  };

  const subBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "6px",
    gap: "8px",
    flexWrap: "wrap",
  };

  const pillStyle = {
    borderRadius: "999px",
    border: "1px solid rgba(148,163,184,0.5)",
    padding: "4px 10px",
    fontSize: "10px",
    color: "#cbd5f5",
    background: "rgba(15,23,42,0.9)",
  };

  const statusPill = (() => {
    if (paymentStatus === "checking") {
      return {
        label: "Checking subscription…",
        style: {
          borderColor: "rgba(148,163,184,0.5)",
          background: "rgba(15,23,42,0.9)",
          color: "#e5e7eb",
        },
      };
    }
    if (paymentStatus === "active") {
      return {
        label: "Active • Automation unlocked",
        style: {
          borderColor: "rgba(34,197,94,0.9)",
          background:
            "linear-gradient(135deg, rgba(34,197,94,0.16), rgba(21,128,61,0.3))",
          color: "#bbf7d0",
        },
      };
    }
    if (paymentStatus === "pending") {
      return {
        label: "Pending review",
        style: {
          borderColor: "rgba(234,179,8,0.9)",
          background:
            "linear-gradient(135deg, rgba(250,204,21,0.08), rgba(161,98,7,0.3))",
          color: "#facc15",
        },
      };
    }
    if (paymentStatus === "rejected") {
      return {
        label: "Payment rejected • Please submit again",
        style: {
          borderColor: "rgba(248,113,113,0.9)",
          background:
            "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(127,29,29,0.3))",
          color: "#fecaca",
        },
      };
    }
    return {
      label: "No active subscription",
      style: {
        borderColor: "rgba(148,163,184,0.8)",
        background: "rgba(15,23,42,0.95)",
        color: "#e5e7eb",
      },
    };
  })();

  const cardStyle = {
    marginTop: "24px",
    borderRadius: "24px",
    border: "1px solid rgba(148,163,184,0.6)",
    padding: "20px 22px 24px",
    background:
      "radial-gradient(circle at top left, rgba(56,189,248,0.12), transparent 55%), rgba(15,23,42,0.98)",
    boxShadow: "0 26px 80px rgba(15,23,42,0.95)",
  };

  const topRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "18px",
    marginBottom: "18px",
  };

  const leftColStyle = {
    flex: "1 1 260px",
  };

  const rightColStyle = {
    flex: "0 0 280px",
    borderRadius: "18px",
    border: "1px solid rgba(30,64,175,0.6)",
    background:
      "radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 55%), rgba(15,23,42,0.98)",
    padding: "12px 14px",
    fontSize: "11px",
    color: "#cbd5f5",
  };

  const sectionTitleStyle = {
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "4px",
    color: "#e5e7eb",
  };

  const bodyTextStyle = {
    fontSize: "11px",
    lineHeight: 1.5,
    color: "#9ca3af",
  };

  const selectorRowStyle = {
    marginTop: "12px",
  };

  const selectorLabelStyle = {
    fontSize: "11px",
    color: "#9ca3af",
    marginBottom: "4px",
  };

  const selectorButtonsStyle = {
    display: "flex",
    borderRadius: "999px",
    border: "1px solid rgba(30,64,175,0.6)",
    background: "#020617",
    padding: "4px",
    maxWidth: "260px",
  };

  const locationButtonBase = {
    flex: 1,
    borderRadius: "999px",
    border: "1px solid transparent",
    padding: "7px 10px",
    fontSize: "11px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.16s ease-out",
  };

  const pkButtonStyle = isPK
    ? {
        ...locationButtonBase,
        background: "linear-gradient(135deg, #22c55e, #4ade80)",
        color: "#022c22",
        borderColor: "#4ade80",
        boxShadow: "0 14px 38px rgba(34,197,94,0.55)",
      }
    : {
        ...locationButtonBase,
        background: "transparent",
        color: "#e5e7eb",
      };

  const intButtonStyle = !isPK
    ? {
        ...locationButtonBase,
        background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
        color: "#020617",
        borderColor: "#7dd3fc",
        boxShadow: "0 14px 38px rgba(56,189,248,0.55)",
      }
    : {
        ...locationButtonBase,
        background: "transparent",
        color: "#e5e7eb",
      };

  const qrRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "22px",
    alignItems: "flex-start",
    marginTop: "20px",
  };

  const qrBoxOuter = {
    borderRadius: "22px",
    background: "#020617",
    padding: "10px",
    border: "1px solid rgba(30,64,175,0.7)",
  };

  const qrBoxInner = {
    borderRadius: "18px",
    background: "#ffffff",
    width: "320px",
    height: "320px",
    maxWidth: "100%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const qrImgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
  };

  const paymentInfoStyle = {
    flex: "1 1 260px",
    fontSize: "12px",
    color: "#cbd5f5",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const tagRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "10px",
    color: "#a5b4fc",
    marginTop: "6px",
    gap: "8px",
    flexWrap: "wrap",
  };

  const stepsCardStyle = {
    borderRadius: "18px",
    border: "1px solid rgba(51,65,85,0.9)",
    background:
      "radial-gradient(circle at top left, rgba(129,140,248,0.08), transparent 55%), rgba(15,23,42,0.98)",
    padding: "12px 14px",
    fontSize: "11px",
    color: "#cbd5f5",
  };

  const disclaimerStyle = {
    fontSize: "10px",
    color: "#9ca3af",
    lineHeight: 1.5,
  };

  // NEW: Transaction form styles
  const txCardStyle = {
    borderRadius: "16px",
    border: "1px solid rgba(55,65,81,0.8)",
    background:
      "radial-gradient(circle at right, rgba(56,189,248,0.14), transparent 60%), rgba(15,23,42,0.98)",
    padding: "12px 14px",
    fontSize: "11px",
    color: "#e5e7eb",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const inputStyle = {
    width: "100%",
    borderRadius: "999px",
    border: "1px solid rgba(75,85,99,0.9)",
    padding: "8px 12px",
    fontSize: "12px",
    background: "#020617",
    color: "#e5e7eb",
    outline: "none",
    boxShadow: "0 0 0 0 transparent",
  };

  const inputDisabledStyle = {
    ...inputStyle,
    borderColor: "rgba(75,85,99,0.6)",
    background: "rgba(15,23,42,0.9)",
    color: "#9ca3af",
    cursor: "not-allowed",
  };

  const submitBtnStyle = {
    borderRadius: "999px",
    border: "none",
    padding: "8px 16px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: submitLoading || isFormReadOnly ? "not-allowed" : "pointer",
    background: isFormReadOnly
      ? "rgba(55,65,81,0.9)"
      : "linear-gradient(135deg, #22c55e, #4ade80)",
    color: isFormReadOnly ? "#9ca3af" : "#022c22",
    boxShadow: isFormReadOnly
      ? "none"
      : "0 12px 30px rgba(34,197,94,0.5)",
    transition: "transform 0.12s ease-out, box-shadow 0.12s ease-out",
  };

  const helperTextStyle = {
    fontSize: "10px",
    color: "#9ca3af",
  };

  const errorTextStyle = {
    fontSize: "10px",
    color: "#fecaca",
  };

  const successTextStyle = {
    fontSize: "10px",
    color: "#bbf7d0",
  };

  return (
    <div style={pageStyle}>
      <div style={wrapperStyle}>
        {/* Header */}
        <div>
          <div style={smallTagStyle}>Runway Prompt Studio</div>
          <h1 style={h1Style}>Extension subscription payment</h1>
          <div style={subBarStyle}>
            <span style={{ fontSize: "11px", color: "#9ca3af" }}>
              Manual review • QR based
            </span>
            <div
              style={{
                ...pillStyle,
                ...statusPill.style,
              }}
            >
              {statusPill.label}
            </div>
          </div>
        </div>

        {/* Main card */}
        <div style={cardStyle}>
          <div style={topRowStyle}>
            {/* Left: intro + location selector */}
            <div style={leftColStyle}>
              <div style={sectionTitleStyle}>
                Pay for your Chrome extension subscription
              </div>
              <p style={bodyTextStyle}>
                This page shows{" "}
                <span style={{ color: "#e5e7eb", fontWeight: 500 }}>
                  QR codes, payment instructions and a transaction ID form
                </span>{" "}
                for the Runway Prompt Studio Chrome extension. You can submit
                your{" "}
                <span style={{ color: "#e5e7eb", fontWeight: 500 }}>
                  payment transaction ID either here or from the floating panel
                  on app.runwayml.com
                </span>
                . All activations are still reviewed manually on the backend.
              </p>

              <div style={selectorRowStyle}>
                <div style={selectorLabelStyle}>Choose your location</div>
                <div style={selectorButtonsStyle}>
                  <button
                    type="button"
                    onClick={() => setRegion("PK")}
                    style={pkButtonStyle}
                    disabled={submitLoading}
                  >
                    🇵🇰 Pakistan
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegion("INT")}
                    style={intButtonStyle}
                    disabled={submitLoading}
                  >
                    🌐 International
                  </button>
                </div>
                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "11px",
                    color: "#9ca3af",
                  }}
                >
                  Plan selected:{" "}
                  <span style={{ color: "#e5e7eb", fontWeight: 600 }}>
                    {amountText}
                  </span>
                  .
                </div>
              </div>
            </div>

            {/* Right: Important notes */}
            <div style={rightColStyle}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#e5e7eb",
                  marginBottom: "6px",
                }}
              >
                Important
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "18px",
                  listStyleType: "disc",
                  lineHeight: 1.5,
                }}
              >
                <li>
                  Use the same Google account for both the extension and this
                  website.
                </li>
                <li>
                  After sending payment, copy the{" "}
                  <strong>transaction ID</strong> from your bank / wallet app.
                </li>
                <li>
                  You can paste the transaction ID{" "}
                  <strong>here on this payment page</strong> or inside the{" "}
                  <strong>extension floating panel</strong> on{" "}
                  <span style={{ fontFamily: "monospace" }}>
                    app.runwayml.com
                  </span>
                  .
                </li>
                <li>
                  Once the payment is approved, your device will be unlocked and
                  the transaction form will be locked.
                </li>
              </ul>
            </div>
          </div>

          {/* QR + payment details + transaction form */}
          <div style={qrRowStyle}>
            <div style={qrBoxOuter}>
              <div style={qrBoxInner}>
                <img src={qrUrl} alt="Payment QR" style={qrImgStyle} />
              </div>
              <div style={tagRowStyle}>
                <span>
                  Scan in your banking / wallet app and pay{" "}
                  <span style={{ fontWeight: 600, color: "#4ade80" }}>
                    {amountText}
                  </span>
                  .
                </span>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "999px",
                    border: "1px solid rgba(148,163,184,0.8)",
                    background: "#020617",
                  }}
                >
                  QR • one-time payment
                </span>
              </div>
            </div>

            <div style={paymentInfoStyle}>
              {/* Payment details */}
              <div>
                <div style={sectionTitleStyle}>Payment details</div>
                <p style={{ ...bodyTextStyle, marginBottom: "4px" }}>
                  Plan: <span style={{ color: "#e5e7eb" }}>{amountText}</span>
                </p>
                <p style={{ ...bodyTextStyle, marginBottom: "10px" }}>
                  Method: Bank transfer / QR code
                </p>
              </div>

              {/* How to pay */}
              <div style={stepsCardStyle}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  How to complete payment
                </div>
                <ol
                  style={{
                    margin: 0,
                    paddingLeft: "18px",
                    lineHeight: 1.5,
                  }}
                >
                  <li>Open your banking or wallet app.</li>
                  <li>Scan the QR code shown on this page.</li>
                  <li>Pay {amountText} for your extension license.</li>
                  <li>
                    Copy the{" "}
                    <span style={{ fontWeight: 600 }}>transaction ID</span>{" "}
                    from the payment confirmation.
                  </li>
                  <li>
                    Paste the transaction ID{" "}
                    <strong>here below</strong> or in the{" "}
                    <strong>extension floating panel</strong> on{" "}
                    <span style={{ fontFamily: "monospace" }}>
                      app.runwayml.com
                    </span>
                    .
                  </li>
                </ol>
              </div>

              {/* NEW: Transaction ID submit box (same pending behaviour as extension) */}
              <div style={txCardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "12px", fontWeight: 600 }}>
                    Submit transaction ID
                  </span>
                  {paymentStatus === "pending" && (
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        border: "1px solid rgba(250,204,21,0.8)",
                        color: "#facc15",
                      }}
                    >
                      Pending review
                    </span>
                  )}
                  {paymentStatus === "active" && (
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        border: "1px solid rgba(34,197,94,0.8)",
                        color: "#bbf7d0",
                      }}
                    >
                      Approved
                    </span>
                  )}
                </div>

                <form
                  onSubmit={handleSubmitTransaction}
                  style={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  <input
                    type="text"
                    placeholder="Paste your bank / wallet transaction ID"
                    value={
                      isFormReadOnly && existingTxId
                        ? existingTxId
                        : txIdInput
                    }
                    onChange={(e) => {
                      if (isFormReadOnly) return;
                      setTxIdInput(e.target.value);
                    }}
                    style={isFormReadOnly ? inputDisabledStyle : inputStyle}
                    disabled={isFormReadOnly || submitLoading}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="submit"
                      style={submitBtnStyle}
                      disabled={isFormReadOnly || submitLoading}
                    >
                      {paymentStatus === "active"
                        ? "Payment approved"
                        : paymentStatus === "pending"
                        ? "Waiting for approval"
                        : submitLoading
                        ? "Submitting…"
                        : "Submit transaction ID"}
                    </button>
                    <span style={helperTextStyle}>
                      Once approved, this form will be locked for your account.
                    </span>
                  </div>

                  {submitError && (
                    <div style={errorTextStyle}>{submitError}</div>
                  )}
                  {submitSuccess && (
                    <div style={successTextStyle}>{submitSuccess}</div>
                  )}
                  {paymentStatus === "rejected" && !submitError && (
                    <div style={errorTextStyle}>
                      Last payment request was rejected. Please check your
                      details and submit a new transaction ID.
                    </div>
                  )}
                </form>
              </div>

              <p style={disclaimerStyle}>
                All license checks happen between the extension and the backend.
                After you submit your transaction ID (either here or inside the
                extension), your request is{" "}
                <span style={{ fontWeight: 600, color: "#e5e7eb" }}>
                  reviewed manually
                </span>{" "}
                and, once approved, automation unlocks on your registered
                device. This page does not charge your card directly; it only
                provides QR codes and a secure place to send your transaction
                reference.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
