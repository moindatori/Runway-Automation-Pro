// pages/api/user/payments/submit.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { neon } from "@neondatabase/serverless";

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

// ✅ Pushover notify helper (safe: if env missing, it does nothing)
async function notifyAdminPushover({ email, region, transactionId }) {
  const userKey = process.env.PUSHOVER_USER_KEY;
  const appToken = process.env.PUSHOVER_APP_TOKEN;

  if (!userKey || !appToken) return;

  try {
    const message =
      `New Extension Payment (PENDING)\n` +
      `Email: ${email}\n` +
      `Region: ${region}\n` +
      `TX: ${transactionId}\n\n` +
      `Open Admin: ${process.env.NEXTAUTH_URL || ""}/admin`;

    const form = new URLSearchParams();
    form.set("token", appToken);
    form.set("user", userKey);
    form.set("title", "Runway Automation Pro");
    form.set("message", message);
    form.set("priority", "0");

    const res = await fetch("https://api.pushover.net/1/messages.json", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    // Don’t break payment submission if notify fails
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.warn("Pushover notify failed:", res.status, txt);
    }
  } catch (e) {
    console.warn("Pushover notify error:", e);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    if (!sql) {
      return res
        .status(500)
        .json({ ok: false, message: "Database not configured" });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res.status(200).json({
        ok: false,
        message: "Not logged in.",
      });
    }

    const email = session.user.email;
    const { transactionId, region } = req.body || {};
    const cleanTx = (transactionId || "").trim();

    if (!cleanTx) {
      return res.status(400).json({
        ok: false,
        message: "Transaction ID is required.",
      });
    }

    const normalizedRegion = region === "INT" ? "INT" : "PK";

    // Insert as pending, admin will approve later
    await sql`
      INSERT INTO extension_payments
        (device_id, user_email, region, tx_id, status)
      VALUES
        (NULL, ${email}, ${normalizedRegion}, ${cleanTx}, 'pending');
    `;

    // ✅ Send admin push notification
    await notifyAdminPushover({
      email,
      region: normalizedRegion,
      transactionId: cleanTx,
    });

    return res.status(200).json({
      ok: true,
      status: "pending",
      message: "Transaction submitted. Pending manual review.",
    });
  } catch (err) {
    console.error("user/payments/submit error", err);
    return res.status(500).json({
      ok: false,
      message: "Unable to submit transaction.",
      error: err.message,
    });
  }
}
