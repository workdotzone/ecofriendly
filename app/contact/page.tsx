import type { Metadata } from "next";
import PageFaqSection from "@/components/faq/PageFaqSection";
import Link from "next/link";
import { MapPin, PhoneCall, Mail, Clock, Send, ShieldCheck } from "lucide-react";

// 🚀 SEO METADATA FOR CONTACT PAGE
export const metadata: Metadata = {
  title: "Contact Us — Pest Control in Mumbai",
  alternates: { canonical: "https://ecofriendlypests.com/contact" },
  description: "Get in touch with Eco-Friendly Pests Control. Call +91-94533 94533 for 100% safe, odorless, and guaranteed pest control services in Mumbai.",
  keywords: ["Contact pest control Mumbai", "Pest control Dahisar", "Pest control phone number", "Book pest control online", "Eco-friendly pests contact"],
  openGraph: {
    title: "Contact Eco-Friendly Pests Control in Mumbai",
    description: "Our pest professionals are always ready to answer your queries. Get a free inspection today.",
    url: "https://ecofriendlypests.com/contact",
    images: [{ url: "/og/default.jpg", width: 1200, height: 630, alt: "Contact Eco-Friendly Pests" }],
  }
};

export default function ContactPage() {
  // 🚀 LocalBusiness Schema for Google Local SEO
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "PestControlService",
    "name": "Eco-Friendly Pests",
    "image": "https://ecofriendlypests.com/logo.png",
    "@id": "",
    "url": "https://ecofriendlypests.com",
    "telephone": "+919453394533",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "D.N. Dube Road, Rajesh Compound, Dahisar East",
      "addressLocality": "Mumbai",
      "postalCode": "400068",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 19.2500, // Approx Dahisar coordinates
      "longitude": 72.8596
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Inject SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      {/* 🟢 Page Header */}
      <section className="bg-green-700 py-16 md:py-20 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            Get In Touch With Us
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto mb-6">
            Our team of pest professionals is always ready to answer your pest-related questions. Reach out to us for a free quote or inspection.
          </p>
          <div className="flex items-center justify-center gap-2 text-green-100 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Contact Us</span>
          </div>
        </div>
      </section>

      {/* 🟢 Main Contact Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          
          {/* 📍 Left Side: Contact Information (Takes 2 columns) */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-md font-semibold text-sm mb-4">
                <ShieldCheck size={18} /> 24/7 Customer Support
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Fill out the form and an Eco-Friendly Pests Control agent will contact you shortly. Alternatively, you can directly reach us using the details below.
              </p>
            </div>

            <address className="not-italic space-y-6">
              {/* Address Card */}
              <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors">
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Head Office</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    D.N. Dube Road, Rajesh Compound,<br />
                    Dahisar East, Mumbai - 400068<br />
                    Maharashtra, India
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors">
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                  <PhoneCall size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Call Us</h3>
                  <a href="tel:+919453394533" className="text-gray-600 text-sm hover:text-green-600 font-medium transition-colors">
                    +91-94533 94533
                  </a>
                </div>
              </div>

              {/* Email Card */}
              <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors">
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Email Us</h3>
                  <a href="mailto:info@ecofriendlypests.com" className="text-gray-600 text-sm hover:text-green-600 font-medium transition-colors">
                    info@ecofriendlypests.com
                  </a>
                </div>
              </div>

              {/* Business Hours Card */}
              <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-green-300 transition-colors">
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Business Hours</h3>
                  <p className="text-gray-600 text-sm">
                    Monday - Sunday: 24 Hours Open<br />
                    (Emergency services available)
                  </p>
                </div>
              </div>
            </address>
          </div>

          {/* ✉️ Right Side: Contact Form (Takes 3 columns) */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 relative">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-500 mb-8">We usually reply within 15 minutes.</p>

              <form className="space-y-6" /* Action yahan baad me backend ke liye lagayenge */>
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      placeholder="Enter your full name" 
                      required 
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    />
                  </div>
                  {/* Phone Input */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number *</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      placeholder="Enter your phone number" 
                      pattern="[0-9]{10}"
                      title="Enter 10 digit mobile number"
                      required 
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      placeholder="Enter your email address" 
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    />
                  </div>
                  {/* Service Selection */}
                  <div>
                    <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-2">Interested Service *</label>
                    <select 
                      id="service" 
                      required
                      defaultValue=""
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all cursor-pointer"
                    >
                      <option value="" disabled>Select a service</option>
                      <option value="Cockroach Control">Cockroach Control</option>
                      <option value="Termite Control">Termite Control</option>
                      <option value="Bed Bug Control">Bed Bug Control</option>
                      <option value="Rodent Control">Rodent Control</option>
                      <option value="Mosquito Control">Mosquito Control</option>
                      <option value="General Pest Control">General Pest Control / AMC</option>
                    </select>
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Your Message / Address *</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    placeholder="Tell us about your pest issue or provide your complete address..." 
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                >
                  Send Message <Send size={18} />
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  By submitting this form, you agree to our privacy policy. We keep your data 100% secure.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 🟢 Full Width Google Map (Boosts Local SEO) */}
      <section className="w-full h-[400px] md:h-[500px] bg-gray-200 relative">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.1472591605333!2d72.8595996!3d19.2500003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b1297120a133%3A0xc3b8a1c97a7a13c9!2sDahisar%20East%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Eco Friendly Pests Control Location Map"
          className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
        ></iframe>
      </section>
      
      <PageFaqSection page="contact" path="/contact" />
    </div>
  );
}