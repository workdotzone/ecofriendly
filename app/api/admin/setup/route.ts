import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import {
  clearLoginFailures,
  isAdminAuthConfigured,
  isAdminSetupKeyConfigured,
  isLoginRateLimited,
  isSameOriginRequest,
  recordLoginFailure,
  verifyAdminSetupKey,
} from "@/lib/adminAuth";

const SINGLE_ADMIN_ID = "000000000000000000000001";

export async function GET() {
  try {
    await dbConnect();
    const registrationOpen = !(await Admin.exists({}));
    return NextResponse.json({
      success: true,
      registrationOpen,
      authConfigured: isAdminAuthConfigured(),
      setupKeyConfigured: isAdminSetupKeyConfigured(),
    }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Admin setup status error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to check admin setup. Please try again." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ success: false, message: "Invalid request origin" }, { status: 403 });
  }
  if (!isAdminAuthConfigured()) {
    return NextResponse.json({
      success: false,
      message: "Admin authentication is not configured. Set JWT_SECRET to a random value of at least 32 characters.",
    }, { status: 503 });
  }
  if (!isAdminSetupKeyConfigured()) {
    return NextResponse.json({
      success: false,
      message: "Initial setup is locked until a random ADMIN_SETUP_KEY of at least 32 characters is configured on the server.",
    }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Please submit valid registration details." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ success: false, message: "Please submit valid registration details." }, { status: 400 });
  }

  const { email: rawEmail, password, setupKey } = body as Record<string, unknown>;
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ success: false, message: "Enter a valid email address." }, { status: 400 });
  }
  if (
    typeof password !== "string"
    || password.length < 12
    || new TextEncoder().encode(password).length > 72
  ) {
    return NextResponse.json({
      success: false,
      message: "Use a password with at least 12 characters and no more than 72 bytes.",
    }, { status: 400 });
  }

  try {
    if (await isLoginRateLimited(request)) {
      return NextResponse.json({
        success: false,
        message: "Too many unsuccessful setup attempts. Wait 15 minutes before trying again.",
      }, { status: 429, headers: { "Retry-After": "900" } });
    }
    if (!verifyAdminSetupKey(setupKey)) {
      await recordLoginFailure(request);
      return NextResponse.json({ success: false, message: "Invalid one-time setup key." }, { status: 401 });
    }

    await dbConnect();
    if (await Admin.exists({})) {
      return NextResponse.json({
        success: false,
        message: "Admin registration is closed. Sign in with the registered account.",
      }, { status: 403 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await clearLoginFailures(request);
    await Admin.create({
      _id: SINGLE_ADMIN_ID,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      success: true,
      message: "Admin account created. Sign in with your new credentials.",
    }, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json({
        success: false,
        message: "Admin registration has already been completed.",
      }, { status: 409 });
    }
    console.error("Admin registration error:", error);
    return NextResponse.json({
      success: false,
      message: "Unable to create the admin account. Please try again.",
    }, { status: 503 });
  }
}
