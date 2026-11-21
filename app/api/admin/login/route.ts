import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import {
  adminCookieOptions,
  clearLoginFailures,
  createAdminToken,
  isAdminAuthConfigured,
  isLoginRateLimited,
  isSameOriginRequest,
  recordLoginFailure,
} from "@/lib/adminAuth";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ success: false, message: "Invalid request origin" }, { status: 403 });
  }
  if (!isAdminAuthConfigured()) {
    return NextResponse.json({
      success: false,
      message: "Admin authentication is unavailable. Check the server JWT_SECRET configuration.",
    }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Enter your email and password." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ success: false, message: "Enter your email and password." }, { status: 400 });
  }

  const { email: rawEmail, password } = body as Record<string, unknown>;
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || email.length > 254
    || typeof password !== "string"
    || new TextEncoder().encode(password).length > 72
  ) {
    return NextResponse.json({ success: false, message: "Invalid email or password." }, { status: 400 });
  }

  try {
    if (await isLoginRateLimited(request)) {
      return NextResponse.json({
        success: false,
        message: "Too many unsuccessful attempts. Wait 15 minutes before trying again.",
      }, { status: 429, headers: { "Retry-After": "900" } });
    }

    await dbConnect();
    const admin = await Admin.findOne({ email }).select("+password");
    const passwordMatches = admin ? await bcrypt.compare(password, admin.password) : false;
    if (!admin || !passwordMatches) {
      await recordLoginFailure(request);
      return NextResponse.json({ success: false, message: "Invalid email or password." }, { status: 401 });
    }

    await clearLoginFailures(request);
    const token = await createAdminToken(admin.email, admin._id.toString());
    const response = NextResponse.json({ success: true, message: "Login successful." });
    response.cookies.set("admin_token", token, adminCookieOptions());
    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({
      success: false,
      message: "Unable to sign in right now. Please try again.",
    }, { status: 503 });
  }
}
