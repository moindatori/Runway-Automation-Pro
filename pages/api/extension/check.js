// pages/api/extension/check.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ ok: false, error: "Method not allowed" });
    }

    const { token } = req.body || {};

    // 1) Token check
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
