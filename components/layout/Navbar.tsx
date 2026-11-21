"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import { SITE } from "@/lib/site";

export type NavLink = { name: string; href: string };

/**
 * Header navigation. Links are passed in from the server (layout) so every service and page link
 * is in the initial HTML — crawlers see the full internal-link structure without running JavaScript.
 */
export default function Navbar({ services, pages }: { services: NavLink[]; pages: NavLink[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  // Close the mobile menu on Escape. (Link clicks close it via onClick below.)
  // usePathname() is intentionally not used: it would make every page's header dynamic and block static prerendering.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMobileMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navLinkClass = "font-semibold text-gray-700 transition-colors hover:text-green-700";
  const closeOnLinkClick = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a")) setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 flex w-full flex-col bg-white shadow-sm">
      <div className="bg-green-700 px-4 py-2 text-sm font-medium text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
          <a href={`mailto:${SITE.email}`} className="hidden items-center gap-2 transition-colors hover:text-green-200 sm:flex">
            <Mail size={16} aria-hidden="true" /> {SITE.email}
          </a>
          <a href={SITE.phoneHref} className="mx-auto flex items-center gap-2 transition-colors hover:text-green-200 sm:mx-0">
            <Phone size={16} aria-hidden="true" /> Call now: {SITE.phoneDisplay}
          </a>
        </div>
      </div>

      <nav aria-label="Main" className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 py-2" aria-label={`${SITE.name} — home`}>
          <Image
            src="/logo.png"
            alt={`${SITE.name} logo`}
            width={1171}
            height={390}
            preload
            sizes="(max-width: 640px) 120px, (max-width: 1024px) 168px, 192px"
            className="h-10 w-auto object-contain sm:h-12 md:h-14 lg:h-16"
          />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          <Link href="/" className={navLinkClass}>Home</Link>

          <div className="group relative">
            <Link href="/services" className={`flex items-center gap-1 py-2 ${navLinkClass}`} aria-haspopup="true">
              Services <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true" />
            </Link>
            <div className="invisible absolute left-1/2 top-full w-[760px] -translate-x-1/2 rounded-b-xl border-t-4 border-green-600 bg-white p-6 opacity-0 shadow-2xl transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <ul className="grid grid-cols-3 gap-x-6 gap-y-2">
                {services.map((service) => (
                  <li key={service.href}>
                    <Link href={service.href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700">
                      <CheckCircle2 size={14} className="shrink-0 text-green-500" aria-hidden="true" /> {service.name}
                    </Link>
                  </li>
                ))}
                <li className="col-span-3 border-t border-gray-100 pt-3">
                  <Link href="/services" className="inline-flex items-center rounded-lg bg-green-50 px-3 py-2 text-sm font-bold text-green-700 hover:bg-green-100 hover:underline">
                    View all services →
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Link href="/about" className={navLinkClass}>About</Link>
          {pages.map((page) => (
            <Link key={page.href} href={page.href} className={navLinkClass}>{page.name}</Link>
          ))}
          <Link href="/contact" className={navLinkClass}>Contact</Link>
          <Link href="/book-now" className="rounded-md bg-green-600 px-6 py-2.5 font-bold text-white shadow-sm transition-colors hover:bg-green-700">Book Now</Link>
        </div>

        <button
          type="button"
          className="p-2 text-gray-700 hover:text-green-700 lg:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        onClick={closeOnLinkClick}
        className={`absolute left-0 top-full w-full overflow-y-auto border-t border-gray-100 bg-white shadow-xl transition-all duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? "visible max-h-[85vh] opacity-100" : "invisible max-h-0 opacity-0"}`}
      >
        <div className="flex flex-col gap-1 px-4 pb-10 pt-4">
          <Link href="/" className="border-b border-gray-100 py-3 text-lg font-semibold text-gray-800">Home</Link>
          <div className="flex flex-col border-b border-gray-100">
            <div className="flex items-center justify-between py-3">
              <Link href="/services" className="flex-grow text-lg font-semibold text-gray-800">Our Services</Link>
              <button
                type="button"
                className="p-2 text-gray-800"
                onClick={() => setIsServicesOpen((open) => !open)}
                aria-expanded={isServicesOpen}
                aria-label="Show services"
              >
                <ChevronDown size={20} className={`transition-transform duration-300 ${isServicesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
            </div>
            <ul className={`flex flex-col gap-1 overflow-hidden transition-all duration-300 ${isServicesOpen ? "max-h-[1000px] py-2 opacity-100" : "max-h-0 opacity-0"}`}>
              {services.map((service) => (
                <li key={service.href}>
                  <Link href={service.href} className="mb-1 flex items-center gap-2 rounded-r-md border-l-2 border-transparent bg-gray-50/60 py-2.5 pl-4 text-gray-700 hover:border-green-500 hover:text-green-700">
                    <CheckCircle2 size={14} className="text-green-500" aria-hidden="true" /> {service.name}
                  </Link>
                </li>
              ))}
              <li className="border-t border-gray-200 pt-2">
                <Link href="/services" className="block rounded-lg bg-green-50 px-4 py-3 text-center font-bold text-green-700 hover:bg-green-100">
                  View all services
                </Link>
              </li>
            </ul>
          </div>
          <Link href="/about" className="border-b border-gray-100 py-3 text-lg font-semibold text-gray-800">About</Link>
          {pages.map((page) => (
            <Link key={page.href} href={page.href} className="border-b border-gray-100 py-3 text-lg font-semibold text-gray-800">{page.name}</Link>
          ))}
          <Link href="/contact" className="border-b border-gray-100 py-3 text-lg font-semibold text-gray-800">Contact</Link>
          <Link href="/book-now" className="mt-4 rounded-xl bg-green-600 px-6 py-4 text-center font-bold text-white hover:bg-green-700">Book Free Inspection</Link>
        </div>
      </div>
    </header>
  );
}
