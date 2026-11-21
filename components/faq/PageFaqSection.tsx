import FaqAccordion, { JsonLd, faqPageSchema } from "@/components/faq/FaqAccordion";
import { PAGE_FAQS } from "@/lib/content/page-faqs";
import { absoluteUrl } from "@/lib/site";

/** 12 page-specific FAQs (6 + 6) with matching FAQPage JSON-LD, for the core pages. */
export default function PageFaqSection({ page, path, heading = "Frequently asked questions" }: { page: keyof typeof PAGE_FAQS; path: string; heading?: string }) {
  const faqs = PAGE_FAQS[page];
  if (!faqs?.length) return null;
  return (
    <section id="faq" aria-labelledby="page-faq-heading" className="scroll-mt-32 bg-white py-16 md:py-20">
      <JsonLd data={{ "@context": "https://schema.org", ...faqPageSchema(faqs, absoluteUrl(path)) }} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="page-faq-heading" className="mb-10 text-center text-3xl font-extrabold text-gray-900 md:text-4xl">{heading}</h2>
        <FaqAccordion faqs={faqs} group={`faq-${String(page)}`} />
      </div>
    </section>
  );
}
