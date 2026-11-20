import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import AboutSection from "@/components/home/AboutSection";
import Clients from "@/components/home/Clients";
import FAQ from "@/components/home/FAQ";
import SeoContent from "@/components/SeoContent";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import { JsonLd, faqPageSchema } from "@/components/faq/FaqAccordion";
import { getClients, getHomeFaqs, getLocations, getReviews, getServices } from "@/lib/data";
import { BUSINESS_ID, SITE, SITE_URL, absoluteUrl } from "@/lib/site";

const title = "Eco-Friendly Pest Control in Mumbai | Eco-Friendly Pests";
const description =
  "Odourless pest control in Mumbai, Thane & Navi Mumbai — termite, cockroach, bed bug, rodent & mosquito treatment. Free inspection & written warranty.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE.name,
    url: `${SITE_URL}/`,
    title,
    description,
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: "Eco-Friendly Pests — pest control services in Mumbai" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [SITE.defaultOgImage] },
};

export default async function Home() {
  const [services, reviewData, clients, faqs, locations] = await Promise.all([
    getServices(),
    getReviews({ limit: 6 }),
    getClients(),
    getHomeFaqs(),
    getLocations(),
  ]);

  const homeUrl = `${SITE_URL}/`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${homeUrl}#webpage`,
        url: homeUrl,
        name: title,
        description,
        inLanguage: "en-IN",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": BUSINESS_ID },
        primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl("/banner.webp") },
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#home-summary"] },
      },
      {
        "@type": "ItemList",
        "@id": `${homeUrl}#services`,
        name: "Pest control services",
        numberOfItems: services.length,
        itemListElement: services.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(`/services/${service.slug}`),
          name: service.title,
        })),
      },
      faqPageSchema(faqs, homeUrl),
    ],
  };

  return (
    <>
      <JsonLd data={schema} />
      <Hero services={services.map((s) => s.title)} stats={reviewData.stats} />
      <Services services={services} />
      <AboutSection locations={locations} />
      <Clients clients={clients} />
      <ReviewsSection
        id="reviews"
        heading="Trusted by Mumbai families and businesses"
        description="Recent, published reviews from residential and commercial customers across our service areas."
        reviews={reviewData.reviews}
        stats={reviewData.stats}
      />
      <FAQ faqs={faqs} />
      <SeoContent />
    </>
  );
}
