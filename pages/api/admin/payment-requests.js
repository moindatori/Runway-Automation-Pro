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
  const session = await getServerSession(req, res, authOptions);
  if (!session || !isAdminEmail(session.user?.email)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (req.method === "GET") {
    try {
      const rows = await sql`
        SELECT pr.id,
               pr.plan_code,
               pr.currency,
               pr.amount_numeric,
               pr.tx_id,
               pr.status,
               pr.created_at,
               u.email
        FROM payment_requests pr
        JOIN users u ON u.id = pr.user_id
        ORDER BY pr.created_at DESC
      `;
      return res.status(200).json({ rows });
    } catch (err) {
      console.error("admin GET payment-requests error", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === "POST") {
    const { id, action } = req.body || {};
    if (!id || !["approve", "reject"].includes(action)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    try {
      const prs = await sql`
        SELECT * FROM payment_requests WHERE id = ${id}
      `;
      if (!prs || prs.length === 0) {
        return res.status(404).json({ error: "Not found" });
      }
      const pr = prs[0];

      if (pr.status !== "pending") {
        return res.status(400).json({ error: "Already processed" });
      }

      if (action === "reject") {
        await sql`
          UPDATE payment_requests
          SET status = 'rejected',
              reviewed_by = ${session.user.email},
              reviewed_at = NOW()
          WHERE id = ${id}
        `;
        return res.status(200).json({ success: true });
      }

      if (action === "approve") {
        await sql`
          UPDATE payment_requests
          SET status = 'approved',
              reviewed_by = ${session.user.email},
              reviewed_at = NOW()
          WHERE id = ${id}
        `;

        await sql`
          INSERT INTO subscriptions (user_id, plan_code, currency, amount_numeric, status, start_date, end_date)
          VALUES (${pr.user_id}, ${pr.plan_code}, ${pr.currency}, ${pr.amount_numeric}, 'active', NOW(), NOW() + interval '30 days')
        `;

        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ error: "Unknown action" });
    } catch (err) {
      console.error("admin POST payment-requests error", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).end();
}
