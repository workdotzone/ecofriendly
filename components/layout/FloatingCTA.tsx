import Link from "next/link";
import { Calendar, PhoneCall } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { SITE } from "@/lib/site";

const whatsappMessage = encodeURIComponent("Hello Eco-Friendly Pests, I want to book a pest control inspection.");

/**
 * Mobile: a fixed bottom action bar (thumb-friendly, never covers content — the layout adds bottom padding).
 * Desktop: compact floating buttons in the corner.
 */
export default function FloatingCTA() {
  return (
    <>
      <nav
        aria-label="Quick contact"
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-gray-200 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <a href={SITE.phoneHref} className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-xs font-semibold text-gray-800">
          <PhoneCall size={20} className="text-green-700" aria-hidden="true" /> Call
        </a>
        <a href={`${SITE.whatsappHref}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-xs font-semibold text-gray-800">
          <FaWhatsapp size={20} className="text-[#25D366]" aria-hidden="true" /> WhatsApp
        </a>
        <Link href="/book-now" className="flex flex-col items-center justify-center gap-0.5 bg-green-600 py-2.5 text-xs font-bold text-white">
          <Calendar size={20} aria-hidden="true" /> Book free visit
        </Link>
      </nav>

      <div className="fixed bottom-6 right-6 z-50 hidden flex-col items-end gap-3 md:flex">
        <a href={SITE.phoneHref} aria-label={`Call ${SITE.phoneDisplay}`} className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl transition hover:scale-110 hover:bg-blue-700">
          <PhoneCall size={24} aria-hidden="true" />
          <span className="pointer-events-none absolute right-full mr-4 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
            Call us now
          </span>
        </a>
        <a href={`${SITE.whatsappHref}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition hover:scale-110 hover:bg-[#20ba5a]">
          <FaWhatsapp size={28} aria-hidden="true" />
          <span className="pointer-events-none absolute right-full mr-4 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
            Chat on WhatsApp
          </span>
        </a>
        <Link href="/book-now" className="flex items-center gap-2 rounded-full bg-green-600 px-6 py-3.5 font-bold text-white shadow-2xl transition hover:scale-105 hover:bg-green-700">
          <Calendar size={20} aria-hidden="true" /> <span className="text-sm">Book now</span>
        </Link>
      </div>
    </>
  );
}
