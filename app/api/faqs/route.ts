import { connection, NextResponse } from "next/server";
import { getFaqsByScope } from "@/lib/faqs";

export async function GET(request: Request) {
  await connection();
  try {
    const { searchParams } = new URL(request.url);
    const locationSlug = searchParams.get("locationSlug")?.trim().toLowerCase();
    const serviceSlug = searchParams.get("serviceSlug")?.trim().toLowerCase();
    const servicesOverview = searchParams.get("scope") === "services";
    if ((locationSlug && serviceSlug) || (servicesOverview && (locationSlug || serviceSlug))) {
      return NextResponse.json({ success: false, message: "Choose only one FAQ scope" }, { status: 400 });
    }

    const faqs = await getFaqsByScope({ locationSlug, serviceSlug, servicesOverview });
    return NextResponse.json({ success: true, faqs }, { status: 200 });
  } catch (error) {
    console.error("FAQ fetch error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}