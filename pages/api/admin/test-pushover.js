import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ ok: false, error: "Forbidden" });
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
