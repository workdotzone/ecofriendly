/**
 * Single source of truth for business identity (NAP), URLs and SEO defaults.
 * Keep Name / Address / Phone identical everywhere (site, Google Business Profile,
 * directories) — consistent NAP is a core local-SEO and GEO/AEO trust signal.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://ecofriendlypests.com").replace(/\/+$/, "");

export const SITE = {
  name: "Eco-Friendly Pests",
  legalName: "Eco-Friendly Pests",
  shortName: "EcoPests",
  tagline: "Odourless, eco-friendly pest control in Mumbai, Thane & Navi Mumbai",
  description:
    "Eco-Friendly Pests provides odourless, low-toxicity pest control for homes and businesses in Mumbai, Thane and Navi Mumbai — termite, cockroach, bed bug, rodent, mosquito and wood borer treatments with free inspection.",
  phone: "+91-94533-94533",
  phoneDisplay: "+91-94533 94533",
  phoneHref: "tel:+919453394533",
  whatsappHref: "https://wa.me/919453394533",
  email: "info@ecofriendlypests.com",
  logo: "/logo.png",
  defaultOgImage: "/og/default.jpg",
  address: {
    streetAddress: "D.N. Dube Road, Ratan Nagar, Dahisar (East)",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    postalCode: "400068",
    addressCountry: "IN",
  },
  // Approximate coordinates for Dahisar (East). Replace with the exact pin from Google Business Profile.
  geo: { latitude: 19.2502, longitude: 72.8691 },
  areaServed: ["Mumbai", "Thane", "Navi Mumbai", "Mira Road", "Bhayandar", "Vasai", "Virar"],
  openingHours: { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:00", closes: "21:00" },
  // Add real profile URLs here (Google Business Profile, Justdial, Facebook, Instagram, LinkedIn).
  // Only real, owned profiles belong in sameAs — leave empty rather than linking to generic home pages.
  sameAs: [] as string[],
} as const;

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `${SITE_URL}/` : `${SITE_URL}${clean}`;
}

export const ORG_ID = `${SITE_URL}/#organization`;
export const BUSINESS_ID = `${SITE_URL}/#localbusiness`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Safe JSON-LD serialiser — escapes `<` so content can never close the script tag. */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Normalise any admin-entered slug ("/services/Cockroach Control/") to "cockroach-control". */
export function normalizeSlug(value: unknown) {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .toLowerCase()
    .replace(/^\/?services\//, "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9-\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Trim text to a length on a word boundary — used for meta descriptions and card excerpts. */
export function truncate(text: string, max = 158) {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : cut.length).replace(/[,.;:\s]+$/, "")}…`;
}
