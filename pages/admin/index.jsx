import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { sql } from "../../lib/db";

function isAdminEmail(email) {
  if (!email) return false;
  const single = process.env.ADMIN_EMAIL;
  const multi = process.env.ADMIN_EMAILS;
  if (single && email === single) return true;
  if (multi) {
    const list = multi.split(",").map((e) => e.trim());
    if (list.includes(email)) return true;
  }
  return false;
}

export default function AdminPage({ sessionEmail, stats, pending }) {
  async function handleAction(id, action) {
    try {
      const res = await fetch("/api/admin/payment-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action })
      });
      if (!res.ok) {
        alert("Error performing action");
        return;
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error performing action");
    }
  }

  return (
    <div className="main-layout">
      <div className="main-container">
        <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 24, marginBottom: 4 }}>Admin – Payments & Subscriptions</h1>
            <p className="subtext">Review user payments, activate subscriptions, and monitor earnings.</p>
          </div>
          <div>
            <span className="badge">Signed in as {sessionEmail}</span>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 18, marginTop: 0 }}>Overview</h2>
          <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 140px", padding: 10, borderRadius: 12, border: "1px solid rgba(148,163,184,0.5)" }}>
              <div className="subtext" style={{ fontSize: 12 }}>Active subscriptions</div>
              <div style={{ fontSize: 20, fontWeight: 600 }}>{stats.activeSubscriptions}</div>
            </div>
            <div style={{ flex: "1 1 140px", padding: 10, borderRadius: 12, border: "1px solid rgba(148,163,184,0.5)" }}>
              <div className="subtext" style={{ fontSize: 12 }}>Earnings (PKR)</div>
              <div style={{ fontSize: 20, fontWeight: 600 }}>{stats.totalPkr}</div>
            </div>
            <div style={{ flex: "1 1 140px", padding: 10, borderRadius: 12, border: "1px solid rgba(148,163,184,0.5)" }}>
              <div className="subtext" style={{ fontSize: 12 }}>Earnings (USD)</div>
              <div style={{ fontSize: 20, fontWeight: 600 }}>{stats.totalUsd}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 18, marginTop: 0 }}>Pending payment requests</h2>
          {pending.length === 0 ? (
            <p className="subtext">No pending payment requests.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Currency</th>
                    <th>Amount</th>
                    <th>Tx ID</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((row) => (
                    <tr key={row.id}>
                      <td>{row.email}</td>
                      <td>{row.plan_code}</td>
                      <td>{row.currency}</td>
                      <td>{row.amount_numeric}</td>
                      <td style={{ fontSize: 11 }}>{row.tx_id}</td>
                      <td style={{ fontSize: 11 }}>
                        {new Date(row.created_at).toLocaleString()}
                      </td>
                      <td>
                        <button
                          className="btn"
                          style={{ padding: "4px 10px", fontSize: 12, marginRight: 4 }}
                          onClick={() => handleAction(row.id, "approve")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-outline"
                          style={{ padding: "4px 10px", fontSize: 12 }}
                          onClick={() => handleAction(row.id, "reject")}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || !isAdminEmail(session.user?.email)) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false
      }
    };
  }

  const [{ rows: statRows }, pendingRows] = await Promise.all([
    sql`SELECT
          COALESCE(SUM(CASE WHEN currency = 'PKR' THEN amount_numeric ELSE 0 END), 0) AS total_pkr,
          COALESCE(SUM(CASE WHEN currency = 'USD' THEN amount_numeric ELSE 0 END), 0) AS total_usd,
          COALESCE(SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END), 0) AS active_subs
        FROM subscriptions`,
    sql`SELECT pr.id,
                pr.plan_code,
                pr.currency,
                pr.amount_numeric,
                pr.tx_id,
                pr.created_at,
                u.email
         FROM payment_requests pr
         JOIN users u ON u.id = pr.user_id
         WHERE pr.status = 'pending'
         ORDER BY pr.created_at DESC`
  ])
    .then(([statResult, pendingResult]) => [{ rows: statResult }, pendingResult])
    .catch((err) => {
      console.error("admin getServerSideProps error", err);
      return [{ rows: [{ total_pkr: 0, total_usd: 0, active_subs: 0 }] }, []];
    });

  const stat = statRows[0] || { total_pkr: 0, total_usd: 0, active_subs: 0 };

  return {
    props: {
      sessionEmail: session.user.email,
      stats: {
        activeSubscriptions: Number(stat.active_subs || 0),
        totalPkr: Number(stat.total_pkr || 0),
        totalUsd: Number(stat.total_usd || 0)
      },
      pending: pendingRows.map((row) => ({
        id: row.id,
        email: row.email,
        plan_code: row.plan_code,
        currency: row.currency,
        amount_numeric: Number(row.amount_numeric),
        tx_id: row.tx_id,
        created_at: row.created_at
      }))
    }
  };
}
