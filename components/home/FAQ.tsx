import { HelpCircle } from "lucide-react";
import FaqAccordion from "@/components/faq/FaqAccordion";
import type { FaqItem } from "@/lib/content/types";

/** Homepage FAQ — server-rendered from the database (falls back to curated general FAQs). */
export default function FAQ({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs.length) return null;
  return (
    <section id="faq" className="w-full scroll-mt-32 bg-white py-16 md:py-24" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-md bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-800">
            <HelpCircle size={18} aria-hidden="true" /> Have questions?
          </p>
          <h2 id="faq-heading" className="mb-4 text-3xl font-extrabold text-gray-900 md:text-4xl">
            Pest control <span className="text-green-600">FAQs</span>
          </h2>
          <p className="text-lg text-gray-600">
            Quick answers about safety, timing, pricing and booking for pest control in Mumbai.
          </p>
        </div>
        <FaqAccordion faqs={faqs} group="home-faq" />
      </div>
    </section>
  );
}
