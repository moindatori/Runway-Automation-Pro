// pages/api/admin/payment-requests.js

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
    return res
      .status(405)
      .json({ ok: false, error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !isAdminEmail(session.user?.email)) {
    return res.status(403).json({ ok: false, error: "Forbidden" });
  }

  const { id, action } = req.body || {};
  if (!id || !action) {
    return res
      .status(400)
      .json({ ok: false, error: "id and action required" });
  }

  try {
    if (action === "approve_30") {
      // Approve and grant 30-day license from now
      await sql`
        UPDATE extension_payments
        SET status = 'approved',
            valid_until = NOW() + interval '30 days'
        WHERE id = ${id}
      `;
    } else if (action === "reject") {
      // Mark as rejected, no license
      await sql`
        UPDATE extension_payments
        SET status = 'rejected',
            valid_until = NULL
        WHERE id = ${id}
      `;
    } else if (action === "cancel") {
      // Cancel an approved license immediately
      await sql`
        UPDATE extension_payments
        SET status = 'cancelled',
            valid_until = NOW()
        WHERE id = ${id}
      `;
    } else {
      return res
        .status(400)
        .json({ ok: false, error: "Unknown action" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(
      "admin extension payment action error (extension_payments)",
      err
    );
    return res
      .status(500)
      .json({ ok: false, error: "Server error" });
  }
}
