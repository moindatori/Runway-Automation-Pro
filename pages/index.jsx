// pages/index.jsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { signOut } from "next-auth/react";

export default function Home({ sessionEmail }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#e5e7eb",
        fontFamily:
          "-apple-system,BlinkMacSystemFont,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif"
      }}
    >
      {/* Top bar */}
      <header
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "22px 24px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 0.4
            }}
          >
            Runway Prompt Studio – Backend
          </h1>
          <p
            style={{
              marginTop: 4,
              fontSize: 13,
              color: "#9ca3af",
              maxWidth: 520
            }}
          >
            Paid Chrome extension backend on Vercel + Neon with Google sign-in, manual
            payment review, device locking and subscription control.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              fontSize: 12,
              padding: "4px 10px",
              borderRadius: 999,
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(148,163,184,0.45)",
              maxWidth: 220,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden"
            }}
            title={sessionEmail}
          >
            {sessionEmail}
          </div>
          <button
            onClick={() => signOut()}
            style={{
              borderRadius: 999,
              border: "1px solid rgba(248,250,252,0.7)",
              padding: "6px 16px",
              background: "transparent",
              color: "#e5e7eb",
              fontSize: 13,
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main
        style={{
          maxWidth: 1100,
          margin: "10px auto 0",
          padding: "0 24px 40px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)",
          gap: 24,
          alignItems: "stretch"
        }}
      >
        {/* Overview */}
        <section
          style={{
            borderRadius: 20,
            padding: 22,
            border: "1px solid rgba(37,99,235,0.25)",
            background:
              "radial-gradient(circle at top left, rgba(79,70,229,0.28), transparent 55%), #020617",
            boxShadow: "0 18px 45px rgba(15,23,42,0.7)"
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: 10,
              fontSize: 20,
              fontWeight: 700
            }}
          >
            Welcome to your control backend
          </h2>
          <p style={{ fontSize: 13, color: "#cbd5f5", marginBottom: 12 }}>
            Use this panel to manage subscriptions and connect the Chrome extension with
            your Neon database. Users never see your secrets – they only get a single
            signed token.
          </p>

          <ul style={{ fontSize: 13, color: "#9ca3af", paddingLeft: 18, lineHeight: 1.7 }}>
            <li>
              <b>Manual payments:</b> Approve or reject QR payments from the{" "}
              <a href="/admin" style={{ color: "#a5b4fc", textDecoration: "underline" }}>
                Admin panel
              </a>
              .
            </li>
            <li>
              <b>Device locking:</b> Every subscription can be tied to one device ID and
              reset from the Users tab.
            </li>
            <li>
              <b>API token:</b> Generate a signed token once and let the extension call
              the backend securely.
            </li>
          </ul>

          <div
            style={{
              marginTop: 18,
              display: "inline-flex",
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px dashed rgba(129,140,248,0.6)",
              fontSize: 12,
              color: "#a5b4fc",
              background: "rgba(15,23,42,0.75)"
            }}
          >
            Tip: backend URL اور API token دونوں extension کی settings میں جائیں گے۔
          </div>
        </section>

        {/* Quick actions */}
        <section
          style={{
            borderRadius: 20,
            padding: 20,
            border: "1px solid rgba(55,65,81,0.8)",
            background: "rgba(15,23,42,0.96)",
            boxShadow: "0 18px 45px rgba(15,23,42,0.8)"
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: 12,
              fontSize: 18,
              fontWeight: 700
            }}
          >
            Quick actions
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a
              href="/extension-token"
              style={{
                textDecoration: "none",
                borderRadius: 14,
                padding: 10,
                border: "1px solid rgba(129,140,248,0.6)",
                background:
                  "linear-gradient(135deg, rgba(79,70,229,0.28), rgba(15,23,42,0.95))",
                display: "flex",
                flexDirection: "column",
                gap: 4
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: "#e5e7eb" }}>
                Generate extension API token
              </span>
              <span style={{ fontSize: 12, color: "#c7d2fe" }}>
                Create a signed token for your Chrome extension. Copy and paste it into the
                extension settings so it can talk to this backend.
              </span>
            </a>

            <a
              href="/admin"
              style={{
                textDecoration: "none",
                borderRadius: 14,
                padding: 10,
                border: "1px solid rgba(55,65,81,0.9)",
                background: "rgba(15,23,42,0.9)",
                display: "flex",
                flexDirection: "column",
                gap: 4
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: "#e5e7eb" }}>
                Open admin panel
              </span>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>
                Review payments, control subscriptions, reset devices and see earnings.
              </span>
            </a>

            <a
              href="/api/auth/signin"
              style={{
                textDecoration: "none",
                borderRadius: 14,
                padding: 10,
                border: "1px solid rgba(55,65,81,0.7)",
                background: "rgba(15,23,42,0.85)",
                display: "flex",
                flexDirection: "column",
                gap: 4
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: "#e5e7eb" }}>
                Direct Google sign-in
              </span>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>
                Use this link if you ever need to re-authenticate or test OAuth
                configuration.
              </span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false
      }
    };
  }

  return {
    props: {
      sessionEmail: session.user.email
    }
  };
}
