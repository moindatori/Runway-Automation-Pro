// pages/api/extension/check.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

// Device is locked to a machine for 72 hours
const DEVICE_LOCK_HOURS = 72;

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const { token, deviceId } = req.body || {};

    // 1) Verify extension API token
    if (!token || token !== process.env.EXTENSION_API_TOKEN) {
      return res.status(401).json({ ok: false, error: "Bad token" });
    }

    // 2) Check NextAuth session (same Google account as website)
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res.status(200).json({ ok: false, reason: "not_logged_in" });
    }

    const email = session.user.email.toLowerCase();
    const now = new Date();

    // 3) Get latest subscription for this user
    const rows = await sql`
      SELECT id,
             email,
             status,
             region,
             plan,
             expires_at,
             device_id,
             device_bound_at
      FROM subscriptions
      WHERE email = ${email}
      ORDER BY created_at DESC
      LIMIT 1;
    `;

    if (!rows || rows.length === 0) {
      // no subscription in DB
      return res.status(200).json({ ok: true, status: "no_subscription" });
    }

    const sub = rows[0];

    // 4) Expired subscription → treat as no subscription
    if (sub.expires_at && new Date(sub.expires_at) < now) {
      return res.status(200).json({ ok: true, status: "no_subscription" });
    }

    // 5) Pending payment
    if (sub.status === "pending") {
      return res.status(200).json({
        ok: true,
        status: "pending",
        region: sub.region || "PK",
      });
    }

    // 6) Active subscription → handle device binding
    const boundId = sub.device_id;
    const boundAt = sub.device_bound_at ? new Date(sub.device_bound_at) : null;

    if (deviceId) {
      // first time: bind device
      if (!boundId) {
        await sql`
          UPDATE subscriptions
          SET device_id = ${deviceId},
              device_bound_at = NOW(),
              updated_at = NOW()
          WHERE id = ${sub.id};
        `;
      } else if (boundId !== deviceId) {
        // different device trying to use same subscription
        const lockMs = DEVICE_LOCK_HOURS * 60 * 60 * 1000;

        if (boundAt && now - boundAt < lockMs) {
          const hoursLeft = Math.ceil(
            (lockMs - (now - boundAt)) / (60 * 60 * 1000)
          );
          // still locked to previous device
          return res.status(200).json({
            ok: false,
            reason: "device_locked",
            hoursLeft,
          });
        } else {
          // 72 hours passed: re-bind to new device
          await sql`
            UPDATE subscriptions
            SET device_id = ${deviceId},
                device_bound_at = NOW(),
                updated_at = NOW()
            WHERE id = ${sub.id};
          `;
        }
      }
    }

    // 7) Calculate days remaining (for showing in admin / extension)
    let daysRemaining = null;
    if (sub.expires_at) {
      const diffMs = new Date(sub.expires_at) - now;
      daysRemaining = diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 0;
    }

    return res.status(200).json({
      ok: true,
      status: "active",
      region: sub.region || "PK",
      plan: sub.plan || "default",
      daysRemaining,
    });
  } catch (err) {
    console.error("[/api/extension/check] error", err);
    return res
      .status(500)
      .json({ ok: false, error: "Internal server error in check" });
  }
}
