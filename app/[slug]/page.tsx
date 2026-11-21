import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle, ArrowRight, BadgeCheck, CalendarCheck, CheckCircle2, ChevronRight, FileText,
  Leaf, MapPin, MessageCircle, PhoneCall, ShieldCheck, Sparkles, UserCheck, Users,
} from "lucide-react";
import pageSlugs from "../legacy-pages.json";
import SmartImage from "@/components/ui/SmartImage";
import FaqAccordion, { JsonLd, faqPageSchema } from "@/components/faq/FaqAccordion";
import ReviewsSection, { Stars } from "@/components/reviews/ReviewsSection";
import Clients from "@/components/home/Clients";
import { getClients, getReviews } from "@/lib/data";
import { getFaqsForLocation } from "@/lib/faqs";
import { buildFaqList } from "@/lib/content/generic";
import { Markdown } from "@/lib/markdown";
import { BUSINESS_ID, ORG_ID, SITE, SITE_URL, absoluteUrl } from "@/lib/site";
import { buildLegacyModel, decode, type LegacyModel } from "@/lib/legacy/engine";

/** Legacy content is rendered by Next.js at clean, extensionless URLs. */
const pageUrl = (sourcePath: string) => `${SITE_URL}/${sourcePath}`;

// Explicit app routes and their aliases are handled by their own pages or the proxy.
export const instant = false;

export function generateStaticParams() {
  const reserved = new Set([
    "about", "about-us", "admin", "blog", "book-now", "booknow", "clients", "contact",
    "privacy-policy", "services", "service-locations", "terms-and-conditions", "testimonials",
  ]);
  return (pageSlugs as string[])
    .map(decode)
    .filter((slug) => !reserved.has(slug.toLowerCase()))
    .map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

function resolve(slug: string): LegacyModel | null {
  return buildLegacyModel(decode(slug));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = resolve(slug);
  if (!model) return { title: "Page not found", robots: { index: false, follow: true } };
  const url = pageUrl(model.sourcePath);
  const ogImage = model.image.startsWith("/services/") ? model.image.replace(/^\/services\/([a-z]+)\.webp$/, "/og/$1.jpg") : SITE.defaultOgImage;
  return {
    title: { absolute: model.metaTitle },
    description: model.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: model.schemaType === "Article" ? "article" : "website",
      locale: "en_IN",
      siteName: SITE.name,
      url,
      title: model.metaTitle,
      description: model.metaDescription,
      images: [{ url: ogImage, width: 1200, height: 630, alt: model.h1 }],
    },
    twitter: { card: "summary_large_image", title: model.metaTitle, description: model.metaDescription, images: [ogImage] },
  };
}

const TRUST = [
  { icon: ShieldCheck, title: "Registered products", text: "Used strictly according to label directions." },
  { icon: Users, title: "In-house technicians", text: "Trained staff on every visit — no subcontractors." },
  { icon: FileText, title: "Written quote & report", text: "Fixed price before work, service report after." },
  { icon: BadgeCheck, title: "Written warranty", text: "Free re-treatment within your service period." },
];

export default async function LegacyPage({ params }: Props) {
  const { slug } = await params;
  const model = resolve(slug);
  if (!model) notFound();

  const url = pageUrl(model.sourcePath);
  const [reviewData, clients, dbFaqs] = await Promise.all([
    getReviews({ limit: 6, service: model.reviewService }),
    getClients(),
    model.locality ? getFaqsForLocation(model.locality.slug.replace(/\s+/g, "-")) : Promise.resolve([]),
  ]);
  // Location FAQs written in the admin come first; the page always shows exactly 12.
  const faqs = buildFaqList([model.locality ? dbFaqs.filter((f) => /\S/.test(f.question)).slice(0, 4) : [], model.faqs], 12);
  const loc = model.locality;

  const area = loc
    ? { "@type": "Place", name: `${loc.name}${loc.region.key !== "outside" && loc.region.key !== "mmr" ? `, ${loc.region.name}` : ""}`, containedInPlace: { "@type": "State", name: loc.region.key === "outside" ? "India" : "Maharashtra" } }
    : SITE.areaServed.map((name) => ({ "@type": "City", name }));

  const graph: Record<string, unknown>[] = [
    {
      "@type": model.schemaType === "CollectionPage" ? "CollectionPage" : model.schemaType === "FAQPage" ? "FAQPage" : "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: model.metaTitle,
      description: model.metaDescription,
      inLanguage: "en-IN",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": BUSINESS_ID },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(model.image) },
      speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#quick-answer", ".faq-answer"] },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: model.breadcrumbs.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.label, item: absoluteUrl(b.href) })),
    },
  ];
  if (model.schemaType === "Service" && model.family) {
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: model.h1,
      serviceType: model.family.label,
      description: model.quickAnswer,
      url,
      image: absoluteUrl(model.image),
      provider: { "@id": BUSINESS_ID },
      areaServed: area,
      offers: { "@type": "Offer", priceCurrency: "INR", availability: "https://schema.org/InStock", description: "Free inspection with a fixed written quote before treatment.", url },
    });
    graph.push({
      "@type": "HowTo",
      "@id": `${url}#howto`,
      name: model.processHeading,
      step: model.process.map((p, i) => ({ "@type": "HowToStep", position: i + 1, name: p.name, text: p.text, url: `${url}#process` })),
    });
  }
  if (model.schemaType === "Article") {
    graph.push({
      "@type": "Article",
      "@id": `${url}#article`,
      headline: model.h1,
      description: model.metaDescription,
      image: absoluteUrl(model.image),
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      mainEntityOfPage: { "@id": `${url}#webpage` },
      inLanguage: "en-IN",
    });
  }
  if (model.schemaType !== "FAQPage") graph.push(faqPageSchema(faqs, url));
  else (graph[0] as Record<string, unknown>).mainEntity = faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } }));

  const bookHref = `/book-now?service=${encodeURIComponent(model.family?.label ?? "Pest Control")}`;
  const whatsapp = `${SITE.whatsappHref}?text=${encodeURIComponent(`Hi, I need ${model.family?.label.toLowerCase() ?? "pest control"}${loc ? ` in ${loc.name}` : ""}.`)}`;

  return (
    <div className="bg-gray-50">
      <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />

      {/* ------------------------------------------------ HERO */}
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-16">
          <div>
            <nav aria-label="Breadcrumb" className="mb-5 text-sm text-green-100">
              <ol className="flex flex-wrap items-center gap-1.5">
                {model.breadcrumbs.map((b, i) => (
                  <li key={b.href} className="flex items-center gap-1.5">
                    {i > 0 && <ChevronRight size={14} aria-hidden="true" />}
                    {i < model.breadcrumbs.length - 1 ? <Link href={b.href} className="hover:text-white hover:underline">{b.label}</Link> : <span aria-current="page" className="font-semibold text-white">{b.label}</span>}
                  </li>
                ))}
              </ol>
            </nav>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-green-50 ring-1 ring-white/20">
              {loc ? <MapPin size={15} aria-hidden="true" /> : <Leaf size={15} aria-hidden="true" />} {model.eyebrow}
            </p>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{model.h1}</h1>
            <p id="quick-answer" className="mt-5 max-w-2xl text-base leading-relaxed text-green-50 sm:text-lg">{model.quickAnswer}</p>
            {reviewData.stats.count > 0 && (
              <a href="#reviews" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm ring-1 ring-white/20 hover:bg-white/15">
                <Stars rating={reviewData.stats.average} size={15} />
                <span className="font-semibold">{reviewData.stats.average.toFixed(1)}/5</span>
                <span className="text-green-100">from {reviewData.stats.count} reviews</span>
              </a>
            )}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={bookHref} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-green-800 shadow-lg transition hover:bg-green-50">
                Book free inspection <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href={SITE.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-6 py-3.5 font-bold text-white transition hover:bg-white/10">
                <PhoneCall size={18} aria-hidden="true" /> {SITE.phoneDisplay}
              </a>
            </div>
          </div>
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/20">
            <SmartImage src={model.image} alt={model.imageAlt} fill preload fetchPriority="high" sizes="(max-width: 1024px) 100vw, 600px" className="object-cover" />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ TRUST BAR */}
      <section aria-label="Why customers trust us" className="relative z-10 mx-auto -mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 shadow-lg lg:grid-cols-4">
          {TRUST.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3 bg-white p-4 sm:p-5">
              <Icon size={22} className="mt-0.5 shrink-0 text-green-600" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-gray-900">{title}</p>
                <p className="mt-0.5 text-xs text-gray-600 sm:text-sm">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------ BODY */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-3 lg:gap-12 lg:px-8">
        <article className="min-w-0 space-y-12 lg:col-span-2">
          <div className="space-y-4 text-base leading-relaxed text-gray-700 sm:text-[17px]">
            {model.intro.map((p) => <p key={p}>{p}</p>)}
          </div>

          {model.facts.length > 0 && (
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-3">
              {model.facts.map((f) => (
                <div key={f.label} className="bg-white p-4 last:odd:col-span-2 sm:last:odd:col-span-1 sm:[&:nth-child(3n+1):last-child]:col-span-3 sm:[&:nth-child(3n+2):last-child]:col-span-2">
                  <dt className="text-xs font-bold uppercase tracking-wide text-gray-500">{f.label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-900 sm:text-base">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {loc && model.localParagraphs && (
            <section id="local" aria-labelledby="local-heading" className="scroll-mt-32 rounded-3xl border border-green-100 bg-white p-6 sm:p-8">
              <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-green-700">
                <MapPin size={16} aria-hidden="true" /> {loc.region.name}
              </p>
              <h2 id="local-heading" className="text-2xl font-bold text-gray-900 sm:text-3xl">{model.localHeading}</h2>
              <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-gray-700 sm:text-base">
                {model.localParagraphs.map((p) => <p key={p}>{p}</p>)}
              </div>
            </section>
          )}

          {model.signs.length > 0 && (
            <section id="signs" aria-labelledby="signs-heading" className="scroll-mt-32">
              <h2 id="signs-heading" className="text-2xl font-bold text-gray-900 sm:text-3xl">{model.signsHeading}</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {model.signs.map((sign) => (
                  <li key={sign} className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-4 text-[15px] text-gray-800">
                    <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" /> <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {model.sections.map((s, i) => (
            <section key={`${s.heading}-${i}`} id={`s${i + 1}`} aria-labelledby={`s${i + 1}-h`} className="scroll-mt-32">
              <h2 id={`s${i + 1}-h`} className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">{s.heading}</h2>
              <Markdown source={s.body} />
            </section>
          ))}

          <section id="process" aria-labelledby="process-h" className="scroll-mt-32">
            <h2 id="process-h" className="text-2xl font-bold text-gray-900 sm:text-3xl">{model.processHeading}</h2>
            <ol className="mt-6 space-y-4">
              {model.process.map((step, i) => (
                <li key={step.name} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-lg font-bold text-white" aria-hidden="true">{i + 1}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{step.name}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-gray-700">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {model.preparation.length > 0 && (
            <section id="prepare" aria-labelledby="prepare-h" className="scroll-mt-32">
              <h2 id="prepare-h" className="text-2xl font-bold text-gray-900 sm:text-3xl">Before and after the treatment</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {[
                  { icon: CalendarCheck, title: "Before the visit", list: model.preparation },
                  { icon: Sparkles, title: "After the treatment", list: model.aftercare },
                ].map(({ icon: Icon, title, list }) => (
                  <div key={title} className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900"><Icon size={20} className="text-green-600" aria-hidden="true" /> {title}</h3>
                    <ul className="mt-4 space-y-3">
                      {list.map((item) => <li key={item} className="flex gap-2.5 text-[15px] text-gray-700"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600" aria-hidden="true" /> {item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              {model.prevention.length > 0 && (
                <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-6">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900"><Leaf size={20} className="text-green-700" aria-hidden="true" /> {model.preventionHeading}</h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {model.prevention.map((item) => <li key={item} className="flex gap-2.5 text-[15px] text-gray-800"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-green-700" aria-hidden="true" /> {item}</li>)}
                  </ul>
                </div>
              )}
            </section>
          )}

          <section aria-labelledby="why-h">
            <h2 id="why-h" className="text-2xl font-bold text-gray-900 sm:text-3xl">{model.whyHeading}</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {model.why.map((w) => (
                <li key={w.title} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <p className="flex items-center gap-2 font-bold text-gray-900"><BadgeCheck size={18} className="text-green-600" aria-hidden="true" /> {w.title}</p>
                  <p className="mt-1.5 text-[15px] text-gray-700">{w.text}</p>
                </li>
              ))}
            </ul>
          </section>

          {model.cost && (
            <section id="cost" aria-labelledby="cost-h" className="scroll-mt-32">
              <h2 id="cost-h" className="text-2xl font-bold text-gray-900 sm:text-3xl">{model.costHeading}</h2>
              <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-gray-700 sm:text-base">
                {model.cost.map((p) => <p key={p}>{p}</p>)}
              </div>
            </section>
          )}

          <div className="flex flex-col items-start gap-4 rounded-3xl bg-gradient-to-r from-green-700 to-emerald-600 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <p className="max-w-xl text-lg font-semibold">{model.closing}</p>
            <Link href={bookHref} className="shrink-0 rounded-xl bg-white px-6 py-3 font-bold text-green-800 hover:bg-green-50">Book inspection</Link>
          </div>

          <aside className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 sm:flex-row sm:items-center">
            <UserCheck size={28} className="shrink-0 text-green-700" aria-hidden="true" />
            <p>
              Written and reviewed by the <strong className="text-gray-900">{SITE.name} technical team</strong>, based on treatments we carry out across Mumbai, Thane, Navi Mumbai and Pune. Products are used as per their registered label directions.
            </p>
          </aside>
        </article>

        {/* ------------------------------------------------ SIDEBAR */}
        <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:p-7">
            <p className="text-sm font-bold uppercase tracking-wider text-green-700">Free inspection</p>
            <p className="mt-1 text-xl font-bold text-gray-900">{loc ? `Book in ${loc.name}` : "Talk to a technician"}</p>
            <p className="mt-2 text-sm text-gray-600">Fixed written quote before any work starts. Mon–Sat, 9 am – 9 pm.</p>
            <div className="mt-5 space-y-3">
              <a href={SITE.phoneHref} className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 py-3.5 font-bold text-green-800 hover:bg-green-100"><PhoneCall size={18} aria-hidden="true" /> {SITE.phoneDisplay}</a>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 font-bold text-white hover:brightness-95"><MessageCircle size={18} aria-hidden="true" /> WhatsApp us</a>
              <Link href={bookHref} className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 font-bold text-white shadow-md hover:bg-green-700">Book online <ArrowRight size={18} aria-hidden="true" /></Link>
            </div>
          </div>
          {model.servicePage && (
            <Link href={model.servicePage.href} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 font-semibold text-gray-800 hover:border-green-400 hover:text-green-700">
              {model.servicePage.label} <ArrowRight size={18} aria-hidden="true" />
            </Link>
          )}
          {model.linkGroups[0] && (
            <nav aria-label={model.linkGroups[0].heading} className="rounded-3xl border border-gray-100 bg-white p-6">
              <p className="text-lg font-bold text-gray-900">{model.linkGroups[0].heading}</p>
              <ul className="mt-3 divide-y divide-gray-100">
                {model.linkGroups[0].links.slice(0, 8).map((l) => (
                  <li key={l.href}><Link href={l.href} className="flex items-center justify-between py-2.5 text-[15px] text-gray-700 hover:text-green-700">{l.label} <ChevronRight size={16} aria-hidden="true" /></Link></li>
                ))}
              </ul>
            </nav>
          )}
        </aside>
      </div>

      {model.bigList && (
        <section id="areas" aria-labelledby="areas-h" className="scroll-mt-32 bg-white py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="areas-h" className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">{model.bigList.heading}</h2>
            <div className="space-y-8">
              {model.bigList.groups.map((g) => (
                <div key={g.heading}>
                  <h3 className="mb-3 text-lg font-bold text-gray-900">{g.heading}</h3>
                  <ul className="grid gap-x-6 gap-y-1.5 text-[15px] sm:grid-cols-2 lg:grid-cols-4">
                    {g.links.map((l) => <li key={l.href}><Link href={l.href} className="text-gray-700 hover:text-green-700 hover:underline">{l.label}</Link></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <ReviewsSection
        id="reviews"
        heading={loc ? `What customers say about ${model.family?.label.toLowerCase() ?? "our service"}` : "What our customers say"}
        description="Real, published reviews from our customers. Reviews for this service appear first."
        reviews={reviewData.reviews}
        stats={reviewData.stats}
        tone="white"
      />

      <Clients clients={clients} heading="Trusted by businesses and housing societies" />

      <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-32 bg-gray-50 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-green-700">{model.family?.label ?? "Pest control"}{loc ? ` · ${loc.name}` : ""}</p>
            <h2 id="faq-heading" className="text-3xl font-extrabold text-gray-900 md:text-4xl">Frequently asked questions</h2>
          </div>
          <FaqAccordion faqs={faqs} group={`faq-${model.sourcePath.slice(0, 40)}`} />
        </div>
      </section>

      {model.linkGroups.length > 0 && (
        <section aria-label="Related pages" className="bg-white py-14">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
            {model.linkGroups.map((g) => (
              <nav key={g.heading} aria-label={g.heading}>
                <h2 className="mb-4 text-xl font-bold text-gray-900">{g.heading}</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {g.links.map((l) => (
                    <li key={l.href}><Link href={l.href} className="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-[15px] text-gray-700 hover:border-green-300 hover:text-green-700"><MapPin size={14} className="shrink-0 text-green-600" aria-hidden="true" /> {l.label}</Link></li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

