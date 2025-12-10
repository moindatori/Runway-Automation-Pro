// pages/api/extension/check.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const ALLOWED_ORIGINS = ["https://app.runwayml.com"];

if (process.env.NEXT_PUBLIC_ALLOWED_ORIGIN) {
  ALLOWED_ORIGINS.push(process.env.NEXT_PUBLIC_ALLOWED_ORIGIN);
}

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
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { token, deviceId } = req.body || {};

  // EXTENSION API TOKEN CHECK
  if (!token || token !== process.env.EXTENSION_API_TOKEN) {
    return res.status(401).json({ ok: false, error: "Bad token" });
  }

  try {
    // YE LINE asal magic hai: ye NextAuth ka login check karega (cookie se)
    const session = await getServerSession(req, res, authOptions);

    console.log("[extension/check] session?", !!session, session?.user?.email, "deviceId:", deviceId);

    // AGAR LOGIN NAHI:
    if (!session || !session.user?.email) {
      return res.status(200).json({ ok: false, reason: "not_logged_in" });
    }

    // TODO: yahan baad me DB se subscription check karna hai
    // abhi ke liye: hamesha "no_subscription" bhej rahe hain
    return res.status(200).json({
      ok: true,
      status: "no_subscription", // baad me "active" waghaira
      plan: null,
      daysRemaining: 0,
      region: "PK",
    });
  } catch (err) {
    console.error("extension/check error", err);
    return res.status(500).json({ ok: false, error: "internal_error" });
  }
}
