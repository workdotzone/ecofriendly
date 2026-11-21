import Image from "next/image";
import { CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import LeadForm from "@/components/forms/LeadForm";
import { Stars } from "@/components/reviews/ReviewsSection";
import type { ReviewStats } from "@/lib/data";
import { SITE } from "@/lib/site";
import banner from "@/public/banner.webp";

/**
 * Homepage hero (server component). The banner is the LCP element:
 * statically imported (intrinsic size known → zero CLS, blur placeholder), preloaded with high priority,
 * and served at the right width for each device via `sizes="100vw"`.
 * The rating badge uses real review data — it is hidden when there are no published reviews.
 */
export default function Hero({ services, stats }: { services: string[]; stats: ReviewStats }) {
  return (
    <section className="flex w-full flex-col bg-gray-50">
      <div className="w-full">
        <Image
          src={banner}
          alt="Eco-Friendly Pests technician spraying a living room — pest control for cockroaches, ants, mosquitoes, rats and termites in Mumbai"
          preload
          fetchPriority="high"
          placeholder="blur"
          sizes="100vw"
          className="h-auto w-full"
        />
      </div>

      <div className="mx-auto mb-6 mt-8 w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Eco-Friendly <span className="text-green-600">Pest Control in Mumbai</span>
        </h1>
        <p id="home-summary" className="mx-auto max-w-4xl text-base leading-relaxed text-gray-600 sm:text-lg">
          {SITE.name} provides odourless, low-toxicity pest control for homes and businesses across Mumbai, Thane and Navi Mumbai —
          termite, cockroach, bed bug, rodent, mosquito and wood borer treatment by trained in-house technicians, with a free
          inspection and a fixed written quote before any work begins.
        </p>
        {stats.count > 0 && (
          <a href="#reviews" className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 text-sm">
            <Stars rating={stats.average} size={20} />
            <span className="font-bold text-gray-800">
              Rated {stats.average.toFixed(1)}/5 from {stats.count} customer {stats.count === 1 ? "review" : "reviews"}
            </span>
          </a>
        )}
      </div>

      <div className="relative z-20 mx-auto mb-16 mt-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl lg:flex-row">
          <div className="flex flex-col justify-center border-b border-gray-100 bg-green-50/50 p-6 sm:p-10 lg:w-1/2 lg:border-b-0 lg:border-r">
            <p className="mb-6 inline-flex items-center gap-2 self-start rounded-md bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-800 sm:text-sm">
              <MapPin size={16} aria-hidden="true" /> Serving Mumbai, Thane &amp; Navi Mumbai
            </p>
            <h2 className="mb-4 text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">
              Complete <span className="text-green-600">pest control</span> for homes &amp; businesses
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-gray-600 sm:mb-8 sm:text-base">
              Registered products, targeted application and clear safety instructions — so your family, staff and pets stay safe while pests are removed.
            </p>
            <ul className="space-y-3 text-sm font-medium text-gray-700 sm:text-base">
              <li className="flex items-center gap-3"><CheckCircle2 className="shrink-0 text-green-600" size={20} aria-hidden="true" /> Odourless gel &amp; bait treatments — no need to vacate</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="shrink-0 text-green-600" size={20} aria-hidden="true" /> Safe-use guidance for children &amp; pets</li>
              <li className="flex items-center gap-3"><ShieldCheck className="shrink-0 text-green-600" size={20} aria-hidden="true" /> Written warranty on every service plan</li>
            </ul>
          </div>

          <div className="flex flex-col justify-center bg-white p-6 sm:p-10 lg:w-1/2">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Book a free inspection</h2>
              <p className="mt-1 text-sm text-gray-500">Get a call back from our team — Mon–Sat, 9 am to 9 pm.</p>
            </div>
            <LeadForm services={services} />
          </div>
        </div>
      </div>
    </section>
  );
}
