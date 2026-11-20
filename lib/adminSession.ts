import { jwtVerify, SignJWT } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "admin_token";
const JWT_ISSUER = "eco-pest-admin";
const JWT_AUDIENCE = "eco-pest-admin-panel";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  const encoded = new TextEncoder().encode(secret);
  return encoded.length >= 32 ? encoded : null;
}

export function isAdminAuthConfigured() {
  return getSecret() !== null;
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function createAdminToken(email: string, adminId: string) {
  const secret = getSecret();
  if (!secret) throw new Error("JWT_SECRET must be at least 32 bytes");

  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret);
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 12,
    path: "/",
  };
}

export async function isAdminTokenValid(token: string | undefined) {
  const secret = getSecret();
  if (!token || !secret) return false;

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    return payload.role === "admin" && typeof payload.sub === "string" && typeof payload.email === "string";
  } catch {
    return false;
  }
}

export async function isAdminRequest(request: NextRequest | Request) {
  const token = request.headers
    .get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  return isAdminTokenValid(token);
}

export async function requireAdmin(request: NextRequest | Request) {
  const isMutation = !["GET", "HEAD", "OPTIONS"].includes(request.method);
  if (isMutation && !isSameOriginRequest(request)) {
    return NextResponse.json({ success: false, message: "Invalid request origin" }, { status: 403 });
  }
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return null;
}
