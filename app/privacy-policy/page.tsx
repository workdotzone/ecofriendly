import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Eco-Friendly Pests collects, uses and protects the information you share when you book a pest control service.",
  alternates: { canonical: absoluteUrl("/privacy-policy") },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      faqPage="privacy"
      path="/privacy-policy"
      title="Privacy Policy"
      updated="November 2026"
      sections={[
        { heading: "Information we collect", body: ["When you book an inspection or contact us, we collect the details you provide — such as your name, mobile number, service required, address or area, and preferred date.", "Our website may also collect basic technical information (browser type, pages visited) through server logs to keep the site secure and working well."] },
        { heading: "How we use it", body: ["We use your details only to respond to your request, schedule and carry out the service, send service reminders and warranty follow-ups, and improve our services.", "We do not sell or rent your personal information to anyone."] },
        { heading: "Sharing", body: ["Your details are shared only with our own staff who need them to deliver your service, or where required by law."] },
        { heading: "Retention and security", body: ["We keep booking records for as long as needed to provide the service and meet legal or warranty obligations, and protect them with reasonable technical and organisational safeguards."] },
        { heading: "Your choices", body: ["You can ask us to access, correct or delete your personal information, or to stop contacting you, at any time using the contact details below."] },
      ]}
    />
  );
}
