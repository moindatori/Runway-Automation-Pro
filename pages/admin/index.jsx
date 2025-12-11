// pages/admin/index.jsx
import { useMemo, useState } from "react";
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

function Badge({ tone = "gray", children }) {
  const map = {
    gray: { bg: "rgba(148,163,184,0.2)", color: "#e5e7eb" },
    green: { bg: "rgba(34,197,94,0.18)", color: "#bbf7d0" },
    red: { bg: "rgba(239,68,68,0.18)", color: "#fecaca" },
    blue: { bg: "rgba(59,130,246,0.18)", color: "#bfdbfe" },
    purple: { bg: "rgba(129,140,248,0.2)", color: "#e0e7ff" },
    orange: { bg: "rgba(249,115,22,0.18)", color: "#fed7aa" }
  };
  const p = map[tone] || map.gray;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        background: p.bg,
        color: p.color,
        textTransform: "uppercase",
        letterSpacing: 0.4
      }}
    >
      {children}
    </span>
  );
}

function Sidebar({ activeTab, setActiveTab, sessionEmail }) {
  const items = [
    { id: "dashboard", label: "Dashboard" },
    { id: "users", label: "Users" },
    { id: "payments", label: "Extension payments" },
    { id: "settings", label: "Settings" }
  ];

  return (
    <aside
      style={{
        width: 260,
        background: "rgba(4,7,20,0.98)",
        color: "#e5e7eb",
        display: "flex",
        flexDirection: "column",
        padding: "24px 18px",
        boxShadow: "8px 0 50px rgba(15,23,42,0.8)",
        borderRight: "1px solid rgba(148,163,184,0.35)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)"
      }}
    >
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Admin Panel</div>
        <div style={{ fontSize: 12, color: "#9ca3af" }}>
          Runway Prompt Studio
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                border: "none",
                borderRadius: 999,
                padding: "10px 14px",
                textAlign: "left",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                background: active
                  ? "linear-gradient(135deg,#ff6ac1,#fbbf24)"
                  : "transparent",
                color: active ? "#0b1020" : "#cbd5f5",
                boxShadow: active
                  ? "0 12px 40px rgba(251,191,36,0.55)"
                  : "none",
                transition: "all 0.2s ease"
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto" }}>
        <div
          style={{
            borderRadius: 18,
            border: "1px solid rgba(148,163,184,0.45)",
            padding: 12,
            fontSize: 12,
            background:
              "radial-gradient(circle at top left, rgba(129,140,248,0.25), transparent 55%), rgba(6,9,26,0.98)"
          }}
        >
          <div style={{ fontWeight: 500, color: "#e5e7eb" }}>Signed in</div>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>{sessionEmail}</div>
          <div style={{ marginTop: 8 }}>
            <Badge tone="green">Administrator</Badge>
          </div>
        </div>
      </div>
    </aside>
  );
}

function StatCard({ title, value, helper, icon }) {
  return (
    <div
      style={{
        flex: "1 1 180px",
        background:
          "radial-gradient(circle at top left, rgba(129,140,248,0.12), transparent 55%), rgba(6,11,30,0.96)",
        borderRadius: 20,
        padding: 18,
        border: "1px solid rgba(30,64,175,0.55)",
        boxShadow: "0 24px 70px rgba(15,23,42,0.9)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minWidth: 0
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div style={{ fontSize: 12, color: "#9ca3af" }}>{title}</div>
        {icon && (
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              background: "rgba(30,64,175,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              color: "#c7d2fe",
              boxShadow: "0 10px 30px rgba(30,64,175,0.7)"
            }}
          >
            {icon}
          </div>
        )}
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#f9fafb" }}>
        {value}
      </div>
      {helper && (
        <div style={{ fontSize: 11, color: "#94a3b8" }}>{helper}</div>
      )}
    </div>
  );
}

function FilterTabs({ current, setCurrent }) {
  const tabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
    { id: "cancelled", label: "Cancelled" }
  ];

  return (
    <div
      style={{
        display: "inline-flex",
        borderRadius: 999,
        background: "rgba(6,11,30,0.95)",
        padding: 2,
        border: "1px solid rgba(148,163,184,0.6)",
        boxShadow: "0 14px 40px rgba(15,23,42,0.9)"
      }}
    >
      {tabs.map((t) => {
        const active = current === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setCurrent(t.id)}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "6px 16px",
              fontSize: 12,
              cursor: "pointer",
              background: active
                ? "linear-gradient(135deg,#6366f1,#ec4899)"
                : "transparent",
              color: active ? "#0b1020" : "#94a3b8",
              fontWeight: active ? 600 : 500,
              boxShadow: active
                ? "0 10px 35px rgba(99,102,241,0.7)"
                : "none",
              transition: "all 0.2s ease"
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export default function AdminPage({
  sessionEmail,
  stats,
  users,
  payments,
  extTokenPreview
}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [generatedToken, setGeneratedToken] = useState("");

  const filteredPayments = useMemo(() => {
    if (paymentFilter === "all") return payments;
    return payments.filter((p) => p.status === paymentFilter);
  }, [payments, paymentFilter]);

  const pendingCount = payments.filter((p) => p.status === "pending").length;

  async function handlePaymentAction(id, action) {
    let label = "";
    if (action === "approve_30") label = "approve this extension payment for 30 days?";
    if (action === "reject") label = "reject this payment?";
    if (action === "cancel") label = "cancel this approved license now?";

    if (!label || !confirm(`Are you sure you want to ${label}`)) return;

    try {
      const res = await fetch("/api/admin/payment-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error || "Error while updating extension payment");
        return;
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  }

  async function handleUserAction(userId, action) {
    let msg = "";
    if (action === "reset_device") msg = "Reset device lock for this user?";
    if (action === "extend_30")
      msg = "Extend active subscription by 30 days?";
    if (action === "cancel_subscription")
      msg = "Cancel active subscription for this user?";

    if (msg && !confirm(msg)) return;

    try {
      const res = await fetch("/api/admin/user-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        alert(data?.error || "Error performing user action");
        return;
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  }

  function generateNewToken() {
    const partA =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now().toString(16)}-${Math.random()
            .toString(16)
            .slice(2, 10)}`;
    const partB =
      Math.random().toString(36).slice(2) +
      Math.random().toString(36).slice(2);
    const token = `${partA}.${partB}`;
    setGeneratedToken(token);
  }

  // =======================
  // FULL-PAGE GLASS STYLES
  // =======================
  const s = {
    page: {
      minHeight: "100vh",
      width: "100%",
      background:
        "radial-gradient(circle at 0% 0%, #ff0f7b 0, transparent 55%), radial-gradient(circle at 100% 100%, #f97316 0, transparent 55%), #020617",
      fontFamily: "'Inter', system-ui, sans-serif",
      position: "relative",
      overflow: "hidden",
      display: "flex"
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
      opacity: 0.45,
      zIndex: 0
    },
    blob2: {
      position: "absolute",
      bottom: "-15%",
      right: "-10%",
      width: "55vw",
      height: "55vw",
      background:
        "radial-gradient(circle, #f97316 0%, rgba(0,0,0,0) 70%)",
      filter: "blur(90px)",
      opacity: 0.45,
      zIndex: 0
    },
    shell: {
      position: "relative",
      zIndex: 10,
      display: "flex",
      flex: 1,
      minHeight: "100vh",
      background:
        "radial-gradient(circle at 50% 0%, rgba(56,189,248,0.2), transparent 55%), rgba(3,7,18,0.96)",
      borderTop: "1px solid rgba(148,163,184,0.5)",
      borderLeft: "1px solid rgba(15,23,42,0.9)"
    },
    main: {
      flex: 1,
      padding: "26px 32px",
      color: "#e5e7eb",
      overflowY: "auto",
      maxHeight: "100vh"
    },
    panel: {
      background:
        "radial-gradient(circle at top left, rgba(129,140,248,0.16), transparent 55%), rgba(6,11,30,0.98)",
      borderRadius: 24,
      border: "1px solid rgba(30,64,175,0.6)",
      padding: 18,
      boxShadow: "0 22px 80px rgba(15,23,42,0.95)"
    },
    tablePanel: {
      background:
        "radial-gradient(circle at top left, rgba(56,189,248,0.16), transparent 55%), rgba(3,7,18,0.98)",
      borderRadius: 24,
      border: "1px solid rgba(30,64,175,0.7)",
      padding: 18,
      boxShadow: "0 26px 90px rgba(15,23,42,0.98)",
      overflowX: "auto"
    }
  };

  const headerTextColor = "#f9fafb";
  const subTextMuted = "#9ca3af";

  return (
    <div style={s.page}>
      <div style={s.blob1} />
      <div style={s.blob2} />

      <div style={s.shell}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sessionEmail={sessionEmail}
        />

        <main style={s.main}>
          {activeTab === "dashboard" && (
            <>
              <header style={{ marginBottom: 20 }}>
                <h1
                  style={{
                    fontSize: 26,
                    margin: 0,
                    color: headerTextColor
                  }}
                >
                  Dashboard Overview
                </h1>
                <p
                  style={{
                    fontSize: 13,
                    color: subTextMuted,
                    marginTop: 4
                  }}
                >
                  Monitor your extension users, active licenses, and revenue.
                </p>
              </header>

              <section
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                  marginBottom: 20
                }}
              >
                <StatCard
                  title="Total Users"
                  value={stats.totalUsers}
                  helper="Registered emails in users table"
                  icon="👥"
                />
                <StatCard
                  title="Users with Subscription"
                  value={stats.usersWithSub}
                  helper="Emails with an approved, active extension license"
                  icon="⭐"
                />
                <StatCard
                  title="Earnings (PKR)"
                  value={stats.totalPkr}
                  helper="All-time approved PKR extension revenue"
                  icon="₨"
                />
                <StatCard
                  title="Earnings (USD)"
                  value={stats.totalUsd}
                  helper="All-time approved USD extension revenue"
                  icon="$"
                />
              </section>

              <section
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
                  gap: 16,
                  alignItems: "stretch"
                }}
              >
                <div style={s.panel}>
                  <h2
                    style={{
                      fontSize: 16,
                      margin: 0,
                      marginBottom: 8,
                      color: "#e5e7eb"
                    }}
                  >
                    Recent Activity
                  </h2>
                  <p style={{ fontSize: 13, color: subTextMuted }}>
                    Latest user registrations and subscription changes will
                    appear here in future iterations. For now, you already see
                    live extension stats above.
                  </p>
                </div>

                <div style={s.panel}>
                  <h2
                    style={{
                      fontSize: 16,
                      margin: 0,
                      marginBottom: 8,
                      color: "#e5e7eb"
                    }}
                  >
                    System Health
                  </h2>
                  <div style={{ display: "grid", rowGap: 6, fontSize: 13 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >
                      <span>API Status</span>
                      <Badge tone="green">Operational</Badge>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >
                      <span>Database</span>
                      <Badge tone="green">Connected</Badge>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >
                      <span>Extension payments</span>
                      <Badge tone={pendingCount ? "orange" : "green"}>
                        {pendingCount ? `${pendingCount} pending` : "All clear"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === "users" && (
            <>
              <header style={{ marginBottom: 18 }}>
                <h1
                  style={{
                    fontSize: 24,
                    margin: 0,
                    color: headerTextColor
                  }}
                >
                  User Management
                </h1>
                <p
                  style={{
                    fontSize: 13,
                    color: subTextMuted,
                    marginTop: 4
                  }}
                >
                  View registered users, their devices and extension subscription
                  status. Use admin actions to reset device or manage license.
                </p>
              </header>

              <section style={s.tablePanel}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                    minWidth: 980
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(30,41,59,0.9)" }}>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px 6px",
                          fontSize: 12,
                          color: "#9ca3af"
                        }}
                      >
                        User
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px 6px",
                          fontSize: 12,
                          color: "#9ca3af"
                        }}
                      >
                        Subscription
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px 6px",
                          fontSize: 12,
                          color: "#9ca3af"
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px 6px",
                          fontSize: 12,
                          color: "#9ca3af"
                        }}
                      >
                        Remaining days
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px 6px",
                          fontSize: 12,
                          color: "#9ca3af"
                        }}
                      >
                        Device ID
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px 6px",
                          fontSize: 12,
                          color: "#9ca3af"
                        }}
                      >
                        Device updated
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px 6px",
                          fontSize: 12,
                          color: "#9ca3af"
                        }}
                      >
                        Registered
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "8px 6px",
                          fontSize: 12,
                          color: "#9ca3af"
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          style={{
                            padding: "10px 6px",
                            color: "#9ca3af"
                          }}
                        >
                          No users yet.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => {
                        const statusTone =
                          u.sub_status === "approved"
                            ? "green"
                            : u.sub_status === "pending"
                            ? "orange"
                            : u.sub_status === "cancelled" ||
                              u.sub_status === "rejected"
                            ? "red"
                            : "gray";

                        const deviceShort =
                          u.device_id && u.device_id.length > 16
                            ? `${u.device_id.slice(0, 16)}…`
                            : u.device_id || "-";

                        const hasActive =
                          u.sub_status === "approved" &&
                          (u.daysRemaining == null || u.daysRemaining > 0);

                        const actionBtnBase = {
                          borderRadius: 999,
                          padding: "5px 10px",
                          fontSize: 11,
                          cursor: "pointer",
                          border: "none"
                        };

                        return (
                          <tr
                            key={u.id}
                            style={{
                              borderBottom: "1px solid rgba(15,23,42,0.8)"
                            }}
                          >
                            <td style={{ padding: "8px 6px" }}>
                              <div
                                style={{
                                  fontWeight: 600,
                                  color: "#e5e7eb"
                                }}
                              >
                                {u.name || u.email}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#9ca3af"
                                }}
                              >
                                {u.email}
                              </div>
                            </td>
                            <td style={{ padding: "8px 6px" }}>
                              {u.plan_code ? (
                                <Badge tone="blue">{u.plan_code}</Badge>
                              ) : (
                                <span
                                  style={{
                                    fontSize: 12,
                                    color: "#9ca3af"
                                  }}
                                >
                                  No extension plan
                                </span>
                              )}
                            </td>
                            <td style={{ padding: "8px 6px" }}>
                              {u.sub_status ? (
                                <Badge tone={statusTone}>
                                  {u.sub_status}
                                </Badge>
                              ) : (
                                <Badge>No subscription</Badge>
                              )}
                            </td>
                            <td
                              style={{
                                padding: "8px 6px",
                                fontSize: 12,
                                color: "#e5e7eb"
                              }}
                            >
                              {u.daysRemaining != null
                                ? `${u.daysRemaining} days`
                                : "-"}
                            </td>
                            <td
                              style={{
                                padding: "8px 6px",
                                fontSize: 12,
                                color: "#e5e7eb"
                              }}
                            >
                              {deviceShort}
                            </td>
                            <td
                              style={{
                                padding: "8px 6px",
                                fontSize: 12,
                                color: "#9ca3af"
                              }}
                            >
                              {u.last_updated
                                ? new Date(
                                    u.last_updated
                                  ).toLocaleString()
                                : "-"}
                            </td>
                            <td
                              style={{
                                padding: "8px 6px",
                                fontSize: 12,
                                color: "#9ca3af"
                              }}
                            >
                              {new Date(
                                u.created_at
                              ).toLocaleDateString()}
                            </td>
                            <td style={{ padding: "8px 6px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  gap: 6,
                                  flexWrap: "wrap"
                                }}
                              >
                                <button
                                  style={{
                                    ...actionBtnBase,
                                    background: "rgba(129,140,248,0.22)",
                                    color: "#e0e7ff"
                                  }}
                                  onClick={() =>
                                    handleUserAction(u.id, "reset_device")
                                  }
                                >
                                  Reset device
                                </button>
                                <button
                                  disabled={!hasActive}
                                  style={{
                                    ...actionBtnBase,
                                    background: "rgba(34,197,94,0.25)",
                                    color: "#bbf7d0",
                                    opacity: hasActive ? 1 : 0.4,
                                    cursor: hasActive
                                      ? "pointer"
                                      : "not-allowed"
                                  }}
                                  onClick={() =>
                                    hasActive &&
                                    handleUserAction(u.id, "extend_30")
                                  }
                                >
                                  Extend 30d
                                </button>
                                <button
                                  disabled={!hasActive}
                                  style={{
                                    ...actionBtnBase,
                                    background: "rgba(248,113,113,0.2)",
                                    color: "#fecaca",
                                    opacity: hasActive ? 1 : 0.4,
                                    cursor: hasActive
                                      ? "pointer"
                                      : "not-allowed"
                                  }}
                                  onClick={() =>
                                    hasActive &&
                                    handleUserAction(
                                      u.id,
                                      "cancel_subscription"
                                    )
                                  }
                                >
                                  Cancel sub
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </section>
            </>
          )}

          {activeTab === "payments" && (
            <>
              <header
                style={{
                  marginBottom: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <h1
                    style={{
                      fontSize: 24,
                      margin: 0,
                      color: headerTextColor
                    }}
                  >
                    Extension Payment Requests
                  </h1>
                  <p
                    style={{
                      fontSize: 13,
                      color: subTextMuted,
                      marginTop: 4
                    }}
                  >
                    Review QR payments from the Chrome extension and approve or
                    reject licenses.
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12
                  }}
                >
                  <FilterTabs
                    current={paymentFilter}
                    setCurrent={setPaymentFilter}
                  />
                  <button
                    onClick={() => window.location.reload()}
                    style={{
                      borderRadius: 999,
                      border: "1px solid rgba(148,163,184,0.55)",
                      padding: "7px 14px",
                      background:
                        "radial-gradient(circle at top left, rgba(129,140,248,0.2), transparent 55%), rgba(6,11,30,0.98)",
                      fontSize: 12,
                      cursor: "pointer",
                      color: "#e5e7eb",
                      boxShadow: "0 14px 40px rgba(15,23,42,0.85)"
                    }}
                  >
                    Refresh
                  </button>
                </div>
              </header>

              <section
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  maxHeight: "calc(100vh - 180px)",
                  overflowY: "auto"
                }}
              >
                {filteredPayments.length === 0 ? (
                  <div style={s.panel}>
                    <div
                      style={{
                        fontSize: 13,
                        color: subTextMuted
                      }}
                    >
                      No extension payments in this filter.
                    </div>
                  </div>
                ) : (
                  filteredPayments.map((p) => {
                    const tone =
                      p.status === "approved"
                        ? "green"
                        : p.status === "rejected"
                        ? "red"
                        : p.status === "cancelled"
                        ? "red"
                        : "orange";

                    const planLabel =
                      p.region === "INT"
                        ? "$10 / 30 days (International)"
                        : "Rs1000 / 30 days (Pakistan)";

                    const deviceShort =
                      p.device_id && p.device_id.length > 18
                        ? `${p.device_id.slice(0, 18)}…`
                        : p.device_id || "-";

                    let statusHelper = "";
                    if (p.status === "approved") {
                      statusHelper = p.valid_until
                        ? `Active until ${new Date(
                            p.valid_until
                          ).toLocaleDateString()}`
                        : "Approved (no expiry set)";
                    } else if (p.status === "pending") {
                      statusHelper = "Waiting for manual review";
                    } else if (p.status === "rejected") {
                      statusHelper = "Rejected";
                    } else if (p.status === "cancelled") {
                      statusHelper = "Cancelled / expired";
                    }

                    return (
                      <div
                        key={p.id}
                        style={{
                          background:
                            "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 55%), rgba(6,11,30,0.98)",
                          borderRadius: 22,
                          border: "1px solid rgba(30,64,175,0.7)",
                          padding: 18,
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 18,
                          boxShadow: "0 24px 90px rgba(15,23,42,0.98)"
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ marginBottom: 6 }}>
                            <div
                              style={{
                                fontWeight: 600,
                                color: "#e5e7eb"
                              }}
                            >
                              {p.email}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "#9ca3af"
                              }}
                            >
                              Region: {p.region || "-"} • {planLabel}
                            </div>
                          </div>

                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "repeat(2,minmax(0,1fr))",
                              columnGap: 24,
                              rowGap: 4,
                              fontSize: 12,
                              color: "#e5e7eb"
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#9ca3af"
                                }}
                              >
                                Transaction ID
                              </div>
                              <div style={{ fontFamily: "monospace" }}>
                                {p.tx_id}
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#9ca3af"
                                }}
                              >
                                Created at
                              </div>
                              <div>
                                {new Date(
                                  p.created_at
                                ).toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#9ca3af"
                                }}
                              >
                                Device ID
                              </div>
                              <div style={{ fontFamily: "monospace" }}>
                                {deviceShort}
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#9ca3af"
                                }}
                              >
                                License status
                              </div>
                              <div>{statusHelper}</div>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: 8,
                            minWidth: 160
                          }}
                        >
                          <Badge tone={tone}>{p.status}</Badge>

                          {p.status === "pending" && (
                            <div
                              style={{
                                display: "flex",
                                gap: 6,
                                marginTop: 4
                              }}
                            >
                              <button
                                onClick={() =>
                                  handlePaymentAction(p.id, "approve_30")
                                }
                                style={{
                                  borderRadius: 999,
                                  border: "none",
                                  padding: "6px 14px",
                                  background:
                                    "linear-gradient(135deg,#22c55e,#4ade80)",
                                  color: "#022c22",
                                  cursor: "pointer",
                                  fontSize: 12,
                                  fontWeight: 600,
                                  boxShadow:
                                    "0 14px 40px rgba(34,197,94,0.7)"
                                }}
                              >
                                Approve 30d
                              </button>
                              <button
                                onClick={() =>
                                  handlePaymentAction(p.id, "reject")
                                }
                                style={{
                                  borderRadius: 999,
                                  border:
                                    "1px solid rgba(248,113,113,0.7)",
                                  padding: "6px 14px",
                                  background: "transparent",
                                  color: "#fecaca",
                                  cursor: "pointer",
                                  fontSize: 12,
                                  fontWeight: 500
                                }}
                              >
                                Reject
                              </button>
                            </div>
                          )}

                          {p.status === "approved" && (
                            <button
                              onClick={() =>
                                handlePaymentAction(p.id, "cancel")
                              }
                              style={{
                                borderRadius: 999,
                                border:
                                  "1px solid rgba(248,113,113,0.7)",
                                padding: "6px 14px",
                                background: "rgba(248,113,113,0.12)",
                                color: "#fed7aa",
                                cursor: "pointer",
                                fontSize: 12,
                                fontWeight: 500,
                                marginTop: 4
                              }}
                            >
                              Cancel license
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </section>
            </>
          )}

          {activeTab === "settings" && (
            <>
              <header style={{ marginBottom: 16 }}>
                <h1
                  style={{
                    fontSize: 24,
                    margin: 0,
                    color: headerTextColor
                  }}
                >
                  Settings
                </h1>
                <p
                  style={{
                    fontSize: 13,
                    color: subTextMuted,
                    marginTop: 4
                  }}
                >
                  Internal configuration for your billing backend and
                  extension API.
                </p>
              </header>

              <section style={s.panel}>
                <h2
                  style={{
                    fontSize: 16,
                    margin: "0 0 8px",
                    color: "#e5e7eb"
                  }}
                >
                  Environment
                </h2>
                <ul
                  style={{
                    fontSize: 13,
                    color: "#e5e7eb",
                    paddingLeft: 18
                  }}
                >
                  <li>
                    <b>Admin email:</b> {sessionEmail}
                  </li>
                  <li>
                    <b>Neon database:</b> configured via{" "}
                    <code>DATABASE_URL</code>
                  </li>
                  <li>
                    <b>Google OAuth:</b> using{" "}
                    <code>GOOGLE_CLIENT_ID</code> /
                    <code> GOOGLE_CLIENT_SECRET</code>
                  </li>
                  <li>
                    <b>Extension token env:</b>{" "}
                    <code>EXTENSION_API_TOKEN</code>
                  </li>
                </ul>
                <p
                  style={{
                    fontSize: 12,
                    color: "#9ca3af",
                    marginTop: 8
                  }}
                >
                  For any changes to environment variables, update them in
                  Vercel and redeploy.
                </p>

                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 14,
                    borderTop: "1px solid rgba(148,163,184,0.5)"
                  }}
                >
                  <h2
                    style={{
                      fontSize: 16,
                      margin: "0 0 6px",
                      color: "#e5e7eb"
                    }}
                  >
                    Extension API token helper
                  </h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#e5e7eb",
                      marginBottom: 8
                    }}
                  >
                    This shows a masked preview of the token used by the
                    extension and lets you generate new random tokens which
                    you can copy into Vercel and your Chrome extension
                    config.
                  </p>

                  <div
                    style={{
                      fontSize: 13,
                      marginBottom: 8,
                      color: "#e5e7eb"
                    }}
                  >
                    <b>Current token (preview):</b>{" "}
                    <span
                      style={{
                        fontFamily: "monospace",
                        color: "#f9fafb"
                      }}
                    >
                      {extTokenPreview || "Not set"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={generateNewToken}
                    style={{
                      borderRadius: 999,
                      border: "1px solid rgba(129,140,248,0.8)",
                      padding: "7px 14px",
                      background:
                        "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      color: "#f9fafb",
                      fontSize: 12,
                      cursor: "pointer",
                      fontWeight: 600,
                      boxShadow: "0 16px 50px rgba(79,70,229,0.7)"
                    }}
                  >
                    Generate new random token
                  </button>

                  {generatedToken && (
                    <div
                      style={{
                        marginTop: 10,
                        fontSize: 12,
                        background: "rgba(6,11,30,0.98)",
                        borderRadius: 10,
                        padding: 10,
                        border: "1px solid rgba(30,64,175,0.7)"
                      }}
                    >
                      <div
                        style={{
                          marginBottom: 4,
                          color: "#e5e7eb"
                        }}
                      >
                        Copy this value to{" "}
                        <code>EXTENSION_API_TOKEN</code> in Vercel and to
                        your Chrome extension build:
                      </div>
                      <div
                        style={{
                          fontFamily: "monospace",
                          wordBreak: "break-all",
                          color: "#f9fafb"
                        }}
                      >
                        {generatedToken}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </main>
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

  try {
    const statsRows = await sql`
      SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (
          SELECT COUNT(DISTINCT user_email)
          FROM extension_payments
          WHERE status = 'approved'
            AND (valid_until IS NULL OR valid_until > NOW())
        ) AS users_with_sub,
        (
          SELECT COALESCE(SUM(
            CASE
              WHEN region = 'INT' THEN 0
              ELSE 1000
            END
          ), 0)
          FROM extension_payments
          WHERE status = 'approved'
        ) AS total_pkr,
        (
          SELECT COALESCE(COUNT(*) * 10, 0)
          FROM extension_payments
          WHERE status = 'approved'
            AND region = 'INT'
        ) AS total_usd
    `;
    const row = statsRows[0] || {
      total_users: 0,
      users_with_sub: 0,
      total_pkr: 0,
      total_usd: 0
    };

    const usersRows = await sql`
      WITH latest_ext AS (
        SELECT DISTINCT ON (user_email)
          id,
          user_email,
          region,
          status,
          valid_until,
          created_at
        FROM extension_payments
        ORDER BY user_email, created_at DESC
      ),
      latest_lock AS (
        SELECT DISTINCT ON (user_id)
          id,
          user_id,
          device_id,
          last_updated
        FROM device_locks
        ORDER BY user_id, last_updated DESC
      )
      SELECT
        u.id,
        u.email,
        u.name,
        u.created_at,
        le.region,
        le.status AS ext_status,
        le.valid_until,
        dl.device_id,
        dl.last_updated
      FROM users u
      LEFT JOIN latest_ext le ON le.user_email = u.email
      LEFT JOIN latest_lock dl ON dl.user_id = u.id
      ORDER BY u.created_at DESC
    `;

    const now = new Date();

    const users = usersRows.map((u) => {
      let daysRemaining = null;
      let plan_code = null;

      if (u.region) {
        plan_code = u.region === "INT" ? "EXT_INT" : "EXT_PK";
      }

      if (u.ext_status === "approved" && u.valid_until) {
        const end = new Date(u.valid_until);
        const diffMs = end.getTime() - now.getTime();
        if (diffMs > 0) {
          daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        } else {
          daysRemaining = 0;
        }
      }

      return {
        id: u.id,
        email: u.email,
        name: u.name,
        created_at: u.created_at,
        plan_code,
        sub_status: u.ext_status,
        end_date: u.valid_until,
        device_id: u.device_id,
        last_updated: u.last_updated,
        daysRemaining
      };
    });

    let paymentsRows = [];
    try {
      paymentsRows = await sql`
        SELECT
          id,
          user_email,
          device_id,
          region,
          tx_id,
          status,
          valid_until,
          created_at
        FROM extension_payments
        ORDER BY created_at DESC
      `;
    } catch (err) {
      console.error(
        "admin getServerSideProps extension_payments query error",
        err
      );
      paymentsRows = [];
    }

    const payments = paymentsRows.map((p) => ({
      id: p.id,
      email: p.user_email,
      device_id: p.device_id,
      region: p.region,
      tx_id: p.tx_id,
      status: p.status,
      valid_until: p.valid_until,
      created_at: p.created_at
    }));

    const rawToken = process.env.EXTENSION_API_TOKEN || "";
    let extTokenPreview = null;
    if (rawToken) {
      if (rawToken.length > 14) {
        extTokenPreview =
          rawToken.slice(0, 6) + "••••" + rawToken.slice(-4);
      } else {
        extTokenPreview = rawToken.replace(/.(?=.{4})/g, "•");
      }
    }

    return {
      props: {
        sessionEmail: session.user.email,
        stats: {
          totalUsers: Number(row.total_users || 0),
          usersWithSub: Number(row.users_with_sub || 0),
          totalPkr: Number(row.total_pkr || 0),
          totalUsd: Number(row.total_usd || 0)
        },
        users,
        payments,
        extTokenPreview
      }
    };
  } catch (err) {
    console.error("admin getServerSideProps error", err);
    const rawToken = process.env.EXTENSION_API_TOKEN || "";
    let extTokenPreview = null;
    if (rawToken) {
      if (rawToken.length > 14) {
        extTokenPreview =
          rawToken.slice(0, 6) + "••••" + rawToken.slice(-4);
      } else {
        extTokenPreview = rawToken.replace(/.(?=.{4})/g, "•");
      }
    }

    return {
      props: {
        sessionEmail: session.user.email,
        stats: {
          totalUsers: 0,
          usersWithSub: 0,
          totalPkr: 0,
          totalUsd: 0
        },
        users: [],
        payments: [],
        extTokenPreview
      }
    };
  }
}
