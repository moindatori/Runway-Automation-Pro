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
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !isAdminEmail(session.user?.email)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { id, action } = req.body || {};
    if (!id || !action) {
      return res.status(400).json({ error: "Missing id or action" });
    }

    if (action === "approve_30") {
      // 1) Load extension payment
      const paymentRows = await sql`
        SELECT id, user_email, device_id, region, tx_id, status, valid_until, created_at
        FROM extension_payments
        WHERE id = ${id}
        LIMIT 1
      `;
      const payment = paymentRows[0];
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      if (payment.status !== "pending") {
        return res.status(400).json({ error: "Only pending payments can be approved" });
      }

      // 2) Find or create user by email
      const email = payment.user_email;
      if (!email) {
        return res.status(400).json({ error: "Payment has no user_email" });
      }

      let userId;
      const userRows = await sql`
        SELECT id FROM users WHERE email = ${email} LIMIT 1
      `;
      if (userRows.length > 0) {
        userId = userRows[0].id;
      } else {
        const newUserRows = await sql`
          INSERT INTO users (email, name)
          VALUES (${email}, ${email})
          RETURNING id
        `;
        userId = newUserRows[0].id;
      }

      // 3) Determine pricing + plan based on region
      const region = payment.region || "PK";
      let currency = "PKR";
      let amountNumeric = 1000;
      let planCode = "EXT-PKR-30";

      if (region === "INT") {
        currency = "USD";
        amountNumeric = 10;
        planCode = "EXT-INT-30";
      }

      // 4) Create 30-day subscription entry
      await sql`
        INSERT INTO subscriptions (
          user_id,
          plan_code,
          status,
          currency,
          amount_numeric,
          start_date,
          end_date
        )
        VALUES (
          ${userId},
          ${planCode},
          'active',
          ${currency},
          ${amountNumeric},
          NOW(),
          NOW() + interval '30 days'
        )
      `;

      // 5) Update extension_payments status + valid_until
      await sql`
        UPDATE extension_payments
        SET status = 'approved',
            valid_until = NOW() + interval '30 days'
        WHERE id = ${id}
      `;

      return res.status(200).json({ ok: true });
    }

    if (action === "reject") {
      await sql`
        UPDATE extension_payments
        SET status = 'rejected'
        WHERE id = ${id}
      `;
      return res.status(200).json({ ok: true });
    }

    if (action === "cancel") {
      // Cancel the extension payment and related EXT subscription
      const paymentRows = await sql`
        SELECT id, user_email, region
        FROM extension_payments
        WHERE id = ${id}
        LIMIT 1
      `;
      const payment = paymentRows[0];
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      // 1) Mark payment as cancelled
      await sql`
        UPDATE extension_payments
        SET status = 'cancelled',
            valid_until = NOW()
        WHERE id = ${id}
      `;

      // 2) Cancel latest active EXT-* subscription for this user (if exists)
      if (payment.user_email) {
        const userRows = await sql`
          SELECT id
          FROM users
          WHERE email = ${payment.user_email}
          LIMIT 1
        `;
        if (userRows.length > 0) {
          const userId = userRows[0].id;
          await sql`
            UPDATE subscriptions
            SET status = 'cancelled',
                end_date = LEAST(end_date, NOW())
            WHERE user_id = ${userId}
              AND status = 'active'
              AND plan_code LIKE 'EXT-%'
          `;
        }
      }

      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: "Unsupported action" });
  } catch (err) {
    console.error("admin payment-requests error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
