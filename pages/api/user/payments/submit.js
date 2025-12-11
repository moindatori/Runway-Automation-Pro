// pages/api/user/payments/submit.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { neon } from "@neondatabase/serverless";

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

export default async function handler(req, res) {
  if (req.method !== "POST") {
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
      return res.status(200).json({
        ok: false,
        message: "Not logged in.",
      });
    }

    const email = session.user.email;
    const { transactionId, region } = req.body || {};
    const cleanTx = (transactionId || "").trim();

    if (!cleanTx) {
      return res.status(400).json({
        ok: false,
        message: "Transaction ID is required.",
      });
    }

    const normalizedRegion = region === "INT" ? "INT" : "PK";

    // Insert as pending, admin will approve later (same as extension/payment.js style)
    await sql`
      INSERT INTO extension_payments
        (device_id, user_email, region, tx_id, status)
      VALUES
        (NULL, ${email}, ${normalizedRegion}, ${cleanTx}, 'pending');
    `;

    return res.status(200).json({
      ok: true,
      status: "pending",
      message: "Transaction submitted. Pending manual review.",
    });
  } catch (err) {
    console.error("user/payments/submit error", err);
    return res.status(500).json({
      ok: false,
      message: "Unable to submit transaction.",
      error: err.message,
    });
  }
}
