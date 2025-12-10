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
 * Make sure we have a users.id for this email
 * (uses ON CONFLICT if email is unique; otherwise will just insert once)
 */
async function ensureUser(email, name) {
  if (!sql) return null;

  // Try to find existing user
  const existing = await sql`
    SELECT id
    FROM users
    WHERE email = ${email}
    LIMIT 1;
  `;
  if (existing.length > 0) {
    return existing[0].id;
  }

  // If email is UNIQUE, this ON CONFLICT is safe.
  // If not, you can drop ON CONFLICT and just keep a single INSERT.
  const inserted = await sql`
    INSERT INTO users (email, name)
    VALUES (${email}, ${name || null})
    ON CONFLICT (email) DO UPDATE
      SET name = EXCLUDED.name
    RETURNING id;
  `;

  return inserted[0]?.id || null;
}

/**
 * Strict device lock:
 * - Only ONE active device per user_id.
 * - A device_id CANNOT be active for two different users at the same time.
 * - Old locks (>72h) for that user are auto-released so user can move to a new device.
 */
async function enforceDeviceLock(userId, deviceId) {
  if (!sql || !userId || !deviceId) {
    // If DB or ids are missing, do not block – fail-open
    return { ok: true, reason: "no_db_or_ids" };
  }

  try {
    // 0) Is this device already locked to ANOTHER user?
    const conflict = await sql`
      SELECT user_id
      FROM device_locks
      WHERE device_id = ${deviceId}
        AND is_active = true
        AND user_id <> ${userId}
      LIMIT 1;
    `;
    if (conflict.length > 0) {
      // Device already linked to another user → hard block
      return {
        ok: false,
        reason: "device_locked",
        message: "This device is already licensed to another account."
      };
    }

    // 1) Same device + same user already active → just update last_seen_at
    const same = await sql`
      SELECT id
      FROM device_locks
      WHERE user_id = ${userId}
        AND device_id = ${deviceId}
        AND is_active = true
      LIMIT 1;
    `;
    if (same.length > 0) {
      await sql`
        UPDATE device_locks
        SET last_updated = now()
        WHERE id = ${same[0].id};
      `;
      return { ok: true, reason: "same_device" };
    }

    // 2) Auto-expire any active lock for this user older than 72 hours
    const released = await sql`
      UPDATE device_locks
      SET is_active = false
      WHERE user_id = ${userId}
        AND is_active = true
        AND created_at < (now() - interval '72 hours')
      RETURNING id;
    `;

    if (released.length > 0) {
      // Old device freed, now lock this new one
      const inserted = await sql`
        INSERT INTO device_locks (user_id, device_id, is_active)
        VALUES (${userId}, ${deviceId}, true)
        RETURNING id;
      `;
      return { ok: true, reason: "auto_switch", newLockId: inserted[0].id };
    }

    // 3) Still have some active lock (recent) → different device → block
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

    // 4) No active lock at all → create new lock for this device
    const inserted = await sql`
      INSERT INTO device_locks (user_id, device_id, is_active)
      VALUES (${userId}, ${deviceId}, true)
      RETURNING id;
    `;
    return { ok: true, reason: "new_lock", newLockId: inserted[0].id };
  } catch (e) {
    console.error("enforceDeviceLock error (device_locks issue?)", e);
    // Fail-open: if lock table is missing/broken, do NOT block usage
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

    // Must be logged in with Google
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res.status(200).json({
        ok: false,
        reason: "not_logged_in"
      });
    }

    const email = session.user.email;
    const name = session.user.name || null;

    // 0) Ensure we have a users.id for this email
    const userId = await ensureUser(email, name);

    // 1) Enforce device lock (per user and per device)
    const lockResult = await enforceDeviceLock(userId, deviceId);
    if (!lockResult.ok) {
      // Device mismatch or device already bound to another user
      return res.status(200).json({
        ok: false,
        reason: "device_locked",
        message:
          lockResult.message ||
          "Your license is locked to another device. Please request a device reset from admin.",
        activeDeviceId: lockResult.activeDeviceId || null,
        since: lockResult.since || null
      });
    }

    // 2) Check subscription status from extension_payments for this email
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
      // No payments yet → no subscription
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
      // Approved with no valid_until → treat as manually active
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
