import { NextResponse } from "next/server";
import { adminCookieOptions, isSameOriginRequest } from "@/lib/adminAuth";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ success: false, message: "Invalid request origin" }, { status: 403 });
  }

  const response = NextResponse.json(
    { success: true, message: "Signed out." },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set("admin_token", "", {
    ...adminCookieOptions(),
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}
