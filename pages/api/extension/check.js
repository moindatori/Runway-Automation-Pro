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
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
}

/**
 * Device lock using device_locks table keyed by user_id (NOT user_email).
 *
 * Rules:
 *  - 1 active device per user_id.
 *  - If same deviceId -> update last_seen_at/last_updated, allow.
 *  - If different deviceId:
 *      * If old lock older than 72h → move lock to new device.
 *      * Otherwise → block with reason "device_locked".
 */
async function enforceDeviceLock(userId, deviceId) {
  if (!sql) {
    // If DB not configured, don't block the user
    return { ok: true, reason: "no_db" };
  }

  try {
    // 1) If this device is already active, just update last_seen_at / last_updated
    const same = await sql`
      SELECT id
      FROM device_locks
      WHERE user_id = ${userId}
        AND device_id = ${deviceId}
        AND is_active = true
      LIMIT 1;
    `;

    if (same.length > 0) {
      const lockId = same[0].id;
      await sql`
        UPDATE device_locks
        SET last_seen_at = NOW(),
            last_updated = NOW()
        WHERE id = ${lockId};
      `;
      return { ok: true, reason: "same_device" };
    }

    // 2) Auto-expire old active locks older than 72 hours (per user)
    const released = await sql`
      UPDATE device_locks
      SET is_active = false
      WHERE user_id = ${userId}
        AND is_active = true
        AND created_at < (NOW() - INTERVAL '72 hours')
      RETURNING id;
    `;

    if (released.length > 0) {
      // We freed an old device; now lock this new one
      const inserted = await sql`
        INSERT INTO device_locks (user_id, device_id, is_active, last_seen_at, last_updated)
        VALUES (${userId}, ${deviceId}, true, NOW(), NOW())
        RETURNING id;
      `;
      return { ok: true, reason: "auto_switch", newLockId: inserted[0].id };
    }

    // 3) Is there still some recent active lock for this user on another device?
    const active = await sql`
      SELECT device_id, created_at
      FROM device_locks
      WHERE user_id = ${userId}
        AND is_active = true
      ORDER BY created_at DESC
      LIMIT 1;
    `;

    if (active.length > 0) {
      return {
        ok: false,
        reason: "device_locked",
        activeDeviceId: active[0].device_id,
        since: active[0].created_at
      };
    }

    // 4) No active lock at all → create a new lock for this device
    const inserted = await sql`
      INSERT INTO device_locks (user_id, device_id, is_active, last_seen_at, last_updated)
      VALUES (${userId}, ${deviceId}, true, NOW(), NOW())
      RETURNING id;
    `;
    return { ok: true, reason: "new_lock", newLockId: inserted[0].id };
  } catch (e) {
    console.error("enforceDeviceLock error", e);
    // If something goes wrong, better to NOT block everyone.
    // If you want it even stricter, you can change this to ok: false.
    return { ok: true, reason: "lock_disabled" };
  }
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
      return res.status(401).json({ ok: false, error: "Bad token" });
    }

    if (!sql) {
      return res.status(500).json({
        ok: false,
        error: "Database not configured"
      });
    }

    // User must be logged in with Google (same as /api/extension/payment)
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res.status(200).json({
        ok: false,
        reason: "not_logged_in"
      });
    }

    const email = session.user.email;

    // Resolve user_id from users table (create row if missing)
    let userId;
    const userRows = await sql`
      SELECT id
      FROM users
      WHERE email = ${email}
      LIMIT 1;
    `;
    if (userRows.length > 0) {
      userId = userRows[0].id;
    } else {
      const insertUser = await sql`
        INSERT INTO users (email, name)
        VALUES (${email}, ${email})
        RETURNING id;
      `;
      userId = insertUser[0].id;
    }

    // =============================
    // 1) Enforce device lock
    // =============================
    const lockResult = await enforceDeviceLock(userId, deviceId);
    if (!lockResult.ok) {
      // Device mismatch and under 72 hours
      return res.status(200).json({
        ok: false,
        reason: "device_locked",
        message:
          "Your license is locked to another device. Please request a device reset from admin.",
        activeDeviceId: lockResult.activeDeviceId || null,
        since: lockResult.since || null
      });
    }

    // =============================
    // 2) Check subscription status
    // =============================
    //
    // We read from extension_payments (latest row) for this email.
    //
    let rows = [];
    try {
      rows = await sql`
        SELECT status, valid_until, region
        FROM extension_payments
        WHERE user_email = ${email}
        ORDER BY created_at DESC
        LIMIT 1;
      `;
    } catch (e) {
      console.error(
        "check.js payments lookup error (extension_payments missing?)",
        e
      );
      rows = [];
    }

    if (rows.length === 0) {
      return res.status(200).json({
        ok: true,
        status: "no_subscription",
        plan: null,
        daysRemaining: null,
        region: null
      });
    }

    const row = rows[0];
    const nowMs = Date.now();
    let daysRemaining = null;
    let isActive = false;

    if (row.valid_until) {
      const untilMs = Date.parse(row.valid_until);
      const diffMs = untilMs - nowMs;
      daysRemaining = Math.max(
        0,
        Math.floor(diffMs / (1000 * 60 * 60 * 24))
      );
      isActive = diffMs > 0 && row.status === "approved";
    } else {
      // If no valid_until set, treat approved as active (lifetime/manual)
      isActive = row.status === "approved";
    }

    if (!isActive) {
      if (row.status === "pending") {
        return res.status(200).json({
          ok: true,
          status: "pending",
          plan: null,
          daysRemaining,
          region: row.region || null
        });
      }

      return res.status(200).json({
        ok: true,
        status: "no_subscription",
        plan: null,
        daysRemaining: null,
        region: row.region || null
      });
    }

    // ACTIVE
    return res.status(200).json({
      ok: true,
      status: "active",
      plan: null,
      daysRemaining,
      region: row.region || null
    });
  } catch (err) {
    console.error("check.js fatal error", err);
    return res.status(500).json({
      ok: false,
      error: "Server error"
    });
  }
}
