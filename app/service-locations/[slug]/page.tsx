import { Metadata } from 'next';
import SmartImage from '@/components/ui/SmartImage';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, ShieldCheck, PhoneCall, CheckCircle2, ArrowRight, Star, Quote, Building2, BadgeCheck } from 'lucide-react';
import { getFaqsForLocation } from '@/lib/faqs';
import { getClients, getLocationBySlug, getLocationSlugs, getReviews, getServices } from '@/lib/data';


type ServiceSummary = {
  _id: string;
  title?: string;
  name?: string;
  slug: string;
};

type ReviewSummary = {
  _id?: string;
  name: string;
  designation?: string;
  location?: string;
  service?: string;
  rating?: number;
  text: string;
};

type ClientLogo = {
  _id: string;
  name: string;
  image: string;
};



// Known slugs are fully prerendered (generateStaticParams). Reading `params` at the top of the page is
// intentional: it lets notFound()/redirects run before streaming, so crawlers get real 404/308 status codes.
export const instant = false;

export async function generateStaticParams() {
  const slugs = await getLocationSlugs();
  // Cache Components requires at least one param; unknown slugs still render on demand.
  return (slugs.length ? slugs : ['mumbai']).map((slug) => ({ slug }));
}

async function loadLocation(slug: string) {
  try {
    return await getLocationBySlug(slug);
  } catch (error) {
    console.error(`Failed to load location "${slug}":`, error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const loc = await loadLocation(slug);
  if (!loc) return { title: 'Location not found', robots: { index: false, follow: true } };

  const isWorli = loc.slug.toLowerCase() === 'worli';
  const rawTitle = isWorli
    ? 'Pest Control in Worli | Eco-Friendly Pests'
    : loc.metaTitle || `Pest Control in ${loc.name} | Eco-Friendly Pests`;
  // Admin titles often already end with the brand — never append it twice.
  const title = /eco[- ]?friendly pests/i.test(rawTitle) ? rawTitle : `${rawTitle} | Eco-Friendly Pests`;
  const description = isWorli
    ? 'Looking for pest control in Worli? Get safe, odorless, eco-friendly termite, rodent, cockroach and mosquito treatments with free inspection.'
    : loc.metaDescription || loc.shortDescription || `Eco-friendly pest control in ${loc.name}, Mumbai. Free inspection and written quote.`;
  const canonicalUrl = `https://ecofriendlypests.com/service-locations/${loc.slug}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { type: 'website', locale: 'en_IN', title, description, url: canonicalUrl, siteName: 'Eco-Friendly Pests', images: [{ url: '/og/default.jpg', width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function LocationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loc = await loadLocation(slug);
  if (!loc) notFound();
  const isWorli = loc.slug.toLowerCase() === 'worli';

  const [publicServices, reviewData, clients] = await Promise.all([getServices(), getReviews({ limit: 6 }), getClients()]);
  const services: ServiceSummary[] = publicServices.map((s) => ({ _id: s.id, title: s.title, slug: s.slug }));
  const reviews: ReviewSummary[] = reviewData.reviews.map((r) => ({ _id: r.id, name: r.name, designation: r.designation, service: r.service, rating: r.rating, text: r.text }));
  const clientLogos: ClientLogo[] = clients.map((c) => ({ _id: c.id, name: c.name, image: c.image }));

  let faqs: { question: string; answer: string }[] = [];
  try {
    faqs = await getFaqsForLocation(loc.slug.toLowerCase());
  } catch (error) {
    console.error(`Failed to load FAQs for location "${slug}":`, error);
  }

  // Filter valid services
  const validServices = services.filter((service) => Boolean(service.title?.trim() || service.name?.trim()));
  const featuredReviews = reviews.slice(0, 6);

  const localSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://ecofriendlypests.com/service-locations/${loc.slug}#webpage`,
        "name": isWorli ? "Pest Control in Worli" : (loc.metaTitle || `Pest Control in ${loc.name}`),
        "description": isWorli
          ? "Looking for pest control in Worli? Get safe, odorless, eco-friendly pest treatments with free inspection."
          : (loc.metaDescription || loc.shortDescription),
        "url": `https://ecofriendlypests.com/service-locations/${loc.slug}`,
        "inLanguage": "en-IN",
      },
      {
        "@type": "Service",
        "@id": `https://ecofriendlypests.com/service-locations/${loc.slug}#service`,
        "name": `Pest Control in ${loc.name}`,
        "serviceType": "Pest control",
        "description": loc.metaDescription || loc.shortDescription,
        "areaServed": {
          "@type": "City",
          "name": loc.name,
        },
        "provider": {
          "@type": "Organization",
          "name": "Eco-Friendly Pests",
          "url": "https://ecofriendlypests.com",
        },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ecofriendlypests.com/" },
          { "@type": "ListItem", "position": 2, "name": "Locations", "item": "https://ecofriendlypests.com/service-locations" },
          { "@type": "ListItem", "position": 3, "name": loc.name, "item": `https://ecofriendlypests.com/service-locations/${loc.slug}` },
        ],
      },
      {
        "@type": "HowTo",
        "name": `How to book pest control in ${loc.name}`,
        "description": `A simple process for arranging an eco-friendly pest inspection and treatment in ${loc.name}.`,
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Request an inspection",
            "text": `Book a free pest inspection for your property in ${loc.name}.`,
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Identify the pest concern",
            "text": "A trained technician assesses the infestation, affected areas and suitable treatment method.",
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Complete treatment",
            "text": "The team applies the recommended odorless or eco-friendly treatment and explains aftercare.",
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Follow-up support",
            "text": "Request follow-up support according to the service warranty and pest activity.",
          },
        ],
      },
    ],
  };
  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  } : null;
  const faqMidpoint = Math.ceil(faqs.length / 2);
  const faqColumns = [faqs.slice(0, faqMidpoint), faqs.slice(faqMidpoint)];

  return (
    <div className="bg-gray-50 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <section className="bg-green-900 py-16 md:py-24 relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <nav className="text-green-300 text-sm mb-6 flex items-center justify-center gap-2 font-medium">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <Link href="/service-locations" className="hover:text-white">Locations</Link>
            <span>›</span>
            <span className="text-white capitalize">{loc.name}</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-800 text-green-200 rounded-full font-semibold text-sm mb-6 shadow-sm">
            <MapPin size={16} /> Serving {loc.name} Area
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            {isWorli ? 'Pest Control in Worli' : (loc.heading || `Pest Control in ${loc.name}`)}
          </h1>
          
          <p className="text-lg md:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
            {isWorli
              ? 'Looking for pest control in Worli? Eco-Friendly Pests provides safe, odorless and eco-friendly protection for homes, offices and luxury residences.'
              : loc.shortDescription}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {isWorli ? 'Pest Control Services in Worli' : `Expert Eradication in ${loc.name}`}
            </h2>
            
            <div 
              className="prose prose-lg text-gray-600 mb-10 whitespace-pre-wrap leading-loose"
              dangerouslySetInnerHTML={{ __html: loc.detailedContent || 'Detailed information coming soon.' }}
            />

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Top Services we offer in {loc.name}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {validServices.slice(0, 6).map((service) => (
                  <Link 
                    key={service._id} 
                    href={`/services/${service.slug}-in-${loc.slug}`}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-green-50 hover:text-green-700 transition-colors border border-transparent hover:border-green-200 group"
                  >
                    <CheckCircle2 className="text-green-500 group-hover:scale-110 transition-transform" size={20} />
                    <span className="font-semibold text-gray-700 group-hover:text-green-700">{service.title || service.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl p-8 border-[5px] border-green-50 shadow-xl text-center">
              <ShieldCheck size={50} className="text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pest Problem?</h3>
              <p className="text-gray-500 mb-6 text-sm">
                Fast & reliable service in {loc.name}. Get a free inspection today.
              </p>
              
              <Link href="/book-now" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl mb-4 transition-colors shadow-md flex items-center justify-center gap-2">
                Book Inspection <ArrowRight size={18} />
              </Link>
              
              <a href="tel:+919453394533" className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 border border-blue-200">
                <PhoneCall size={18} /> +91-94533 94533
              </a>
            </div>
          </div>

        </div>
      </section>

      <section className="bg-white py-16 md:py-20" aria-labelledby="why-choose-location-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
              <BadgeCheck size={17} /> Local pest control expertise
            </span>
            <h2 id="why-choose-location-heading" className="text-3xl font-extrabold text-gray-900 md:text-4xl">
              Why Choose Eco-Friendly Pests in {loc.name}?
            </h2>
            {isWorli && (
              <p className="mt-5 leading-relaxed text-gray-600">
                Worli properties range from high-rise apartments and luxury residences to commercial offices and hospitality spaces.
                Pest control in this area requires careful planning for basements, terraces, kitchens, storage areas and dense vertical structures.
                Our technicians recommend a treatment based on the pest, property layout and infestation level.
              </p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              ['Eco-friendly treatments', 'Odorless, targeted solutions selected with children, pets and sensitive spaces in mind.'],
              ['Property-specific inspection', 'Treatment planning based on the actual pest, entry points and conditions in your property.'],
              ['Experienced technicians', 'Trained teams follow treatment protocols and explain preparation and aftercare clearly.'],
              ['Residential and commercial care', 'Support for apartments, offices, restaurants, retail spaces and corporate properties.'],
              ['Service warranty guidance', 'Clear guidance on protection periods and follow-up support for eligible treatments.'],
              ['Flexible local scheduling', 'Inspection and service appointments arranged around your location and availability.'],
            ].map(([title, description]) => (
              <article key={title} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <CheckCircle2 size={23} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="location-process-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 id="location-process-heading" className="text-3xl font-extrabold text-gray-900">
              Pest Control Process in {loc.name}
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-gray-600">
              A clear inspection-to-follow-up process helps us address the cause of the infestation, not just the visible pests.
            </p>
          </div>
          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              ['1', 'Book inspection', 'Choose a convenient time for a pest assessment.'],
              ['2', 'Inspect property', 'We identify the pest, active areas and likely entry or breeding points.'],
              ['3', 'Apply treatment', 'Targeted eco-friendly methods are used based on the diagnosed issue.'],
              ['4', 'Prevent recurrence', 'Receive practical aftercare and follow-up guidance for the selected service.'],
            ].map(([number, title, description]) => (
              <li key={number} className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-extrabold text-white">
                  {number}
                </span>
                <h3 className="mb-2 font-bold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {clientLogos.length > 0 && (
        <section className="bg-white py-12" aria-labelledby="client-logos-heading">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 id="client-logos-heading" className="mb-8 flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest text-gray-500">
              <Building2 size={18} /> Trusted by clients across Maharashtra
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {clientLogos.map((logo) => (
                <div key={logo._id} className="flex h-24 w-36 items-center justify-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <SmartImage
                    src={logo.image}
                    alt={`${logo.name} logo`}
                    width={140}
                    height={96}
                    sizes="140px"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredReviews.length > 0 && (
        <section className="bg-green-950 py-16 md:py-20" aria-labelledby="location-reviews-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 id="location-reviews-heading" className="text-3xl font-extrabold text-white">
                Customer Reviews
              </h2>
              <p className="mt-4 text-green-100">
                {featuredReviews.length} customer experiences shared with Eco-Friendly Pests.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredReviews.map((review) => (
                <article key={review._id || review.name} className="relative rounded-2xl border border-white/10 bg-white p-7 shadow-xl">
                  <Quote className="absolute right-6 top-6 text-green-100" size={48} />
                  <div className="mb-5 flex gap-1 text-yellow-400" aria-label={`${review.rating || 5} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={17} fill={star <= Math.max(0, Math.min(5, review.rating || 5)) ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <blockquote className="mb-6 leading-relaxed text-gray-700">&ldquo;{review.text}&rdquo;</blockquote>
                  <div className="border-t border-gray-100 pt-5">
                    <p className="font-bold text-gray-900">{review.name}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {[review.service, review.location || review.designation].filter(Boolean).join(' - ')}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-9 text-center">
              <Link href="/testimonials" className="inline-flex items-center gap-2 font-semibold text-white underline decoration-green-400 underline-offset-4 hover:text-green-200">
                Read more customer reviews <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="bg-white py-16 md:py-20" aria-labelledby="location-faq-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 id="location-faq-heading" className="mb-8 text-center text-3xl font-bold text-gray-900">
              Pest Control FAQs in {loc.name}
            </h2>
            <div className="grid items-start gap-4 md:grid-cols-2 md:gap-6">
              {faqColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="space-y-4">
                  {column.map((faq, index) => (
                    <details key={`${faq.question}-${columnIndex}-${index}`} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                      <summary className="cursor-pointer font-semibold text-gray-900">{faq.question}</summary>
                      <p className="mt-3 leading-relaxed text-gray-600">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}