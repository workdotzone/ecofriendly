import Link from "next/link";
import Image from "next/image";
import { cacheLife } from "next/cache";
import { ChevronRight, Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { FaFacebook, FaGoogle, FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from "react-icons/fa6";
import type { LocationLink } from "@/lib/data";
import type { NavLink } from "./Navbar";
import { SITE } from "@/lib/site";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const socialIcon = (url: string) => {
  const host = url.toLowerCase();
  if (host.includes("facebook")) return { Icon: FaFacebook, label: "Facebook" };
  if (host.includes("instagram")) return { Icon: FaInstagram, label: "Instagram" };
  if (host.includes("linkedin")) return { Icon: FaLinkedin, label: "LinkedIn" };
  if (host.includes("youtube")) return { Icon: FaYoutube, label: "YouTube" };
  if (host.includes("x.com") || host.includes("twitter")) return { Icon: FaXTwitter, label: "X" };
  return { Icon: FaGoogle, label: "Google Business Profile" };
};

const quickLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "About us", href: "/about" },
  { name: "All services", href: "/services" },
  { name: "Service areas", href: "/service-locations" },
  { name: "Customer reviews", href: "/testimonials" },
  { name: "Our clients", href: "/clients" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

/** Server-rendered footer: every service and location link is crawlable in the initial HTML. */
export default async function Footer({ services, locations }: { services: NavLink[]; locations: LocationLink[] }) {
  const year = await currentYear();
  return (
    <footer className="border-t-[6px] border-green-600 bg-gray-900 text-gray-300" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      <div className="border-b border-gray-800 bg-green-700/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-white">
            <ShieldCheck className="shrink-0 text-green-500" size={32} aria-hidden="true" />
            <div>
              <p className="text-lg font-bold">Need pest control today?</p>
              <p className="text-sm text-gray-400">Free inspection · fixed written quote · written warranty</p>
            </div>
          </div>
          <a href={SITE.phoneHref} className="rounded-md bg-green-600 px-6 py-2.5 font-bold text-white shadow-lg transition-colors hover:bg-green-500">
            Call {SITE.phoneDisplay}
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col space-y-6">
            <Link href="/" className="inline-block w-max rounded-lg bg-white p-3" aria-label={`${SITE.name} — home`}>
              <Image src="/logo.png" alt={`${SITE.name} logo`} width={1171} height={390} sizes="240px" className="h-16 w-auto object-contain md:h-20" />
            </Link>
            <p className="pr-4 text-sm leading-relaxed text-gray-400">
              Odourless, eco-friendly pest management for homes, housing societies and businesses across Mumbai, Thane and Navi Mumbai.
            </p>
            {SITE.sameAs.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Follow us</p>
                <ul className="flex items-center gap-3">
                  {SITE.sameAs.map((url) => {
                    const { Icon, label } = socialIcon(url);
                    return (
                      <li key={url}>
                        <a href={url} target="_blank" rel="noopener noreferrer me" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-green-600 hover:text-white">
                          <Icon size={16} aria-hidden="true" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <nav aria-label="Quick links">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Quick links</h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-green-400">
                    <ChevronRight size={14} className="text-gray-600 group-hover:text-green-500" aria-hidden="true" /> {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Our services">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Our services</h3>
            <ul className="space-y-3">
              {services.slice(0, 10).map((service) => (
                <li key={service.href}>
                  <Link href={service.href} className="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-green-400">
                    <ChevronRight size={14} className="text-gray-600 group-hover:text-green-500" aria-hidden="true" /> {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Contact us</h3>
            <address className="flex flex-col space-y-4 text-sm not-italic text-gray-400">
              <p className="flex items-start gap-3">
                <MapPin className="mt-1 shrink-0 text-green-500" size={18} aria-hidden="true" />
                <span>
                  <strong className="mb-1 block font-medium text-white">Head office</strong>
                  {SITE.address.streetAddress},<br />{SITE.address.addressLocality} – {SITE.address.postalCode}, {SITE.address.addressRegion}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="shrink-0 text-green-500" size={18} aria-hidden="true" />
                <a href={SITE.phoneHref} className="transition-colors hover:text-green-400">{SITE.phoneDisplay}</a>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="shrink-0 text-green-500" size={18} aria-hidden="true" />
                <a href={`mailto:${SITE.email}`} className="break-all transition-colors hover:text-green-400">{SITE.email}</a>
              </p>
              <p className="flex items-center gap-3">
                <Clock className="shrink-0 text-green-500" size={18} aria-hidden="true" />
                <span>Mon–Sat, 9:00 am – 9:00 pm</span>
              </p>
            </address>
          </div>
        </div>

        {locations.length > 0 && (
          <nav aria-label="Service areas" className="border-t border-gray-800 py-8">
            <h3 className="mb-3 text-sm font-semibold text-white">Pest control service areas</h3>
            <ul className="flex flex-wrap gap-x-1 text-xs font-medium leading-relaxed text-gray-500">
              {locations.map((loc, index) => (
                <li key={loc.id}>
                  <Link href={`/service-locations/${loc.slug}`} className="transition-colors hover:text-green-400">{loc.name}</Link>
                  {index < locations.length - 1 && <span className="mx-1.5 text-gray-700" aria-hidden="true">|</span>}
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-6 text-xs font-medium md:flex-row">
          <p className="text-center text-gray-500 md:text-left">© {year} {SITE.name}. All rights reserved.</p>
          <ul className="flex items-center gap-4 text-gray-500">
            <li><Link href="/privacy-policy" className="transition-colors hover:text-white">Privacy Policy</Link></li>
            <li aria-hidden="true" className="text-gray-700">•</li>
            <li><Link href="/terms-and-conditions" className="transition-colors hover:text-white">Terms &amp; Conditions</Link></li>
            <li aria-hidden="true" className="text-gray-700">•</li>
            <li><a href="/sitemap.xml" className="transition-colors hover:text-green-400">Sitemap</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
