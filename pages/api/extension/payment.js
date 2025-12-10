// pages/api/extension/payment.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { neon } from "@neondatabase/serverless";

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
const EXTENSION_API_TOKEN = process.env.EXTENSION_API_TOKEN;

// Allowed origin: Runway web app
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
      // DB not configured
      return res.status(500).json({
        ok: false,
        error: "Database not configured",
      });
    }

    // Store payment request with status = pending
    // Table expected:
    // CREATE TABLE extension_payments (
    //   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    //   device_id text NOT NULL,
    //   user_email text NOT NULL,
    //   region text NOT NULL,
    //   tx_id text NOT NULL,
    //   status text NOT NULL DEFAULT 'pending',
    //   valid_until timestamptz,
    //   created_at timestamptz DEFAULT now()
    // );
    await sql`
      INSERT INTO extension_payments
        (device_id, user_email, region, tx_id, status)
      VALUES
        (${deviceId}, ${email}, ${normalizedRegion}, ${txId}, 'pending')
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
