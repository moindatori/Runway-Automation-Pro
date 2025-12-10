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
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
}

/**
 * Ensure there is a row in extension_users for this email.
 * Returns extension_users.id (uuid).
 */
async function ensureExtensionUser({ email, googleId, name, avatarUrl }) {
  // Try to find existing user by email
  const existing = await sql`
    SELECT id FROM extension_users
    WHERE email = ${email}
    LIMIT 1;
  `;
  if (existing.length > 0) {
    return existing[0].id;
  }

  // Create new user row
  const inserted = await sql`
    INSERT INTO extension_users (google_id, email, name, avatar_url)
    VALUES (${googleId}, ${email}, ${name}, ${avatarUrl})
    RETURNING id;
  `;
  return inserted[0].id;
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

    // Basic validation
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

    if (!sql) {
      return res.status(500).json({
        ok: false,
        error: "Database not configured",
      });
    }

    // Check login (must match the Google account in the extension)
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      // Same pattern as /api/extension/check – 200 + reason
      return res.status(200).json({
        ok: false,
        reason: "not_logged_in",
      });
    }

    const email = session.user.email;
    const name = session.user.name || null;
    const avatarUrl = session.user.image || null;
    const googleId =
      session.user.googleId ||
      session.user.sub ||
      session.user.id ||
      null;

    const normalizedRegion = region === "INT" ? "INT" : "PK";

    // Ensure extension_users row exists and get its id
    const userId = await ensureExtensionUser({
      email,
      googleId,
      name,
      avatarUrl,
    });

    // Store payment request in payment_requests (NOT extension_payments)
    // Schema example:
    // id uuid DEFAULT gen_random_uuid(),
    // user_id uuid NOT NULL REFERENCES extension_users(id) ON DELETE CASCADE,
    // device_id text NOT NULL,
    // region text NOT NULL,
    // tx_id text NOT NULL,
    // status text NOT NULL DEFAULT 'pending',
    // created_at timestamptz DEFAULT now()
    await sql`
      INSERT INTO payment_requests
        (user_id, device_id, region, tx_id, status)
      VALUES
        (${userId}, ${deviceId}, ${normalizedRegion}, ${txId}, 'pending');
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
