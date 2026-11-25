import type { Metadata } from "next";
import PageFaqSection from "@/components/faq/PageFaqSection";
import Link from "next/link";
import { ShieldCheck, PhoneCall, CheckCircle2 } from "lucide-react";
import BookNowForm from "@/components/forms/BookNowForm";
import { getServices } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

// 🚀 SEO METADATA (Perfectly Intact)
export const metadata: Metadata = {
  title: "Book a Free Pest Control Inspection & Quote",
  alternates: { canonical: absoluteUrl("/book-now") },
  description: "Schedule a free pest inspection for your home or commercial property in Mumbai, Thane, Navi Mumbai, & Pune. 100% safe & odorless treatment.",
  keywords: ["Book pest control Mumbai", "Free pest inspection", "Pest control appointment", "Eco-friendly pest booking"],
  openGraph: {
    title: "Book Free Pest Inspection | Eco-Friendly Pests",
    description: "Schedule your inspection with our expert technicians today.",
    url: absoluteUrl("/book-now"),
    images: [{ url: "/og/default.jpg", width: 1200, height: 630, alt: "Book a free pest inspection" }],
  }
};

export default async function BookNowPage() {
  const services = (await getServices()).map((s) => s.title);
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 🟢 Page Header */}
      <section className="bg-green-800 py-16 md:py-20 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-900 text-green-300 rounded-full font-semibold text-sm mb-4 border border-green-700">
            <ShieldCheck size={18} /> Quick & Easy Scheduling
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Book Free Pest Inspection & Quote</h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto mb-6">
            Tell us about your pest problem and area — our team will call you back with a convenient time slot and an upfront price.
          </p>
          <div className="flex items-center justify-center gap-2 text-green-200 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Book Now</span>
          </div>
        </div>
      </section>

      {/* 🟢 Main Booking Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* 📝 Left Side: Client Component Form Injected Here */}
          <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Schedule Your Appointment</h2>
            <p className="text-gray-500 mb-8">Fill out the details below and our expert will get in touch shortly.</p>
            
            {/* Form Logic Handled By Client Component */}
            <BookNowForm services={services} />

          </div>

          {/* 🛡️ Right Side: Why Book With Us */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">What Happens Next?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-600 text-sm leading-relaxed">Our expert technician calls you within 15 minutes to confirm the slot.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-600 text-sm leading-relaxed">Thorough inspection of your premises at zero visiting charge.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-600 text-sm leading-relaxed">Upfront quotation with zero hidden charges before treatment begins.</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-900 text-white p-8 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold mb-3">Emergency Pest Outbreak?</h3>
              <p className="text-green-200 text-sm mb-6">Skip the form and talk directly to our senior pest management supervisor.</p>
              <a href="tel:+919453394533" className="flex items-center justify-center gap-3 w-full bg-white text-green-900 font-bold py-3.5 rounded-xl hover:bg-green-50 transition-colors shadow-md mb-4">
                <PhoneCall size={20} /> +91-94533 94533
              </a>
              <a href="https://wa.me/919453394533" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-green-700 text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition-colors border border-green-600">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
      <PageFaqSection page="booking" path="/book-now" />
    </div>
  );
}