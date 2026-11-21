import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Lead from "@/models/Lead";
import { cleanText, normalizeIndianMobile } from "@/lib/validation";

/**
 * Public lead endpoint.
 * - Whitelists fields (clients can no longer set `status` or other internal fields).
 * - Validates name and Indian mobile number, caps lengths.
 * - Honeypot field "website": bots that fill it get a fake success and nothing is saved.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ success: true, message: "Booking received" }, { status: 201 });
  }

  const name = cleanText(body.name, 80);
  const phone = normalizeIndianMobile(body.phone);
  const service = cleanText(body.service, 120) || "General Pest Control";

  if (name.length < 2) {
    return NextResponse.json({ success: false, message: "Please enter your name." }, { status: 422 });
  }
  if (!phone) {
    return NextResponse.json({ success: false, message: "Please enter a valid 10-digit mobile number." }, { status: 422 });
  }

  try {
    await dbConnect();
    await Lead.create({
      name,
      phone,
      service,
      address: cleanText(body.address, 500),
      propertyType: cleanText(body.propertyType, 40) || "Not Specified",
      preferredDate: cleanText(body.preferredDate, 20),
      source: cleanText(body.source, 80) || "Website",
    });
    return NextResponse.json({ success: true, message: "Booking received" }, { status: 201 });
  } catch (error) {
    console.error("Lead create error:", error);
    return NextResponse.json(
      { success: false, message: "We couldn't save your request. Please call or WhatsApp us." },
      { status: 500 },
    );
  }
}
