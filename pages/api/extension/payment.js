// pages/api/extension/payment.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { neon } from "@neondatabase/serverless";

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
const EXTENSION_API_TOKEN = process.env.EXTENSION_API_TOKEN;

// ✅ Pushover notify (admin)
async function notifyAdminPushover({ email, region, transactionId, deviceId }) {
  const userKey = process.env.PUSHOVER_USER_KEY;
  const appToken = process.env.PUSHOVER_APP_TOKEN;
  if (!userKey || !appToken) return;

  try {
    const adminUrl =
      (process.env.NEXTAUTH_URL || "").replace(/\/$/, "") + "/admin";

    const message =
      `New Extension Payment (PENDING)\n` +
      `Email: ${email}\n` +
      `Region: ${region}\n` +
      `TX: ${transactionId}\n` +
      `Device: ${deviceId}\n\n` +
      `Admin: ${adminUrl}`;

    const form = new URLSearchParams();
    form.set("token", appToken);
    form.set("user", userKey);
    form.set("title", "Runway Automation Pro");
    form.set("message", message);

    const r = await fetch("https://api.pushover.net/1/messages.json", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      console.warn("Pushover notify failed:", r.status, txt);
    }
  } catch (e) {
    console.warn("Pushover notify error:", e);
  }
}

// Allowed origin: Runway app
const ALLOWED_ORIGIN =
  process.env.NODE_ENV === "production"
    ? "https://app.runwayml.com"
    : "*";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
}

export default async function handler(req, res) {
  setCors(res);

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { token, deviceId, region, txId } = req.body || {};

    if (!token || !deviceId || !txId) {
      return res
        .status(400)
        .json({ ok: false, error: "token, deviceId and txId required" });
    }

    if (!EXTENSION_API_TOKEN) {
      return res
        .status(500)
        .json({ ok: false, error: "Server token not configured" });
    }

    if (token !== EXTENSION_API_TOKEN) {
      return res.status(401).json({ ok: false, error: "Bad token" });
    }

    // Check login (same Google account as extension)
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res.status(200).json({
        ok: false,
        reason: "not_logged_in",
      });
    }

    if (!sql) {
      return res.status(500).json({
        ok: false,
        error: "Database not configured",
      });
    }

    const email = session.user.email;
    const normalizedRegion = region === "INT" ? "INT" : "PK";

    await sql`
      INSERT INTO extension_payments
        (device_id, user_email, region, tx_id, status)
      VALUES
        (${deviceId}, ${email}, ${normalizedRegion}, ${txId}, 'pending')
    `;

    // ✅ send admin notification (does not block success if it fails)
    await notifyAdminPushover({
      email,
      region: normalizedRegion,
      transactionId: txId,
      deviceId,
    });

    return res.status(200).json({
      ok: true,
      status: "pending",
    });
  } catch (err) {
    console.error("payment.js fatal error", err);
    return res.status(500).json({
      ok: false,
      error: "Server error",
    });
  }
}
