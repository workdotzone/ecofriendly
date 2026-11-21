import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar, { type NavLink } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";
import { JsonLd } from "@/components/faq/FaqAccordion";
import { getLocations, getMenu, getReviews, getServices } from "@/lib/data";
import { BUSINESS_ID, ORG_ID, SITE, SITE_URL, WEBSITE_ID, absoluteUrl } from "@/lib/site";

// Self-hosted variable font: no request to Google at runtime or build, `swap` avoids invisible text.
const inter = localFont({
  src: "./fonts/Inter-Variable-latin.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
  fallback: ["system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#15803d",
};

// NOTE: no `alternates.canonical` here on purpose. A canonical in the root layout is inherited by every
// page that doesn't set its own — it was telling Google that /about, /contact, /blog… were duplicates of the homepage.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pest Control in Mumbai | Eco-Friendly Pests",
    template: "%s | Eco-Friendly Pests",
  },
  description: SITE.description,
  applicationName: SITE.name,
  category: "Pest control services",
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE.name,
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: `${SITE.name} — pest control in Mumbai` }],
  },
  twitter: { card: "summary_large_image", images: [SITE.defaultOgImage] },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: { icon: "/favicon.ico", apple: "/logo.png" },
  other: {
    "geo.region": "IN-MH",
    "geo.placename": "Mumbai",
    "geo.position": `${SITE.geo.latitude};${SITE.geo.longitude}`,
    ICBM: `${SITE.geo.latitude}, ${SITE.geo.longitude}`,
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [services, menu, locations, reviewData] = await Promise.all([getServices(), getMenu(), getLocations(), getReviews({ limit: 0 })]);

  // Header/footer service links come from the Services collection (always correct URLs);
  // admin "Page" menu items are added as top-level links.
  const serviceLinks: NavLink[] = services.map((s) => ({ name: s.title, href: `/services/${s.slug}` }));
  const extraServiceLinks = menu
    .filter((m) => m.category === "Service" && !serviceLinks.some((s) => s.href === m.href))
    .map((m) => ({ name: m.name, href: m.href }));
  const navigationServiceLinks = serviceLinks.slice(0, 20);
  const pageLinks: NavLink[] = menu
    .filter((m) => m.category === "Page" && !["/", "/about", "/contact", "/book-now", "/services"].includes(m.href))
    .map((m) => ({ name: m.name, href: m.href }));
  const allServiceLinks = [...serviceLinks, ...extraServiceLinks];

  const { stats } = reviewData;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE.name,
        url: absoluteUrl("/"),
        logo: { "@type": "ImageObject", url: absoluteUrl(SITE.logo), width: 1171, height: 390 },
        email: SITE.email,
        telephone: SITE.phone,
        ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
        contactPoint: {
          "@type": "ContactPoint",
          telephone: SITE.phone,
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi", "Marathi"],
        },
      },
      {
        "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
        "@id": BUSINESS_ID,
        name: SITE.name,
        description: SITE.description,
        url: absoluteUrl("/"),
        image: absoluteUrl(SITE.defaultOgImage),
        logo: absoluteUrl(SITE.logo),
        telephone: SITE.phone,
        email: SITE.email,
        priceRange: "₹₹",
        currenciesAccepted: "INR",
        paymentAccepted: "Cash, UPI, Bank transfer",
        address: { "@type": "PostalAddress", ...SITE.address },
        geo: { "@type": "GeoCoordinates", ...SITE.geo },
        areaServed: SITE.areaServed.map((name) => ({ "@type": "City", name })),
        openingHoursSpecification: [
          { "@type": "OpeningHoursSpecification", dayOfWeek: SITE.openingHours.days, opens: SITE.openingHours.opens, closes: SITE.openingHours.closes },
        ],
        parentOrganization: { "@id": ORG_ID },
        ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Pest control services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, url: absoluteUrl(`/services/${s.slug}`) },
          })),
        },
        ...(stats.count > 0
          ? { aggregateRating: { "@type": "AggregateRating", ratingValue: stats.average, reviewCount: stats.count, bestRating: 5, worstRating: 1 } }
          : {}),
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: absoluteUrl("/"),
        name: SITE.name,
        inLanguage: "en-IN",
        publisher: { "@id": ORG_ID },
      },
    ],
  };

  return (
    <html lang="en-IN" className={inter.variable}>
      <body className="bg-gray-50 pb-16 font-sans text-gray-900 antialiased md:pb-0">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-green-800 focus:shadow-lg">
          Skip to content
        </a>
        <JsonLd data={schema} />
        <Navbar services={navigationServiceLinks} pages={pageLinks} />
        <main id="main" className="min-h-screen">{children}</main>
        <Footer services={allServiceLinks} locations={locations} />
        <FloatingCTA />
      </body>
    </html>
  );
}
