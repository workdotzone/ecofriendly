"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { normalizeIndianMobile } from "@/lib/validation";

type Status = "idle" | "loading" | "success" | "error";

/** Compact lead form used in the homepage hero. Service options come from the database. */
export default function LeadForm({ services, source = "Homepage Hero" }: { services: string[]; source?: string }) {
  const [form, setForm] = useState({ name: "", phone: "", service: "", address: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const options = services.length ? services : ["Cockroach Control", "Termite Control", "Bed Bug Control", "Rodent Control", "Mosquito Control"];

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "loading") return;
    setError("");
    if (!normalizeIndianMobile(form.phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || "Something went wrong.");
      setStatus("success");
      setForm({ name: "", phone: "", service: "", address: "", website: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please call us instead.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center text-green-800" role="status" aria-live="polite">
        <CheckCircle2 size={40} className="mx-auto mb-2 text-green-600" aria-hidden="true" />
        <p className="text-lg font-bold">Request received!</p>
        <p className="text-sm">Our team will call you shortly (Mon–Sat, 9 am – 9 pm).</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-4 text-sm font-semibold text-green-700 underline">
          Send another request
        </button>
      </div>
    );
  }

  const input = "w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-green-500";

  return (
    <form className="space-y-4" onSubmit={submit} noValidate={false}>
      <div>
        <label htmlFor="lead-name" className="sr-only">Your name</label>
        <input id="lead-name" type="text" required minLength={2} maxLength={80} autoComplete="name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name *" className={input} />
      </div>
      <div>
        <label htmlFor="lead-phone" className="sr-only">Mobile number</label>
        <input id="lead-phone" type="tel" required inputMode="numeric" autoComplete="tel-national" maxLength={16} value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile number *" className={input}
          aria-invalid={Boolean(error)} aria-describedby={error ? "lead-error" : undefined} />
      </div>
      <div>
        <label htmlFor="lead-service" className="sr-only">Service needed</label>
        <select id="lead-service" required value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className={`${input} cursor-pointer`}>
          <option value="" disabled>Select service *</option>
          {options.map((name) => <option key={name} value={name}>{name}</option>)}
          <option value="Other">Other pest problem</option>
        </select>
      </div>
      <div>
        <label htmlFor="lead-address" className="sr-only">Area or address</label>
        <textarea id="lead-address" rows={2} maxLength={500} autoComplete="street-address" value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Your area / locality (optional)" className={`${input} resize-none`} />
      </div>
      {/* Honeypot — hidden from people, bots fill it */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="lead-website">Website</label>
        <input id="lead-website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
      </div>
      {error && <p id="lead-error" className="text-sm font-medium text-red-600" role="alert">{error}</p>}
      <button type="submit" disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3.5 font-bold text-white shadow-md transition-colors hover:bg-green-700 disabled:cursor-wait disabled:opacity-80">
        {status === "loading" ? <><Loader2 className="animate-spin" size={20} aria-hidden="true" /> Sending…</> : <>Get free inspection <ArrowRight size={18} aria-hidden="true" /></>}
      </button>
      <p className="text-center text-xs text-gray-500">We only use your number to call you about this request.</p>
    </form>
  );
}
