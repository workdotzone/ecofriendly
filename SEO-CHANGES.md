# SEO / GEO / AEO / VEO upgrade — what changed and what to do after deploy

## Legacy content uses clean Next.js URLs

Legacy content is published at extensionless URLs (for example, `/pest-control-andheri`). Historical `.php` URLs permanently redirect to their clean Next.js equivalents; `.php` URLs are not included in `/sitemap.xml`. The sitemap also includes the current static pages and published service, location, and blog pages.

How the content is built (`lib/legacy/`):
- `engine.ts` classifies every URL — 3,257 location pages, 20 service pages, 35 “near me” keyword pages, 9 guides, 4 hubs (guides, FAQ, service areas, preparation checklist) and 14 HTML sitemap pages — and assembles the page.
- `families-extra.ts` + `lib/content/services.ts` — long-form content for 17 pest types (general, herbal, home, commercial, cockroach, termite, bed bug, rodent, mosquito, wood borer, dog ticks, honey bee/wasp, flies, spiders, lizards, ants, wildlife).
- `regions.ts` — maps the 1,812 localities to 10 regions (South/Central Mumbai, western/eastern suburbs, Thane belt, Navi Mumbai, Mira–Vasai–Palghar, Raigad, Pune, outside Maharashtra) and 10 locality types (station, hospital, market, road, sector, village, colony…), each with its own copy.
- `guides.ts` — the 9 how-to guides.
- Every block of text is chosen with a seed from the URL, so each page always renders the same but neighbouring pages differ. Local FAQ answers use the page’s own facts and neighbouring areas. Each local page links to nearby areas and to other services in the same locality.

Measured: page body text is 750–2,450 words (median ~1,200). Average overlap between two pages of the same service is 29–37% (5-word phrase overlap) — most text on each page is different. Pages for places outside Maharashtra say clearly that availability must be confirmed (no false local claims).

Reviews and testimonials on every page come **only from real reviews in the database** (Admin → Testimonials). Nothing is invented; until reviews are added, a “share your feedback” box shows instead.

The five old core URLs (`about-us.php`, `booknow.php`, `contact.php`, `services.php`, `testimonials.php`) permanently redirect to their current Next.js pages, so you don’t maintain duplicate copies.

Also fixed: images in `/public/services/` were being blocked by the SEO guard in `proxy.ts` (would have broken service images); the About, Contact, Book Now, Reviews, Clients, Service Locations, Blog, Privacy and Terms pages now also have 12 page-specific FAQs.

## After you deploy (do these once)
1. **Admin → Services → "Import default content"** — copies the 6 core services (full content + 12 FAQs each)
   into MongoDB so you can edit them. Existing services are kept; only their *empty* SEO fields are filled.
2. **Google Search Console & Bing Webmaster Tools** → submit `https://ecofriendlypests.com/sitemap.xml` (one file with every page).
3. In `lib/site.ts`: set the exact map pin (`geo`) from your Google Business Profile and add your real
   profile URLs to `sameAs` (Google Business Profile, Facebook, Instagram, Justdial…). Social icons appear in the footer automatically.
4. Optional env: `NEXT_PUBLIC_SITE_URL` (defaults to https://ecofriendlypests.com; Vercel deployment URLs are ignored), `MONGODB_TIMEOUT_MS` (default 8000).
5. Review the starter text in `/privacy-policy` and `/terms-and-conditions`.

## How content flows now
- **Services come from MongoDB** (`Service` collection) everywhere: the homepage shows the first 21 active services, the header shows the first 20 with a “View all services” link, and `/services`, footer, sitemap, llms.txt and JSON-LD use the full active catalogue. Order + show/hide are controlled in Admin (`order` and `Live` fields).
- The service editor suggests reusable images from existing services based on title/slug matches; selecting one reuses its URL without another ImageKit upload. Pasting a different URL or uploading a replacement remains available.
- If the database is empty or unreachable, the 6 curated services in `lib/content/services.ts` are shown so the site never goes blank.
- Each service page = admin fields (title, image, meta title/description, H1, quick answer, FAQs, long text)
  merged with curated defaults. **Every service page always shows exactly 12 FAQs** (admin FAQs first, then FAQ-manager FAQs, then curated, then general).
- All public pages are **statically prerendered** (`"use cache"`, revalidated hourly). Every admin change
  (services, reviews, FAQs, clients, menu, locations, blogs) refreshes the site immediately via `revalidateTag`.

## SEO fixes
- Removed the canonical from the root layout — it was declaring /about, /contact, /blog, /book-now, /clients… as duplicates of the homepage.
- Fixed duplicated brand in titles ("… | Eco-Friendly Pests | Eco-Friendly Pests").
- One URL per page: `/services/rat-control` → `/services/rodent-control`, `/Contact` → `/contact`,
  `*.php` → clean URL, legacy roots (`/cockroach-pest-control`, `/about-us`, `/booknow`) → 308 to the real page.
- Unknown URLs now return a real **404** status (were "soft 404" 200s).
- Homepage, services, reviews, FAQs, header and footer links are server-rendered (were client-fetched — invisible to crawlers without JS).
- Broken footer links fixed (`/home`, `/faqs`), privacy/terms pages added, location links use the real slug.
- Lead API hardened: field whitelist, Indian mobile validation, honeypot, length limits.

## GEO / AEO / VEO (AI answers, featured snippets, voice)
- Every service page opens with a 40–60-word **quick answer**, question-style H2s, a step-by-step process, signs, prep/aftercare, prevention and 12 FAQs.
- JSON-LD graph: Organization, LocalBusiness (NAP, geo, hours, areas, offer catalog, real aggregate rating), WebSite,
  WebPage + **Speakable**, Service (+ reviews when available), HowTo, BreadcrumbList, FAQPage, CollectionPage/ItemList, BlogPosting.
- `/llms.txt` is generated from the database (services, quick answers, FAQs, contact facts).
- `robots.txt` explicitly allows Google, Bing and AI answer crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Applebot…); /admin and /api stay blocked.
- E-E-A-T: "written & reviewed by" block with last-updated date on service pages; no invented prices, stats or guarantees.

## Performance / images
- `SmartImage`: Next.js optimizer for local images (AVIF/WebP), ImageKit's own CDN transforms for ImageKit URLs,
  correct `sizes` everywhere, graceful placeholder for missing/broken images. Removed all `unoptimized` and raw `<img>` on public pages.
- Hero banner is preloaded with high fetch priority and a blur placeholder (LCP). WebP copies of the 2 MB PNGs added.
- Self-hosted Inter font (no Google Fonts request), removed the third-party texture background, CSS-only logo marquee.
- Mobile: bottom call/WhatsApp/book bar instead of stacked floating buttons; no horizontal overflow at 360 px.

## Reviews UI
- Rating summary (average, stars, 5→1 distribution), avatar initials, verified badge, date, service chip, "Read more" for long reviews.
- Swipe carousel on mobile, grid on desktop. Service pages show reviews for that service first.
- Hero/rating badges show **real** numbers from the database and hide when there are no reviews.
