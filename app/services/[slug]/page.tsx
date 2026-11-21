import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
  AlertTriangle, ArrowRight, CalendarCheck, CheckCircle2, ChevronRight, Leaf,
  MessageCircle, PhoneCall, ShieldCheck, Sparkles, UserCheck,
} from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import FaqAccordion, { JsonLd, faqPageSchema } from "@/components/faq/FaqAccordion";
import ReviewsSection, { Stars } from "@/components/reviews/ReviewsSection";
import Clients from "@/components/home/Clients";
import { getClients, getReviews, getServiceDetail, getServiceSlugs, getServices } from "@/lib/data";
import { Markdown, stripMarkdown } from "@/lib/markdown";
import { BUSINESS_ID, SITE, SITE_URL, absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

// Known slugs are fully prerendered (generateStaticParams). Reading `params` at the top of the page is
// intentional: it lets notFound()/redirects run before streaming, so crawlers get real 404/308 status codes.
export const instant = false;

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

function ogImageFor(image: string) {
  // Local service images have pre-cropped 1200×630 OG versions in /public/og.
  const local = image.match(/^\/services\/([a-z0-9-]+)\.(png|webp|jpe?g)$/i);
  return local ? `/og/${local[1]}.jpg` : image || SITE.defaultOgImage;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceDetail(slug);
  if (!service) {
    return { title: "Service not found", robots: { index: false, follow: true } };
  }
  const { content } = service;
  const url = absoluteUrl(`/services/${service.slug}`);
  const image = ogImageFor(service.image);
  return {
    title: { absolute: content.metaTitle },
    description: content.metaDescription,
    keywords: content.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE.name,
      url,
      title: content.metaTitle,
      description: content.metaDescription,
      images: [{ url: image, width: 1200, height: 630, alt: content.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.metaTitle,
      description: content.metaDescription,
      images: [image],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceDetail(slug);
  if (!service) notFound();

  // One URL per service: aliases, upper-case and trailing variations 301 to the canonical slug.
  if (slug !== service.slug) permanentRedirect(`/services/${service.slug}`);

  const { content } = service;
  const [allServices, reviewData, clients] = await Promise.all([
    getServices(),
    getReviews({ limit: 6, service: { slug: service.slug, title: service.title, pest: content.pest } }),
    getClients(),
  ]);

  const url = absoluteUrl(`/services/${service.slug}`);
  const otherServices = allServices.filter((s) => s.slug !== service.slug);
  const related = [
    ...content.related.map((r) => otherServices.find((s) => s.slug === r)).filter(Boolean),
    ...otherServices,
  ].filter((s, i, arr) => s && arr.findIndex((x) => x!.slug === s.slug) === i).slice(0, 3) as typeof otherServices;

  const serviceRating = reviewData.serviceStats && reviewData.serviceStats.count > 0 ? reviewData.serviceStats : null;
  const matchedReviews = reviewData.reviews.slice(0, reviewData.matchedCount);
  const lastUpdated = service.updatedAt ? new Date(service.updatedAt) : null;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: content.metaTitle,
        description: content.metaDescription,
        inLanguage: "en-IN",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${url}#service` },
        primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(service.image) },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        ...(service.updatedAt ? { dateModified: service.updatedAt } : {}),
        // Voice assistants / AI answers: the H1 and the direct-answer summary are the speakable parts.
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#service-h1", "#quick-answer"] },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.title,
        serviceType: content.pest ? `${content.pest} control` : service.title,
        description: stripMarkdown(content.quickAnswer),
        url,
        image: absoluteUrl(service.image),
        provider: { "@id": BUSINESS_ID },
        areaServed: SITE.areaServed.map((name) => ({ "@type": "City", name })),
        audience: { "@type": "Audience", audienceType: "Homes, housing societies, offices, restaurants and warehouses" },
        termsOfService: absoluteUrl("/terms-and-conditions"),
        offers: {
          "@type": "Offer",
          url,
          availability: "https://schema.org/InStock",
          priceCurrency: "INR",
          description: "Free inspection with a fixed written quote before treatment.",
          areaServed: SITE.areaServed.map((name) => ({ "@type": "City", name })),
        },
        ...(serviceRating
          ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: serviceRating.average,
              reviewCount: serviceRating.count,
              bestRating: 5,
              worstRating: 1,
            },
            review: matchedReviews.slice(0, 5).map((review) => ({
              "@type": "Review",
              author: { "@type": "Person", name: review.name },
              reviewBody: review.text,
              ...(review.createdAt ? { datePublished: review.createdAt.slice(0, 10) } : {}),
              reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5, worstRating: 1 },
            })),
          }
          : {}),
      },
      {
        "@type": "HowTo",
        "@id": `${url}#howto`,
        name: `How ${service.title.toLowerCase()} is done`,
        step: content.process.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.name,
          text: step.text,
          url: `${url}#process`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
          { "@type": "ListItem", position: 3, name: service.title, item: url },
        ],
      },
      faqPageSchema(service.faqs, url),
    ],
  };

  return (
    <div className="bg-gray-50">
      <JsonLd data={schema} />

      {/* ------------------------------------------------ HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 md:py-16 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
          <div>
            <nav aria-label="Breadcrumb" className="mb-5 text-sm text-green-100">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li><Link href="/" className="hover:text-white hover:underline">Home</Link></li>
                <li aria-hidden="true"><ChevronRight size={14} /></li>
                <li><Link href="/services" className="hover:text-white hover:underline">Services</Link></li>
                <li aria-hidden="true"><ChevronRight size={14} /></li>
                <li aria-current="page" className="font-semibold text-white">{service.title}</li>
              </ol>
            </nav>
            <h1 id="service-h1" className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {content.h1}
            </h1>
            <p id="quick-answer" className="mt-5 max-w-2xl text-base leading-relaxed text-green-50 sm:text-lg">
              {content.quickAnswer}
            </p>

            {reviewData.stats.count > 0 && (
              <a href="#reviews" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm ring-1 ring-white/20 hover:bg-white/15">
                <Stars rating={reviewData.stats.average} size={15} />
                <span className="font-semibold">{reviewData.stats.average.toFixed(1)}/5</span>
                <span className="text-green-100">from {reviewData.stats.count} customer reviews</span>
              </a>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={`/book-now?service=${encodeURIComponent(service.title)}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-green-800 shadow-lg transition hover:bg-green-50">
                Book free inspection <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href={SITE.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-6 py-3.5 font-bold text-white transition hover:bg-white/10">
                <PhoneCall size={18} aria-hidden="true" /> {SITE.phoneDisplay}
              </a>
            </div>

            <ul className="mt-7 grid grid-cols-1 gap-2 text-sm text-green-50 sm:grid-cols-3">
              {["Free inspection & fixed quote", "Registered, low-odour products", "Trained in-house technicians"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0 text-green-300" aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/20">
            <SmartImage
              src={service.image}
              alt={service.imageAlt}
              fill
              preload
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ QUICK FACTS */}
      <section aria-label={`${service.title} at a glance`} className="relative z-10 mx-auto -mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 shadow-lg sm:grid-cols-3 lg:grid-cols-5">
          {content.facts.map((fact) => (
            <div key={fact.label} className="bg-white p-4 last:col-span-2 sm:p-5 lg:last:col-span-1">
              <dt className="text-xs font-bold uppercase tracking-wide text-gray-500">{fact.label}</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900 sm:text-base">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ------------------------------------------------ BODY */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-3 lg:gap-12 lg:px-8">
        <article className="min-w-0 space-y-12 lg:col-span-2">
          {content.signs.length > 0 && (
            <section id="signs" aria-labelledby="signs-heading" className="scroll-mt-32">
              <h2 id="signs-heading" className="text-2xl font-bold text-gray-900 sm:text-3xl">
                What are the signs of {content.pest.toLowerCase()} in your home?
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {content.signs.map((sign) => (
                  <li key={sign} className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-4 text-[15px] text-gray-800">
                    <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {content.sections.map((section, i) => (
            <section key={section.heading} id={`section-${i + 1}`} aria-labelledby={`section-${i + 1}-heading`} className="scroll-mt-32">
              <h2 id={`section-${i + 1}-heading`} className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">{section.heading}</h2>
              <Markdown source={section.body} />
            </section>
          ))}

          {service.customBody && (
            <section id="details" aria-labelledby="details-heading" className="scroll-mt-32">
              <h2 id="details-heading" className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">More about {service.title}</h2>
              <Markdown source={service.customBody} />
            </section>
          )}

          <section id="process" aria-labelledby="process-heading" className="scroll-mt-32">
            <h2 id="process-heading" className="text-2xl font-bold text-gray-900 sm:text-3xl">
              How is {service.title.toLowerCase()} done? Our step-by-step process
            </h2>
            <ol className="mt-6 space-y-4">
              {content.process.map((step, i) => (
                <li key={step.name} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-lg font-bold text-white" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900">{step.name}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-gray-700">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="preparation" aria-labelledby="preparation-heading" className="scroll-mt-32">
            <h2 id="preparation-heading" className="text-2xl font-bold text-gray-900 sm:text-3xl">
              How to prepare, and what to do after treatment
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <CalendarCheck size={20} className="text-green-600" aria-hidden="true" /> Before the visit
                </h3>
                <ul className="mt-4 space-y-3">
                  {content.preparation.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[15px] text-gray-700">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600" aria-hidden="true" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <Sparkles size={20} className="text-green-600" aria-hidden="true" /> After the treatment
                </h3>
                <ul className="mt-4 space-y-3">
                  {content.aftercare.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[15px] text-gray-700">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600" aria-hidden="true" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Leaf size={20} className="text-green-700" aria-hidden="true" /> How to prevent {content.pest.toLowerCase()} from coming back
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {content.prevention.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[15px] text-gray-800">
                    <ShieldCheck size={18} className="mt-0.5 shrink-0 text-green-700" aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* E-E-A-T: who stands behind this content, and how fresh it is */}
          <aside className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 sm:flex-row sm:items-center">
            <UserCheck size={28} className="shrink-0 text-green-700" aria-hidden="true" />
            <p>
              Written and reviewed by the <strong className="text-gray-900">{SITE.name} technical team</strong>, based on treatments we carry out
              across Mumbai, Thane and Navi Mumbai. Products are used as per their registered label directions.
              {lastUpdated && (
                <> Last updated <time dateTime={service.updatedAt}>{lastUpdated.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" })}</time>.</>
              )}
            </p>
          </aside>
        </article>

        {/* ------------------------------------------------ SIDEBAR */}
        <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:p-7">
            <p className="text-sm font-bold uppercase tracking-wider text-green-700">Free inspection</p>
            <h2 className="mt-1 text-xl font-bold text-gray-900">Need {service.title.toLowerCase()}?</h2>
            <p className="mt-2 text-sm text-gray-600">Talk to a technician today. Fixed written quote before any work starts.</p>
            <div className="mt-5 space-y-3">
              <a href={SITE.phoneHref} className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 py-3.5 font-bold text-green-800 transition hover:bg-green-100">
                <PhoneCall size={18} aria-hidden="true" /> {SITE.phoneDisplay}
              </a>
              <a
                href={`${SITE.whatsappHref}?text=${encodeURIComponent(`Hi, I need ${service.title}. Please share details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 font-bold text-white transition hover:brightness-95"
              >
                <MessageCircle size={18} aria-hidden="true" /> WhatsApp us
              </a>
              <Link href={`/book-now?service=${encodeURIComponent(service.title)}`} className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 font-bold text-white shadow-md transition hover:bg-green-700">
                Book online <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-4 text-center text-xs text-gray-500">Mon–Sat, 9 am – 9 pm</p>
          </div>

          {otherServices.length > 0 && (
            <nav aria-label="Other services" className="rounded-3xl border border-gray-100 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900">Other pest control services</h2>
              <ul className="mt-4 divide-y divide-gray-100">
                {otherServices.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="flex items-center justify-between py-3 text-[15px] font-medium text-gray-700 hover:text-green-700">
                      {s.title} <ChevronRight size={16} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>
      </div>

      <ReviewsSection
        id="reviews"
        heading={`What customers say about our ${service.title.toLowerCase()}`}
        description={
          reviewData.matchedCount > 0
            ? "Recent feedback from customers who booked this service, followed by other recent reviews."
            : "Recent feedback from customers across our pest control services."
        }
        reviews={reviewData.reviews}
        stats={reviewData.stats}
        tone="white"
      />

      <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-32 bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-green-700">{service.title}</p>
            <h2 id="faq-heading" className="text-3xl font-extrabold text-gray-900 md:text-4xl">Frequently asked questions</h2>
            <p className="mt-3 text-gray-600">Straight answers to the {service.faqs.length} questions customers ask us most.</p>
          </div>
          <FaqAccordion faqs={service.faqs} group={`faq-${service.slug}`} />
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="related-heading" className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">Related services</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg">
                  <div className="relative aspect-[3/2] bg-gray-100">
                    <SmartImage src={s.image} alt={s.imageAlt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px" className="object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700">{s.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">{s.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Clients clients={clients} heading="Trusted by organisations across Mumbai" />
    </div>
  );
}
