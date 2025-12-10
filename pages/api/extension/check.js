// pages/api/extension/check.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

// Allowed origin – yahan se content script request aa rahi hai
const ALLOWED_ORIGINS = [
  "https://app.runwayml.com", // Runway main app
  process.env.NEXT_PUBLIC_ALLOWED_ORIGIN || "" // optional extra
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
    // CORS headers every time
    setCors(req, res);

    // Preflight (OPTIONS) – must return 200, not 405
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ ok: false, error: "Method not allowed" });
    }

    const { token } = req.body || {};

    // 1) Token check (matches env on Vercel)
    if (!token || token !== process.env.EXTENSION_API_TOKEN) {
      return res
        .status(401)
        .json({ ok: false, error: "Bad token" });
    }

    // 2) Google session check
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      // Extension ko batata hai ke user login nahi
      return res
        .status(200)
        .json({ ok: false, reason: "not_logged_in" });
    }

    // 3) TEST MODE:
    // Abhi database use nahi kar rahe. Hamesha "no_subscription" return karo
    // taa-ke extension payment UI show kare.
    return res.status(200).json({
      ok: true,
      status: "no_subscription",
      plan: null,
      daysRemaining: 0,
      region: "PK"
    });
  } catch (e) {
    console.error("extension/check error", e);
    return res
      .status(500)
      .json({ ok: false, error: "internal_error" });
  }
}
