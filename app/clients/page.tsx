import type { Metadata } from "next";
import PageFaqSection from "@/components/faq/PageFaqSection";
import Image from "next/image";
import Link from "next/link";
import { 
  Building2, Coffee, Hospital, School, Home, 
  ShieldCheck, ArrowRight, Quote, Star, CheckCircle2 
} from "lucide-react";
import { absoluteUrl } from "@/lib/site";

// 🚀 SEO METADATA FOR CLIENTS PAGE
export const metadata: Metadata = {
  title: "Our Clients — Commercial Pest Control in Mumbai",
  alternates: { canonical: absoluteUrl("/clients") },
  description: "Eco-Friendly Pests is the trusted choice for 1000+ commercial and residential clients in Mumbai, Thane, and Pune. See our esteemed client portfolio.",
  keywords: ["Pest control clients Mumbai", "Commercial pest control portfolio", "Top pest control companies Mumbai", "Hospitality pest control", "Corporate pest management"],
  openGraph: {
    title: "Our Esteemed Clients | Eco-Friendly Pests",
    description: "Trusted by top brands, hospitals, schools, and housing societies across Maharashtra for 100% safe pest control.",
    images: [{ url: "/og/default.jpg", width: 1200, height: 630, alt: "Our Clients - Eco Friendly Pests" }],
  }
};

// Client Logos Data (Using your existing birla.jpg as placeholder)
const clientLogos = [
  { id: 1, name: "Birla Group", src: "/clients/birla.jpg" },
  { id: 2, name: "L&T Infrastructure", src: "/clients/birla.jpg" },
  { id: 3, name: "UltraTech Cement", src: "/clients/birla.jpg" },
  { id: 4, name: "Hotel Vihang Inn", src: "/clients/birla.jpg" },
  { id: 5, name: "Hotel Wine & Dine", src: "/clients/birla.jpg" },
  { id: 6, name: "DGS Builders", src: "/clients/birla.jpg" },
  { id: 7, name: "Reliance Retail", src: "/clients/birla.jpg" },
  { id: 8, name: "Apollo Hospitals", src: "/clients/birla.jpg" },
  { id: 9, name: "DPS School", src: "/clients/birla.jpg" },
  { id: 10, name: "Tata Motors", src: "/clients/birla.jpg" },
  { id: 11, name: "Hiranandani Estate", src: "/clients/birla.jpg" },
  { id: 12, name: "Lodha Group", src: "/clients/birla.jpg" },
];

export default function ClientsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* 🟢 Page Header & Breadcrumbs */}
      <section className="bg-green-700 py-16 md:py-20 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            Our Esteemed Clients
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto mb-6">
            Trusted by 850+ businesses and 1000+ homes across Mumbai, Thane, Navi Mumbai, and Pune for hygienic and professional pest management.
          </p>
          <div className="flex items-center justify-center gap-2 text-green-100 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Clients</span>
          </div>
        </div>
      </section>

      {/* 🟢 SEO Text Introduction */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            A Legacy of <span className="text-green-600">Trust and Excellence</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            At <strong>Eco-Friendly Pests</strong>, we understand that commercial spaces require a zero-tolerance approach to pests. A single cockroach or rodent can severely damage a brand's reputation and lead to health compliance issues.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Over the years, we have partnered with top-tier brands, government organizations, healthcare facilities, and leading educational institutions. Our commitment to using government-approved, odorless, and highly effective chemicals has made us the #1 choice for corporate pest control in Maharashtra.
          </p>
        </div>
      </section>

      {/* 🟢 Industries We Serve (Great for Local SEO & Keyword Coverage) */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Industries We Protect</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We provide tailored pest management solutions designed specifically for the unique regulatory and safety requirements of different commercial sectors.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6">
              <Hospital size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Healthcare & Hospitals</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Hospitals require 100% sterile environments. We provide safe, odorless pest control targeting bed bugs, cockroaches, and rodents without disturbing patients or contaminating equipment.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6">
              <Coffee size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Hotels & Restaurants</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Food safety is critical. Our FSSAI-compliant pest treatments ensure your commercial kitchens and dining areas remain completely free of flies, cockroaches, and rats.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6">
              <Building2 size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Corporate Offices & IT</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Protect your server rooms from rodent damage and keep your employees safe from mosquitoes and diseases with our discrete weekend and after-hours pest treatments.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6">
              <School size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Schools & Universities</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Children's safety is our priority. We use heavily tested, herbal, and child-safe chemicals to keep educational campuses free from dengue-causing mosquitoes and wasps.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6">
              <Building2 size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Warehouses & Logistics</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Prevent rodents and termites from destroying your stored goods, raw materials, and structural foundations with our heavy-duty industrial pest control programs.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6">
              <Home size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Housing Societies</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Comprehensive Annual Maintenance Contracts (AMC) for large residential complexes covering common areas, gardens, clubhouses, and individual flats.
            </p>
          </div>
        </div>
      </section>

      {/* 🟢 Client Logo Grid */}
      <section className="py-16 md:py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Brands That Trust Us</h2>
            <p className="text-gray-600">A glimpse of our prestigious clientele who rely on our ISO-certified pest management.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {clientLogos.map((client) => (
              <div 
                key={client.id} 
                className="bg-gray-50 border border-gray-100 p-6 rounded-xl flex items-center justify-center h-32 hover:shadow-md hover:border-green-300 transition-all group"
              >
                <div className="relative w-full h-full opacity-80 group-hover:opacity-100 transition-opacity">
                  <Image 
                    src={client.src} 
                    alt={`${client.name} - Pest Control Client`}
                    fill 
                    className="object-contain" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🟢 Detailed Client Success Stories (Very Important for SEO Context) */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Client Success Stories</h2>
            <p className="text-gray-600">Real feedback from business leaders and facility managers.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 relative">
              <Quote className="absolute top-8 right-8 text-green-100 rotate-180" size={60} />
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(i => <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-8 relative z-10 italic">
                "I have had a major cockroach problem and used to use another company that couldn't get rid of the problem. I finally called the Eco-Friendly Pests Control team. They came here, did a thorough inspection, and applied an odorless gel treatment that completely wiped out the cockroaches from my home without any toxic smell. I highly recommend them to others."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  VR
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Vivekanand Ray</h4>
                  <p className="text-sm text-gray-500">Project Manager, L&T Infrastructure Ltd.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 relative">
              <Quote className="absolute top-8 right-8 text-green-100 rotate-180" size={60} />
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(i => <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-8 relative z-10 italic">
                "Eco-Friendly Pests Control responded quickly to my concerns. The pest control operators were very polite, efficient, and prompt. They got right to work, identified the entry points, and solved my severe rodent problem in our warehouse permanently. I recommend them to other corporate facilities and would definitely use their AMC services again in the future."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  RM
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">R C Maurya</h4>
                  <p className="text-sm text-gray-500">Project Manager, Ultra Tech Cement Ltd.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 relative">
              <Quote className="absolute top-8 right-8 text-green-100 rotate-180" size={60} />
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(i => <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-8 relative z-10 italic">
                "Eco-Friendly Pests Control has been servicing my restaurant for over a year now. In the food industry, hygiene is everything. They have always been prompt, dependable, and their treatments never disrupt our kitchen operations. I am very thankful for their excellent pest control operators and their strong commitment to quality."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  GM
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">General Manager</h4>
                  <p className="text-sm text-gray-500">Hotel Wine & Dine, Borivali-Mumbai</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 relative">
              <Quote className="absolute top-8 right-8 text-green-100 rotate-180" size={60} />
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(i => <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-8 relative z-10 italic">
                "The pest control person came exactly at the appointed time. He was very professional, kind, and friendly. We had a massive bed bug issue in our hotel rooms which was affecting guest reviews. He did a great deep-cleaning job to get rid of the bed bugs completely. I highly appreciate the way he did the work."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  SS
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Sunil Sharma</h4>
                  <p className="text-sm text-gray-500">General Manager, Hotel Vihang Inn</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🟢 Call to Action (Commercial Conversion) */}
      <section className="bg-green-900 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ShieldCheck className="text-green-400 mx-auto mb-6" size={56} />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make Your Premises Pest-Free?
          </h2>
          <p className="text-lg text-green-100 mb-10">
            Join 1000+ businesses who trust Eco-Friendly Pests for their commercial spaces. Get a free, no-obligation site inspection today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/book-now"
              className="bg-white text-green-800 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-xl flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Book Free Inspection <ArrowRight size={20} />
            </Link>
            <Link 
              href="tel:+919453394533"
              className="bg-green-800 border border-green-600 text-white hover:bg-green-700 px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-xl flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Call +91-94533 94533
            </Link>
          </div>
        </div>
      </section>

      <PageFaqSection page="clients" path="/clients" />
    </div>
  );
}