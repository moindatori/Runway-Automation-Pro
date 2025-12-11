// pages/api/user/payments/status.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { neon } from "@neondatabase/serverless";

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    if (!sql) {
      return res
        .status(500)
        .json({ ok: false, message: "Database not configured" });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      // Not logged in on the website → treat as no subscription
      return res.status(200).json({
        ok: true,
        status: "none",
        transactionId: "",
      });
    }

    const email = session.user.email;

    // Same table the extension uses
    const rows = await sql`
      SELECT status, tx_id
      FROM extension_payments
      WHERE user_email = ${email}
      ORDER BY created_at DESC
      LIMIT 1;
    `;

    if (rows.length === 0) {
      return res.status(200).json({
        ok: true,
        status: "none",
        transactionId: "",
      });
    }

    const row = rows[0];

    // Map DB status → UI status
    let status = "none";
    if (row.status === "approved" || row.status === "active") {
      status = "active";
    } else if (row.status === "pending") {
      status = "pending";
    } else if (row.status === "rejected") {
      status = "rejected";
    }

    return res.status(200).json({
      ok: true,
      status,
      transactionId: row.tx_id || "",
    });
  } catch (err) {
    console.error("user/payments/status error", err);
    return res.status(500).json({
      ok: false,
      message: "Unable to read payment status.",
      error: err.message,
    });
  }
}
