import { cacheLife, cacheTag } from "next/cache";
import dbConnect from "@/lib/db";
import Service from "@/models/Service";
import Testimonial from "@/models/Testimonial";
import Client from "@/models/Client";
import Faq from "@/models/Faq";
import Menu from "@/models/Menu";
import Location from "@/models/Location";
import Blog from "@/models/Blog";
import { SERVICE_CONTENT, findServiceContent } from "@/lib/content/services";
import { GENERAL_FAQS, buildFaqList, buildGenericContent } from "@/lib/content/generic";
import type { FaqItem, ServiceContent } from "@/lib/content/types";
import { normalizeSlug } from "@/lib/site";

/**
 * Data layer for all public pages.
 *
 * Every database read is wrapped in `"use cache"` so pages are prerendered as static HTML
 * (fast LCP, fully crawlable, no client-side fetching for SEO content).
 *  - Success  → cached for `hours` and tagged; admin changes call revalidateTag(tag) for near-instant updates.
 *  - DB error → returns `null` cached for `minutes`, and callers use curated fallback content.
 *    The short lifetime means a temporary outage never gets "baked in" for long.
 * All returned values are plain JSON (no ObjectId / Date instances) so they can be cached.
 */

export const TAGS = {
  services: "services",
  testimonials: "testimonials",
  clients: "clients",
  faqs: "faqs",
  menu: "menu",
  locations: "locations",
  blogs: "blogs",
} as const;

// ------------------------------------------------------------------ types

export type PublicService = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  image: string;
  imageAlt: string;
  order: number;
  updatedAt?: string;
};

export type ServiceDetail = PublicService & {
  content: ServiceContent;
  /** Admin-written long content (markdown-lite). Rendered when there is no curated content, or in addition to it. */
  customBody?: string;
  faqs: FaqItem[];
  fromDatabase: boolean;
};

export type Review = {
  id: string;
  name: string;
  designation: string;
  service: string;
  serviceSlug?: string;
  rating: number;
  text: string;
  createdAt?: string;
};

export type ReviewStats = {
  count: number;
  average: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export type ClientLogo = { id: string; name: string; image: string };
export type MenuItem = { id: string; name: string; href: string; category: "Page" | "Service" };
export type LocationLink = { id: string; name: string; slug: string; updatedAt?: string };
export type BlogSummary = { id: string; slug: string; title: string; metaDescription: string; image?: string; createdAt?: string; updatedAt?: string };

type Lean = Record<string, unknown> & { _id?: { toString(): string } };

const str = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);
const iso = (value: unknown) => {
  if (!value) return undefined;
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

function log(scope: string, error: unknown) {
  console.error(`[data] ${scope}:`, error instanceof Error ? error.message : error);
}

// ------------------------------------------------------------------ cached DB readers

async function readServices(): Promise<Lean[] | null> {
  "use cache";
  cacheTag(TAGS.services);
  try {
    await dbConnect();
    const docs = await Service.find(
      { isActive: { $ne: false } },
      "title slug shortDescription fullContent image imageAlt metaTitle metaDescription h1 quickAnswer keywords faqs order updatedAt createdAt",
    ).sort({ order: 1, createdAt: 1 }).lean();
    cacheLife("hours");
    return JSON.parse(JSON.stringify(docs));
  } catch (error) {
    log("services", error);
    cacheLife("minutes");
    return null;
  }
}

async function readServiceFaqs(): Promise<{ serviceSlug: string; question: string; answer: string }[] | null> {
  "use cache";
  cacheTag(TAGS.faqs);
  try {
    await dbConnect();
    const docs = await Faq.find({ serviceSlug: { $ne: null }, locationSlug: null }, "serviceSlug question answer")
      .sort({ createdAt: 1 }).lean();
    cacheLife("hours");
    return docs.map((doc: Lean) => ({ serviceSlug: str(doc.serviceSlug), question: str(doc.question), answer: str(doc.answer) }));
  } catch (error) {
    log("service faqs", error);
    cacheLife("minutes");
    return null;
  }
}

async function readGeneralFaqs(): Promise<FaqItem[] | null> {
  "use cache";
  cacheTag(TAGS.faqs);
  try {
    await dbConnect();
    const docs = await Faq.find({ locationSlug: null, serviceSlug: null, serviceOverview: { $ne: true } }, "question answer")
      .sort({ createdAt: 1 }).lean();
    cacheLife("hours");
    return docs.map((doc: Lean) => ({ question: str(doc.question), answer: str(doc.answer) }));
  } catch (error) {
    log("general faqs", error);
    cacheLife("minutes");
    return null;
  }
}

async function readTestimonials(): Promise<Review[] | null> {
  "use cache";
  cacheTag(TAGS.testimonials);
  try {
    await dbConnect();
    const docs = await Testimonial.find({}, "name designation service serviceSlug rating text createdAt")
      .sort({ createdAt: -1, _id: -1 }).limit(500).lean();
    cacheLife("hours");
    return docs
      .filter((doc: Lean) => str(doc.name).trim() && str(doc.text).trim())
      .map((doc: Lean) => ({
        id: String(doc._id),
        name: str(doc.name).trim(),
        designation: str(doc.designation).trim(),
        service: str(doc.service).trim(),
        serviceSlug: str(doc.serviceSlug) || undefined,
        rating: Math.max(1, Math.min(5, Math.round(Number(doc.rating) || 5))),
        text: str(doc.text).trim(),
        createdAt: iso(doc.createdAt),
      }));
  } catch (error) {
    log("testimonials", error);
    cacheLife("minutes");
    return null;
  }
}

async function readClients(): Promise<ClientLogo[] | null> {
  "use cache";
  cacheTag(TAGS.clients);
  try {
    await dbConnect();
    const docs = await Client.find({}, "name image").sort({ createdAt: -1 }).limit(60).lean();
    cacheLife("hours");
    return docs
      .filter((doc: Lean) => str(doc.image).trim())
      .map((doc: Lean) => ({ id: String(doc._id), name: str(doc.name, "Client"), image: str(doc.image) }));
  } catch (error) {
    log("clients", error);
    cacheLife("minutes");
    return null;
  }
}

async function readMenu(): Promise<MenuItem[] | null> {
  "use cache";
  cacheTag(TAGS.menu);
  try {
    await dbConnect();
    const docs = await Menu.find({}, "name slug category").sort({ createdAt: 1 }).lean();
    cacheLife("hours");
    return docs.map((doc: Lean) => {
      const category = doc.category === "Page" ? "Page" : "Service";
      const raw = str(doc.slug).trim();
      const href = /^https?:\/\//i.test(raw)
        ? raw
        : category === "Service"
          ? `/services/${normalizeSlug(raw)}`
          : `/${raw.replace(/^\/+/, "")}`;
      return { id: String(doc._id), name: str(doc.name), href, category };
    });
  } catch (error) {
    log("menu", error);
    cacheLife("minutes");
    return null;
  }
}

async function readLocations(): Promise<LocationLink[] | null> {
  "use cache";
  cacheTag(TAGS.locations);
  try {
    await dbConnect();
    const docs = await Location.find({ isActive: true }, "name slug updatedAt").sort({ name: 1 }).lean();
    cacheLife("hours");
    return docs
      .filter((doc: Lean) => str(doc.slug))
      .map((doc: Lean) => ({ id: String(doc._id), name: str(doc.name), slug: str(doc.slug), updatedAt: iso(doc.updatedAt) }));
  } catch (error) {
    log("locations", error);
    cacheLife("minutes");
    return null;
  }
}

async function readBlogs(): Promise<BlogSummary[] | null> {
  "use cache";
  cacheTag(TAGS.blogs);
  try {
    await dbConnect();
    const docs = await Blog.find({}, "slug title metaDescription image createdAt updatedAt").sort({ createdAt: -1 }).lean();
    cacheLife("hours");
    return docs.map((doc: Lean) => ({
      id: String(doc._id),
      slug: str(doc.slug),
      title: str(doc.title),
      metaDescription: str(doc.metaDescription),
      image: str(doc.image) || undefined,
      createdAt: iso(doc.createdAt),
      updatedAt: iso(doc.updatedAt),
    }));
  } catch (error) {
    log("blogs", error);
    cacheLife("minutes");
    return null;
  }
}

// ------------------------------------------------------------------ services

function fallbackServices(): PublicService[] {
  return SERVICE_CONTENT.map((content, index) => ({
    id: `default-${content.slug}`,
    slug: content.slug,
    title: content.title,
    shortDescription: content.shortDescription,
    image: content.image,
    imageAlt: content.imageAlt,
    order: index,
  }));
}

function toPublicService(doc: Lean, index: number): PublicService | null {
  const rawSlug = normalizeSlug(doc.slug);
  const title = str(doc.title).trim();
  if (!rawSlug || !title) return null;
  const curated = findServiceContent(rawSlug);
  // A core service stored under an alias slug (e.g. "cockroach-pest-control") is published at its
  // canonical URL (/services/cockroach-control); the alias 308-redirects there (see proxy.ts).
  const slug = curated?.slug ?? rawSlug;
  return {
    id: String(doc._id ?? slug),
    slug,
    title,
    shortDescription: str(doc.shortDescription).trim() || curated?.shortDescription || "",
    image: str(doc.image).trim() || curated?.image || "/services/cockroaches.webp",
    imageAlt: str(doc.imageAlt).trim() || curated?.imageAlt || `${title} by Eco-Friendly Pests in Mumbai`,
    order: typeof doc.order === "number" ? doc.order : 100 + index,
    updatedAt: iso(doc.updatedAt),
  };
}

/** All active services, ordered. Never empty: falls back to curated services when the DB is empty or down. */
export async function getServices(): Promise<PublicService[]> {
  const docs = await readServices();
  if (!docs || docs.length === 0) return fallbackServices();
  const seen = new Set<string>();
  const services = docs
    .map(toPublicService)
    .filter((service): service is PublicService => {
      if (!service || seen.has(service.slug)) return false;
      seen.add(service.slug);
      return true;
    });
  return services.length ? services.sort((a, b) => a.order - b.order) : fallbackServices();
}

/** Full service page data, with curated + admin content merged and exactly 12 FAQs. */
export async function getServiceDetail(rawSlug: string): Promise<ServiceDetail | null> {
  const slug = normalizeSlug(rawSlug);
  if (!slug) return null;

  const [docs, faqRows] = await Promise.all([readServices(), readServiceFaqs()]);
  const curated = findServiceContent(slug);
  // Exact DB match first; otherwise an alias (e.g. /services/rat-control) resolves to the DB record
  // of the same service (e.g. slug "rodent-control"), and the page redirects to that canonical slug.
  const candidates = new Set([slug, ...(curated ? [curated.slug, ...(curated.aliases ?? [])] : [])]);
  const doc = docs?.find((d) => normalizeSlug(d.slug) === slug)
    ?? docs?.find((d) => candidates.has(normalizeSlug(d.slug)));

  // Not in the database and no curated content → genuine 404.
  // Curated core services always resolve (even if missing from the DB) so long-indexed URLs never break.
  if (!doc && !curated) return null;

  const base: PublicService = doc
    ? toPublicService(doc, 0)!
    : {
      id: `default-${curated!.slug}`,
      slug: curated!.slug,
      title: curated!.title,
      shortDescription: curated!.shortDescription,
      image: curated!.image,
      imageAlt: curated!.imageAlt,
      order: 0,
    };

  const content: ServiceContent = curated
    ? { ...curated }
    : buildGenericContent({ slug: base.slug, title: base.title, shortDescription: base.shortDescription, image: base.image, imageAlt: base.imageAlt });

  // Admin-entered fields override curated defaults when filled in.
  if (doc) {
    const metaTitle = str(doc.metaTitle).trim();
    const metaDescription = str(doc.metaDescription).trim();
    const h1 = str(doc.h1).trim();
    const quickAnswer = str(doc.quickAnswer).trim();
    if (metaTitle) content.metaTitle = metaTitle;
    if (metaDescription) content.metaDescription = metaDescription;
    if (h1) content.h1 = h1;
    if (quickAnswer) content.quickAnswer = quickAnswer;
    if (Array.isArray(doc.keywords) && doc.keywords.length) content.keywords = (doc.keywords as unknown[]).map(String);
    content.title = base.title;
    content.shortDescription = base.shortDescription;
    content.image = base.image;
    content.imageAlt = base.imageAlt;
  }

  const dbFaqs: FaqItem[] = Array.isArray(doc?.faqs)
    ? (doc!.faqs as Lean[]).map((f) => ({ question: str(f.question), answer: str(f.answer) }))
    : [];
  const managerFaqs: FaqItem[] = (faqRows ?? [])
    .filter((row) => normalizeSlug(row.serviceSlug) === base.slug || (curated && curated.aliases?.includes(normalizeSlug(row.serviceSlug))))
    .map(({ question, answer }) => ({ question, answer }));

  const customBody = str(doc?.fullContent).trim();
  // Don't repeat the admin text when it's just the short description pasted again.
  const showCustomBody = customBody && customBody !== base.shortDescription;

  return {
    ...base,
    content,
    customBody: showCustomBody ? customBody : undefined,
    faqs: buildFaqList([dbFaqs, managerFaqs, content.faqs], 12),
    fromDatabase: Boolean(doc),
  };
}

/** Slugs to prerender at build time. Always returns at least one slug (required with Cache Components). */
export async function getServiceSlugs(): Promise<string[]> {
  const services = await getServices();
  const slugs = new Set(services.map((service) => service.slug));
  // Curated core services resolve even when absent from the DB, unless the DB holds them under an alias slug.
  for (const content of SERVICE_CONTENT) {
    const coveredByAlias = [content.slug, ...(content.aliases ?? [])].some((s) => slugs.has(s));
    if (!coveredByAlias) slugs.add(content.slug);
  }
  return [...slugs];
}

// ------------------------------------------------------------------ reviews

export function computeReviewStats(reviews: Review[]): ReviewStats {
  const distribution: ReviewStats["distribution"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const review of reviews) distribution[review.rating as 1 | 2 | 3 | 4 | 5] += 1;
  const count = reviews.length;
  const average = count ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10 : 0;
  return { count, average, distribution };
}

/** Reviews for a section. When `service` is given, matching reviews come first, then recent general ones. */
export async function getReviews(options: { limit?: number; service?: { slug: string; title: string; pest?: string } } = {}) {
  const all = (await readTestimonials()) ?? [];
  const stats = computeReviewStats(all);
  if (!options.service) {
    return { reviews: options.limit ? all.slice(0, options.limit) : all, stats, matchedCount: all.length };
  }

  const { slug, title, pest } = options.service;
  const words = [title, pest ?? ""]
    .join(" ")
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((w) => w.length > 3 && !["control", "pest", "treatment", "service", "services", "removal"].includes(w))
    .map((w) => w.replace(/(es|s)$/, ""));
  const matches = (review: Review) =>
    normalizeSlug(review.serviceSlug) === slug
    || words.some((w) => review.service.toLowerCase().includes(w));

  const matched = all.filter(matches);
  const rest = all.filter((review) => !matches(review));
  const limit = options.limit ?? 6;
  return {
    reviews: [...matched, ...rest].slice(0, limit),
    stats,
    serviceStats: computeReviewStats(matched),
    matchedCount: matched.length,
  };
}

// ------------------------------------------------------------------ misc

export async function getClients(): Promise<ClientLogo[]> {
  return (await readClients()) ?? [];
}

export async function getHomeFaqs(): Promise<FaqItem[]> {
  const faqs = await readGeneralFaqs();
  return faqs && faqs.length ? buildFaqList([faqs], Math.max(faqs.length, 6)) : GENERAL_FAQS;
}

export async function getMenu(): Promise<MenuItem[]> {
  return (await readMenu()) ?? [];
}

export async function getLocations(): Promise<LocationLink[]> {
  return (await readLocations()) ?? [];
}

export async function getBlogs(): Promise<BlogSummary[]> {
  return ((await readBlogs()) ?? []).filter((blog) => blog.slug);
}

// ------------------------------------------------------------------ single location

export type LocationDetail = {
  id: string;
  name: string;
  slug: string;
  heading?: string;
  shortDescription?: string;
  detailedContent?: string;
  metaTitle?: string;
  metaDescription?: string;
  updatedAt?: string;
};

async function readLocation(slug: string): Promise<LocationDetail | null | "error"> {
  "use cache";
  cacheTag(TAGS.locations, `location-${slug}`);
  try {
    await dbConnect();
    const doc = (await Location.findOne({ slug, isActive: true }).lean()) as Lean | null;
    cacheLife("hours");
    if (!doc) return null;
    return {
      id: String(doc._id),
      name: str(doc.name),
      slug: str(doc.slug),
      heading: str(doc.heading) || undefined,
      shortDescription: str(doc.shortDescription) || undefined,
      detailedContent: str(doc.detailedContent) || undefined,
      metaTitle: str(doc.metaTitle) || undefined,
      metaDescription: str(doc.metaDescription) || undefined,
      updatedAt: iso(doc.updatedAt),
    };
  } catch (error) {
    log(`location ${slug}`, error);
    cacheLife("minutes");
    return "error";
  }
}

/** Returns the location, `null` when it doesn't exist (404), or throws when the database is unreachable. */
export async function getLocationBySlug(rawSlug: string): Promise<LocationDetail | null> {
  const slug = (rawSlug || "").trim().toLowerCase();
  if (!slug || slug.length > 120) return null;
  const result = await readLocation(slug);
  if (result === "error") throw new Error("Location data is temporarily unavailable");
  return result;
}

export async function getLocationSlugs(): Promise<string[]> {
  const locations = await getLocations();
  return locations.map((l) => l.slug);
}

// ------------------------------------------------------------------ single blog post

export type BlogPost = BlogSummary & { content: string; author: string };

async function readBlog(slug: string): Promise<BlogPost | null | "error"> {
  "use cache";
  cacheTag(TAGS.blogs, `blog-${slug}`);
  try {
    await dbConnect();
    const doc = (await Blog.findOne({ slug }).lean()) as Lean | null;
    cacheLife("hours");
    if (!doc) return null;
    return {
      id: String(doc._id),
      slug: str(doc.slug),
      title: str(doc.title),
      metaDescription: str(doc.metaDescription),
      image: str(doc.image) || undefined,
      content: str(doc.content),
      author: str(doc.author) || "Eco-Friendly Pests",
      createdAt: iso(doc.createdAt),
      updatedAt: iso(doc.updatedAt),
    };
  } catch (error) {
    log(`blog ${slug}`, error);
    cacheLife("minutes");
    return "error";
  }
}

export async function getBlogBySlug(rawSlug: string): Promise<BlogPost | null> {
  const slug = (rawSlug || "").trim();
  if (!slug || slug.length > 200) return null;
  const result = await readBlog(slug);
  return result === "error" ? null : result;
}
