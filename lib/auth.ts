import { createHmac } from "crypto";
import { cookies } from "next/headers";
import { supabase } from "./supabase";

const SESSION_COOKIE = "stag_session";
const SESSION_SECRET = process.env.SESSION_SECRET!;
const STAG_PASSWORD = process.env.STAG_PASSWORD!;

export async function validateCredentials(firstName: string, lastName: string, password: string): Promise<boolean> {
  if (password !== STAG_PASSWORD) return false;

  const { data } = await supabase
    .from("guests")
    .select("id")
    .ilike("first_name", firstName.trim())
    .ilike("last_name", lastName.trim())
    .single();

  return !!data;
}

function sign(value: string): string {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

export function createSessionToken(firstName: string, lastName: string): string {
  const payload = `${firstName.trim()} ${lastName.trim()}`.toLowerCase();
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
