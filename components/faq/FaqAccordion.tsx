import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/content/types";
import { jsonLd } from "@/lib/site";

/**
 * Accessible, zero-JS FAQ accordion built on <details>/<summary>.
 * Answers are always present in the HTML, so search engines and AI crawlers read every answer.
 * `name` makes it an exclusive accordion in modern browsers (one open at a time).
 */
export default function FaqAccordion({
  faqs,
  group = "faq",
  columns = 2,
  openFirst = true,
}: {
  faqs: FaqItem[];
  group?: string;
  columns?: 1 | 2;
  openFirst?: boolean;
}) {
  if (!faqs.length) return null;
  const mid = Math.ceil(faqs.length / 2);
  const cols = columns === 2 ? [faqs.slice(0, mid), faqs.slice(mid)] : [faqs];

  return (
    <div className={`grid items-start gap-4 ${columns === 2 ? "md:grid-cols-2 md:gap-5" : ""}`}>
      {cols.map((col, c) => (
        <div key={c} className="space-y-4">
          {col.map((faq, i) => {
            const index = c * mid + i;
            return (
              <details
                key={`${group}-${index}`}
                name={group}
                open={openFirst && index === 0}
                className="group rounded-2xl border border-gray-200 bg-white transition-colors open:border-green-500 open:bg-green-50/40 open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-2xl p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 sm:p-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-bold text-gray-900 group-open:text-green-800 sm:text-lg">{faq.question}</h3>
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-transform duration-200 group-open:rotate-180 group-open:bg-green-600 group-open:text-white">
                    <ChevronDown size={18} aria-hidden="true" />
                  </span>
                </summary>
                <div className="px-5 pb-5 text-[15px] leading-relaxed text-gray-700 sm:px-6 sm:pb-6 sm:text-base">
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              </details>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function faqPageSchema(faqs: FaqItem[], url: string) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}
