import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BadgeCheck, Building2, Eye, Heart, Home, Leaf, MapPin,
  PhoneCall, ShieldCheck, Target,
} from "lucide-react";
import Clients from "@/components/home/Clients";
import PageFaqSection from "@/components/faq/PageFaqSection";
import { JsonLd } from "@/components/faq/FaqAccordion";
import { getClients, getLocations, getServices } from "@/lib/data";
import { BUSINESS_ID, SITE, SITE_URL, absoluteUrl } from "@/lib/site";

const pageTitle = "About Eco-Friendly Pests | Pest Control in Mumbai";
const pageDescription =
  "Learn about Eco-Friendly Pests, a pest management company serving homes and businesses in Mumbai, Thane and Navi Mumbai. See our services, approach and client logos.";
const aboutUrl = absoluteUrl("/about");

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  keywords: [
    "pest control company in Mumbai",
    "about Eco-Friendly Pests",
    "pest management in Mumbai",
    "pest control in Thane",
    "pest control in Navi Mumbai",
    "residential and commercial pest control",
  ],
  alternates: { canonical: aboutUrl },
  openGraph: {
    type: "website",
    title: pageTitle,
    description: pageDescription,
    url: aboutUrl,
    siteName: SITE.name,
    locale: "en_IN",
    images: [{ url: "/banner.png", width: 1672, height: 941, alt: "Eco-Friendly Pests pest control services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/banner.png"],
  },
};

const principles = [
  {
    icon: Target,
    title: "Inspect before recommending",
    text: "We begin by understanding the pest activity, affected areas and property needs before explaining the proposed treatment.",
  },
  {
    icon: ShieldCheck,
    title: "Clear treatment guidance",
    text: "Our team explains preparation, product use, re-entry and aftercare instructions relevant to the selected service.",
  },
  {
    icon: Heart,
    title: "Respect for your space",
    text: "We coordinate access and timing with residents, facility teams and business operations wherever practical.",
  },
];

const process = [
  {
    title: "Tell us what you are seeing",
    text: "Share the pest, signs of activity, affected rooms or work areas and your locality when you contact us.",
  },
  {
    title: "Arrange an inspection",
    text: "We review accessible areas and discuss the conditions that may be contributing to the pest issue.",
  },
  {
    title: "Review the service plan",
    text: "Before work begins, we explain the recommended scope, written quote, preparation and any relevant follow-up.",
  },
  {
    title: "Follow the aftercare advice",
    text: "After the visit, use the service instructions provided and contact our team if you have questions.",
  },
];

export default async function AboutPage() {
  const [clients, locations, services] = await Promise.all([
    getClients(),
    getLocations(),
    getServices(),
  ]);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${aboutUrl}#webpage`,
        url: aboutUrl,
        name: pageTitle,
        description: pageDescription,
        inLanguage: "en-IN",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": BUSINESS_ID },
        mainEntity: { "@id": BUSINESS_ID },
        primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl("/banner.png") },
        breadcrumb: { "@id": `${aboutUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${aboutUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "About", item: aboutUrl },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd data={schema} />

      <section className="overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
          <div>
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-green-100">
              <ol className="flex flex-wrap items-center gap-2">
                <li><Link href="/" className="hover:text-white hover:underline">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="font-semibold text-white">About us</li>
              </ol>
            </nav>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-green-50">
              <Leaf size={17} aria-hidden="true" /> Pest management for homes and businesses
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              About Eco-Friendly Pests
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-green-50 sm:text-xl">
              We provide pest control services for residential and commercial properties across Mumbai, Thane and Navi Mumbai. Every visit starts with understanding the pest problem and the needs of the site.
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-green-100">
              From a home treatment to a scheduled business service, our team explains the proposed work, preparation and aftercare so you can make an informed decision.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/book-now" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-green-900 shadow-lg transition hover:bg-green-50">
                Request an inspection <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href={SITE.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-6 py-3.5 font-bold text-white transition hover:bg-white/10">
                <PhoneCall size={18} aria-hidden="true" /> {SITE.phoneDisplay}
              </a>
            </div>
          </div>

          <figure className="overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
            <div className="relative aspect-[16/10] w-full sm:aspect-video">
              <Image
                src="/banner.png"
                alt="Pest control professional and residential pest management services"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-contain"
              />
            </div>
            <figcaption className="border-t border-gray-100 px-5 py-4 text-sm leading-relaxed text-gray-600 sm:px-6">
              Pest treatment is planned around the pest, the property and the areas that need attention.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20" aria-labelledby="about-company-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-green-700">Who we are</p>
            <h2 id="about-company-heading" className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
              A local pest control company focused on practical service
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-700 sm:text-lg">
              <p>
                Eco-Friendly Pests helps households, housing societies and workplaces manage common pest problems. Our service coverage includes Mumbai, Thane and Navi Mumbai, with pest-specific options for issues such as cockroaches, termites, bed bugs, rodents, mosquitoes and wood borers.
              </p>
              <p>
                No two properties are exactly alike. The source of activity, building layout, access, occupants and previous treatments can all affect the right next step. We ask about these details, inspect the relevant areas where possible and explain the options before treatment is carried out.
              </p>
              <p>
                We believe good pest management includes more than a product application. Clear communication about the work, preparation, safety directions, prevention and follow-up helps customers know what to expect before and after a visit.
              </p>
            </div>
          </div>

          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {principles.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-7">
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-20" aria-labelledby="about-services-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-green-700">What we do</p>
            <h2 id="about-services-heading" className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Pest control for homes, societies and workplaces
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
              Our technicians assess the reported activity and explain a service suited to the pest and premises. Explore our treatments for service details, preparation advice and frequently asked questions.
            </p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <li key={service.id}>
                <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-7">
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-gray-600">{service.shortDescription}</p>
                  <Link href={`/services/${service.slug}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-green-700 hover:text-green-900">
                    View service details <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </article>
              </li>
            ))}
          </ul>
          <div className="mt-8 text-center">
            <Link href="/services" className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-700 px-5 py-3 font-semibold text-green-800 transition hover:bg-green-50">
              View all pest control services <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20" aria-labelledby="about-process-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-green-700">Our approach</p>
            <h2 id="about-process-heading" className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What to expect when you book pest control
            </h2>
          </div>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-lg font-bold text-white" aria-hidden="true">
                  {index + 1}
                </span>
                <h3 className="font-bold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-8 max-w-4xl text-center text-sm leading-relaxed text-gray-600">
            The treatment method, preparation, re-entry directions and any warranty depend on the service and site conditions. Your technician will provide the instructions relevant to your visit.
          </p>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-white py-16 md:py-20" aria-labelledby="about-clients-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-green-700">Client relationships</p>
            <h2 id="about-clients-heading" className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Supporting businesses and residential communities
            </h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              We work with property owners, facility teams and businesses to plan pest management around their premises and operating needs. The client logos below are drawn from our current client portfolio; the services and visit schedules are agreed for each site.
            </p>
          </div>
          {clients.length > 0 ? (
            <Clients clients={clients} heading="Client logos" />
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
              <Building2 size={32} className="mx-auto text-green-700" aria-hidden="true" />
              <p className="mt-3 font-semibold text-gray-900">Our client portfolio is being updated.</p>
              <p className="mt-2 text-sm text-gray-600">Contact our team to discuss pest management for your home, society or business.</p>
              <Link href="/contact" className="mt-4 inline-flex items-center gap-2 font-semibold text-green-700 hover:text-green-900">
                Contact us <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-green-950 py-16 text-white md:py-20" aria-labelledby="about-areas-heading">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-green-300">Where we work</p>
            <h2 id="about-areas-heading" className="text-3xl font-extrabold sm:text-4xl">
              Pest control across Mumbai and nearby areas
            </h2>
            <p className="mt-4 leading-relaxed text-green-100">
              Our team serves residential and commercial customers across Mumbai, Thane and Navi Mumbai. Availability depends on the locality, service type and appointment schedule. Check the current service-area directory or contact us to confirm coverage for your address.
            </p>
            {locations.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {locations.slice(0, 12).map((location) => (
                  <li key={location.id}>
                    <Link href={`/service-locations/${location.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm text-green-50 transition hover:bg-white/20">
                      <MapPin size={14} aria-hidden="true" /> {location.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/service-locations" className="mt-6 inline-flex items-center gap-2 font-semibold text-white underline decoration-green-400 underline-offset-4 hover:text-green-200">
              Browse all service locations <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
              <Home className="mb-4 text-green-300" size={28} aria-hidden="true" />
              <h3 className="font-bold">Residential pest control</h3>
              <p className="mt-2 text-sm leading-relaxed text-green-100">Pest inspections and treatments for homes, apartments and shared residential spaces.</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
              <Building2 className="mb-4 text-green-300" size={28} aria-hidden="true" />
              <h3 className="font-bold">Commercial pest management</h3>
              <p className="mt-2 text-sm leading-relaxed text-green-100">Site-specific service planning for offices, hospitality, retail and other workplaces.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-20" aria-labelledby="about-values-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-green-700">What guides our work</p>
            <h2 id="about-values-heading" className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our mission, vision and values
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Target, title: "Our mission", text: "Help customers manage pest problems with clear communication, practical treatment plans and useful prevention advice." },
              { icon: Eye, title: "Our vision", text: "Build long-term customer trust through consistent service, careful site assessments and responsible pest management." },
              { icon: Heart, title: "Our values", text: "Respect every property, explain recommendations honestly and keep customers informed throughout the service." },
            ].map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                <Icon className="mb-5 text-green-700" size={30} aria-hidden="true" />
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <p className="mt-3 leading-relaxed text-gray-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-green-800 py-14 text-white md:py-16" aria-labelledby="about-cta-heading">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:flex-row lg:justify-between lg:text-left lg:px-8">
          <div>
            <p className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider text-green-200 lg:justify-start">
              <BadgeCheck size={17} aria-hidden="true" /> Talk with our team
            </p>
            <h2 id="about-cta-heading" className="text-3xl font-extrabold sm:text-4xl">Need help with a pest problem?</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-green-100">
              Tell us what you have noticed and where you are located. We can help you choose the next step and arrange an inspection.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/book-now" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-green-900 transition hover:bg-green-50">
              Book an inspection <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <a href={SITE.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-6 py-3.5 font-bold text-white transition hover:bg-white/10">
              <PhoneCall size={17} aria-hidden="true" /> Call {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <PageFaqSection page="about" path="/about" />
    </div>
  );
}
