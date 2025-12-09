import { sql } from "../../../lib/db";
import { parseExtensionToken } from "../../../lib/token";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { authToken, planCode, txId, note } = req.body || {};
  if (!authToken || !planCode || !txId) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const userId = parseExtensionToken(authToken);
    if (!userId) {
      return res.status(401).json({ error: "Invalid auth" });
    }

    const currency = planCode === "PKR_MONTHLY" ? "PKR" : "USD";
    const amount = planCode === "PKR_MONTHLY" ? 1000 : 10;

    await sql`
      INSERT INTO payment_requests (user_id, plan_code, currency, amount_numeric, tx_id, note)
      VALUES (${userId}, ${planCode}, ${currency}, ${amount}, ${txId}, ${note || null})
    `;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("payment-request error", err);
    return res.status(500).json({ error: "Server error" });
  }
}
