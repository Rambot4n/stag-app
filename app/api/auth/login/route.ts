import { NextRequest, NextResponse } from "next/server";
import { validateCredentials, createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { firstName, lastName, password } = await request.json();

  if (!(await validateCredentials(firstName, lastName, password))) {
    return NextResponse.json({ error: "Invalid name or password" }, { status: 401 });
  }

  const token = createSessionToken(firstName, lastName);
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
