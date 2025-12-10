// pages/api/extension/payment.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { neon } from "@neondatabase/serverless";

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
const EXTENSION_API_TOKEN = process.env.EXTENSION_API_TOKEN;

// Allowed origin: Runway app
const ALLOWED_ORIGIN =
  process.env.NODE_ENV === "production"
    ? "https://app.runwayml.com"
    : "*";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST,OPTIONS"
  );
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
      return res
        .status(401)
        .json({ ok: false, error: "Bad token" });
    }

    // Check login
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res.status(200).json({
        ok: false,
        reason: "not_logged_in",
      });
    }

    const email = session.user.email;
    const normalizedRegion = region === "INT" ? "INT" : "PK";

    if (!sql) {
      return res.status(500).json({
        ok: false,
        error: "Database not configured",
      });
    }

    // Optional: link to users table if it exists
    let userId = null;
    try {
      const rowsUser = await sql`
        SELECT id FROM users
        WHERE email = ${email}
        LIMIT 1
      `;
      if (rowsUser.length > 0) {
        userId = rowsUser[0].id;
      }
    } catch (e) {
      console.error("payment.js users lookup error", e);
    }

    // Store payment request in extension_payments
    // Schema example:
    // id uuid DEFAULT gen_random_uuid(),
    // user_id uuid NULL,
    // device_id text NOT NULL,
    // user_email text NOT NULL,
    // region text NOT NULL,
    // tx_id text NOT NULL,
    // status text NOT NULL DEFAULT 'pending',
    // valid_until timestamptz NULL,
    // created_at timestamptz DEFAULT now()
    await sql`
      INSERT INTO extension_payments
        (user_id, device_id, user_email, region, tx_id, status)
      VALUES
        (${userId}, ${deviceId}, ${email}, ${normalizedRegion}, ${txId}, 'pending')
    `;

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
