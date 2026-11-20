import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms for booking and receiving pest control services from Eco-Friendly Pests, including quotes, scheduling, safety and warranty.",
  alternates: { canonical: absoluteUrl("/terms-and-conditions") },
};

export default function TermsPage() {
  return (
    <LegalPage
      faqPage="terms"
      path="/terms-and-conditions"
      title="Terms & Conditions"
      updated="November 2026"
      sections={[
        { heading: "Quotes and inspection", body: ["Prices are confirmed in writing after inspection, based on the pest, property size, infestation level and the plan selected. The quoted price is what you pay unless you request additional work."] },
        { heading: "Scheduling", body: ["Appointments are confirmed by phone or WhatsApp. Please let us know as early as possible if you need to reschedule."] },
        { heading: "Preparation and safety", body: ["Customers agree to follow the preparation and re-entry instructions given for each treatment, including keeping children and pets away from treated areas for the advised time.", "All products are used according to their registered label directions."] },
        { heading: "Warranty", body: ["Warranty or service periods depend on the treatment and plan and are stated on your service report. Re-treatment within that period is free if pest activity returns, provided preparation and aftercare instructions were followed and the treated areas were not altered (for example by new construction, plumbing work or seepage)."] },
        { heading: "Payment", body: ["Payment is due on completion of each visit unless otherwise agreed in writing for annual or commercial contracts."] },
      ]}
    />
  );
}
