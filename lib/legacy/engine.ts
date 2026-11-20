/**
 * Page engine for every URL in the original sitemap (app/legacy-pages.json).
 *
 * Each URL is classified (local service page, service page, "near me" keyword page, guide, hub,
 * HTML sitemap page) and assembled from:
 *   - the pest family's long-form content (lib/content/services.ts + ./families-extra.ts)
 *   - the locality's region and type (./regions.ts)
 *   - deterministic, slug-seeded variants of every text block, so the same URL always renders the
 *     same text but neighbouring pages get different wording, section choices, FAQs and links
 *   - internal links to nearby localities and other services in the same locality
 * Everything is pure and synchronous (no DB), so all ~3,400 pages are prerendered as static HTML.
 */
import legacySlugs from "@/app/legacy-pages.json";
import { SERVICE_CONTENT } from "@/lib/content/services";
import type { FaqItem, ServiceContent, ServiceFact, ServiceSection, ServiceStep } from "@/lib/content/types";
import { EXTRA_FAMILIES } from "./families-extra";
import { GUIDE_BY_SLUG, GUIDES, type GuideConfig } from "./guides";
import { REGIONS, TYPE_COPY, findLocalityType, findRegion, type LocalityType, type Region } from "./regions";
import { GENERAL_FAQS } from "@/lib/content/generic";

// ------------------------------------------------------------------ utilities

export function decode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Small deterministic PRNG so every URL always gets the same variants. */
function rng(seed: string) {
  let a = hash(seed) || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
type Rand = () => number;
const pick = <T,>(r: Rand, arr: readonly T[]) => arr[Math.floor(r() * arr.length)];
function shuffle<T>(r: Rand, arr: readonly T[]) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
const sample = <T,>(r: Rand, arr: readonly T[], n: number) => shuffle(r, arr).slice(0, Math.min(n, arr.length));
const fill = (template: string, vars: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key) => (key in vars ? vars[key] : `{${key}}`));

const WORD_FIX: Record<string, string> = {
  cst: "CST", gtb: "GTB", midc: "MIDC", cbd: "CBD", bkc: "BKC", iit: "IIT", lbs: "LBS", jm: "JM", fc: "FC", sv: "SV", dn: "DN",
  rfc: "RFC", nibm: "NIBM", mhada: "MHADA", lic: "LIC", sbi: "SBI", ic: "IC", hp: "HP", cp: "CP", kc: "KC", sg: "SG", nl: "NL", jb: "JB",
  rpts: "RPTS", nda: "NDA", bmc: "BMC", lig: "LIG", mig: "MIG", awc: "AWC", nx: "NX", aiims: "AIIMS", seepz: "SEEPZ", nitie: "NITIE",
  andher: "Andheri", hil: "Hill", lowe: "Lower", naga: "Nagar", nagr: "Nagar", collage: "College", punecity: "Pune City", dombivali: "Dombivli",
  of: "of", and: "and", the: "the", in: "in", r: "R", m: "M", j: "J", s: "S", v: "V", l: "L", p: "P",
};

export function prettyLocality(slug: string) {
  const clean = decode(slug).replace(/\s+/g, " ").trim();
  const sector = clean.match(/^sector[- ]([0-9a-z-]+?)(?:-(.+))?$/i);
  const words = (s: string) =>
    s.split(/[-\s]+/).filter(Boolean).map((w, i) => {
      const lower = w.toLowerCase();
      if (WORD_FIX[lower] && !(i === 0 && ["of", "and", "the", "in"].includes(lower))) return WORD_FIX[lower];
      if (/^\d/.test(w)) return w.toUpperCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }).join(" ");
  if (sector) {
    const [, num, rest] = sector;
    return rest ? `Sector ${num.toUpperCase()}, ${words(rest)}` : `Sector ${num.toUpperCase()}`;
  }
  return words(clean).replace(/\s*\(\s*/g, " (");
}

// ------------------------------------------------------------------ families

export type Family = ServiceContent & { label: string; servicePage?: string };

const LABELS: Record<string, string> = {
  "cockroach-control": "Cockroach Control",
  "termite-control": "Termite Control",
  "bed-bugs-control": "Bed Bug Treatment",
  "rodent-control": "Rat & Rodent Control",
  "mosquito-control": "Mosquito Control",
  "wood-borer-control": "Wood Borer Treatment",
  "pest-control": "Pest Control",
  "herbal-pest-control": "Herbal Pest Control",
  "home-pest-control": "Home Pest Control",
  "commercial-pest-control": "Commercial Pest Control",
  "dog-ticks-control": "Dog Tick Control",
  "honey-bee-control": "Honey Bee Removal",
  "fly-pest-control": "Fly Control",
  "spider-pest-control": "Spider Control",
  "lizard-pest-control": "Lizard Control",
  "ant-control": "Ant Control",
  "wildlife-control": "Wildlife & Rodent Control",
};

export const FAMILIES = new Map<string, Family>();
for (const c of SERVICE_CONTENT) FAMILIES.set(c.slug, { ...c, label: LABELS[c.slug] ?? c.title, servicePage: `/services/${c.slug}` });
for (const c of EXTRA_FAMILIES) FAMILIES.set(c.slug, { ...c, label: LABELS[c.slug] ?? c.title });

/** URL prefix in the original sitemap → family key */
const PREFIXES: [string, string][] = [
  ["bed-bugs-pest-control", "bed-bugs-control"],
  ["cockroach-pest-control", "cockroach-control"],
  ["commercial-pest-control", "commercial-pest-control"],
  ["termite-pest-control", "termite-control"],
  ["mosquito-pest-control", "mosquito-control"],
  ["wood-borer-control", "wood-borer-control"],
  ["honey-bee-pest-control", "honey-bee-control"],
  ["honey-bee-control", "honey-bee-control"],
  ["dog-ticks-pest-control", "dog-ticks-control"],
  ["dog-ticks-control", "dog-ticks-control"],
  ["herbal-pest-control", "herbal-pest-control"],
  ["fly-pest-control", "fly-pest-control"],
  ["home-pest-control", "home-pest-control"],
  ["residential-pest-control", "home-pest-control"],
  ["rodent-pest-control", "rodent-control"],
  ["spider-pest-control", "spider-pest-control"],
  ["lizard-pest-control", "lizard-pest-control"],
  ["pest-control", "pest-control"],
];

// ------------------------------------------------------------------ classification

export type PageKind = "local" | "service" | "keyword" | "guide" | "hub-guides" | "hub-faq" | "hub-areas" | "hub-checklist" | "html-sitemap";

export type Classified = {
  sourcePath: string; // exactly as in the original sitemap (may contain %20, %27…)
  decoded: string;
  kind: PageKind;
  family?: string;
  localitySlug?: string;
  sitemapPage?: number;
  guide?: GuideConfig;
};

function keywordFamily(s: string) {
  if (/termite/.test(s)) return "termite-control";
  if (/tick/.test(s)) return "dog-ticks-control";
  if (/bee|hornet|yellow-jacket|wasp/.test(s)) return "honey-bee-control";
  if (/wildlife|vole|rabbit|animal/.test(s)) return "wildlife-control";
  return "pest-control";
}

export function classify(sourcePath: string): Classified {
  const decoded = decode(sourcePath);
  const s = decoded.toLowerCase().trim();
  const base = { sourcePath, decoded };

  const sm = s.match(/^site-map(?:-(\d+))?$/);
  if (sm) return { ...base, kind: "html-sitemap", sitemapPage: sm[1] ? Number(sm[1]) : 1 };
  const guide = GUIDE_BY_SLUG.get(s);
  if (guide) return { ...base, kind: "guide", guide, family: guide.family };
  if (s === "pest-control-guides") return { ...base, kind: "hub-guides" };
  if (s === "pest-faq") return { ...base, kind: "hub-faq" };
  if (s === "pest-control-service-areas") return { ...base, kind: "hub-areas" };
  if (s === "pest-control-preparation-checklist") return { ...base, kind: "hub-checklist" };

  if (s.includes("near-me") || /^(professional-wildlife|wildlife|vole|rabbit|yellow-jackets|exterminator|bee-and-hornet)/.test(s)) {
    const prefix = PREFIXES.find(([p]) => s.startsWith(`${p}-`));
    return { ...base, kind: "keyword", family: prefix && !s.startsWith("pest-control-") ? prefix[1] : keywordFamily(s) };
  }
  if (["about-us", "booknow", "contact", "services", "testimonials"].includes(s)) {
    return { ...base, kind: "service", family: "pest-control" };
  }

  for (const [prefix, family] of PREFIXES) {
    if (s === prefix) return { ...base, kind: "service", family };
    if (s.startsWith(`${prefix}-`) || s.startsWith(`${prefix} `)) {
      let loc = s.slice(prefix.length).replace(/^[\s-]+/, "").trim();
      if (loc === "herbal") return { ...base, kind: "service", family: "herbal-pest-control" };
      loc = loc.replace(/^service-in-/, "");
      return { ...base, kind: "local", family, localitySlug: loc };
    }
  }
  return { ...base, kind: "service", family: keywordFamily(s) };
}

// ------------------------------------------------------------------ indexes (built once)

type IndexEntry = { sourcePath: string; family: string; locality: string; regionKey: string; name: string; occurrence: number };
let INDEX: { all: Classified[]; local: IndexEntry[]; byLocality: Map<string, IndexEntry[]>; byFamilyRegion: Map<string, IndexEntry[]> } | null = null;

export function siteIndex() {
  if (INDEX) return INDEX;
  const all = (legacySlugs as string[]).map(classify);
  const local: IndexEntry[] = [];
  const seenPair = new Map<string, number>();
  for (const c of all) {
    if (c.kind !== "local" || !c.localitySlug || !c.family) continue;
    const pair = `${c.family}|${prettyLocality(c.localitySlug).toLowerCase()}`;
    const occurrence = seenPair.get(pair) ?? 0;
    seenPair.set(pair, occurrence + 1);
    local.push({ sourcePath: c.sourcePath, family: c.family, locality: c.localitySlug, regionKey: findRegion(c.localitySlug).key, name: prettyLocality(c.localitySlug), occurrence });
  }
  const byLocality = new Map<string, IndexEntry[]>();
  const byFamilyRegion = new Map<string, IndexEntry[]>();
  for (const e of local) {
    byLocality.set(e.locality, [...(byLocality.get(e.locality) ?? []), e]);
    const k = `${e.family}|${e.regionKey}`;
    byFamilyRegion.set(k, [...(byFamilyRegion.get(k) ?? []), e]);
  }
  INDEX = { all, local, byLocality, byFamilyRegion };
  return INDEX;
}

export const legacyHref = (sourcePath: string) => `/${sourcePath}`;

// ------------------------------------------------------------------ output model

export type LinkItem = { label: string; href: string };
export type LinkGroup = { heading: string; links: LinkItem[] };

export type LegacyModel = {
  kind: PageKind;
  sourcePath: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  quickAnswer: string;
  image: string;
  imageAlt: string;
  breadcrumbs: LinkItem[];
  facts: ServiceFact[];
  intro: string[];
  localHeading?: string;
  localParagraphs?: string[];
  signsHeading?: string;
  signs: string[];
  sections: ServiceSection[];
  processHeading: string;
  process: ServiceStep[];
  preparation: string[];
  aftercare: string[];
  prevention: string[];
  preventionHeading: string;
  whyHeading: string;
  why: { title: string; text: string }[];
  costHeading?: string;
  cost?: string[];
  closing: string;
  faqs: FaqItem[];
  linkGroups: LinkGroup[];
  family?: Family;
  locality?: { slug: string; name: string; region: Region; type: LocalityType };
  servicePage?: LinkItem;
  bigList?: { heading: string; groups: LinkGroup[] };
  schemaType: "Service" | "Article" | "CollectionPage" | "FAQPage";
  reviewService?: { slug: string; title: string; pest?: string };
};

// ------------------------------------------------------------------ text pools

const CITY: Record<string, string> = {
  "south-mumbai": "Mumbai", "central-mumbai": "Mumbai", "western-suburbs": "Mumbai", "eastern-suburbs": "Mumbai", mmr: "Mumbai",
  thane: "Thane", "navi-mumbai": "Navi Mumbai", "mira-vasai-palghar": "Mira-Bhayandar–Vasai-Virar", raigad: "Raigad", pune: "Pune", outside: "",
};

const INTROS = [
  "Looking for {svcl} in {loc}? Eco-Friendly Pests inspects your home or business first, explains exactly what is causing the problem, and gives you a fixed written quote before any treatment begins.",
  "If {pestl} have become a problem in {loc}, you are not alone — it is one of the most common requests we receive {inregion}. Our trained technicians treat the source, not just what you can see.",
  "Eco-Friendly Pests provides {svcl} for flats, bungalows, offices and shops in {loc}, using targeted, low-odour methods and clear safety instructions for families, staff and pets.",
  "Residents and businesses in {loc} call us when {pestl} start showing up in kitchens, storerooms, bedrooms or common areas. Here is how our {svcl} works and what you can expect from the visit.",
  "From the first inspection to the follow-up visit, our {svcl} in {loc} is planned around your property — whether it is a compact flat, a family bungalow, a housing society or a commercial unit.",
  "{Svc} in {loc} starts with a free inspection. We find where {pestl} are hiding, how they are getting in and what is attracting them, then treat those exact spots.",
];
const INTRO_2 = [
  "Every visit is carried out by our own trained technicians — not subcontractors — using products registered for professional use, applied according to their label directions.",
  "You get a clear explanation of the treatment, preparation steps before the visit, aftercare instructions and a written service report with your warranty or service period.",
  "We use odourless gel and bait methods indoors wherever they work, and keep sprays limited to cracks, drains and outer areas, so most families can stay at home during treatment.",
  "There are no surprise charges on the day: the price is confirmed in writing after inspection, based on the size of your property and the level of activity.",
];
const QUICK_LEADS = [
  "{Svc} in {loc} usually takes {time}.",
  "For a typical home in {loc}, {svcl} takes {time}.",
  "In {loc}, {svcl} begins with a free inspection; the treatment itself typically takes {time}.",
];
const WHY_POOL = [
  { title: "Free inspection first", text: "We find the cause before quoting, so you only pay for treatment you actually need." },
  { title: "Fixed written quote", text: "The price is confirmed in writing before work starts — no extra charges added on the day." },
  { title: "Trained in-house technicians", text: "Our own technicians carry out every visit and follow label directions and safety procedures." },
  { title: "Low-odour methods indoors", text: "Gel baits, bait stations and targeted crack-and-crevice treatment keep odour and exposure low." },
  { title: "Written warranty", text: "Your service period is written on the report, with free re-treatment if activity returns within it." },
  { title: "Safe-use guidance", text: "You get clear instructions on preparation, re-entry times and aftercare for children and pets." },
  { title: "Homes and businesses", text: "We treat flats, bungalows, housing societies, offices, restaurants, shops and warehouses." },
  { title: "Documented service", text: "Every visit is recorded in a service report — useful for societies and audit-ready for businesses." },
];
const CLOSINGS = [
  "Ready to sort out {pestl} in {loc}? Call or WhatsApp {phone}, or book a free inspection online — we’ll confirm a convenient time.",
  "Book your free inspection for {svcl} in {loc} today. We’ll inspect, explain and quote in writing before starting any work.",
  "Don’t wait for {pestl} in {loc} to spread to the rest of the building. A free inspection is the quickest way to know exactly what you’re dealing with.",
  "Talk to a technician about {svcl} in {loc}: call or WhatsApp {phone}, Monday to Saturday, 9 am to 9 pm.",
];
const COST_TEMPLATES = [
  "The cost of {svcl} in {loc} depends on the size of the property, how widespread the activity is and whether you choose a one-time visit or an annual plan. We confirm a fixed price in writing after a free inspection.",
  "Pricing for {svcl} in {loc} is based on carpet area, the number of rooms or zones treated, the infestation level and the plan you choose. You’ll know the exact amount before any work starts.",
  "There is no one-size price for {svcl} — a 1 BHK in {loc} needs far less than a large bungalow or a restaurant. After inspection we give you a written quote with no hidden charges.",
];
const DESC_TEMPLATES = [
  "{Svc} in {loc}: free inspection, odourless options and a written warranty. Trained technicians for homes, societies and businesses. Call {phone}.",
  "Need {svcl} in {loc}? Eco-Friendly Pests inspects first, quotes in writing and treats safely for families and pets. Book a free inspection today.",
  "Professional {svcl} in {loc}{city}. Targeted, low-odour treatment, safe-use guidance and follow-up support. Free inspection, fixed quote.",
  "Eco-Friendly Pests offers {svcl} in {loc} for flats, bungalows, offices and shops — inspection first, written quote, warranty on every plan.",
];

// Local FAQs — answers are filled from the page’s own family facts, region and neighbours, so they differ per page.
type LocalFaqContext = { loc: string; svc: string; svcl: string; pestl: string; region: Region; family: Family; nearby: string[]; city: string };
const LOCAL_FAQS: ((c: LocalFaqContext) => FaqItem)[] = [
  (c) => ({
    question: `Do you provide ${c.svcl} in ${c.loc}?`,
    answer: c.region.served
      ? `Yes. Eco-Friendly Pests provides ${c.svcl} in ${c.loc} and nearby areas ${c.region.inPhrase}. Call or WhatsApp +91-94533 94533 to book a free inspection.`
      : `${c.loc} is outside our main service region of Mumbai, Thane, Navi Mumbai and Pune. Please call +91-94533 94533 to check availability before booking — we’ll tell you upfront if we can’t attend.`,
  }),
  (c) => ({ question: `How long does ${c.svcl} take in ${c.loc}?`, answer: `${factValue(c.family, ["Treatment time", "Typical time"]) ?? "Most visits take one to two hours"} for a typical home in ${c.loc}. Larger homes, bungalows and commercial sites take longer.` }),
  (c) => ({ question: `Do I need to leave my home in ${c.loc} during ${c.svcl}?`, answer: `${factValue(c.family, ["Need to vacate?", "Re-entry"]) ?? "Usually not"}. Your technician will confirm exactly which rooms to avoid and for how long before starting.` }),
  (c) => ({ question: `What does ${c.svcl} cost in ${c.loc}?`, answer: `It depends on the size of the property, the level of activity and the plan you choose. After a free inspection in ${c.loc} you get a fixed written quote with no hidden charges.` }),
  (c) => ({ question: `Which pests are most common ${c.region.inPhrase}?`, answer: `${c.region.pressure[0]} ${c.region.pressure[1] ?? ""}`.trim() }),
  (c) => ({ question: `Do you also serve areas near ${c.loc}?`, answer: c.nearby.length ? `Yes. We also provide ${c.svcl} in nearby areas such as ${c.nearby.slice(0, 4).join(", ")}.` : `Yes. Call to confirm availability in neighbouring areas.` }),
  (c) => ({ question: `Can housing societies in ${c.loc} book ${c.svcl} for the whole building?`, answer: `Yes. Treating common areas such as drains, shafts, garbage rooms and compound walls along with individual flats gives longer-lasting results, and we document every visit for the society.` }),
  (c) => ({ question: `Is ${c.svcl} in ${c.loc} safe for children and pets?`, answer: `Yes, when you follow the re-entry and aftercare advice. We use targeted, low-odour methods and tell you exactly how long children and pets should stay away from treated areas.` }),
  (c) => ({ question: `Do shops, offices and restaurants in ${c.loc} get ${c.svcl}?`, answer: `Yes. Commercial sites in ${c.loc} can book one-time treatment or a scheduled programme with service reports, with visits planned outside working hours where possible.` }),
  (c) => ({ question: `What should I do before the technician arrives in ${c.loc}?`, answer: `${c.family.preparation.slice(0, 2).join(" ")} Your technician will confirm anything else when the visit is booked.` }),
  (c) => ({ question: `Is there a warranty on ${c.svcl} in ${c.loc}?`, answer: `Yes. Your service period depends on the plan you choose and is written on the service report. If activity returns within that period, we re-treat at no extra cost.` }),
  (c) => ({ question: `How do I book ${c.svcl} in ${c.loc}?`, answer: `Call or WhatsApp +91-94533 94533 (Monday to Saturday, 9 am to 9 pm) or use the booking form on this page. Mention ${c.loc} and the problem you’re seeing.` }),
];

function factValue(family: Family, labels: string[]) {
  const f = family.facts.find((x) => labels.includes(x.label));
  return f ? f.value.charAt(0).toUpperCase() + f.value.slice(1) : undefined;
}

// Keyword-intent angles for "near me" pages.
const ANGLES: { test: RegExp; heading: string; body: string }[] = [
  { test: /best|top/, heading: "How to choose the best {svcl} company near you", body: "Look for a company that **inspects before quoting**, explains what it found, and gives a **fixed written quote**. Ask which products will be used and whether they are registered for professional use, how long you must stay out of treated rooms, and what the **written warranty** covers. Be wary of anyone who quotes over the phone without seeing the property or promises a lifetime of protection." },
  { test: /compan/, heading: "What to check before hiring {svcl} companies", body: "- Do they send **their own trained technicians**, or subcontract?\n- Will they **inspect first** and show you the evidence?\n- Is the quote **fixed and written**, including follow-up visits?\n- Is there a **warranty or service period** on the report?\n- Can they provide **service reports** for your housing society or business?" },
  { test: /exterminator/, heading: "What does a {pestl} exterminator actually do?", body: "A professional doesn’t just spray. They **identify the species**, find where it nests and how it gets in, choose a method that suits your property, treat those exact spots and then advise on **proofing and hygiene** so the problem doesn’t return. A good technician will also tell you honestly if something needs a different service." },
  { test: /inspection/, heading: "What a professional {pestl} inspection includes", body: "An inspection checks the areas where activity usually starts — wall-floor joints, door frames, wardrobes, kitchens, drains, lofts and outer walls — using tapping, moisture checks and visual signs. You are shown what was found, given a written quote and told what can wait and what can’t." },
  { test: /removal|nest/, heading: "How professional {pestl} removal works", body: "Removal starts with identifying the pest and the safest approach, then treating or removing the colony at the source, clearing residue that attracts new pests, and sealing the spot. Follow-up checks confirm the problem has not returned." },
  { test: /treatment/, heading: "{Svc} treatment options compared", body: "Different situations call for different methods: **targeted baits and crack-and-crevice treatment** for indoor pests, **barrier treatments** for soil-borne pests like termites, **source reduction** for flies and mosquitoes, and **exclusion** for rodents. Your technician explains which applies after inspection." },
  { test: /specialist/, heading: "Why use a {pestl} specialist?", body: "Specialists know the habits of the pest — where it hides, how it spreads and what makes it come back — so treatment goes exactly where it is needed. That usually means fewer products, less disruption and longer-lasting results than general spraying." },
  { test: /service/, heading: "{Svc} service plans", body: "Choose a **one-time treatment** for a specific problem, or an **annual plan** with scheduled visits and free re-treatment between them. Housing societies and businesses usually prefer annual plans with documented visits." },
  { test: /local/, heading: "Local {svcl} across Mumbai, Thane, Navi Mumbai and Pune", body: "We serve homes and businesses across the Mumbai region and Pune from our base in Dahisar (East), Mumbai. Use the area list on this page to find your locality." },
  { test: /vole|rabbit/, heading: "Voles and rabbits: what you’re probably seeing", body: "Voles and wild rabbits aren’t typical pests in Mumbai or Pune homes. What people usually see digging in gardens or running along walls are **field mice, house mice, shrews or bandicoot rats**. The fix is identification, removing food and shelter, sealing entry points and using bait stations or traps where appropriate." },
  { test: /yellow-jacket|hornet/, heading: "Yellow jackets, hornets and wasps in India", body: "“Yellow jacket” is an American name for social wasps. In Indian homes the usual culprits are **paper wasps and hornets** building nests under eaves, sunshades and AC units, and **honey bees or rock bees** building combs on balconies. The right removal method depends on which insect it is." },
  { test: /wildlife/, heading: "What wildlife control covers — and what it doesn’t", body: "We handle **rats, mice, bandicoots, bees and wasps**. Snakes, monkeys and other protected animals must be handled by the **Forest Department or a registered rescue organisation**. We can then help reduce the rodents and food sources that attracted them." },
  { test: /control|pest/, heading: "How effective {svcl} works", body: "Effective control follows four steps: **inspect** to find the source, **treat** where the pest lives and travels, **proof** the entry points, and **monitor** with a follow-up. Skipping any one of them is why DIY treatment so often fails." },
];

// ------------------------------------------------------------------ builders

const PHONE = "+91-94533 94533";

function baseVars(family: Family, loc: string, region?: Region) {
  const svc = family.label;
  const city = region ? CITY[region.key] : "";
  return {
    Svc: svc,
    svc,
    svcl: svc.toLowerCase().replace(/^rat & rodent/, "rat and rodent"),
    pestl: family.pest.toLowerCase(),
    loc,
    inregion: region?.inPhrase ?? "across the Mumbai region",
    phone: PHONE,
    city: city && !loc.toLowerCase().includes(city.toLowerCase()) ? `, ${city}` : "",
  };
}

/** Make family copy fit the page's place: "in Mumbai" → "in {loc}"; outside Mumbai, "Mumbai’s" → "{city}’s". */
function localiseText(text: string, loc: string, region: Region) {
  let out = text.replace(/\bin Mumbai\b(?! (?:region|Metropolitan))/, `in ${loc}`);
  const city = CITY[region.key];
  if (!["Mumbai", ""].includes(city ?? "")) out = out.replace(/\bMumbai(’|')s\b/g, `${city}$1s`).replace(/\bin Mumbai\b/g, `in ${city}`);
  if (region.key === "outside") out = out.replace(/\bMumbai(’|')s\b/g, "the local").replace(/\bin Mumbai\b/g, "in your city");
  return out;
}

function localiseHeading(heading: string, loc: string) {
  return heading.replace(/\bin Mumbai( homes)?\b/i, (_, homes) => `in ${loc}${homes ? " homes" : ""}`);
}

function trimTitle(t: string) {
  return t.length <= 62 ? t : t.replace(/ \| Eco-Friendly Pests$/, "");
}

function familyFaqs(r: Rand, family: Family, n: number) {
  return sample(r, family.faqs, n);
}

function nearbyEntries(entry: { family: string; locality: string; regionKey: string }, r: Rand, n: number) {
  const idx = siteIndex();
  const list = idx.byFamilyRegion.get(`${entry.family}|${entry.regionKey}`) ?? [];
  const pos = list.findIndex((e) => e.locality === entry.locality);
  // Neighbours in list order (alphabetical within the region) plus a few seeded picks, without the page itself.
  const around = list.slice(Math.max(0, pos - 3), pos + 4).filter((e) => e.locality !== entry.locality);
  const extra = sample(r, list.filter((e) => e.locality !== entry.locality && !around.includes(e)), n);
  return [...around, ...extra].slice(0, n);
}

function whyItems(r: Rand) {
  return sample(r, WHY_POOL, 4);
}

function servicePageLink(family: Family): LinkItem | undefined {
  return family.servicePage ? { label: `Complete ${family.label.toLowerCase()} guide`, href: family.servicePage } : undefined;
}

// --- local pages ---------------------------------------------------
function buildLocal(c: Classified): LegacyModel {
  const family = FAMILIES.get(c.family!)!;
  const locSlug = c.localitySlug!;
  const loc = prettyLocality(locSlug);
  const region = findRegion(locSlug);
  const type = findLocalityType(locSlug);
  const r = rng(c.sourcePath);
  const v = baseVars(family, loc, region);
  const idx = siteIndex();

  const nearby = nearbyEntries({ family: c.family!, locality: locSlug, regionKey: region.key }, r, 10);
  const sameArea = (idx.byLocality.get(locSlug) ?? []).filter((e) => e.family !== c.family);

  const timeFact = family.facts.find((f) => ["Treatment time", "Typical time"].includes(f.label));
  const stayFact = family.facts.find((f) => ["Need to vacate?", "Re-entry"].includes(f.label));
  const lead1 = timeFact
    ? fill(pick(r, QUICK_LEADS), { ...v, time: timeFact.value.replace(/^(\d)/, "$1") })
    : `${v.Svc} in ${loc} starts with a free inspection, so the visit can be planned around your property.`;
  const lead2 = stayFact ? ` ${stayFact.label === "Re-entry" ? "Re-entry:" : "Need to vacate?"} ${stayFact.value}.` : "";
  const quickAnswer = `${lead1}${lead2} ${localiseText(family.quickAnswer.split(/(?<=\.)\s+/).slice(0, 2).join(" "), loc, region)}`;

  const sectionCount = family.sections.length >= 4 ? 3 : family.sections.length;
  const sections = sample(r, family.sections, sectionCount)
    .sort((a, b) => family.sections.indexOf(a) - family.sections.indexOf(b))
    .map((s) => ({ heading: localiseText(localiseHeading(s.heading, loc), loc, region), body: localiseText(s.body, loc, region) }));

  const localParagraphs = [
    fill(pick(r, TYPE_COPY[type]), v),
    `${pick(r, region.context)} ${sample(r, region.pressure, 2).join(" ")}`,
  ];
  if (sameArea.length) {
    const others = [...new Set(sameArea.map((e) => FAMILIES.get(e.family)?.label.toLowerCase()).filter(Boolean))].slice(0, 4) as string[];
    const list = others.length > 1 ? `${others.slice(0, -1).join(", ")} and ${others[others.length - 1]}` : others[0];
    localParagraphs.push(`Alongside ${v.svcl}, households and businesses in ${loc} also book ${list} with us — see the links further down this page.`);
  }

  const faqCtx: LocalFaqContext = { loc, svc: v.Svc, svcl: v.svcl, pestl: v.pestl, region, family, nearby: nearby.map((e) => e.name), city: CITY[region.key] };
  const local = sample(r, LOCAL_FAQS, 6).map((f) => f(faqCtx));
  // Drop family FAQs that ask the same thing as a local FAQ in different words (time, vacating, cost…).
  const covered = new Set(local.map((f) => faqTopic(f.question)).filter(Boolean));
  const familyPicks = familyFaqs(r, family, family.faqs.length).filter((f) => !covered.has(faqTopic(f.question)));
  const faqs = dedupe([...local, ...familyPicks]).slice(0, 12);

  // Original sitemap sometimes lists the same service+locality twice (e.g. "x-masjid-bunder" and "x masjid-bunder"):
  // the repeat gets a different title so no two pages share one.
  const occurrence = idx.local.find((e) => e.sourcePath === c.sourcePath)?.occurrence ?? 0;
  const descVars = { ...v };
  const h1Variants = [`${v.Svc} in ${loc}`, `${v.Svc} Services in ${loc}`, `${v.Svc} in ${loc}${v.city || ", Maharashtra"}`];
  const h1 = occurrence ? h1Variants[1 + ((occurrence - 1) % 2)] : pick(r, h1Variants);
  let metaDescription = occurrence
    ? `${h1Variants[1 + ((occurrence - 1) % 2)]} — inspection first, a fixed written quote and a written warranty. Call ${PHONE}.`
    : fill(pick(r, DESC_TEMPLATES), descVars);
  if (metaDescription.length > 160) metaDescription = fill(DESC_TEMPLATES[1], descVars);
  if (metaDescription.length > 160) metaDescription = `${v.Svc} in ${loc}: free inspection, written quote and warranty. Call ${PHONE}.`;

  const linkGroups: LinkGroup[] = [];
  if (sameArea.length) linkGroups.push({ heading: `Other pest control services in ${loc}`, links: sameArea.map((e) => ({ label: `${FAMILIES.get(e.family)?.label ?? "Pest Control"} in ${loc}`, href: legacyHref(e.sourcePath) })) });
  if (nearby.length) linkGroups.push({ heading: `${v.Svc} in nearby areas`, links: nearby.map((e) => ({ label: `${v.Svc} in ${e.name}`, href: legacyHref(e.sourcePath) })) });

  return {
    kind: "local",
    sourcePath: c.sourcePath,
    metaTitle: trimTitle(occurrence ? `${h1} | Eco-Friendly Pests` : `${v.Svc} in ${loc} | Eco-Friendly Pests`),
    metaDescription,
    h1,
    eyebrow: region.served ? region.name : "Service availability on request",
    quickAnswer,
    image: family.image,
    imageAlt: `${family.label} in ${loc} — ${family.imageAlt.charAt(0).toLowerCase()}${family.imageAlt.slice(1)}`,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Service areas", href: "/pest-control-service-areas" },
      { label: `${v.Svc} in ${loc}`, href: legacyHref(c.sourcePath) },
    ],
    facts: family.facts,
    intro: [fill(pick(r, INTROS), v), fill(pick(r, INTRO_2), v)],
    localHeading: pick(r, [`Pest problems in ${loc}`, `Why ${v.pestl} are a problem in ${loc}`, `About pest control in ${loc}`, `What we see in ${loc}`]),
    localParagraphs,
    signsHeading: pick(r, [`Signs of ${v.pestl} in ${loc} homes`, `How to tell if you have ${v.pestl}`, `Early warning signs to look for in ${loc}`]),
    signs: sample(r, family.signs, Math.min(5, family.signs.length)),
    sections,
    processHeading: pick(r, [`How our ${v.svcl} works in ${loc}`, `Our ${v.svcl} process, step by step`, `What happens during the visit`]),
    process: family.process.map((step, i) => (i === 0 ? { ...step, text: `${step.text} ${pick(r, [`For ${loc}, the technician`, `In ${loc} homes, we`, `At your ${loc} property, we`])} ${pick(r, ["also check shared drains, ducts and the building’s common areas where relevant.", "note anything in neighbouring units or common areas that could cause re-infestation.", "look at balconies, lofts and storage areas that are often missed."])}` } : step)),
    preparation: sample(r, family.preparation, 3),
    aftercare: sample(r, family.aftercare, 3),
    prevention: sample(r, family.prevention, 3),
    preventionHeading: pick(r, [`Keeping ${v.pestl} away after treatment`, `Prevention tips for ${loc} homes`, `How to stop ${v.pestl} coming back`]),
    whyHeading: pick(r, [`Why ${loc} chooses Eco-Friendly Pests`, "Why choose Eco-Friendly Pests", `What you can expect in ${loc}`]),
    why: whyItems(r),
    costHeading: `How much does ${v.svcl} cost in ${loc}?`,
    cost: [fill(pick(r, COST_TEMPLATES), v)],
    closing: fill(pick(r, CLOSINGS), v),
    faqs,
    linkGroups,
    family,
    locality: { slug: locSlug, name: loc, region, type },
    servicePage: servicePageLink(family),
    schemaType: "Service",
    reviewService: { slug: family.slug, title: family.title, pest: family.pest },
  };
}

// --- service (family root) & keyword pages ------------------------
function regionDirectory(familyKey: string, limitPerRegion = 40): LinkGroup[] {
  const idx = siteIndex();
  const label = FAMILIES.get(familyKey)?.label ?? "Pest Control";
  const groups: LinkGroup[] = [];
  for (const region of [...REGIONS, { key: "mmr", name: "Other Mumbai-region areas" } as Region]) {
    const list = idx.byFamilyRegion.get(`${familyKey}|${region.key}`) ?? [];
    if (!list.length) continue;
    groups.push({ heading: region.name, links: list.slice(0, limitPerRegion).map((e) => ({ label: `${label} in ${e.name}`, href: legacyHref(e.sourcePath) })) });
  }
  return groups;
}

function buildServiceOrKeyword(c: Classified): LegacyModel {
  const family = FAMILIES.get(c.family!) ?? FAMILIES.get("pest-control")!;
  const r = rng(c.sourcePath);
  const v = baseVars(family, "Mumbai, Thane, Navi Mumbai and Pune");
  const keywordText = prettyLocality(c.decoded).replace(/&/g, "and");
  const isKeyword = c.kind === "keyword";
  const s = c.decoded.toLowerCase();

  const angles = ANGLES.filter((a) => a.test.test(s));
  const primary = angles[0] ?? ANGLES[ANGLES.length - 1];
  const secondary = sample(r, ANGLES.filter((a) => a !== primary && !/vole|rabbit|yellow|wildlife|local/.test(a.test.source)), 2);
  const angleSections: ServiceSection[] = isKeyword
    ? [primary, ...secondary].map((a) => ({ heading: fill(a.heading, v), body: fill(a.body, v) }))
    : [];

  const rootPrefix = PREFIXES.find(([, f]) => f === family.slug)?.[0];
  const altRoot = !isKeyword && s !== family.slug && !(family.slug === "pest-control" && s === rootPrefix);
  const altName = s === "pest-control-herbal" ? "Herbal Pest Control Services" : keywordText;
  const h1 = isKeyword ? keywordText.replace(/\bNear Me\b/i, "Near You") : altRoot ? altName : family.h1;
  const metaTitle = trimTitle(
    isKeyword ? `${keywordText} | Eco-Friendly Pests`
      : altRoot ? `${altName} in Mumbai & Pune | Eco-Friendly Pests`
      : `${family.label} in Mumbai, Thane & Pune | Eco-Friendly Pests`,
  );
  const metaDescription = isKeyword
    ? `${keywordText.replace(/ Near Me$/i, "")} near you in Mumbai, Thane, Navi Mumbai and Pune: inspection first, written quote and warranty. Call ${PHONE}.`.slice(0, 160)
    : `${altRoot ? altName : family.label} across Mumbai, Thane, Navi Mumbai and Pune. ${family.shortDescription}`.slice(0, 158).replace(/\s+\S*$/, "") + ".";

  const directory = regionDirectory(family.slug === "wildlife-control" ? "rodent-control" : family.slug === "ant-control" ? "pest-control" : family.slug);
  const faqs = dedupe([
    ...(isKeyword ? [
      { question: `How do I find ${keywordText.toLowerCase().replace(/ near me$/, "")} near me?`, answer: `Use the area list on this page to find your locality, or call ${PHONE}. We serve Mumbai, Thane, Navi Mumbai and Pune from our base in Dahisar (East), Mumbai.` },
      { question: `Does Eco-Friendly Pests offer ${family.label.toLowerCase()} near me?`, answer: `Yes, across Mumbai, Thane, Navi Mumbai and Pune. Each visit starts with a free inspection and a fixed written quote.` },
    ] : []),
    ...sample(r, family.faqs, 12),
  ]).slice(0, 12);

  return {
    kind: c.kind,
    sourcePath: c.sourcePath,
    metaTitle,
    metaDescription,
    h1,
    eyebrow: isKeyword ? "Serving Mumbai, Thane, Navi Mumbai & Pune" : "Mumbai · Thane · Navi Mumbai · Pune",
    quickAnswer: family.quickAnswer,
    image: family.image,
    imageAlt: family.imageAlt,
    breadcrumbs: [
      { label: "Home", href: "/" },
      ...(family.servicePage ? [{ label: family.label, href: family.servicePage }] : [{ label: "Services", href: "/services" }]),
      { label: h1, href: legacyHref(c.sourcePath) },
    ],
    facts: family.facts,
    intro: [
      isKeyword
        ? `Searching for ${keywordText.toLowerCase().replace(/ near me$/, "")} near you? Eco-Friendly Pests serves homes, housing societies and businesses across Mumbai, Thane, Navi Mumbai and Pune, with a free inspection and a fixed written quote before any work starts.`
        : `${family.shortDescription} We serve homes, housing societies and businesses across Mumbai, Thane, Navi Mumbai and Pune.`,
      fill(pick(r, INTRO_2), v),
    ],
    signsHeading: `Signs you need ${family.label.toLowerCase()}`,
    signs: family.signs,
    sections: [...angleSections, ...family.sections],
    processHeading: `How our ${family.label.toLowerCase()} works`,
    process: family.process,
    preparation: family.preparation,
    aftercare: family.aftercare,
    prevention: family.prevention,
    preventionHeading: `How to prevent ${family.pest.toLowerCase()}`,
    whyHeading: "Why choose Eco-Friendly Pests",
    why: whyItems(r),
    costHeading: `How much does ${family.label.toLowerCase()} cost?`,
    cost: [fill(pick(r, COST_TEMPLATES), { ...v, loc: "your area" })],
    closing: fill(pick(r, CLOSINGS), { ...v, loc: "your area" }),
    faqs,
    linkGroups: [],
    family,
    servicePage: servicePageLink(family),
    bigList: directory.length ? { heading: `Find ${family.label.toLowerCase()} in your area`, groups: directory } : undefined,
    schemaType: "Service",
    reviewService: { slug: family.slug, title: family.title, pest: family.pest },
  };
}

// --- guides -----------------------------------------------------------
function buildGuide(c: Classified): LegacyModel {
  const g = c.guide!;
  const family = FAMILIES.get(g.family)!;
  const r = rng(c.sourcePath);
  return {
    kind: "guide",
    sourcePath: c.sourcePath,
    metaTitle: trimTitle(`${g.title} | Eco-Friendly Pests`),
    metaDescription: g.metaDescription,
    h1: g.h1,
    eyebrow: "Pest control guide",
    quickAnswer: family.quickAnswer,
    image: family.image,
    imageAlt: family.imageAlt,
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Guides", href: "/pest-control-guides" }, { label: g.h1, href: legacyHref(c.sourcePath) }],
    facts: family.facts,
    intro: g.intro,
    signsHeading: `Signs of ${family.pest.toLowerCase()} to check for`,
    signs: family.signs,
    sections: [
      { heading: g.diyHeading, body: g.diySteps.map((s, i) => `${i + 1}. ${s}`).join("\n") },
      ...family.sections,
      { heading: g.callHeading, body: g.whenToCall.map((s) => `- ${s}`).join("\n") },
    ],
    processHeading: `How professional ${family.label.toLowerCase()} works`,
    process: family.process,
    preparation: family.preparation,
    aftercare: family.aftercare,
    prevention: family.prevention,
    preventionHeading: "Prevention checklist",
    whyHeading: "Need professional help?",
    why: whyItems(r),
    closing: fill(pick(r, CLOSINGS), baseVars(family, "your home")),
    faqs: dedupe(family.faqs).slice(0, 12),
    linkGroups: [{ heading: "More pest control guides", links: GUIDES.filter((x) => x.slug !== g.slug).map((x) => ({ label: x.h1, href: legacyHref(x.slug) })) }],
    family,
    servicePage: servicePageLink(family),
    schemaType: "Article",
    reviewService: { slug: family.slug, title: family.title, pest: family.pest },
  };
}

// --- hubs ---------------------------------------------------------------
function hubBase(c: Classified, h1: string, metaTitle: string, metaDescription: string, intro: string[]): LegacyModel {
  const general = FAMILIES.get("pest-control")!;
  const r = rng(c.sourcePath);
  return {
    kind: c.kind,
    sourcePath: c.sourcePath,
    metaTitle,
    metaDescription,
    h1,
    eyebrow: "Eco-Friendly Pests",
    quickAnswer: general.quickAnswer,
    image: "/residentialpest.webp",
    imageAlt: "Eco-Friendly Pests technician at work in a family home",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: h1, href: legacyHref(c.sourcePath) }],
    facts: [],
    intro,
    signs: [],
    sections: [],
    processHeading: "How every visit works",
    process: general.process,
    preparation: [],
    aftercare: [],
    prevention: [],
    preventionHeading: "",
    whyHeading: "Why choose Eco-Friendly Pests",
    why: whyItems(r),
    closing: fill(pick(r, CLOSINGS), baseVars(general, "your area")),
    faqs: GENERAL_FAQS,
    linkGroups: [],
    schemaType: "CollectionPage",
  };
}

function buildHub(c: Classified): LegacyModel {
  const idx = siteIndex();
  if (c.kind === "hub-guides") {
    const m = hubBase(c, "Pest Control Guides", "Pest Control Guides & How-Tos | Eco-Friendly Pests",
      "Practical pest control guides: cockroaches, ants, flies, termites, bed bugs, mosquitoes, rodents, wood borers and bee hives — plus a preparation checklist.",
      ["Practical, honest guides written by our technical team — what you can do yourself, what doesn’t work, and when it is worth calling a professional."]);
    m.bigList = { heading: "All guides", groups: [{ heading: "Pest-by-pest guides", links: [...GUIDES.map((g) => ({ label: g.h1, href: legacyHref(g.slug) })), { label: "Pest Control Preparation Checklist", href: "/pest-control-preparation-checklist" }, { label: "Pest Control FAQs", href: "/pest-faq" }] }] };
    m.sections = GUIDES.map((g) => ({ heading: g.h1, body: `${g.intro[0]}\n\n[Read the ${g.h1.toLowerCase()} guide](${legacyHref(g.slug)})` }));
    m.schemaType = "CollectionPage";
    return m;
  }
  if (c.kind === "hub-faq") {
    const m = hubBase(c, "Pest Control FAQs", "Pest Control FAQs | Eco-Friendly Pests",
      "Answers to the most common pest control questions: safety, timing, cost, preparation and pest-specific treatments for termites, cockroaches, bed bugs and more.",
      ["Straight answers to the questions customers ask us most, grouped by pest. For anything not covered here, call or WhatsApp +91-94533 94533."]);
    m.sections = [...FAMILIES.values()].filter((f) => f.slug !== "wildlife-control").map((f) => ({
      heading: `${f.label}: common questions`,
      body: f.faqs.slice(0, 3).map((q) => `**${q.question}** ${q.answer}`).join("\n\n") + (f.servicePage ? `\n\n[More about ${f.label.toLowerCase()}](${f.servicePage})` : ""),
    }));
    m.schemaType = "FAQPage";
    return m;
  }
  if (c.kind === "hub-checklist") {
    const m = hubBase(c, "Pest Control Preparation Checklist", "Pest Control Preparation Checklist | Eco-Friendly Pests",
      "How to prepare your home before pest control and what to do afterwards — checklists for cockroach, termite, bed bug, rodent, mosquito and general treatments.",
      ["Good preparation makes treatment work better and keeps your family safe. Use the checklist for the service you’ve booked, and keep the aftercare steps handy for the days after the visit."]);
    m.sections = [...FAMILIES.values()].filter((f) => !["wildlife-control", "ant-control"].includes(f.slug)).map((f) => ({
      heading: `${f.label}: before and after`,
      body: `### Before the visit\n${f.preparation.map((p) => `- ${p}`).join("\n")}\n\n### After the visit\n${f.aftercare.map((p) => `- ${p}`).join("\n")}`,
    }));
    m.schemaType = "Article";
    return m;
  }
  // service areas
  const m = hubBase(c, "Pest Control Service Areas", "Pest Control Service Areas — Mumbai, Thane, Navi Mumbai & Pune",
    "Find pest control in your locality: every area we serve across Mumbai, Thane, Navi Mumbai, Mira-Bhayandar, Vasai-Virar, Raigad and Pune.",
    ["Eco-Friendly Pests is based in Dahisar (East), Mumbai, and serves homes and businesses across the Mumbai region and Pune. Find your locality below to see the services available there."]);
  const seen = new Set<string>();
  const groups: LinkGroup[] = [];
  for (const region of [...REGIONS, { key: "mmr", name: "Other Mumbai-region areas" } as Region]) {
    const links: LinkItem[] = [];
    for (const e of idx.local) {
      if (e.regionKey !== region.key || seen.has(e.locality)) continue;
      seen.add(e.locality);
      const preferred = (idx.byLocality.get(e.locality) ?? []).find((x) => x.family === "pest-control") ?? e;
      links.push({ label: e.name, href: legacyHref(preferred.sourcePath) });
    }
    if (links.length) groups.push({ heading: `${region.name} (${links.length})`, links: links.sort((a, b) => a.label.localeCompare(b.label)) });
  }
  m.bigList = { heading: "All service areas", groups };
  return m;
}

function buildHtmlSitemap(c: Classified): LegacyModel {
  const all = (legacySlugs as string[]);
  const pages = 14;
  const size = Math.ceil(all.length / pages);
  const n = Math.min(Math.max(c.sitemapPage ?? 1, 1), pages);
  const chunk = all.slice((n - 1) * size, n * size);
  const m = hubBase(c, `Sitemap — Part ${n} of ${pages}`, `Sitemap Part ${n} of ${pages} | Eco-Friendly Pests`,
    `Part ${n} of ${pages} of the Eco-Friendly Pests sitemap: links to ${chunk.length} pest control pages for areas and services across Mumbai, Thane, Navi Mumbai and Pune.`,
    [`This is part ${n} of ${pages} of our HTML sitemap. It lists ${chunk.length} pages in the same order as our XML sitemap. Use the part links to browse the rest.`]);
  const label = (sp: string) => {
    const cl = classify(sp);
    if (cl.kind === "local") return `${FAMILIES.get(cl.family!)?.label} in ${prettyLocality(cl.localitySlug!)}`;
    return prettyLocality(cl.decoded);
  };
  m.bigList = {
    heading: `Pages in part ${n}`,
    groups: [
      { heading: "Sitemap parts", links: Array.from({ length: pages }, (_, i) => ({ label: `Part ${i + 1}`, href: i === 0 ? "/site-map" : `/site-map-${i + 1}` })) },
      { heading: `Pages ${(n - 1) * size + 1}–${(n - 1) * size + chunk.length}`, links: chunk.map((sp) => ({ label: label(sp), href: legacyHref(sp) })) },
    ],
  };
  m.faqs = GENERAL_FAQS;
  return m;
}

function faqTopic(question: string) {
  const q = question.toLowerCase();
  if (/how long does .*\btake\b/.test(q)) return "time";
  if (/\b(leave|vacate)\b/.test(q)) return "vacate";
  if (/\b(cost|price|how much)\b/.test(q)) return "cost";
  if (/warranty/.test(q)) return "warranty";
  if (/\bsafe\b/.test(q)) return "safety";
  if (/how (do|can) i book/.test(q)) return "booking";
  if (/before the (technician|visit)|prepare/.test(q)) return "prep";
  return "";
}

function dedupe(faqs: FaqItem[]) {
  const seen = new Set<string>();
  return faqs.filter((f) => {
    const k = f.question.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const CACHE = new Map<string, LegacyModel | null>();

/** Build the page model for a published legacy slug. Returns null if it isn't in the sitemap. */
export function buildLegacyModel(sourcePathOrDecoded: string): LegacyModel | null {
  const key = decode(sourcePathOrDecoded).toLowerCase();
  if (CACHE.has(key)) return CACHE.get(key)!;
  const source = (legacySlugs as string[]).find((s) => decode(s).toLowerCase() === key);
  if (!source) {
    CACHE.set(key, null);
    return null;
  }
  const c = classify(source);
  let model: LegacyModel;
  switch (c.kind) {
    case "local": model = buildLocal(c); break;
    case "guide": model = buildGuide(c); break;
    case "html-sitemap": model = buildHtmlSitemap(c); break;
    case "hub-guides": case "hub-faq": case "hub-areas": case "hub-checklist": model = buildHub(c); break;
    default: model = buildServiceOrKeyword(c);
  }
  // Every page carries exactly 12 FAQs (padded with general FAQs if a source list was short).
  model.faqs = dedupe([...model.faqs, ...GENERAL_FAQS]).slice(0, 12);
  CACHE.set(key, model);
  return model;
}
