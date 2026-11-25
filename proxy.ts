import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminRequest, isSameOriginRequest } from "@/lib/adminSession";
import legacyPages from "@/app/legacy-pages.json";
import { SERVICE_ALIASES } from "@/lib/content/aliases";
import { SERVICE_CONTENT } from "@/lib/content/services";

const publicAdminApiPaths = new Set([
  "/api/admin/login",
  "/api/admin/setup",
  "/api/admin/logout",
]);

// Top-level routes that exist as real pages/files — never 404 these.
const STATIC_ROOT = new Set([
  "about", "contact", "book-now", "services", "blog", "clients", "testimonials", "service-locations",
  "privacy-policy", "terms-and-conditions", "admin", "llms.txt", "robots.txt", "sitemap.xml", "manifest.webmanifest",
]);

function decode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// lower-case slug → the slug exactly as published (legacy URLs keep their original casing)
const LEGACY = new Map((legacyPages as string[]).map((slug) => [decode(slug).toLowerCase(), decode(slug)]));

const LEGACY_ALIASES: Record<string, string> = {
  "about-us": "/about",
  booknow: "/book-now",
  contact: "/contact",
  services: "/services",
  testimonials: "/testimonials",
};

const CORE_SERVICE_SLUGS = new Set(SERVICE_CONTENT.map((c) => c.slug));

// Small in-memory cache of live service slugs (from the cached /api/services route) so unknown
// /services/* URLs can return a real 404 instead of a streamed "soft 404".
let serviceSlugCache: { slugs: Set<string>; expires: number } | null = null;
async function liveServiceSlugs(request: NextRequest): Promise<Set<string> | null> {
  if (serviceSlugCache && serviceSlugCache.expires > Date.now()) return serviceSlugCache.slugs;
  try {
    const res = await fetch(new URL("/api/services", request.url), { headers: { accept: "application/json" }, signal: AbortSignal.timeout(1500) });
    if (!res.ok) return null;
    const data = await res.json();
    const slugs = new Set<string>((data.services ?? []).map((s: { slug?: string }) => String(s.slug ?? "").toLowerCase()));
    serviceSlugCache = { slugs, expires: Date.now() + 60_000 };
    return slugs;
  } catch {
    return null; // never block a request because this check failed
  }
}

async function dynamicRedirectLookup(request: NextRequest) {
  if (request.headers.get("next-router-prefetch") || request.headers.get("purpose") === "prefetch") {
    return null;
  }

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    (pathname.includes(".") && !pathname.endsWith(".php") && !pathname.endsWith(".html"))
  ) {
    return null;
  }

  const cleanPath = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  try {
    const lookupUrl = new URL(`/api/redirects/lookup?path=${encodeURIComponent(cleanPath)}`, request.url);
    const res = await fetch(lookupUrl, { cache: "no-store", signal: AbortSignal.timeout(1500) });
    if (!res.ok) return null;

    const rule = await res.json();
    if (rule?.destination) {
      const target = /^https?:\/\//i.test(rule.destination)
        ? rule.destination
        : new URL(rule.destination, request.url);
      return NextResponse.redirect(target, rule.permanent ? 301 : 302);
    }
  } catch {
    // Fail open so site never breaks if DB lookup is slow
  }

  return null;
}

function notFoundRewrite(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/__not-found/page";
  return NextResponse.rewrite(url);
}

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, 308);
}

/**
- SEO guards that must run before streaming starts (streamed pages always begin with HTTP 200):
-  - unknown top-level URLs → real 404 status (not a "soft 404")
-  - /services/Upper-Case and alias slugs (/services/rat-control) → one 308 to the canonical URL
-  - old PHP URLs → one permanent redirect to their clean Next.js URL
 */
async function seoGuards(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/services/")) {
    const raw = pathname.slice("/services/".length).replace(/\/+$/, "");
    // Files in /public/services (e.g. termite.webp) are static assets, never pages.
    if (!raw || raw.includes("/") || raw.includes(".")) return null;
    const lower = decode(raw).toLowerCase();
    const parts = lower.split("-in-");
    if (parts.length > 2) {
      const baseSlug = SERVICE_ALIASES[parts[0]] ?? parts[0];
      const locationSlug = parts[parts.length - 1];
      return baseSlug && locationSlug
        ? redirectTo(request, `/services/${baseSlug}-in-${locationSlug}`)
        : notFoundRewrite(request);
    }
    const target = SERVICE_ALIASES[lower] ?? lower;
    if (target !== decode(raw)) return redirectTo(request, `/services/${target}`);
    if (CORE_SERVICE_SLUGS.has(target) || target.includes("-in-")) return null;
    const live = await liveServiceSlugs(request);
    return live && live.size > 0 && !live.has(target) ? notFoundRewrite(request) : null;
  }

  const segment = pathname.slice(1);
  if (!segment || segment.includes("/")) return null;
  const decoded = decode(segment);

  // Keep old PHP links working, but make the Next.js URL canonical.
  if (/\.php$/i.test(decoded)) {
    const base = decoded.replace(/\.php$/i, "");
    if (base.toLowerCase() === "index") return redirectTo(request, "/");
    const alias = LEGACY_ALIASES[base.toLowerCase()];
    if (alias) return redirectTo(request, alias);
    const legacy = LEGACY.get(base.toLowerCase());
    if (legacy) return redirectTo(request, `/${legacy}`);
    if (STATIC_ROOT.has(base.toLowerCase())) return redirectTo(request, `/${base.toLowerCase()}`);
    return notFoundRewrite(request);
  }
  if (decoded.includes(".")) return null; // static files (/logo.png, /robots.txt …)

  const lower = decoded.toLowerCase();
  // Modern pages: one URL each (/Contact → /contact)
  if (STATIC_ROOT.has(lower)) return decoded === lower ? null : redirectTo(request, `/${lower}`);
  const alias = LEGACY_ALIASES[lower];
  if (alias) return redirectTo(request, alias);
  // Legacy content is rendered directly at its extensionless URL.
  const legacy = LEGACY.get(lower);
  if (legacy) return decoded === legacy ? null : redirectTo(request, `/${legacy}`);

  // Unknown → rewrite to a path no route matches, so Next renders app/not-found.tsx with a 404 status.
  return notFoundRewrite(request);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminApi = pathname.startsWith("/api/admin/");
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");

  if (!isAdminApi && !isAdminPage) {
    const dynamicRedirect = await dynamicRedirectLookup(request);
    if (dynamicRedirect) return dynamicRedirect;

    return (await seoGuards(request)) ?? NextResponse.next();
  }

  if (isAdminApi && !publicAdminApiPaths.has(pathname)) {
    const isMutation = !["GET", "HEAD", "OPTIONS"].includes(request.method);
    if (isMutation && !isSameOriginRequest(request)) {
      return NextResponse.json({ success: false, message: "Invalid request origin" }, { status: 403 });
    }
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
  }

  if (isAdminPage && !pathname.startsWith("/admin/login")) {
    if (!(await isAdminRequest(request))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname.startsWith("/admin/login") && await isAdminRequest(request)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/services/:path*",
    "/service-locations/:path*",
    "/blog/:path*",
    "/sitemap.xml",
    "/sitemap_index.xml",
    "/robots.txt",
    "/llms.txt",
    // single-segment root paths (no dot = not a static file); excludes api/_next
    "/((?!api|_next|admin)[^/.]+)",
    "/:file([^/]+\\.php)",
  ],
};