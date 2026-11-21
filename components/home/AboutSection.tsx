import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Leaf, Users, MapPin, Building2, Home, CheckCircle2 } from "lucide-react";

import type { LocationLink } from "@/lib/data";

export default function AboutSection({ locations }: { locations: LocationLink[] }) {
  return (
    <section className="w-full py-16 md:py-24 bg-gray-50" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =========================================
            SEO HEADER SECTION
            ========================================= */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm mb-6">
            <ShieldCheck size={18} /> Mumbai's Top Rated Agency
          </div>
          <h2 id="about-heading" className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            The Most Trusted <span className="text-green-600">Pest Control</span> in Mumbai
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            <strong>EcoFriendlyPests</strong> is the most popular and trusted pest management company in Maharashtra. 
            Our mission is clear and straightforward: to provide highly effective, 100% hygienic, and organic pest control solutions that are completely safe for your family, pets, and the environment.
          </p>
        </div>

        {/* =========================================
            4 PILLARS OF TRUST (Grid)
            ========================================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300 group">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
              <Leaf size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">100% Safe & Organic</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Safe for humans, pets, children, and pregnant women. We strictly use government-approved herbal chemicals.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300 group">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Technicians</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Our verified, in-house team holds years of expertise, conducting thorough inspections before any treatment.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300 group">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Guaranteed Results</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Complete eradication of cockroaches, termites, rodents, bed bugs, and mosquitoes with an iron-clad warranty.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300 group">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
              <Building2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Affordable Pricing</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Top-quality pest control services at highly cost-effective and transparent prices without hidden charges.</p>
          </div>
        </div>

        {/* =========================================
            RESIDENTIAL PEST CONTROL (Image Left, Content Right)
            ========================================= */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
          <div className="lg:w-1/2 w-full relative">
            <div className="relative w-full h-[260px] sm:h-[340px] lg:h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image 
                src="/residentialpest.webp" 
                alt="Residential Pest Control Services in Mumbai" 
                fill
                                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100 hidden md:flex">
              <div className="bg-green-100 p-3 rounded-full text-green-600"><Home size={24}/></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Over 10,000+</p>
                <p className="font-bold text-gray-900">Homes Protected</p>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 flex flex-wrap items-center gap-x-3 gap-y-1">
              Residential <span className="text-green-600">Pest Control</span>
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              Your home is your sanctuary. We protect it against unwanted, disease-carrying pests. We apply various targeted chemicals, odorless sprays, and herbal gels depending on the pest type to ensure your family's absolute safety.
            </p>
            <div className="grid sm:grid-cols-2 gap-y-4 gap-x-2">
              {[
                "Cockroach Gel Treatment", 
                "Anti-Termite Protection", 
                "Rodent & Rat Removal", 
                "Bed Bugs Eradication", 
                "Mosquito Thermal Fogging", 
                "Wood Borer Injection"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} />
                  <span className="text-gray-700 font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================
            COMMERCIAL PEST CONTROL (Content Left, Image Right)
            ========================================= */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 mb-24">
          <div className="lg:w-1/2 w-full">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 flex flex-wrap items-center gap-x-3 gap-y-1">
              Commercial <span className="text-green-600">Pest Management</span>
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              We protect businesses across Mumbai and Maharashtra. A pest-free environment is crucial for commercial spaces to maintain brand reputation and pass strict health audits. We offer dedicated AMC packages for:
            </p>
            <div className="grid sm:grid-cols-2 gap-y-4 gap-x-2">
              {[
                "Hospitals & Clinics", 
                "Food Processing Units", 
                "Schools & Universities", 
                "Shopping Malls & PVRs", 
                "Government Offices", 
                "Hotels & Restaurants"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} />
                  <span className="text-gray-700 font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 w-full relative">
            <div className="relative w-full h-[260px] sm:h-[340px] lg:h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image 
                src="/commercialpest.webp" 
                alt="Commercial Pest Control AMC Packages" 
                fill
                                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
             {/* Floating Badge */}
             <div className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100 hidden md:flex">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Building2 size={24}/></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Trusted by</p>
                <p className="font-bold text-gray-900">300+ Corporates</p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            🌍 100% DYNAMIC Local SEO Section: Areas
            ========================================= */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 text-center max-w-6xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 text-green-600 rounded-full mb-6">
            <MapPin size={32} />
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">Areas We Cover Across Maharashtra</h3>
          <p className="text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto text-lg">
            We started our journey in Mumbai and rapidly expanded to meet the high demand. Today, we are proud to offer our premium pest control services across multiple locations to serve you better.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {locations.length > 0 ? (
              locations.map((loc) => (
                <Link
                  key={loc.id}
                  href={`/service-locations/${loc.slug}`}
                  className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:border-green-500 hover:text-green-700 hover:bg-green-50 hover:shadow-md transition-all"
                >
                  Pest control in {loc.name}
                </Link>
              ))
            ) : (
              <Link href="/service-locations" className="px-5 py-2.5 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-semibold">
                View all service areas
              </Link>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}