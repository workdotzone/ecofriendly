import { createHmac, timingSafeEqual } from "node:crypto";
import dbConnect from "@/lib/db";
import AdminLoginAttempt from "@/models/AdminLoginAttempt";
import { isAdminAuthConfigured } from "@/lib/adminSession";

export {
  adminCookieOptions,
  createAdminToken,
  isAdminAuthConfigured,
  isAdminRequest,
  isAdminTokenValid,
  isSameOriginRequest,
  requireAdmin,
} from "@/lib/adminSession";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_FAILURES = 8;

export function isAdminSetupKeyConfigured() {
  const setupKey = process.env.ADMIN_SETUP_KEY;
  return Boolean(setupKey && Buffer.byteLength(setupKey) >= 32);
}

export function verifyAdminSetupKey(candidate: unknown) {
  const setupKey = process.env.ADMIN_SETUP_KEY;
  if (
    typeof candidate !== "string"
    || !setupKey
    || Buffer.byteLength(setupKey) < 32
  ) {
    return false;
  }

  const expected = Buffer.from(setupKey);
  const provided = Buffer.from(candidate);
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

function getRateLimitKey(request: Request) {
  const secret = process.env.JWT_SECRET;
  if (!secret || !isAdminAuthConfigured()) {
    throw new Error("JWT_SECRET must be at least 32 bytes");
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  const forwardedIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientIp = realIp || forwardedIp || "unknown";
  return createHmac("sha256", secret).update(clientIp).digest("hex");
}

export async function isLoginRateLimited(request: Request) {
  await dbConnect();
  const key = getRateLimitKey(request);
  const cutoff = new Date(Date.now() - LOGIN_WINDOW_MS);
  const attempt = await AdminLoginAttempt.findOne({
    _id: key,
    windowStartedAt: { $gt: cutoff },
    attempts: { $gte: MAX_LOGIN_FAILURES },
  }).select("_id").lean();
  return Boolean(attempt);
}

export async function recordLoginFailure(request: Request) {
  await dbConnect();
  const key = getRateLimitKey(request);
  const now = new Date();
  const cutoff = new Date(now.getTime() - LOGIN_WINDOW_MS);

  await AdminLoginAttempt.updateOne(
    { _id: key, windowStartedAt: { $lte: cutoff } },
    { $set: { attempts: 0, windowStartedAt: now, expiresAt: new Date(now.getTime() + LOGIN_WINDOW_MS * 2) } },
  );

  const update = {
    $inc: { attempts: 1 },
    $set: { expiresAt: new Date(now.getTime() + LOGIN_WINDOW_MS * 2) },
    $setOnInsert: { windowStartedAt: now },
  };

  try {
    await AdminLoginAttempt.findOneAndUpdate({ _id: key }, update, { upsert: true, new: true });
  } catch (error) {
    if (!error || typeof error !== "object" || !("code" in error) || error.code !== 11000) throw error;
    await AdminLoginAttempt.findOneAndUpdate({ _id: key }, update, { new: true });
  }
}

export async function clearLoginFailures(request: Request) {
  await dbConnect();
  await AdminLoginAttempt.deleteOne({ _id: getRateLimitKey(request) });
}
