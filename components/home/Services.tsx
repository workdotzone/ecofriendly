import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import type { PublicService } from "@/lib/data";

/**
 * Service cards — rendered on the server from the database (via lib/data getServices()).
 * Shows every active service, in the admin-defined order. No client fetch, so cards, links
 * and images are in the initial HTML for search engines and AI crawlers.
 */
export default function Services({
  services,
  headingLevel = "h2",
  heading,
  intro,
  viewAllHref,
}: {
  services: PublicService[];
  headingLevel?: "h1" | "h2";
  heading?: React.ReactNode;
  intro?: string;
  viewAllHref?: string;
}) {
  const Heading = headingLevel;
  return (
    <section id="services" className="w-full scroll-mt-32 bg-white py-16 md:py-24" aria-labelledby="services-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <Heading id="services-heading" className="mb-4 text-3xl font-extrabold text-gray-900 md:text-4xl">
            {heading ?? (<>Our <span className="text-green-600">Pest Control Services</span> in Mumbai</>)}
          </Heading>
          <p className="text-lg text-gray-600">
            {intro ?? "Targeted, low-odour treatments for every common pest — each starts with a free inspection and a fixed written quote."}
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {services.map((service, index) => (
            <li key={service.id} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                <Link href={`/services/${service.slug}`} className="relative block aspect-[3/2] w-full overflow-hidden bg-gray-100" tabIndex={-1} aria-hidden="true">
                  <SmartImage
                    src={service.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    // First row may be near the fold on desktop; everything else lazy-loads.
                    loading={index < 3 ? "eager" : "lazy"}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </Link>
                <div className="flex flex-grow flex-col p-6">
                  <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-green-700">
                    <Link href={`/services/${service.slug}`} className="focus:outline-none focus-visible:underline">
                      {service.title}
                    </Link>
                  </h3>
                  <p className="mb-6 line-clamp-4 flex-grow text-[15px] leading-relaxed text-gray-600">{service.shortDescription}</p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-auto inline-flex items-center gap-2 font-semibold text-green-700 transition-colors hover:text-green-900"
                  >
                    Explore<span className="sr-only"> about {service.title}</span> <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
        {viewAllHref && (
          <div className="mt-10 text-center">
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-bold text-white transition-colors hover:bg-green-800"
            >
              View all services <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
