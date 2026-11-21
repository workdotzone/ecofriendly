import type { FaqItem, ServiceContent } from "./types";
import { truncate } from "@/lib/site";

/** General FAQs used on the homepage when the database has none, and to pad service FAQs to 12. */
export const GENERAL_FAQS: FaqItem[] = [
  { question: "Is pest control safe for children, pets and pregnant women?", answer: "Yes, when it is done correctly. We use CIB&RC-registered products, choose low-odour methods like gel baits and bait stations indoors, and tell you exactly which rooms to avoid and for how long. Pregnant women, infants and pets should stay out of treated rooms until they are dry and ventilated." },
  { question: "Do I need to leave my house during pest control?", answer: "Usually not. Gel treatments for cockroaches and bait stations for rodents need no vacating. Spray-based treatments such as bed bug or general spray need you to stay out of treated rooms for about 3–4 hours." },
  { question: "How long does a pest control service take?", answer: "A standard cockroach gel treatment takes 45–90 minutes for a 1–3 BHK flat. Bed bug treatment takes 1–2 hours per visit, and anti-termite drill-fill-seal treatment takes around 4–6 hours for a typical 2 BHK." },
  { question: "How often should I get pest control done?", answer: "Most homes in Mumbai benefit from general pest control every three months, termite inspection once a year, and extra mosquito control during the monsoon. Restaurants and food businesses usually need monthly service." },
  { question: "Do you provide a warranty on pest control?", answer: "Yes. Every service comes with a service period or warranty that depends on the treatment and plan, and it is written on your service report. If pests return within that period, we re-treat at no extra cost." },
  { question: "Which areas do you serve?", answer: "We serve Mumbai — western, central and harbour suburbs — along with Thane, Navi Mumbai, Mira-Bhayandar, Vasai and Virar. Call or WhatsApp us to confirm availability in your locality." },
  { question: "How much does pest control cost in Mumbai?", answer: "The price depends on the pest, the size of the property, the infestation level and whether you choose a one-time service or an annual plan. We inspect first and give a fixed written quote with no hidden charges." },
  { question: "Is your pest control really odourless?", answer: "Our gel, bait-station and most indoor treatments are odourless or very low odour. Some spray and fogging treatments have a mild smell that clears after ventilation; the technician will tell you beforehand." },
  { question: "What should I do before the pest control technician arrives?", answer: "Store open food in sealed containers, clear kitchen counters and the area under sinks, move light furniture away from walls if asked, and avoid spraying household insecticide for a few days before the visit." },
  { question: "Are your technicians trained and verified?", answer: "Yes. Our technicians are our own trained staff, not subcontractors, and they follow label directions and safety procedures for every product we use." },
  { question: "Do you provide pest control for offices, restaurants and housing societies?", answer: "Yes. We offer scheduled commercial pest management with service reports and activity records for offices, restaurants, hotels, warehouses, hospitals, schools and housing societies." },
  { question: "How do I book a pest control inspection?", answer: "Call or WhatsApp +91-94533 94533, or fill in the booking form on our website. We confirm a convenient time, inspect your property and share a fixed quote before starting any treatment." },
];

function serviceNoun(title: string) {
  return title.replace(/\s*(pest\s*)?(control|treatment|removal|services?)\s*$/i, "").trim() || title;
}

/** Service-specific FAQ templates used for admin-created services that have no curated content. */
function genericServiceFaqs(title: string): FaqItem[] {
  const noun = serviceNoun(title);
  const lower = title.toLowerCase();
  return [
    { question: `How long does ${lower} take?`, answer: `Most ${lower} visits take 1–3 hours depending on property size and infestation level. Your technician confirms the time after inspection.` },
    { question: `Do I need to leave home during ${lower}?`, answer: `It depends on the method. Gel and bait treatments need no vacating, while spray treatments need you to keep out of treated rooms for a few hours. We tell you before we start.` },
    { question: `Is ${lower} safe for children and pets?`, answer: `Yes, when instructions are followed. We use registered products, place them in targeted areas, and advise how long children and pets should stay away from treated areas.` },
    { question: `How many visits are needed for ${noun.toLowerCase()}?`, answer: `Light problems may need one visit plus a follow-up. Heavier infestations or commercial sites usually need two or more visits or an annual plan.` },
    { question: `How much does ${lower} cost in Mumbai?`, answer: `Cost depends on the size of the property, the level of infestation and the plan you choose. We give a fixed written quote after a free inspection.` },
    { question: `Do you offer a warranty on ${lower}?`, answer: `Yes. The service period depends on the plan and is written on your service report. If the problem returns within that period, we re-treat at no extra cost.` },
  ];
}

/** Turn plain admin text into a single section so pages without curated content still read well. */
export function buildGenericContent(input: {
  slug: string;
  title: string;
  shortDescription: string;
  image: string;
  imageAlt?: string;
}): ServiceContent {
  const { slug, title, shortDescription, image } = input;
  const noun = serviceNoun(title);
  return {
    slug,
    title,
    h1: `${title} in Mumbai`,
    metaTitle: truncate(`${title} in Mumbai | Safe & Odourless`, 60),
    metaDescription: truncate(`${shortDescription} Serving Mumbai, Thane & Navi Mumbai. Free inspection.`, 158),
    shortDescription,
    quickAnswer: truncate(shortDescription, 320),
    image,
    imageAlt: input.imageAlt || `${title} service by Eco-Friendly Pests in Mumbai`,
    keywords: [`${title.toLowerCase()} Mumbai`, `${noun.toLowerCase()} control`, `${noun.toLowerCase()} treatment near me`],
    pest: noun,
    facts: [
      { label: "Inspection", value: "Free, before any treatment" },
      { label: "Need to vacate?", value: "Depends on method — we confirm in advance" },
      { label: "Products", value: "CIB&RC-registered, used as per label" },
      { label: "Warranty", value: "Written, period as per plan" },
      { label: "Best for", value: "Homes, offices, shops and societies" },
    ],
    signs: [],
    sections: [],
    process: [
      { name: "Inspect", text: "We inspect the property to identify the pest, the extent of the problem and the conditions attracting it." },
      { name: "Recommend", text: "You get a clear treatment plan, preparation steps and a fixed written quote." },
      { name: "Treat", text: "Trained technicians apply targeted treatment with registered products, following label directions." },
      { name: "Follow up", text: "We schedule follow-ups as per plan and share prevention advice." },
    ],
    preparation: [
      "Store open food in sealed containers.",
      "Clear access to the areas where you have seen pest activity.",
      "Keep children and pets in another room during treatment.",
    ],
    aftercare: [
      "Follow the re-entry time given by the technician.",
      "Avoid washing treated cracks and surfaces for the advised period.",
      "Report any renewed activity during the service period.",
    ],
    prevention: [
      "Fix leaks and reduce moisture.",
      "Seal gaps around pipes, doors and windows.",
      "Keep garbage covered and clear it daily.",
    ],
    faqs: [...genericServiceFaqs(title), ...GENERAL_FAQS].slice(0, 12),
    related: [],
  };
}

/** Merge FAQ lists, de-duplicating by question, and return exactly `count` items (padding with general FAQs). */
export function buildFaqList(sources: FaqItem[][], count = 12): FaqItem[] {
  const seen = new Set<string>();
  const out: FaqItem[] = [];
  const key = (q: string) => q.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  for (const list of [...sources, GENERAL_FAQS]) {
    for (const faq of list) {
      if (!faq?.question?.trim() || !faq?.answer?.trim()) continue;
      const k = key(faq.question);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ question: faq.question.trim(), answer: faq.answer.trim() });
      if (out.length === count) return out;
    }
  }
  return out;
}
