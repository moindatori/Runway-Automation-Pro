import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { generateExtensionToken } from "../../../lib/token";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.appUserId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const token = generateExtensionToken(session.appUserId);
    return res.status(200).json({ token });
  } catch (err) {
    console.error("create-token error", err);
    return res.status(500).json({ error: "Server error" });
  }
}
