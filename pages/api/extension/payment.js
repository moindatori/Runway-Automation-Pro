// pages/api/extension/payment.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const ALLOWED_ORIGINS = [
  "https://app.runwayml.com",
  process.env.NEXT_PUBLIC_ALLOWED_ORIGIN || ""
];

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
}

export default async function handler(req, res) {
  try {
    setCors(req, res);

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ ok: false, error: "Method not allowed" });
    }

    const { token, txId, region } = req.body || {};

    if (!token || token !== process.env.EXTENSION_API_TOKEN) {
      return res
        .status(401)
        .json({ ok: false, error: "Bad token" });
    }

    if (!txId) {
      return res
        .status(400)
        .json({ ok: false, error: "Missing transaction ID" });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res
        .status(200)
        .json({ ok: false, reason: "not_logged_in" });
    }

    // TEST MODE:
    // Abhi DB me kuch insert nahi kar rahe,
    // sirf ok:true + pending status assume karwa rahe hain.
    console.log(
      "[extension/payment] request",
      session.user.email,
      region,
      txId
    );

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("extension/payment error", e);
    return res
      .status(500)
      .json({ ok: false, error: "internal_error" });
  }
}
