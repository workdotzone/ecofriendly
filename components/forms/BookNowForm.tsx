"use client";

import { useEffect, useState } from "react";
import { normalizeIndianMobile } from "@/lib/validation";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

const DEFAULT_SERVICES = ["Cockroach Control", "Termite Control", "Bed Bug Control", "Rodent / Rat Control", "Mosquito Control", "Wood Borer Control"];

export default function BookNowForm({ services = [] }: { services?: string[] }) {
  const serviceOptions = [...(services.length ? services : DEFAULT_SERVICES), "Commercial Pest Control", "General Pest Control / AMC"];
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    address: "", // Hum location aur notes ko combine karke isme bhejenge
    locationArea: "",
    notes: "",
    propertyType: "Residential",
    preferredDate: "",
    source: "Book Now Page", // Admin ko pata chalega lead kahan se aayi
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Pre-select the service when arriving from a service page (/book-now?service=Termite%20Control).
  // Read on the client so the page itself stays statically prerendered.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("service");
    if (!requested) return;
    const match = serviceOptions.find((option) => option.toLowerCase() === requested.toLowerCase());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((prev) => ({ ...prev, service: match ?? "Other" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    if (!normalizeIndianMobile(formData.phone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    setLoading(true);

    const finalData = {
      name: formData.name,
      phone: formData.phone,
      service: formData.service,
      address: `Area: ${formData.locationArea} | Notes: ${formData.notes}`,
      propertyType: formData.propertyType,
      preferredDate: formData.preferredDate,
      source: formData.source,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(data.message || "We couldn't submit your booking. Please call or WhatsApp us.");
        return;
      }
      {
        setSuccess(true);
        setFormData({ name: "", phone: "", service: "", address: "", locationArea: "", notes: "", propertyType: "Residential", preferredDate: "", source: "Book Now Page" });
      }
    } catch (err) {
      console.error("Booking Error:", err);
      setError("Network error — please check your connection, or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 p-8 rounded-3xl text-center shadow-sm">
        <CheckCircle2 size={50} className="mx-auto mb-4 text-green-600" />
        <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
        <p className="text-gray-600">Thank you! Our expert will call you within 15 minutes.</p>
        <button onClick={() => setSuccess(false)} className="mt-6 text-green-600 font-semibold hover:underline">Book Another Service</button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="booking-field-1" className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
          <input id="booking-field-1" type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Rahul Sharma" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all" />
        </div>
        <div>
          <label htmlFor="booking-field-2" className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number *</label>
          <input id="booking-field-2" type="tel" required inputMode="tel" autoComplete="tel" maxLength={16} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+91 98765 43210" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="booking-field-3" className="block text-sm font-semibold text-gray-700 mb-2">Select Pest Problem *</label>
          <select id="booking-field-3" required value={formData.service} onChange={(e) => setFormData({...formData, service: e.target.value})} className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all cursor-pointer">
            <option value="" disabled>Select pest type</option>
            {serviceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            <option value="Other">Other Pest Issue</option>
          </select>
        </div>
        <div>
          <label htmlFor="booking-field-4" className="block text-sm font-semibold text-gray-700 mb-2">Your Location / Area in Mumbai *</label>
          <input id="booking-field-4" type="text" required value={formData.locationArea} onChange={(e) => setFormData({...formData, locationArea: e.target.value})} placeholder="e.g. Andheri West, Thane" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="booking-field-5" className="block text-sm font-semibold text-gray-700 mb-2">Property Type *</label>
          <select id="booking-field-5" required value={formData.propertyType} onChange={(e) => setFormData({...formData, propertyType: e.target.value})} className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all cursor-pointer">
            <option value="Residential">Residential (Flat / Bungalow)</option>
            <option value="Commercial">Commercial (Office / Shop / Mall)</option>
            <option value="Industrial">Industrial / Warehouse</option>
            <option value="Hospitality">Hotel / Restaurant / Cafe</option>
          </select>
        </div>
        <div>
          <label htmlFor="booking-field-6" className="block text-sm font-semibold text-gray-700 mb-2">Preferred Date (Optional)</label>
          <input id="booking-field-6" type="date" value={formData.preferredDate} onChange={(e) => setFormData({...formData, preferredDate: e.target.value})} className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all cursor-pointer" />
        </div>
      </div>

      <div>
        <label htmlFor="booking-field-7" className="block text-sm font-semibold text-gray-700 mb-2">Complete Address / Notes *</label>
        <textarea id="booking-field-7" rows={4} required value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Provide your building name, flat number, or specific infestation details..." className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"></textarea>
      </div>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700" role="alert">{error}</p>}

      <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 text-lg disabled:opacity-70">
        {loading ? <Loader2 className="animate-spin" size={20} /> : <>Confirm Free Inspection Booking <Send size={20} /></>}
      </button>
    </form>
  );
}