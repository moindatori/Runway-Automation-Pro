import crypto from "crypto";

const EXT_SECRET = process.env.EXTENSION_TOKEN_SECRET;

if (!EXT_SECRET) {
  throw new Error("EXTENSION_TOKEN_SECRET is not set");
}

export function generateExtensionToken(userId) {
  const data = String(userId);
  const signature = crypto
    .createHmac("sha256", EXT_SECRET)
    .update(data)
    .digest("base64url");
  return `${data}.${signature}`;
}

export function parseExtensionToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [userId, signature] = parts;
  if (!userId || !signature) return null;

  const expected = crypto
    .createHmac("sha256", EXT_SECRET)
    .update(userId)
    .digest("base64url");

  if (signature !== expected) return null;
  return userId;
}
