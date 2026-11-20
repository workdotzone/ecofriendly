import Link from "next/link";
import PageFaqSection from "@/components/faq/PageFaqSection";
import { SITE } from "@/lib/site";

/** Simple, readable legal page layout. Content is a starting template — have it reviewed for your business. */
export default function LegalPage({ title, updated, sections, faqPage, path }: { title: string; updated: string; sections: { heading: string; body: string[] }[]; faqPage?: "privacy" | "terms"; path?: string }) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-green-700">Home</Link> <span aria-hidden="true">/</span> <span className="text-gray-800">{title}</span>
        </nav>
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: {updated}</p>
        <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-gray-700 sm:text-base">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-3 text-xl font-bold text-gray-900">{section.heading}</h2>
              {section.body.map((p) => <p key={p} className="mb-3">{p}</p>)}
            </section>
          ))}
          <section>
            <h2 className="mb-3 text-xl font-bold text-gray-900">Contact</h2>
            <p>
              {SITE.name}, {SITE.address.streetAddress}, {SITE.address.addressLocality} {SITE.address.postalCode}. Phone{" "}
              <a href={SITE.phoneHref} className="font-semibold text-green-700">{SITE.phoneDisplay}</a>, email{" "}
              <a href={`mailto:${SITE.email}`} className="font-semibold text-green-700">{SITE.email}</a>.
            </p>
          </section>
        </div>
      </div>
      {faqPage && path && <PageFaqSection page={faqPage} path={path} />}
    </div>
  );
}
