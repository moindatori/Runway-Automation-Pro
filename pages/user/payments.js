// pages/user/payments.js

import React, { useState } from "react";

export default function UserPaymentsPage() {
  const [region, setRegion] = useState("PK");

  const isPK = region === "PK";
  const qrUrl = isPK ? "/qr/pk_1000.png" : "/qr/intl_10usd.png";
  const amountText = isPK ? "Rs1000 / 30 days" : "$10 / 30 days";

  const pageStyle = {
    minHeight: "100vh",
    margin: 0,
    padding: "32px 16px",
    background: "#020617",
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
  };

  const pillStyle = {
    borderRadius: "999px",
    border: "1px solid rgba(148,163,184,0.5)",
    padding: "4px 10px",
    fontSize: "10px",
    color: "#cbd5f5",
    background: "rgba(15,23,42,0.9)",
  };

  const cardStyle = {
    marginTop: "24px",
    borderRadius: "24px",
    border: "1px solid rgba(148,163,184,0.6)",
    padding: "20px 22px",
    background: "rgba(15,23,42,0.98)",
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
    flex: "0 0 260px",
    borderRadius: "18px",
    border: "1px solid rgba(30,64,175,0.6)",
    background:
      "radial-gradient(circle at top left, rgba(56,189,248,0.12), transparent 55%), rgba(15,23,42,0.98)",
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
  };

  const pkButtonStyle = isPK
    ? {
        ...locationButtonBase,
        background: "#22c55e",
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
        background: "#38bdf8",
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
    alignItems: "center",
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
    flex: "1 1 200px",
    fontSize: "12px",
    color: "#cbd5f5",
  };

  const tagRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "10px",
    color: "#a5b4fc",
    marginTop: "6px",
  };

  const stepsCardStyle = {
    marginTop: "18px",
    borderRadius: "18px",
    border: "1px solid rgba(51,65,85,0.9)",
    background:
      "radial-gradient(circle at top left, rgba(129,140,248,0.08), transparent 55%), rgba(15,23,42,0.98)",
    padding: "12px 14px",
    fontSize: "11px",
    color: "#cbd5f5",
  };

  const disclaimerStyle = {
    marginTop: "10px",
    fontSize: "10px",
    color: "#9ca3af",
    lineHeight: 1.5,
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
            <span style={pillStyle}>Chrome extension license</span>
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
                This page only shows{" "}
                <span style={{ color: "#e5e7eb", fontWeight: 500 }}>
                  QR codes and payment instructions
                </span>{" "}
                for the Runway Prompt Studio Chrome extension. You must submit
                your payment transaction ID{" "}
                <span style={{ color: "#e5e7eb", fontWeight: 500 }}>
                  inside the extension floating panel on app.runwayml.com
                </span>
                . No payments are processed directly on this page.
              </p>

              <div style={selectorRowStyle}>
                <div style={selectorLabelStyle}>Choose your location</div>
                <div style={selectorButtonsStyle}>
                  <button
                    type="button"
                    onClick={() => setRegion("PK")}
                    style={pkButtonStyle}
                  >
                    🇵🇰 Pakistan
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegion("INT")}
                    style={intButtonStyle}
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
                  Login with the same Google account in both the extension and
                  this website.
                </li>
                <li>
                  After sending payment, copy the transaction ID from your bank
                  / wallet app.
                </li>
                <li>
                  Open the extension floating panel on{" "}
                  <span style={{ fontFamily: "monospace" }}>
                    app.runwayml.com
                  </span>{" "}
                  and paste the transaction ID there.
                </li>
                <li>Your subscription will be activated after manual review.</li>
              </ul>
            </div>
          </div>

          {/* QR + payment details */}
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
              <div style={sectionTitleStyle}>Payment details</div>
              <p style={{ ...bodyTextStyle, marginBottom: "4px" }}>
                Plan: <span style={{ color: "#e5e7eb" }}>{amountText}</span>
              </p>
              <p style={{ ...bodyTextStyle, marginBottom: "10px" }}>
                Method: Bank transfer / QR code
              </p>

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
                    Go back to the{" "}
                    <span style={{ fontWeight: 600 }}>
                      Chrome extension floating panel
                    </span>{" "}
                    on{" "}
                    <span style={{ fontFamily: "monospace" }}>
                      app.runwayml.com
                    </span>{" "}
                    and paste the ID there.
                  </li>
                </ol>
              </div>

              <p style={disclaimerStyle}>
                This page is only a{" "}
                <span style={{ fontWeight: 600, color: "#e5e7eb" }}>
                  QR + instructions
                </span>{" "}
                view. All license checks happen between the extension and the
                backend. After you submit your transaction ID in the extension,
                your request is reviewed manually and the automation unlocks on
                your registered device.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
