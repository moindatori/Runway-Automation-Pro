// pages/api/extension/payment.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

// --- CORS helper (same pattern as /api/extension/check) ---
function applyCors(req, res) {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "https://app.runwayml.com",
    "https://runway-automation-pro.vercel.app",
  ];

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
}

export default async function handler(req, res) {
  applyCors(req, res);

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { token, txId, region, deviceId } = req.body || {};

    // 1) Validate extension API token
    if (!token || token !== process.env.EXTENSION_API_TOKEN) {
      return res.status(401).json({ ok: false, error: "Bad token" });
    }

    // 2) Validate transaction ID
    if (!txId || typeof txId !== "string" || !txId.trim()) {
      return res
        .status(400)
        .json({ ok: false, error: "Missing transaction ID" });
    }

    // 3) Get Google session (same account as extension)
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res.status(200).json({ ok: false, reason: "not_logged_in" });
    }

    const email = session.user.email.toLowerCase();

    // 4) Normalize region + plan
    const subRegion = region === "INT" ? "INT" : "PK";
    const plan =
      subRegion === "INT" ? "intl_10usd_30d" : "pk_1000rs_30d";

    // 5) Create / overwrite latest PENDING subscription
    //    - status: pending  -> extension overlay shows "Payment submitted"
    //    - expires_at: now + 30 days (will matter once you set status='active')
    //    - tx_id: for manual verification in admin
    //    - device_id / device_bound_at: remember which device paid first
    const result = await sql`
      INSERT INTO subscriptions (
        email,
        status,
        region,
        plan,
        tx_id,
        expires_at,
        device_id,
        device_bound_at,
        created_at,
        updated_at
      )
      VALUES (
        ${email},
        'pending',
        ${subRegion},
        ${plan},
        ${txId.trim()},
        NOW() + interval '30 days',
        ${deviceId || null},
        NOW(),
        NOW(),
        NOW()
      )
      RETURNING id;
    `;

    console.log(
      "[extension/payment] created pending subscription",
      email,
      "sub_id=",
      result[0]?.id,
      "region=",
      subRegion,
      "txId=",
      txId
    );

    // Extension will switch SUB_STATE.status -> "pending"
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("extension/payment error", e);
    return res
      .status(500)
      .json({ ok: false, error: "internal_error_in_payment" });
  }
}
