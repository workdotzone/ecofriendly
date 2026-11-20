import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Faq from "@/models/Faq";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const locationSlug = searchParams.get("locationSlug")?.trim().toLowerCase();
    const serviceSlug = searchParams.get("serviceSlug")?.trim().toLowerCase();
    const servicesOverview = searchParams.get("scope") === "services";
    if ((locationSlug && serviceSlug) || (servicesOverview && (locationSlug || serviceSlug))) {
      return NextResponse.json({ success: false, message: "Choose only one FAQ scope" }, { status: 400 });
    }

    const scopedFaqs = servicesOverview
      ? await Faq.find({ serviceOverview: true, locationSlug: null, serviceSlug: null }).sort({ createdAt: 1 })
      : serviceSlug
        ? await Faq.find({ serviceSlug, locationSlug: null, serviceOverview: { $ne: true } }).sort({ createdAt: 1 })
        : locationSlug
          ? await Faq.find({ locationSlug, serviceSlug: null, serviceOverview: { $ne: true } }).sort({ createdAt: 1 })
          : [];
    const faqs = scopedFaqs.length > 0
      ? scopedFaqs
      : await Faq.find({ locationSlug: null, serviceSlug: null, serviceOverview: { $ne: true } }).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, faqs }, { status: 200 });
  } catch (error) {
    console.error("FAQ fetch error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}