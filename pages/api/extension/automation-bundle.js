// pages/api/extension/automation-bundle.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
const EXTENSION_API_TOKEN = process.env.EXTENSION_API_TOKEN;

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

// ---- same ensureUser as check.js ----
async function ensureUser(email, name) {
  if (!sql) return null;

  const existing = await sql`
    SELECT id
    FROM users
    WHERE email = ${email}
    LIMIT 1;
  `;
  if (existing.length > 0) {
    return existing[0].id;
  }

  const inserted = await sql`
    INSERT INTO users (email, name)
    VALUES (${email}, ${name || null})
    ON CONFLICT (email) DO UPDATE
      SET name = EXCLUDED.name
    RETURNING id;
  `;
  return inserted[0]?.id || null;
}

// ---- same enforceDeviceLock as latest check.js ----
async function enforceDeviceLock(userId, deviceId) {
  if (!sql || !userId || !deviceId) {
    return { ok: true, reason: "no_db_or_ids" };
  }

  try {
    const conflict = await sql`
      SELECT user_id
      FROM device_locks
      WHERE device_id = ${deviceId}
        AND is_active = true
        AND user_id <> ${userId}
      LIMIT 1;
    `;
    if (conflict.length > 0) {
      return {
        ok: false,
        reason: "device_locked",
        message: "This device is already licensed to another account.",
      };
    }

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

    const released = await sql`
      UPDATE device_locks
      SET is_active = false
      WHERE user_id = ${userId}
        AND is_active = true
        AND created_at < (now() - interval '72 hours')
      RETURNING id;
    `;

    if (released.length > 0) {
      const inserted = await sql`
        INSERT INTO device_locks (user_id, device_id, is_active)
        VALUES (${userId}, ${deviceId}, true)
        RETURNING id;
      `;
      return { ok: true, reason: "auto_switch", newLockId: inserted[0].id };
    }

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
        since: active[0].created_at,
      };
    }

    const inserted = await sql`
      INSERT INTO device_locks (user_id, device_id, is_active)
      VALUES (${userId}, ${deviceId}, true)
      RETURNING id;
    `;
    return { ok: true, reason: "new_lock", newLockId: inserted[0].id };
  } catch (e) {
    console.error("enforceDeviceLock error (device_locks issue?)", e);
    return { ok: true, reason: "lock_disabled" };
  }
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ ok: false, error: "Method not allowed" });
  }

  try {
    if (!sql) {
      return res
        .status(500)
        .json({ ok: false, error: "Database not configured" });
    }

    if (!EXTENSION_API_TOKEN) {
      return res
        .status(500)
        .json({ ok: false, error: "Server token not configured" });
    }

    const { token, deviceId } = req.body || {};

    if (!token || !deviceId) {
      return res
        .status(400)
        .json({ ok: false, error: "token and deviceId required" });
    }

    if (token !== EXTENSION_API_TOKEN) {
      return res
        .status(401)
        .json({ ok: false, error: "Bad token" });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res.status(401).json({
        ok: false,
        error: "not_logged_in",
      });
    }

    const email = session.user.email;
    const name = session.user.name || null;

    const userId = await ensureUser(email, name);

    const lockResult = await enforceDeviceLock(userId, deviceId);
    if (!lockResult.ok) {
      return res.status(403).json({
        ok: false,
        error: "device_locked",
        message:
          lockResult.message ||
          "Your license is locked to another device. Please request a device reset from admin.",
      });
    }

    // --- subscription check from extension_payments ---
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
        "automation-bundle payments lookup error",
        e
      );
      rows = [];
    }

    if (rows.length === 0) {
      return res.status(403).json({
        ok: false,
        error: "no_subscription",
      });
    }

    const row = rows[0];
    const nowMs = Date.now();
    let isActive = false;

    if (row.valid_until) {
      const untilMs = Date.parse(row.valid_until);
      const diffMs = untilMs - nowMs;
      isActive = diffMs > 0 && row.status === "approved";
    } else {
      isActive = row.status === "approved";
    }

    if (!isActive) {
      return res.status(403).json({
        ok: false,
        error: row.status === "pending"
          ? "pending"
          : "expired_or_cancelled",
      });
    }

    // --- read bundle file and send as JS ---
    const bundlePath = path.join(
      process.cwd(),
      "automation-client-bundle.js"
    );

    let jsCode;
    try {
      jsCode = fs.readFileSync(bundlePath, "utf8");
    } catch (e) {
      console.error(
        "automation-client-bundle.js not found",
        e
      );
      return res.status(500).json({
        ok: false,
        error: "Server bundle missing",
      });
    }

    res.setHeader(
      "Content-Type",
      "application/javascript; charset=utf-8"
    );
    return res.status(200).send(jsCode);
  } catch (err) {
    console.error("automation-bundle fatal error", err);
    return res
      .status(500)
      .json({ ok: false, error: "Server error" });
  }
}
