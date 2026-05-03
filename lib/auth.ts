import { createHmac } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "stag_session";
const SESSION_SECRET = process.env.SESSION_SECRET!;
const STAG_PASSWORD = process.env.STAG_PASSWORD!;
const ALLOWED_SURNAMES = (process.env.ALLOWED_NAMES ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase());

export function validateCredentials(surname: string, password: string): boolean {
  const surnameOk = ALLOWED_SURNAMES.includes(surname.trim().toLowerCase());
  const passwordOk = password === STAG_PASSWORD;
  return surnameOk && passwordOk;
}

function sign(value: string): string {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

export function createSessionToken(surname: string): string {
  const payload = surname.toLowerCase();
  const sig = sign(payload);
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifySessionToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const lastColon = decoded.lastIndexOf(":");
    const payload = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);
    if (sign(payload) !== sig) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export { SESSION_COOKIE };
