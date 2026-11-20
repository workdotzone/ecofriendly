import { cacheLife, cacheTag } from "next/cache";
import dbConnect from "@/lib/db";
import Faq from "@/models/Faq";

type FaqRow = { question: string; answer: string };

/**
 * FAQ readers used by location / legacy area / services-overview pages.
 * Cached like the rest of the data layer (see lib/data.ts): `hours` on success, `minutes` on DB error,
 * tagged "faqs" so the admin FAQ manager can refresh pages instantly.
 */
async function findFaqs(filter: Record<string, unknown>): Promise<FaqRow[]> {
  const docs = await Faq.find(filter).select("question answer").sort({ createdAt: 1 }).lean();
  return docs.map((doc: { question?: unknown; answer?: unknown }) => ({
    question: String(doc.question ?? ""),
    answer: String(doc.answer ?? ""),
  })).filter((faq: FaqRow) => faq.question.trim() && faq.answer.trim());
}

const GENERAL = { locationSlug: null, serviceSlug: null, serviceOverview: { $ne: true } };

export async function getFaqsForLocation(locationSlug: string | null): Promise<FaqRow[]> {
  "use cache";
  cacheTag("faqs");
  try {
    await dbConnect();
    const local = locationSlug
      ? await findFaqs({ locationSlug, serviceSlug: null, serviceOverview: { $ne: true } })
      : [];
    const faqs = local.length > 0 ? local : await findFaqs(GENERAL);
    cacheLife("hours");
    return faqs;
  } catch (error) {
    console.error(`[faqs] location ${locationSlug}:`, error instanceof Error ? error.message : error);
    cacheLife("minutes");
    return [];
  }
}

export async function getFaqsForService(serviceSlug: string): Promise<FaqRow[]> {
  "use cache";
  cacheTag("faqs");
  try {
    await dbConnect();
    const scoped = await findFaqs({ serviceSlug, locationSlug: null, serviceOverview: { $ne: true } });
    const faqs = scoped.length > 0 ? scoped : await findFaqs(GENERAL);
    cacheLife("hours");
    return faqs;
  } catch (error) {
    console.error(`[faqs] service ${serviceSlug}:`, error instanceof Error ? error.message : error);
    cacheLife("minutes");
    return [];
  }
}

export async function getFaqsForServicesOverview(): Promise<FaqRow[]> {
  "use cache";
  cacheTag("faqs");
  try {
    await dbConnect();
    const overview = await findFaqs({ serviceOverview: true, locationSlug: null, serviceSlug: null });
    const faqs = overview.length > 0 ? overview : await findFaqs(GENERAL);
    cacheLife("hours");
    return faqs;
  } catch (error) {
    console.error("[faqs] services overview:", error instanceof Error ? error.message : error);
    cacheLife("minutes");
    return [];
  }
}
