import type { Metadata } from "next";
import PageFaqSection from "@/components/faq/PageFaqSection";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Star } from "lucide-react";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import Clients from "@/components/home/Clients";
import { JsonLd } from "@/components/faq/FaqAccordion";
import { getClients, getReviews } from "@/lib/data";
import { BUSINESS_ID, SITE, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Customer Reviews — Pest Control in Mumbai",
  description: "Read published customer reviews of Eco-Friendly Pests' termite, cockroach, bed bug, rodent and mosquito control across Mumbai, Thane and Navi Mumbai.",
  alternates: { canonical: absoluteUrl("/testimonials") },
  openGraph: { url: absoluteUrl("/testimonials"), title: "Customer Reviews | Eco-Friendly Pests", images: [{ url: SITE.defaultOgImage, width: 1200, height: 630 }] },
};

export default async function TestimonialsPage() {
  const [{ reviews, stats }, clients] = await Promise.all([getReviews(), getClients()]);
  const url = absoluteUrl("/testimonials");

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: "Customer reviews",
        about: { "@id": BUSINESS_ID },
        inLanguage: "en-IN",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Customer reviews", item: url },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-green-900 to-green-700 py-14 text-white md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-600 bg-green-800 px-4 py-2 text-sm font-semibold text-green-100">
            <Star size={16} className="fill-amber-400 text-amber-400" aria-hidden="true" />
            {stats.count > 0 ? `${stats.average.toFixed(1)}/5 from ${stats.count} published ${stats.count === 1 ? "review" : "reviews"}` : "Customer reviews"}
          </p>
          <h1 className="mb-5 text-4xl font-extrabold tracking-tight md:text-5xl">What our customers say</h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-green-100">
            Feedback from homes, housing societies and businesses we have served across Mumbai, Thane and Navi Mumbai.
          </p>
        </div>
      </section>

      <ReviewsSection
        id="all-reviews"
        eyebrow="All reviews"
        heading="Every published review"
        reviews={reviews}
        stats={stats}
        showAllLink={false}
      />

      <Clients clients={clients} heading="Trusted by client organisations" />

      <section className="border-t-4 border-green-600 bg-gray-900 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-3xl bg-green-800 p-8 shadow-2xl md:flex-row md:p-12">
            <ShieldCheck className="absolute -right-10 -top-10 opacity-10" size={200} aria-hidden="true" />
            <div className="relative z-10 text-center md:max-w-lg md:text-left">
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Need pest control help?</h2>
              <p className="text-lg text-green-100">Book a free inspection and get a fixed written quote.</p>
            </div>
            <div className="relative z-10 flex w-full flex-col gap-4 md:w-auto">
              <Link href="/book-now" className="flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-green-800 shadow-lg transition-colors hover:bg-gray-100">
                Book inspection <ArrowRight size={20} aria-hidden="true" />
              </Link>
              <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl border-2 border-green-500 bg-green-700 px-8 py-4 text-lg font-bold text-white shadow-lg transition-colors hover:bg-green-600">
                <MessageCircle size={20} aria-hidden="true" /> WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>
      <PageFaqSection page="reviews" path="/testimonials" />
    </div>
  );
}
