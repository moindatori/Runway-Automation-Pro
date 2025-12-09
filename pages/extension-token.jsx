import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

export default function ExtensionTokenPage() {
  const { data: session, status } = useSession();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function generateToken() {
    try {
      setLoading(true);
      setMessage("");
      const res = await fetch("/api/extension/create-token", {
        method: "POST"
      });
      if (!res.ok) {
        setMessage("Could not generate token. Are you logged in?");
        return;
      }
      const data = await res.json();
      setToken(data.token);
      setMessage("Copy this token into your Chrome extension (rw_authToken). Treat it like a password.");
    } catch (err) {
      console.error(err);
      setMessage("Error generating token.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="main-layout">
        <div className="main-container">
          <div className="card">Loading session...</div>
        </div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="main-layout">
        <div className="main-container">
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Login required</h2>
            <p className="subtext">
              Please sign in with Google first. After login, come back to this page to generate your extension token.
            </p>
            <button className="btn" onClick={() => signIn("google")}>
              Login with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-layout">
      <div className="main-container">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Extension API token</h2>
          <p className="subtext">
            This token links your Chrome extension to this backend. Generate it once and paste into your extension
            storage as <code>rw_authToken</code>.
          </p>

          <button className="btn" onClick={generateToken} disabled={loading} style={{ marginTop: 8 }}>
            {loading ? "Generating..." : "Generate / refresh token"}
          </button>

          {token && (
            <div style={{ marginTop: 16 }}>
              <label className="subtext">Your token</label>
              <textarea
                className="input"
                style={{ marginTop: 4, height: 80, fontSize: 11 }}
                readOnly
                value={token}
              />
            </div>
          )}

          {message && (
            <p className="subtext" style={{ marginTop: 8 }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
