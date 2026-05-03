import { NextRequest, NextResponse } from "next/server";
import { validateCredentials, createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { surname, password } = await request.json();

  if (!validateCredentials(surname, password)) {
    return NextResponse.json({ error: "Invalid surname or password" }, { status: 401 });
  }

  const token = createSessionToken(surname);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
