import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Leaf, Users, Shield, Clock, PhoneCall } from "lucide-react";
import Services from "@/components/home/Services";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import FaqAccordion, { JsonLd, faqPageSchema } from "@/components/faq/FaqAccordion";
import { getReviews, getServices } from "@/lib/data";
import { getFaqsForServicesOverview } from "@/lib/faqs";
import { GENERAL_FAQS, buildFaqList } from "@/lib/content/generic";
import { BUSINESS_ID, SITE, absoluteUrl } from "@/lib/site";

const pageTitle = "Pest Control Services in Mumbai — Termite, Cockroach, Bed Bug & More";
const pageDescription =
  "Compare pest control services in Mumbai, Thane and Navi Mumbai, from cockroach and termite treatment to bed bug, rodent, mosquito and wood borer control. Book a free inspection.";

export const metadata: Metadata = {
  title: { absolute: `${pageTitle.split(" — ")[0]} | ${SITE.name}` },
  description: pageDescription,
  keywords: [
    "pest control services in Mumbai",
    "pest control in Thane",
    "pest control in Navi Mumbai",
    "cockroach control",
    "termite treatment",
    "bed bug treatment",
    "rodent control",
  ],
  alternates: { canonical: absoluteUrl("/services") },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: absoluteUrl("/services"),
    siteName: SITE.name,
    type: "website",
    locale: "en_IN",
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: "Pest control services in Mumbai" }],
  },
};


export default async function ServicesPage() {
  const [services, reviewData, dbFaqs] = await Promise.all([getServices(), getReviews({ limit: 6 }), getFaqsForServicesOverview()]);
  const faqs = dbFaqs.length ? buildFaqList([dbFaqs], Math.max(dbFaqs.length, 6)) : GENERAL_FAQS;
  const url = absoluteUrl("/services");
  const detailedServices = [
    {
      slug: "cockroach-control",
      title: "Cockroach control",
      description: "Cockroaches are commonly found around kitchens, bathrooms, drains and warm appliance spaces. A useful treatment plan begins by identifying activity and likely harbourages, then targets those areas while addressing food, water and entry points. Cleaning alone may reduce what you see, but does not always reach hidden harbourages or egg cases.",
      guidance: "Store food in closed containers, correct leaks where possible and follow the technician’s preparation and re-entry instructions. The method and any follow-up depend on the species, level of activity and layout of the property.",
    },
    {
      slug: "termite-control",
      title: "Termite inspection and treatment",
      description: "Termite activity can affect wooden furniture, door frames, skirting and other cellulose materials, sometimes with little visible warning. An inspection helps distinguish active termites from old damage, trace likely routes and determine whether the issue is localised or needs a broader treatment plan.",
      guidance: "Avoid disturbing suspected mud tubes or damaged wood before an assessment. The technician can explain the proposed treatment area, access requirements, warranty conditions and practical steps to reduce moisture and wood-to-soil contact.",
    },
    {
      slug: "bed-bugs-control",
      title: "Bed bug treatment",
      description: "Bed bugs hide in mattress seams, bed frames, furniture joints and cracks near sleeping areas. Effective control is based on inspection and careful preparation as well as treatment; moving infested items between rooms can spread the problem and make follow-up harder.",
      guidance: "Ask for the current preparation checklist before the visit, including how to handle bedding and clothing. Follow the written aftercare plan and any recommended inspection or repeat-visit schedule.",
    },
    {
      slug: "rodent-control",
      title: "Rat and rodent control",
      description: "Rodent control should address both signs of activity and the reasons rodents can enter or remain on a property. A site assessment checks likely access gaps, food sources, nesting areas and the safest suitable control options for homes, shops and shared premises.",
      guidance: "Keep food and waste securely covered, avoid touching droppings with bare hands and report where activity has been noticed. Exclusion and sanitation improvements are important parts of reducing the chance of a return.",
    },
    {
      slug: "mosquito-control",
      title: "Mosquito control",
      description: "Mosquitoes breed where suitable standing water collects, so treatment works best when inspection and source reduction accompany any control measures. Balconies, planters, roof areas, drains and shared outdoor spaces may all need checking.",
      guidance: "Empty or cover water-holding containers where practical and keep drainage clear. The technician will explain which areas need attention and any precautions that apply to the selected treatment.",
    },
    {
      slug: "wood-borer-control",
      title: "Wood borer treatment",
      description: "Small exit holes and fine powder around timber can indicate wood-boring insects, but similar signs may have other causes. Assessment helps identify affected wood, the likely extent of activity and whether treatment or replacement should be considered.",
      guidance: "Do not paint over fresh holes or discard affected timber before an inspection if you need the source identified. Treatment suitability depends on the wood, finish, accessibility and evidence of active infestation.",
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: pageTitle,
        description: pageDescription,
        inLanguage: "en-IN",
        about: { "@id": BUSINESS_ID },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: services.length,
          itemListElement: services.map((svc, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Service",
              name: svc.title,
              description: svc.shortDescription,
              url: absoluteUrl(`/services/${svc.slug}`),
              image: absoluteUrl(svc.image),
              provider: { "@id": BUSINESS_ID },
            },
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Services", item: url },
        ],
      },
      faqPageSchema(faqs, url),
    ],
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <JsonLd data={schema} />

      {/* 🟢 Page Header */}
      <section className="bg-green-800 py-16 md:py-24 relative overflow-hidden">
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-700 bg-green-900 px-4 py-2 text-sm font-semibold text-green-300">
            <Leaf size={16} /> Targeted, low-odour pest management
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            Pest Control Services in Mumbai
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            From termites and cockroaches to bed bugs, rodents, mosquitoes and wood borers — targeted treatments with registered products, a free inspection and a written warranty.
          </p>
          <div className="flex items-center justify-center gap-2 text-green-200 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Our Services</span>
          </div>
        </div>
      </section>

      {/* 🟢 Core Values / USPs Section */}
      <section className="bg-white border-b border-gray-200 py-12 relative z-20 -mt-8 mx-4 sm:mx-8 lg:mx-auto max-w-6xl rounded-2xl shadow-lg">
        <div className="grid gap-8 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Leaf className="text-green-600 mb-2" size={32} />
            <h3 className="font-bold text-gray-900 text-lg">Low-odour options</h3>
            <p className="text-sm text-gray-500">Treatment choices are explained for your property, with clear preparation and re-entry instructions.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Users className="text-green-600 mb-2" size={32} />
            <h3 className="font-bold text-gray-900 text-lg">In-House Technicians</h3>
            <p className="text-sm text-gray-500">Highly trained, police-verified staff. Absolutely no subcontractors used.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Shield className="text-green-600 mb-2" size={32} />
            <h3 className="font-bold text-gray-900 text-lg">Service Warranty</h3>
            <p className="text-sm text-gray-500">We provide free follow-up treatments if pests return within the warranty period.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Clock className="text-green-600 mb-2" size={32} />
            <h3 className="font-bold text-gray-900 text-lg">Upfront Pricing</h3>
            <p className="text-sm text-gray-500">Transparent quotes provided before we start any work. No hidden charges.</p>
          </div>
        </div>
      </section>

      <Services
        services={services}
        heading={<>Choose your <span className="text-green-600">pest problem</span></>}
        intro="Select a service to see how we treat it, how to prepare, what it costs to plan for, and answers to the 12 questions customers ask most."
      />

      <section className="bg-gray-50 py-16 md:py-24" aria-labelledby="service-guide-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-green-700">Pest management guide</p>
            <h2 id="service-guide-heading" className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Choose the right pest control service for your property
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Different pests need different inspection and treatment plans. We assess the signs, affected areas and conditions at your property before recommending a service, explaining the preparation needed and sharing aftercare in writing.
            </p>
          </header>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {detailedServices.map((item) => {
              const service = services.find((candidate) => candidate.slug === item.slug);
              return (
                <article key={item.slug} className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-700">{item.description}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{item.guidance}</p>
                  {service && (
                    <Link href={`/services/${service.slug}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-green-700 hover:text-green-900">
                      Explore {service.title} <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  )}
                </article>
              );
            })}
          </div>

          <div className="mt-10 grid gap-6 rounded-3xl border border-green-100 bg-green-50 p-6 sm:p-8 lg:grid-cols-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Homes and apartments</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-700">
                We plan around the affected rooms, household routines and access to kitchens, bedrooms, balconies and utility areas. Before treatment, tell us about children, pets, sensitive occupants and any previous pest-control work so the technician can explain relevant precautions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Societies and shared buildings</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-700">
                In multi-unit buildings, pests may move through common service areas or neighbouring spaces. A clear scope of work, access coordination and practical prevention steps help residents and facility teams understand which areas are included and what action may be needed after the visit.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Offices and commercial premises</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-700">
                Workplaces, restaurants, shops and storage areas have different operating hours and hygiene requirements. We discuss the site, access and suitable timing before confirming the service, and provide a written quote so the responsible team knows the treatment scope and follow-up recommendations.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-4xl">
            <h3 className="text-2xl font-bold text-gray-900">What to expect from a pest control visit</h3>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["1. Tell us what you have noticed", "Share the pest, affected rooms, signs of activity and your locality so we can arrange the right inspection."],
                ["2. Inspect and explain", "The technician assesses accessible areas, likely harbourages and contributing conditions, then explains suitable options."],
                ["3. Review the written quote", "You receive the proposed scope and price before work begins, including any relevant preparation or access needs."],
                ["4. Follow the aftercare plan", "After treatment, follow the instructions provided and contact the team if you have questions about the service or warranty."],
              ].map(([title, description]) => (
                <li key={title} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <h4 className="font-bold text-gray-900">{title}</h4>
                  <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{description}</p>
                </li>
              ))}
            </ol>
          </div>

          <p className="mx-auto mt-10 max-w-4xl text-center text-[15px] leading-relaxed text-gray-600">
            Eco-Friendly Pests provides pest control across Mumbai, Thane and Navi Mumbai. Treatment methods, preparation, timeframes and warranty terms vary by pest and property; your technician will confirm these details during the inspection. For a service in your area, <Link href="/service-locations" className="font-semibold text-green-700 underline decoration-green-300 underline-offset-2 hover:text-green-900">view our service locations</Link> or <Link href="/book-now" className="font-semibold text-green-700 underline decoration-green-300 underline-offset-2 hover:text-green-900">request an inspection</Link>.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20" aria-labelledby="services-faq-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-green-700">Our services</p>
            <h2 id="services-faq-heading" className="text-3xl font-bold text-gray-900">Frequently asked questions</h2>
          </div>
          <FaqAccordion faqs={faqs} group="services-faq" />
        </div>
      </section>

      <ReviewsSection
        heading="What our customers say"
        description="Published reviews from homes and businesses across Mumbai, Thane and Navi Mumbai."
        reviews={reviewData.reviews}
        stats={reviewData.stats}
      />

      {/* 🟢 Bottom CTA Section */}
      <section className="bg-gray-900 py-16 md:py-20 border-t-4 border-green-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-green-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10">
              <ShieldCheck size={200} className="-mr-10 -mt-10" />
            </div>
            
            <div className="relative z-10 md:max-w-lg text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get a Free Inspection & Quote</h2>
              <p className="text-green-100 text-lg">
                Tell us the pest and your area — we call back with a time slot and an upfront price. No hidden fees.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col gap-4 w-full md:w-auto">
              <Link 
                href="/book-now"
                className="bg-white text-green-800 text-center hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                Book Inspection Now <ArrowRight size={20} />
              </Link>
              <Link 
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-700 border-2 border-green-500 text-white text-center hover:bg-green-600 px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <PhoneCall size={20} /> WhatsApp Us
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}