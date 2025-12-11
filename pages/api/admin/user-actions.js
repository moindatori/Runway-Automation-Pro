// pages/api/admin/user-actions.js
import { sql } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, action, days } = req.body || {};
  if (!userId || !action) {
    return res.status(400).json({ error: "Missing userId or action" });
  }

  try {
    // 1) Load user + email
    const userRows = await sql`
      SELECT id, email
      FROM users
      WHERE id = ${userId}
      LIMIT 1;
    `;
    if (userRows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userEmail = userRows[0].email;

    // --- Helpers --------------------------------------------------------

    async function resetDeviceLocks() {
      await sql`
        UPDATE device_locks
        SET is_active = false
        WHERE user_id = ${userId}
          AND is_active = true;
      `;
    }

    async function loadLatestExt() {
      const extRows = await sql`
        SELECT id, region, status, valid_until
        FROM extension_payments
        WHERE user_email = ${userEmail}
        ORDER BY created_at DESC
        LIMIT 1;
      `;
      return extRows[0] || null;
    }

    // create or update subscription:
    //  - if existingRow exists -> update (status=approved, new valid_until)
    //  - if not -> create new row with status=approved
    async function upsertSubscription({ targetDays }) {
      const existing = await loadLatestExt();
      const region = existing?.region || "PK"; // default PK, you can change

      const now = new Date();
      let base = now;

      // If already approved and valid_until in future, extend from that date
      if (
        existing &&
        existing.status === "approved" &&
        existing.valid_until
      ) {
        const existingEnd = new Date(existing.valid_until);
        if (existingEnd.getTime() > now.getTime()) {
          base = existingEnd;
        }
      }

      const newEnd = new Date(
        base.getTime() + targetDays * 24 * 60 * 60 * 1000
      );

      if (!existing) {
        // No previous subscription -> create manual approved row
        await sql`
          INSERT INTO extension_payments
            (user_email, device_id, region, tx_id, status, valid_until)
          VALUES
            (${userEmail}, NULL, ${region}, 'ADMIN_MANUAL', 'approved', ${newEnd.toISOString()});
        `;
      } else {
        await sql`
          UPDATE extension_payments
          SET status = 'approved',
              valid_until = ${newEnd.toISOString()}
          WHERE id = ${existing.id};
        `;
      }
    }

    async function cancelSubscription() {
      const existing = await loadLatestExt();
      if (!existing) {
        // nothing to cancel, just succeed
        return;
      }
      await sql`
        UPDATE extension_payments
        SET status = 'cancelled',
            valid_until = NOW()
        WHERE id = ${existing.id};
      `;
    }

    // --- Actions --------------------------------------------------------

    if (action === "reset_device") {
      await resetDeviceLocks();
      return res.status(200).json({ ok: true });
    }

    if (action === "extend_30") {
      await upsertSubscription({ targetDays: 30 });
      return res.status(200).json({ ok: true });
    }

    if (action === "cancel_subscription") {
      await cancelSubscription();
      return res.status(200).json({ ok: true });
    }

    if (action === "set_days") {
      const intDays = parseInt(days, 10);
      if (Number.isNaN(intDays) || intDays < 0) {
        return res.status(400).json({ error: "Invalid days value" });
      }
      // IMPORTANT: this works even if no subscription exists yet
      await upsertSubscription({ targetDays: intDays });
      return res.status(200).json({ ok: true });
    }

    // Unknown action
    return res.status(400).json({ error: "Unknown action" });
  } catch (err) {
    console.error("user-actions error", err);
    return res.status(500).json({ error: "Server error" });
  }
}
