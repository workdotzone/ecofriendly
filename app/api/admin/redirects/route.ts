import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Redirect from "@/models/Redirect";
import { requireAdmin } from "@/lib/adminAuth";

function normalizePath(path: string) {
  let clean = path.trim();
  if (!clean.startsWith("/") && !/^https?:\/\//i.test(clean)) {
    clean = `/${clean}`;
  }
  if (clean.length > 1 && clean.endsWith("/")) {
    clean = clean.slice(0, -1);
  }
  return clean;
}

export async function GET(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const redirects = await Redirect.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(redirects, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/redirects error:", error);
    return NextResponse.json({ error: "Failed to load redirects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const body = await request.json();

    const source = normalizePath(body.source || "").toLowerCase();
    const destination = normalizePath(body.destination || "");

    if (!source || !destination) {
      return NextResponse.json({ error: "Source and destination are required" }, { status: 400 });
    }
    if (source === destination.toLowerCase()) {
      return NextResponse.json({ error: "Source and destination cannot be the same (redirect loop)" }, { status: 400 });
    }
    if (source.startsWith("/admin") || source.startsWith("/api")) {
      return NextResponse.json({ error: "Cannot redirect /admin or /api routes" }, { status: 400 });
    }

    const created = await Redirect.create({
      source,
      destination,
      permanent: body.permanent !== false,
      isActive: true,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json({ error: "A redirect for this source path already exists" }, { status: 409 });
    }
    console.error("POST /api/admin/redirects error:", err);
    return NextResponse.json({ error: "Failed to create redirect" }, { status: 500 });
  }
}