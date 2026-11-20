import { refreshPublicContent } from "@/lib/revalidate";
import { TAGS } from "@/lib/data";
import { NextResponse, type NextRequest } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";
import Faq from "@/models/Faq";

type FaqInput = {
  question: string;
  answer: string;
  locationSlug: string | null;
  serviceSlug: string | null;
  serviceOverview: boolean;
};

function parseFaqInput(body: unknown): FaqInput | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;

  const values = body as Record<string, unknown>;
  if (typeof values.question !== "string" || typeof values.answer !== "string") return null;

  const question = values.question.trim();
  const answer = values.answer.trim();
  const rawLocationSlug = values.locationSlug ?? "";
  const rawServiceSlug = values.serviceSlug ?? "";
  const serviceOverview = values.serviceOverview ?? false;

  if (
    !question ||
    question.length > 250 ||
    !answer ||
    answer.length > 5000 ||
    (typeof rawLocationSlug !== "string" && rawLocationSlug !== null) ||
    (typeof rawServiceSlug !== "string" && rawServiceSlug !== null) ||
    typeof serviceOverview !== "boolean"
  ) {
    return null;
  }

  const normalizeSlug = (slug: unknown) => typeof slug === "string"
    ? slug.trim().toLowerCase().replace(/\s+/g, "-")
    : "";
  const locationSlug = normalizeSlug(rawLocationSlug);
  const serviceSlug = normalizeSlug(rawServiceSlug);
  const isValidSlug = (slug: string) => !slug || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  if (
    !isValidSlug(locationSlug)
    || !isValidSlug(serviceSlug)
    || (locationSlug && serviceSlug)
    || (serviceOverview && (locationSlug || serviceSlug))
  ) return null;

  return {
    question,
    answer,
    locationSlug: locationSlug || null,
    serviceSlug: serviceSlug || null,
    serviceOverview,
  };
}

export async function GET(request: NextRequest) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    const faqs = await Faq.find().sort({ locationSlug: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, faqs });
  } catch (error) {
    console.error("Admin FAQ fetch error:", error);
    return NextResponse.json({ success: false, message: "Failed to load FAQs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
  }

  const input = parseFaqInput(body);
  if (!input) {
    return NextResponse.json({ success: false, message: "Enter a question and answer within the allowed lengths" }, { status: 400 });
  }

  try {
    await dbConnect();
    const faq = await Faq.create(input);
    refreshPublicContent(TAGS.faqs);
    return NextResponse.json({ success: true, faq }, { status: 201 });
  } catch (error) {
    console.error("Admin FAQ create error:", error);
    return NextResponse.json({ success: false, message: "Failed to save FAQ" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  const id = new URL(request.url).searchParams.get("id");
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: "A valid FAQ ID is required" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
  }

  const input = parseFaqInput(body);
  if (!input) {
    return NextResponse.json({ success: false, message: "Enter a question and answer within the allowed lengths" }, { status: 400 });
  }

  try {
    await dbConnect();
    const faq = await Faq.findByIdAndUpdate(id, input, { new: true, runValidators: true });
    if (!faq) return NextResponse.json({ success: false, message: "FAQ not found" }, { status: 404 });

    refreshPublicContent(TAGS.faqs);
    return NextResponse.json({ success: true, faq });
  } catch (error) {
    console.error("Admin FAQ update error:", error);
    return NextResponse.json({ success: false, message: "Failed to update FAQ" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  const id = new URL(request.url).searchParams.get("id");
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: "A valid FAQ ID is required" }, { status: 400 });
  }

  try {
    await dbConnect();
    const faq = await Faq.findByIdAndDelete(id);
    if (!faq) return NextResponse.json({ success: false, message: "FAQ not found" }, { status: 404 });

    refreshPublicContent(TAGS.faqs);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin FAQ delete error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete FAQ" }, { status: 500 });
  }
}
