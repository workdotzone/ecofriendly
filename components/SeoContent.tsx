import { 
  ShieldCheck, Leaf, MapPin, Target, Award, Home, Building2, 
  TrendingUp, Bug, CheckCircle2, Clock, ThumbsUp, AlertTriangle, Users 
} from "lucide-react";

export default function SeoContent() {
  return (
    <section className="w-full bg-white py-16 md:py-24 border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =========================================
            SECTION 1: THE MAIN SEO HOOK (H2)
            ========================================= */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full font-semibold text-sm mb-6 border border-green-200">
            <Award size={18} /> Mumbai's Most Trusted Digital & On-Ground Pest Partner
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
            Comprehensive <span className="text-green-600">Pest Control Services in Mumbai</span>: Why Eco-Friendly Pests is the Ultimate Choice
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            In Mumbai's highly competitive and fast-paced landscape, a pest infestation is more than just a nuisance—it is a direct threat to your family's health and your business's reputation. As the premier pest management company in Maharashtra, we bridge the gap between global pest control standards and local environmental needs.
          </p>
        </div>

        {/* =========================================
            SECTION 2: THE MUMBAI CLIMATE CHALLENGE
            ========================================= */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-24">
          <div className="lg:w-1/2">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <AlertTriangle className="text-red-500" size={32} /> 
              Understanding Mumbai's Unique Pest Dynamics
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
              Mumbai, India's financial capital, is home to over 20 million people. The city’s unique coastal climate, characterized by extreme humidity, heavy monsoons, and densely packed infrastructure, creates the absolute perfect breeding ground for destructive pests.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              From the high-rise luxury apartments in South Mumbai (SoBo) facing severe Wood Borer issues due to sea breezes, to the bustling commercial kitchens in Andheri and Bandra battling Cockroaches, generic pest control simply fails here. You need a specialized, localized strategy. We have mapped the pest behavior of every Mumbai zone to deliver eradication, not just temporary relief.
            </p>
          </div>
          <div className="lg:w-1/2 bg-gray-50 rounded-3xl p-8 md:p-10 border border-gray-200 relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-green-600 text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl shadow-lg border-4 border-white">
              100%
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-6">The Hidden Cost of Ignoring Pests in Mumbai</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="bg-white p-2 rounded-lg shadow-sm text-red-500 mt-1"><Bug size={20}/></div>
                <div>
                  <strong className="text-gray-900 block text-lg">Structural Damage</strong>
                  <span className="text-gray-600">Termites silently hollow out expensive imported wooden furniture and structural beams 24/7.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-white p-2 rounded-lg shadow-sm text-red-500 mt-1"><Bug size={20}/></div>
                <div>
                  <strong className="text-gray-900 block text-lg">Health Hazards</strong>
                  <span className="text-gray-600">Rodents and Mosquitoes carry deadly diseases like Leptospirosis, Dengue, and Malaria, peaking during Mumbai monsoons.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-white p-2 rounded-lg shadow-sm text-red-500 mt-1"><Bug size={20}/></div>
                <div>
                  <strong className="text-gray-900 block text-lg">Brand Destruction</strong>
                  <span className="text-gray-600">A single cockroach sighting in a Mumbai restaurant can lead to viral negative reviews and BMC license issues.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* =========================================
            SECTION 3: WHAT SETS US APART (E-E-A-T)
            ========================================= */}
        <div className="mb-24">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">What Sets Eco-Friendly Pests Apart?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-2 transition-transform duration-300">
              <Leaf className="text-green-600 mb-6" size={40} />
              <h4 className="text-xl font-bold text-gray-900 mb-4">100% Herbal & Odorless</h4>
              <p className="text-gray-600 leading-relaxed">
                We strictly use organic, government-approved (CIBRC) herbal gels and low-odor sprays. Our treatments are completely safe for pregnant women, infants, asthma patients, and household pets. No need to vacate your home!
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-2 transition-transform duration-300">
              <Target className="text-green-600 mb-6" size={40} />
              <h4 className="text-xl font-bold text-gray-900 mb-4">Root-Cause Eradication</h4>
              <p className="text-gray-600 leading-relaxed">
                We don't just spray surface chemicals that pests eventually become immune to. We use advanced baiting technologies that pests carry back to their nests, destroying the entire colony and the queen from the inside out.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-2 transition-transform duration-300">
              <ShieldCheck className="text-green-600 mb-6" size={40} />
              <h4 className="text-xl font-bold text-gray-900 mb-4">Iron-Clad Warranty</h4>
              <p className="text-gray-600 leading-relaxed">
                Every service comes with a transparent, no-questions-asked warranty period. If pests return during the contract period, our technicians will conduct a follow-up treatment absolutely free of charge. Your investment is protected.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-2 transition-transform duration-300">
              <Users className="text-green-600 mb-6" size={40} />
              <h4 className="text-xl font-bold text-gray-900 mb-4">In-House Experts</h4>
              <p className="text-gray-600 leading-relaxed">
                Unlike aggregator platforms, we do not outsource our work to third-party freelancers. Every technician is a full-time, police-verified, and rigorously trained employee of Eco-Friendly Pests.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            SECTION 4: CORE SERVICES BREAKDOWN (Keyword Rich)
            ========================================= */}
        <div className="bg-green-900 rounded-3xl p-8 md:p-16 mb-24 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Complete Digital-Age Pest Solutions in Mumbai</h3>
            <p className="text-green-100 text-lg md:text-xl max-w-3xl mb-12 leading-relaxed">
              From targeted residential treatments in Borivali to massive commercial warehouse sanitization in Bhiwandi, our full-stack pest control services cover every aspect of modern pest management.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <h4 className="text-2xl font-bold mb-4 flex items-center gap-3"><Home className="text-green-400"/> Residential Mastery</h4>
                <ul className="space-y-4 text-green-50">
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" /> <strong>Advanced Cockroach Gel Baiting:</strong> Perfect for Mumbai kitchens, completely odorless.</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" /> <strong>Bed Bug Deep Extraction:</strong> 2-step process to kill adults and unhatched eggs ensuring peaceful sleep.</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" /> <strong>Drill-Fill-Seal Termite Protection:</strong> Saving your interior woodwork permanently.</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <h4 className="text-2xl font-bold mb-4 flex items-center gap-3"><Building2 className="text-green-400"/> Commercial AMC Packages</h4>
                <ul className="space-y-4 text-green-50">
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" /> <strong>Restaurant & Hotel Hygiene:</strong> FDA & FSSAI compliant pest management strategies.</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" /> <strong>Rodent Control Stations:</strong> Heavy-duty bait stations for manufacturing and IT parks.</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" /> <strong>After-Hours Service:</strong> 24/7 flexible scheduling to ensure zero downtime for your business.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            SECTION 5: THE 4-STEP PROCESS
            ========================================= */}
        <div className="mb-24">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-16">Our Proven 4-Step Eradication Process</h3>
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-green-100 -translate-y-1/2 z-0"></div>
            
            {[
              { step: "01", title: "Comprehensive Audit", desc: "We analyze your property to identify entry points, moisture levels, and the exact species of the pest." },
              { step: "02", title: "Custom Strategy", desc: "No generic sprays. We formulate a specific, targeted chemical or herbal blend based on the infestation severity." },
              { step: "03", title: "Safe Execution", desc: "Our verified technicians execute the treatment flawlessly, maintaining absolute safety protocols for your family." },
              { step: "04", title: "Monitoring & Warranty", desc: "We provide post-treatment guidelines and activate your warranty. If they return, we return. For free." }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                <div className="w-16 h-16 mx-auto bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-black mb-6 shadow-lg border-4 border-white ring-2 ring-green-100">
                  {item.step}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================
            SECTION 6: REAL MUMBAI METRICS
            ========================================= */}
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-200 text-center mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-10">Real Results from Real Mumbai Communities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-black text-green-600 mb-2">15,000+</div>
              <div className="text-gray-700 font-semibold">Homes Secured</div>
            </div>
            <div>
              <div className="text-4xl font-black text-green-600 mb-2">300+</div>
              <div className="text-gray-700 font-semibold">Corporate AMCs</div>
            </div>
            <div>
              <div className="text-4xl font-black text-green-600 mb-2">100%</div>
              <div className="text-gray-700 font-semibold">Herbal & Safe</div>
            </div>
            <div>
              <div className="text-4xl font-black text-green-600 mb-2">4.9/5</div>
              <div className="text-gray-700 font-semibold">Google Rating</div>
            </div>
          </div>
        </div>

        {/* =========================================
            SECTION 7: SEO BOTTOM CONCLUSION
            ========================================= */}
        <div className="prose prose-lg max-w-none text-gray-600 leading-loose">
          <p>
            When it comes to <strong>professional pest control services in Mumbai</strong>, making the right choice is crucial. A DIY approach or hiring untrained local vendors often leads to recurring infestations, toxic chemical exposure, and wasted money. At Eco-Friendly Pests, we bring together deep industry-specific expertise, modern chemical engineering, and dedicated customer support. 
          </p>
          <p>
            Whether you are struggling with a severe termite infestation in the wooden heritage structures of South Mumbai, or need immediate mosquito thermal fogging for your residential complex in Thane, our teams are equipped and ready. We offer flexible, transparent pricing with absolutely no hidden costs. Join the thousands of Mumbai residents who sleep peacefully knowing their homes are guarded by the city's finest exterminators.
          </p>
        </div>

      </div>
    </section>
  );
}