// pages/api/extension/payment.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { sql } from "../../../lib/db";
import { randomUUID } from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { token, deviceId, region, txId } = req.body || {};

  if (!token || token !== process.env.EXTENSION_API_TOKEN) {
    return res.status(401).json({ ok: false, error: "Bad token" });
  }
  if (!txId) {
    return res.status(400).json({ ok: false, error: "Missing transaction ID" });
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

  const isPK = (region || "PK") === "PK";
  const planCode = isPK ? "PK_MONTH_1000" : "INT_MONTH_10";
  const currency = isPK ? "PKR" : "USD";
  const amountNumeric = isPK ? 1000 : 10;

  await sql`
    INSERT INTO payment_requests
      (user_id, plan_code, currency, amount_numeric, tx_id, note, status, created_at)
    VALUES
      (${userId}, ${planCode}, ${currency}, ${amountNumeric}, ${txId}, ${deviceId}, 'pending', NOW())
  `;

  return res.status(200).json({ ok: true });
}
