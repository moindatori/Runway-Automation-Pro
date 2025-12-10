// pages/api/extension/check.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { sql } from "../../../lib/db";
import { randomUUID } from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { token, deviceId } = req.body || {};

  if (!token || token !== process.env.EXTENSION_API_TOKEN) {
    return res.status(401).json({ ok: false, error: "Bad token" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(200).json({ ok: false, reason: "not_logged_in" });
  }

  const email = session.user.email;
  const name = session.user.name || email;

  // find or create user
  let userRows = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
  let userId;
  if (userRows.length === 0) {
    userId = randomUUID();
    await sql`
      INSERT INTO users (id, email, name)
      VALUES (${userId}, ${email}, ${name})
    `;
  } else {
    userId = userRows[0].id;
  }

  // pending payment?
  const pendingRows = await sql`
    SELECT id FROM payment_requests
    WHERE user_id = ${userId} AND status = 'pending'
    LIMIT 1
  `;
  if (pendingRows.length > 0) {
    return res.status(200).json({
      ok: true,
      status: "pending"
    });
  }

  // active subscription?
  const subRows = await sql`
    SELECT plan_code, currency, end_date
    FROM subscriptions
    WHERE user_id = ${userId}
      AND status = 'active'
      AND end_date > NOW()
    ORDER BY end_date DESC
    LIMIT 1
  `;

  if (subRows.length === 0) {
    return res.status(200).json({
      ok: true,
      status: "no_subscription"
    });
  }

  const sub = subRows[0];
  const now = new Date();
  const endDate = new Date(sub.end_date);
  const msDiff = endDate.getTime() - now.getTime();
  const daysRemaining =
    msDiff > 0 ? Math.ceil(msDiff / (1000 * 60 * 60 * 24)) : 0;

  // device lock (simple 72h rule)
  const lockRows = await sql`
    SELECT id, device_id, last_updated
    FROM device_locks
    WHERE user_id = ${userId}
    ORDER BY last_updated DESC
    LIMIT 1
  `;

  if (lockRows.length === 0) {
    await sql`
      INSERT INTO device_locks (user_id, device_id)
      VALUES (${userId}, ${deviceId})
    `;
  } else {
    const lock = lockRows[0];
    if (lock.device_id !== deviceId) {
      const allowedRows = await sql`
        SELECT (NOW() - ${lock.last_updated}) > interval '72 hours' AS allowed
      `;
      if (!allowedRows[0].allowed) {
        return res.status(200).json({
          ok: true,
          status: "error",
          reason: "device_locked"
        });
      }
      await sql`
        UPDATE device_locks
        SET device_id = ${deviceId}, last_updated = NOW()
        WHERE id = ${lock.id}
      `;
    } else {
      await sql`
        UPDATE device_locks
        SET last_updated = NOW()
        WHERE id = ${lock.id}
      `;
    }
  }

  return res.status(200).json({
    ok: true,
    status: "active",
    plan: sub.plan_code,
    daysRemaining,
    region: sub.currency === "PKR" ? "PK" : "INT"
  });
}
