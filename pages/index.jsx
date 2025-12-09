import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <div className="main-layout">
      <div className="main-container">
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 26, marginBottom: 4 }}>Runway Prompt Studio – Backend</h1>
            <p className="subtext">
              Paid Chrome extension backend on Vercel + Neon with Google login, manual payment review, and admin panel.
            </p>
          </div>
          <div>
            {status === "authenticated" ? (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, marginBottom: 4 }}>{session.user?.email}</div>
                <button className="btn-outline" onClick={() => signOut()}>
                  Logout
                </button>
              </div>
            ) : (
              <button className="btn" onClick={() => signIn("google")}>
                Login with Google
              </button>
            )}
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 18, marginTop: 0 }}>Quick Links</h2>
          <ul style={{ fontSize: 14, paddingLeft: 18 }}>
            <li>
              <Link href="/extension-token">Generate extension API token</Link>
            </li>
            <li>
              <Link href="/admin">Admin panel (payments, subscriptions, earnings)</Link>
            </li>
            <li>
              <a href="/api/auth/signin">Direct Google sign-in</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
