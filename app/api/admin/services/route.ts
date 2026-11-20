import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Service from "@/models/Service";
import { requireAdmin } from "@/lib/adminAuth";
import { refreshPublicContent } from "@/lib/revalidate";
import { TAGS } from "@/lib/data";
import { SERVICE_CONTENT } from "@/lib/content/services";
import { normalizeSlug } from "@/lib/site";

const MAX_FAQS = 30;

type FaqInput = { question?: unknown; answer?: unknown };

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Whitelist + validate admin input. Returns { data } or { error }. */
function parseService(body: Record<string, unknown>, partial = false) {
  const data: Record<string, unknown> = {};
  const errors: string[] = [];

  const title = text(body.title, 120);
  const slug = normalizeSlug(body.slug || (partial ? "" : body.title));
  const shortDescription = text(body.shortDescription, 400);
  const fullContent = typeof body.fullContent === "string" ? body.fullContent.trim().slice(0, 60000) : "";
  const image = text(body.image, 1000);

  const need = (key: string, value: string, message: string) => {
    if (partial && !(key in body)) return;
    if (value) data[key] = value;
    else errors.push(message);
  };
  need("title", title, "Title is required.");
  need("slug", slug, "A valid URL slug is required.");
  need("shortDescription", shortDescription, "Short description is required.");
  if (!partial || "fullContent" in body) data.fullContent = fullContent || shortDescription || title;
  if (!partial || "image" in body) {
    if (image && !/^(https:\/\/|\/)/.test(image)) errors.push("Image must be an https:// URL or a /public path.");
    else if (image) data.image = image;
    else errors.push("Image is required.");
  }

  for (const key of ["imageAlt", "metaTitle", "metaDescription", "h1", "quickAnswer"] as const) {
    if (key in body) data[key] = text(body[key], key === "quickAnswer" ? 700 : key === "metaDescription" ? 320 : 200);
  }
  if ("keywords" in body) {
    const list = Array.isArray(body.keywords) ? body.keywords : typeof body.keywords === "string" ? body.keywords.split(",") : [];
    data.keywords = list.map((k) => String(k).trim()).filter(Boolean).slice(0, 20);
  }
  if ("faqs" in body) {
    const list = Array.isArray(body.faqs) ? (body.faqs as FaqInput[]) : [];
    data.faqs = list
      .map((f) => ({ question: text(f?.question, 300), answer: text(f?.answer, 2000) }))
      .filter((f) => f.question && f.answer)
      .slice(0, MAX_FAQS);
  }
  if ("order" in body) {
    const order = Number(body.order);
    data.order = Number.isFinite(order) ? Math.max(0, Math.min(9999, Math.round(order))) : 100;
  }
  if ("isActive" in body) data.isActive = body.isActive !== false && body.isActive !== "false";

  return errors.length ? { error: errors.join(" ") } : { data };
}

async function readJson(request: Request) {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function duplicateKey(error: unknown) {
  return typeof error === "object" && error !== null && (error as { code?: number }).code === 11000;
}

/** Admin list (includes inactive services and all SEO fields). */
export async function GET(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;
  try {
    await dbConnect();
    const services = await Service.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error("Admin service list error:", error);
    return NextResponse.json({ success: false, message: "Failed to load services." }, { status: 500 });
  }
}

/**
 * POST                         → create a service
 * POST ?action=import-defaults → create the six core services with full curated content (skips existing slugs,
 *                                or fills only EMPTY SEO fields of existing ones — never overwrites admin edits)
 */
export async function POST(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  const action = new URL(request.url).searchParams.get("action");
  try {
    await dbConnect();

    if (action === "import-defaults") {
      let created = 0;
      let updated = 0;
      for (const [index, c] of SERVICE_CONTENT.entries()) {
        const fullContent = c.sections.map((s) => `## ${s.heading}\n\n${s.body}`).join("\n\n");
        const existing = await Service.findOne({ slug: { $in: [c.slug, ...(c.aliases ?? [])] } });
        if (!existing) {
          await Service.create({
            title: c.title, slug: c.slug, shortDescription: c.shortDescription, fullContent, image: c.image,
            imageAlt: c.imageAlt, metaTitle: c.metaTitle, metaDescription: c.metaDescription, h1: c.h1,
            quickAnswer: c.quickAnswer, keywords: c.keywords, faqs: c.faqs, order: index, isActive: true,
          });
          created += 1;
        } else {
          const fill: Record<string, unknown> = {};
          if (!existing.imageAlt) fill.imageAlt = c.imageAlt;
          if (!existing.metaTitle) fill.metaTitle = c.metaTitle;
          if (!existing.metaDescription) fill.metaDescription = c.metaDescription;
          if (!existing.h1) fill.h1 = c.h1;
          if (!existing.quickAnswer) fill.quickAnswer = c.quickAnswer;
          if (!existing.keywords?.length) fill.keywords = c.keywords;
          if (!existing.faqs?.length) fill.faqs = c.faqs;
          if (Object.keys(fill).length) {
            await Service.updateOne({ _id: existing._id }, { $set: fill });
            updated += 1;
          }
        }
      }
      refreshPublicContent(TAGS.services);
      return NextResponse.json({ success: true, message: `Imported: ${created} created, ${updated} filled with default SEO content.` });
    }

    const body = await readJson(request);
    if (!body) return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
    const parsed = parseService(body);
    if ("error" in parsed) return NextResponse.json({ success: false, message: parsed.error }, { status: 422 });

    await Service.create(parsed.data);
    refreshPublicContent(TAGS.services);
    return NextResponse.json({ success: true, message: "Service added!" }, { status: 201 });
  } catch (error) {
    if (duplicateKey(error)) {
      return NextResponse.json({ success: false, message: "A service with this URL slug already exists." }, { status: 409 });
    }
    console.error("Admin service create error:", error);
    return NextResponse.json({ success: false, message: "Failed to add service." }, { status: 500 });
  }
}

/** PUT ?id=… → update any subset of fields. */
export async function PUT(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  const id = new URL(request.url).searchParams.get("id");
  if (!id || !mongoose.isValidObjectId(id)) {
    return NextResponse.json({ success: false, message: "Invalid service id." }, { status: 400 });
  }
  const body = await readJson(request);
  if (!body) return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  const parsed = parseService(body, true);
  if ("error" in parsed) return NextResponse.json({ success: false, message: parsed.error }, { status: 422 });

  try {
    await dbConnect();
    const updated = await Service.findByIdAndUpdate(id, { $set: parsed.data }, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ success: false, message: "Service not found." }, { status: 404 });
    refreshPublicContent(TAGS.services);
    return NextResponse.json({ success: true, message: "Service updated!" });
  } catch (error) {
    if (duplicateKey(error)) {
      return NextResponse.json({ success: false, message: "Another service already uses this URL slug." }, { status: 409 });
    }
    console.error("Admin service update error:", error);
    return NextResponse.json({ success: false, message: "Failed to update service." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authResponse = await requireAdmin(request);
  if (authResponse) return authResponse;

  const id = new URL(request.url).searchParams.get("id");
  if (!id || !mongoose.isValidObjectId(id)) {
    return NextResponse.json({ success: false, message: "Invalid service id." }, { status: 400 });
  }
  try {
    await dbConnect();
    await Service.findByIdAndDelete(id);
    refreshPublicContent(TAGS.services);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin service delete error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
