import { sql } from "../../../lib/db";
import { parseExtensionToken } from "../../../lib/token";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { authToken, deviceId } = req.body || {};
  if (!authToken || !deviceId) {
    return res.status(200).json({ state: "no_auth" });
  }

  try {
    const userId = parseExtensionToken(authToken);
    if (!userId) {
      return res.status(200).json({ state: "no_auth" });
    }

    const users = await sql`
      SELECT id, email FROM users WHERE id = ${userId}
    `;
    if (!users || users.length === 0) {
      return res.status(200).json({ state: "no_auth" });
    }
    const userRow = users[0];

    const subs = await sql`
      SELECT plan_code, end_date
      FROM subscriptions
      WHERE user_id = ${userId}
        AND status = 'active'
        AND end_date > NOW()
      ORDER BY end_date DESC
      LIMIT 1
    `;
    if (!subs || subs.length === 0) {
      return res.status(200).json({ state: "no_subscription", email: userRow.email });
    }
    const sub = subs[0];

    const hoursLock = 72;

    const locks = await sql`
      SELECT id, device_id, last_updated
      FROM device_locks
      WHERE user_id = ${userId}
      ORDER BY last_updated DESC
      LIMIT 1
    `;
    const now = new Date();

    if (!locks || locks.length === 0) {
      await sql`
        INSERT INTO device_locks (user_id, device_id, last_updated)
        VALUES (${userId}, ${deviceId}, ${now.toISOString()})
      `;
    } else {
      const lock = locks[0];
      if (lock.device_id !== deviceId) {
        const last = new Date(lock.last_updated);
        const diffHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
        if (diffHours < hoursLock) {
          const nextAllowed = new Date(last.getTime() + hoursLock * 60 * 60 * 1000);
          return res.status(200).json({
            state: "device_blocked",
            nextAllowedAt: nextAllowed.toISOString()
          });
        } else {
          await sql`
            UPDATE device_locks
            SET device_id = ${deviceId}, last_updated = ${now.toISOString()}
            WHERE id = ${lock.id}
          `;
        }
      } else {
        await sql`
          UPDATE device_locks
          SET last_updated = ${now.toISOString()}
          WHERE id = ${lock.id}
        `;
      }
    }

    return res.status(200).json({
      state: "ok",
      email: userRow.email,
      plan: sub.plan_code,
      expiresAt: sub.end_date
    });
  } catch (err) {
    console.error("extension status error", err);
    return res.status(500).end();
  }
}
