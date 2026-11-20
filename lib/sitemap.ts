import { getBlogs, getLocations, getServiceDetail, getServiceSlugs } from "@/lib/data";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import { decode } from "@/lib/legacy/engine";
import legacySlugs from "@/app/legacy-pages.json";

/**
 * ONE sitemap at /sitemap.xml containing every page (Google's limit is 50,000 URLs / 50 MB):
 *  1. the homepage
 *  2. every published legacy content page, served by app/[slug]/page.tsx at a clean URL
 *  3. the Next.js pages: /services/*, /service-locations/*, /blog/*, /about, /contact, /book-now …
 *
 * lastmod is only emitted when we have a real modification date — a fake "now" on every URL teaches
 * Google to ignore lastmod entirely.
 */

export type SitemapUrl = {
  loc: string;
  lastmod?: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: number;
  images?: { loc: string; title?: string }[];
  /** loc is already a final, correctly-encoded URL — don't re-encode it. */
  raw?: boolean;
};

const xmlEscape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** Encode each path segment once (legacy slugs may already contain %20 / %27). */
function safeLoc(url: string) {
  try {
    const parsed = new URL(url);
    parsed.pathname = parsed.pathname
      .split("/")
      .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
      .join("/");
    return parsed.toString();
  } catch {
    return url;
  }
}

export function renderUrlset(urls: SitemapUrl[]) {
  const hasImages = urls.some((u) => u.images?.length);
  const body = urls
    .map((u) => {
      const parts = [`<loc>${xmlEscape(u.raw ? u.loc : safeLoc(u.loc))}</loc>`];
      if (u.lastmod) parts.push(`<lastmod>${u.lastmod}</lastmod>`);
      if (u.changefreq) parts.push(`<changefreq>${u.changefreq}</changefreq>`);
      if (typeof u.priority === "number") parts.push(`<priority>${u.priority.toFixed(1)}</priority>`);
      for (const image of u.images ?? []) {
        parts.push(
          `<image:image><image:loc>${xmlEscape(safeLoc(image.loc))}</image:loc>${image.title ? `<image:title>${xmlEscape(image.title)}</image:title>` : ""}</image:image>`,
        );
      }
      return `<url>${parts.join("")}</url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${hasImages ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : ""}>
${body}
</urlset>
`;
}

export function xmlResponse(xml: string) {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}

// ---------------------------------------------------------------- builders

export const STATIC_PAGES: SitemapUrl[] = [
  { loc: `${SITE_URL}/`, changefreq: "weekly", priority: 1.0, images: [{ loc: absoluteUrl("/banner.webp"), title: "Eco-Friendly Pests — pest control in Mumbai" }] },
  { loc: absoluteUrl("/services"), changefreq: "weekly", priority: 0.9 },
  { loc: absoluteUrl("/book-now"), changefreq: "monthly", priority: 0.8 },
  { loc: absoluteUrl("/about"), changefreq: "monthly", priority: 0.7 },
  { loc: absoluteUrl("/contact"), changefreq: "monthly", priority: 0.7 },
  { loc: absoluteUrl("/testimonials"), changefreq: "weekly", priority: 0.7 },
  { loc: absoluteUrl("/clients"), changefreq: "monthly", priority: 0.6 },
  { loc: absoluteUrl("/service-locations"), changefreq: "weekly", priority: 0.7 },
  { loc: absoluteUrl("/blog"), changefreq: "weekly", priority: 0.6 },
  { loc: absoluteUrl("/privacy-policy"), changefreq: "yearly", priority: 0.2 },
  { loc: absoluteUrl("/terms-and-conditions"), changefreq: "yearly", priority: 0.2 },
];

export async function servicesUrls(): Promise<SitemapUrl[]> {
  const slugs = await getServiceSlugs();
  const details = await Promise.all(slugs.map((slug) => getServiceDetail(slug)));
  const seen = new Set<string>();
  return details
    .filter((d): d is NonNullable<typeof d> => Boolean(d))
    .filter((d) => (seen.has(d.slug) ? false : (seen.add(d.slug), true)))
    .map((d) => ({
      loc: absoluteUrl(`/services/${d.slug}`),
      lastmod: d.updatedAt,
      changefreq: "monthly" as const,
      priority: 0.9,
      images: d.image ? [{ loc: absoluteUrl(d.image), title: d.content.imageAlt }] : undefined,
    }));
}

export async function locationUrls(): Promise<SitemapUrl[]> {
  const locations = await getLocations();
  return locations.map((loc) => ({
    loc: absoluteUrl(`/service-locations/${loc.slug}`),
    lastmod: loc.updatedAt,
    changefreq: "monthly" as const,
    priority: 0.7,
  }));
}

export async function blogUrls(): Promise<SitemapUrl[]> {
  const blogs = await getBlogs();
  return blogs.map((blog) => ({
    loc: absoluteUrl(`/blog/${blog.slug}`),
    lastmod: blog.updatedAt ?? blog.createdAt,
    changefreq: "monthly" as const,
    priority: 0.6,
    images: blog.image ? [{ loc: absoluteUrl(blog.image), title: blog.title }] : undefined,
  }));
}

/** Legacy content uses clean Next.js paths; legacy PHP links are redirected by proxy.ts. */
export function legacyUrls(): SitemapUrl[] {
  const aliases: Record<string, string> = {
    "about-us": "about",
    booknow: "book-now",
    contact: "contact",
    services: "services",
    testimonials: "testimonials",
  };
  return (legacySlugs as string[]).map((slug) => ({
    loc: absoluteUrl(`/${aliases[decode(slug).toLowerCase()] ?? slug}`),
    changefreq: "monthly" as const,
    priority: 0.6,
  }));
}

export async function allSitemapUrls(): Promise<SitemapUrl[]> {
  const [services, locations, blogs] = await Promise.all([servicesUrls(), locationUrls(), blogUrls()]);
  const [home, ...otherStatic] = STATIC_PAGES;
  const all = [home, ...legacyUrls(), ...otherStatic, ...services, ...locations, ...blogs];
  const seen = new Set<string>();
  return all.filter((u) => (seen.has(u.loc) ? false : (seen.add(u.loc), true)));
}
