// pages/api/admin/test-pushover.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

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
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email;

  if (!email || !isAdminEmail(email)) {
    return res.status(403).json({
      ok: false,
      error: "Forbidden",
      reason: !email ? "Not logged in" : "Not an admin email",
      sessionEmail: email || null
    });
  }

  const userKey = process.env.PUSHOVER_USER_KEY;
  const appToken = process.env.PUSHOVER_APP_TOKEN;

  if (!userKey || !appToken) {
    return res.status(500).json({
      ok: false,
      error: "Missing env vars",
      hasUserKey: !!userKey,
      hasAppToken: !!appToken
    });
  }

  const form = new URLSearchParams();
  form.set("token", appToken);
  form.set("user", userKey);
  form.set("title", "Runway Automation Pro");
  form.set("message", "✅ Test notification from Vercel API route");

  const r = await fetch("https://api.pushover.net/1/messages.json", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString()
  });

  const text = await r.text().catch(() => "");
  return res.status(200).json({ ok: r.ok, status: r.status, response: text });
}
