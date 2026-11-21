import { cacheLife, cacheTag } from "next/cache";
import dbConnect from "@/lib/db";
import Faq from "@/models/Faq";

type FaqRow = { question: string; answer: string };
export type FaqScope = {
  locationSlug?: string | null;
  serviceSlug?: string | null;
  servicesOverview?: boolean;
};

/**
 * FAQ readers used by location / legacy area / services-overview pages.
 * Cached like the rest of the data layer (see lib/data.ts): `hours` on success, `minutes` on DB error,
 * tagged "faqs" so the admin FAQ manager can refresh pages instantly.
 */
async function findFaqs(filter: Record<string, unknown>) {
  return Faq.find(filter).sort({ createdAt: 1 }).lean();
}

function toFaqRows(docs: { question?: unknown; answer?: unknown }[]): FaqRow[] {
  return docs.map((doc) => ({
    question: String(doc.question ?? ""),
    answer: String(doc.answer ?? ""),
  })).filter((faq: FaqRow) => faq.question.trim() && faq.answer.trim());
}

const GENERAL = { locationSlug: null, serviceSlug: null, serviceOverview: { $ne: true } };

export async function getFaqsByScope({
  locationSlug = null,
  serviceSlug = null,
  servicesOverview = false,
}: FaqScope) {
  await dbConnect();
  const scopedFaqs = servicesOverview
    ? await findFaqs({ serviceOverview: true, locationSlug: null, serviceSlug: null })
    : serviceSlug
      ? await findFaqs({ serviceSlug, locationSlug: null, serviceOverview: { $ne: true } })
      : locationSlug
        ? await findFaqs({ locationSlug, serviceSlug: null, serviceOverview: { $ne: true } })
        : [];
  return scopedFaqs.length > 0 ? scopedFaqs : findFaqs(GENERAL);
}

export async function getFaqsForLocation(locationSlug: string | null): Promise<FaqRow[]> {
  "use cache";
  cacheTag("faqs");
  try {
    const faqs = await getFaqsByScope({ locationSlug });
    cacheLife("hours");
    return toFaqRows(faqs);
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
    const faqs = await getFaqsByScope({ serviceSlug });
    cacheLife("hours");
    return toFaqRows(faqs);
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
    const faqs = await getFaqsByScope({ servicesOverview: true });
    cacheLife("hours");
    return toFaqRows(faqs);
  } catch (error) {
    console.error("[faqs] services overview:", error instanceof Error ? error.message : error);
    cacheLife("minutes");
    return [];
  }
}
