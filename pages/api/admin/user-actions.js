// pages/api/admin/user-actions.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { sql } from "../../../lib/db";

function isAdminEmail(email) {
  if (!email) return false;
  const single = process.env.ADMIN_EMAIL;
  const multi = process.env.ADMIN_EMAILS;
  if (single && email === single) return true;
  if (multi) {
    const list = multi.split(",").map((e) => e.trim());
    if (list.includes(email)) return true;
  }
  return false;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !isAdminEmail(session.user?.email)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { userId, action, days } = req.body || {};

  if (!userId || !action) {
    return res.status(400).json({ error: "Missing userId or action" });
  }

  try {
    // 1) RESET DEVICE
    if (action === "reset_device") {
      await sql`
        DELETE FROM device_locks
        WHERE user_id = ${userId}
      `;
      return res.status(200).json({ ok: true, action: "reset_device" });
    }

    // Helper: latest active subscription
    const activeRows = await sql`
      SELECT id, end_date
      FROM subscriptions
      WHERE user_id = ${userId}
        AND status = 'active'
        AND end_date > NOW()
      ORDER BY end_date DESC
      LIMIT 1
    `;

    if (!activeRows.length) {
      return res.status(400).json({ error: "No active subscription for this user" });
    }

    const subId = activeRows[0].id;

    // 2) EXTEND SUBSCRIPTION (default 30 days)
    if (action === "extend_30") {
      const d = Number.isFinite(parseInt(days, 10)) && parseInt(days, 10) > 0
        ? parseInt(days, 10)
        : 30;

      await sql`
        UPDATE subscriptions
        SET end_date = end_date + ${d} * interval '1 day'
        WHERE id = ${subId}
      `;
      return res.status(200).json({ ok: true, action: "extend_30", days: d });
    }

    // 3) CANCEL SUBSCRIPTION
    if (action === "cancel_subscription") {
      await sql`
        UPDATE subscriptions
        SET status = 'canceled',
            end_date = NOW()
        WHERE id = ${subId}
      `;
      return res.status(200).json({ ok: true, action: "cancel_subscription" });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (err) {
    console.error("admin user action error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
