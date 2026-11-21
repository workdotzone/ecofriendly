import Link from "next/link";
import PageFaqSection from "@/components/faq/PageFaqSection";
import { ArrowRight, BadgeCheck, Building2, CheckCircle2, MapPin, PhoneCall, ShieldCheck, Star } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { getClients, getLocations, getReviews, getServices } from "@/lib/data";

const siteUrl = "https://ecofriendlypests.com";

export default async function ServiceLocationsPage() {
  const [locationList, serviceList, reviewData, clientList] = await Promise.all([getLocations(), getServices(), getReviews({ limit: 6 }), getClients()]);
  const locations = locationList.map((l) => ({ _id: l.id, name: l.name, slug: l.slug }));
  const services = serviceList.map((s) => ({ _id: s.id, title: s.title, name: s.title, slug: s.slug }));
  const testimonials = reviewData.reviews.map((r) => ({ _id: r.id, name: r.name, designation: r.designation, service: r.service, rating: r.rating, text: r.text }));
  const clients = clientList.map((c) => ({ _id: c.id, name: c.name, image: c.image }));

  const baseServices = services.filter((service) => !service.slug.includes("-in-"));
  const validServices = baseServices.filter((service) =>
    Boolean(service.slug && (service.title?.trim() || service.name?.trim())),
  );
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/service-locations#webpage`,
    "name": "Pest Control Service Locations in Mumbai and Maharashtra",
    "description": "Find eco-friendly pest control services in Mumbai, Thane, Navi Mumbai and nearby Maharashtra locations.",
    "url": `${siteUrl}/service-locations`,
    "inLanguage": "en-IN",
    "publisher": { "@id": `${siteUrl}/#organization` },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Pest control locations served",
      "numberOfItems": locations.length,
      "itemListElement": locations.map((location, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": `Pest Control in ${location.name}`,
        "url": `${siteUrl}/service-locations/${location.slug}`,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData).replace(/</g, "\\u003c") }}
      />

      <section className="relative overflow-hidden bg-green-950 py-16 md:py-24">
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-900 px-4 py-2 text-sm font-semibold text-green-200">
            <MapPin size={16} /> Serving Mumbai, Thane and Navi Mumbai
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
            Pest Control Service Locations
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-green-100 md:text-xl">
            Looking for pest control near you? Eco-Friendly Pests provides residential and commercial pest management across Mumbai,
            Thane, Navi Mumbai and surrounding areas. Choose your neighborhood to see local services, treatment information and FAQs.
          </p>
          <Link
            href="/book-now"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-500 px-7 py-4 font-bold text-white shadow-lg transition hover:bg-green-400"
          >
            Book a free inspection <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8" aria-labelledby="areas-heading">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 id="areas-heading" className="text-3xl font-extrabold text-gray-900 md:text-4xl">
            Find Pest Control in Your Area
          </h2>
          <p className="mt-4 leading-relaxed text-gray-600">
            Select your area for location-specific pest control information. Each page explains available treatments and how to arrange an inspection.
          </p>
        </div>

        {locations.length > 0 ? (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <article
                key={location._id.toString()}
                className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-xl"
              >
                <Link
                  href={`/service-locations/${location.slug}`}
                  className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-5"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700 transition group-hover:bg-green-600 group-hover:text-white">
                    <MapPin size={23} />
                  </span>
                  <h3 className="text-xl font-bold capitalize text-gray-900 group-hover:text-green-700">
                    Pest Control in {location.name}
                  </h3>
                </Link>

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Popular services in {location.name}
                </p>
                <ul className="mb-7 flex-grow space-y-3">
                  {validServices.slice(0, 4).map((service) => {
                    const baseSlug = service.slug.split("-in-")[0];
                    return (
                      <li key={service._id.toString()}>
                      <Link
                        href={`/services/${baseSlug}-in-${location.slug}`}
                        className="flex items-start gap-2 text-sm font-medium text-gray-600 transition hover:text-green-700"
                      >
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-600" />
                        {service.title || service.name}
                      </Link>
                      </li>
                    );
                  })}
                </ul>

                <Link
                  href={`/service-locations/${location.slug}`}
                  className="inline-flex items-center gap-2 border-t border-gray-100 pt-4 text-sm font-bold text-green-700"
                >
                  Explore {location.name} services <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-white p-8 text-center text-gray-600">
            Service areas are currently being updated. Please call us to confirm availability.
          </p>
        )}
      </section>

      <section className="bg-white py-16 md:py-20" aria-labelledby="why-choose-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
              <BadgeCheck size={17} /> Local service, clear guidance
            </span>
            <h2 id="why-choose-heading" className="text-3xl font-extrabold text-gray-900 md:text-4xl">
              Why Choose Eco-Friendly Pests?
            </h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              Effective pest management starts with identifying the pest and understanding the property. Our team helps residential and
              commercial customers choose a suitable treatment and understand preparation, safety precautions and aftercare.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["Inspection-led recommendations", "Treatment guidance is based on the pest, affected areas and conditions found at the property."],
              ["Solutions for homes and businesses", "Service options for apartments, houses, offices, restaurants and other commercial spaces."],
              ["Eco-conscious treatment options", "Ask our team about odorless and targeted treatment options suitable for your pest concern."],
              ["Clear preparation and aftercare", "Technicians explain relevant preparation steps and practical guidance after the treatment."],
              ["Local area coverage", "Browse neighborhood pages to find service information for your part of Mumbai and nearby areas."],
              ["Convenient booking", "Contact the team to arrange an inspection and discuss the next steps for your property."],
            ].map(([title, description]) => (
              <article key={title} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <CheckCircle2 className="mb-4 text-green-600" size={25} />
                <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {clients.length > 0 && (
        <section className="border-y border-gray-100 bg-white py-12" aria-labelledby="client-logos-heading">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 id="client-logos-heading" className="mb-8 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-gray-500">
              <Building2 size={18} /> Clients who have worked with us
            </h2>
            <ul className="flex flex-wrap items-center justify-center gap-5">
              {clients.map((client) => (
                <li key={client._id.toString()} className="flex h-24 w-40 items-center justify-center rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <SmartImage
                    src={client.image}
                    alt={`${client.name} logo`}
                    width={150}
                    height={90}
                    sizes="150px"
                    className="max-h-full max-w-full object-contain"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="bg-green-950 py-16 md:py-20" aria-labelledby="customer-reviews-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 id="customer-reviews-heading" className="text-3xl font-extrabold text-white md:text-4xl">
                Customer Reviews
              </h2>
              <p className="mt-4 text-green-100">
                Recent customer experiences with Eco-Friendly Pests. Each review retains its original service and location.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => {
                const rating = Math.max(0, Math.min(5, testimonial.rating ?? 5));
                return (
                  <article key={testimonial._id.toString()} className="rounded-2xl bg-white p-7 shadow-xl">
                    <div className="mb-5 flex gap-1 text-yellow-400" aria-label={`${rating} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={17} fill={star <= rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <blockquote className="mb-6 leading-relaxed text-gray-700">
                      &ldquo;{testimonial.text}&rdquo;
                    </blockquote>
                    <div className="border-t border-gray-100 pt-5">
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {[testimonial.service, testimonial.designation].filter(Boolean).join(" - ")}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="mt-9 text-center">
              <Link href="/testimonials" className="font-semibold text-white underline decoration-green-400 underline-offset-4 hover:text-green-200">
                Read more customer reviews <ArrowRight className="ml-1 inline" size={17} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="border-t-4 border-green-600 bg-gray-900 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <ShieldCheck className="mx-auto mb-6 text-green-500" size={56} />
          <h2 className="mb-6 text-3xl font-bold text-white">Need pest control in an area not listed?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-300">
            Contact our team to check service availability in your neighborhood and arrange an inspection.
          </p>
          <a
            href="tel:+919453394533"
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-green-500"
          >
            <PhoneCall size={20} /> Call +91-94533 94533
          </a>
        </div>
      </section>
      <PageFaqSection page="areas" path="/service-locations" />
    </div>
  );
}
