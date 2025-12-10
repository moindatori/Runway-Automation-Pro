// pages/api/extension/check.js

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
    const { token, deviceId } = req.body || {};

    if (!token || !deviceId) {
      return res
        .status(400)
        .json({ ok: false, error: "token and deviceId required" });
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

    // Check login (Google via NextAuth)
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.email) {
      return res.status(200).json({
        ok: false,
        reason: "not_logged_in",
      });
    }

    const email = session.user.email;
    const name = session.user.name || null;

    // -------------------------------
    // 1) Optional: look up user row
    // -------------------------------
    let userId = null;
    if (sql) {
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
        console.error("check.js users lookup error", e);
      }
    }

    // ---------------------------------------
    // 2) Upsert into device_locks (device ID)
    // ---------------------------------------
    // device_locks schema expected:
    // id uuid, user_id uuid, device_id text, last_updated timestamptz
    let deviceLock = "none"; // none | ok | other_device

    if (sql && userId) {
      try {
        const locks = await sql`
          SELECT id, device_id
          FROM device_locks
          WHERE user_id = ${userId}
          LIMIT 1
        `;

        if (locks.length === 0) {
          // First time – lock this device
          await sql`
            INSERT INTO device_locks (user_id, device_id, last_updated)
            VALUES (${userId}, ${deviceId}, now())
          `;
          deviceLock = "ok";
        } else {
          const lock = locks[0];
          if (!lock.device_id || lock.device_id === deviceId) {
            // Same device – refresh timestamp
            await sql`
              UPDATE device_locks
              SET device_id = ${deviceId}, last_updated = now()
              WHERE id = ${lock.id}
            `;
            deviceLock = "ok";
          } else {
            // Different PC – keep old lock
            deviceLock = "other_device";
          }
        }
      } catch (e) {
        console.error("check.js device_locks error", e);
      }
    }

    // ------------------------------------------------
    // 3) Read subscription status from extension_payments
    // ------------------------------------------------
    let status = "no_subscription"; // no_subscription | pending | active | error
    let region = "PK";
    let daysRemaining = null;
    const plan = "manual-qr";

    if (sql) {
      try {
        // Use either device or email to find latest payment record
        const rowsPay = await sql`
          SELECT status, region, valid_until, created_at
          FROM extension_payments
          WHERE device_id = ${deviceId} OR user_email = ${email}
          ORDER BY created_at DESC
          LIMIT 1
        `;

        if (rowsPay.length > 0) {
          const row = rowsPay[0];
          region = row.region || region;

          const now = new Date();
          const validUntil = row.valid_until ? new Date(row.valid_until) : null;

          if (row.status === "approved" && validUntil && validUntil > now) {
            status = "active";
            const diffMs = validUntil.getTime() - now.getTime();
            daysRemaining = Math.max(
              0,
              Math.ceil(diffMs / (1000 * 60 * 60 * 24))
            );
          } else if (row.status === "pending") {
            status = "pending";
          } else if (row.status === "rejected" || row.status === "expired") {
            status = "no_subscription";
          } else {
            status = "no_subscription";
          }
        }
      } catch (dbErr) {
        console.error("check.js payments error", dbErr);
        status = "error";
      }
    }

    return res.status(200).json({
      ok: true,
      status,
      region,
      plan,
      daysRemaining,
      deviceLock, // for future use in admin/extension
    });
  } catch (err) {
    console.error("check.js fatal error", err);
    return res.status(500).json({
      ok: false,
      error: "Server error",
    });
  }
}
