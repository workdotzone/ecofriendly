import type { ServiceContent } from "./types";

/**
 * Curated, long-form default content for the core services.
 *
 * How it is used:
 * - Service documents in MongoDB are the source of truth for WHICH services exist,
 *   their title, slug, image and order (managed in /admin).
 * - When a database service matches one of these slugs (or aliases), any SEO field left
 *   empty in the admin is filled from here — so every page always has full content and 12 FAQs.
 * - If the database is unreachable, these services are shown instead so the site never goes blank.
 * - Admin → Services → "Import default content" copies these into the database for editing.
 *
 * Writing rules followed here (keep them when editing):
 * - Headings are phrased as real questions → featured snippets, AI answers, voice search.
 * - First sentence of every answer answers the question directly; detail comes after.
 * - No invented statistics, prices or absolute guarantees. Warranty terms are stated per plan.
 */
export const SERVICE_CONTENT: ServiceContent[] = [
  // ---------------------------------------------------------------- COCKROACH
  {
    slug: "cockroach-control",
    aliases: ["cockroach-pest-control", "cockroaches-control", "cockroach"],
    title: "Cockroach Pest Control",
    h1: "Cockroach Pest Control in Mumbai",
    metaTitle: "Cockroach Pest Control in Mumbai | Odourless Gel Treatment",
    metaDescription:
      "Odourless cockroach gel treatment for homes, kitchens and offices in Mumbai, Thane & Navi Mumbai. No need to vacate, safe-use guidance, free inspection.",
    shortDescription:
      "Odourless gel baiting that targets German and American cockroaches where they hide — kitchens, bathrooms, drains and appliances. No need to vacate your home.",
    quickAnswer:
      "Professional cockroach control in Mumbai uses odourless gel bait placed in cracks, hinges and appliance gaps where cockroaches hide. Cockroaches eat the gel and carry it back to the colony. Most homes see a sharp drop in activity within 7–10 days, with a follow-up visit to break the egg cycle.",
    image: "/services/cockroaches.webp",
    imageAlt: "Technician applying odourless cockroach gel bait inside a kitchen cabinet hinge in a Mumbai apartment",
    keywords: ["cockroach pest control Mumbai", "cockroach gel treatment", "German cockroach control", "kitchen cockroach treatment", "cockroach control near me"],
    pest: "Cockroaches",
    facts: [
      { label: "Treatment time", value: "45–90 minutes (1–3 BHK)" },
      { label: "Need to vacate?", value: "No — gel treatment is odourless" },
      { label: "Visits", value: "Initial + follow-up (plan dependent)" },
      { label: "Results", value: "Visible drop in 7–10 days" },
      { label: "Best for", value: "Kitchens, bathrooms, restaurants, offices" },
    ],
    signs: [
      "Live cockroaches running when you switch on the kitchen light at night",
      "Pepper-like droppings in drawers, cabinet hinges and behind the fridge",
      "Brown, capsule-shaped egg cases (oothecae) in corners and appliance gaps",
      "A musty, oily smell in cupboards with heavy activity",
      "Shed skins near sinks, drains and the back of the microwave or fridge",
    ],
    sections: [
      {
        heading: "Why do cockroaches keep coming back in Mumbai homes?",
        body:
          "Mumbai's warm, humid climate lets cockroaches breed all year. In apartment buildings they move between flats through shared **drain lines, electrical shafts and garbage ducts**, so cleaning alone rarely solves the problem.\n\nThe German cockroach — the small, light-brown species found in kitchens — is the hardest to control. A single egg case carries 30–40 nymphs, and over-the-counter sprays usually scatter them deeper into walls instead of reaching the colony.",
      },
      {
        heading: "How does our cockroach gel treatment work?",
        body:
          "We use **CIB&RC-registered gel baits** applied as tiny dots in the exact places cockroaches hide and travel: cabinet hinges, drawer runners, sink cut-outs, switchboards, appliance motors and drain edges.\n\n- Cockroaches eat the bait and return to their harbourage.\n- The active ingredient spreads to other cockroaches that contact or feed on them (secondary kill).\n- Because the gel is odourless and placed out of reach, you do not need to empty the kitchen or leave home.\n\nFor heavy infestations, drains and outdoor areas we may add a targeted residual spray or an insect growth regulator to stop nymphs from maturing.",
      },
      {
        heading: "Gel treatment vs spray: which is better for cockroaches?",
        body:
          "For indoor kitchens, **gel baiting is usually more effective and far more comfortable** than a general spray. Sprays kill on contact but can repel cockroaches into wall voids, and they need you to vacate and clean surfaces afterwards.\n\nSprays still have a role — in drains, ducts, garbage areas and commercial back-of-house zones. Our technician decides the mix after inspection, rather than spraying everything by default.",
      },
      {
        heading: "Cockroach control for restaurants, offices and housing societies",
        body:
          "Commercial kitchens need scheduled, documented treatment because of food-safety audits. We offer monthly or fortnightly service with **service reports, pest activity logs and recommendations** your FSSAI or facility auditor can review.\n\nFor housing societies, treating common drains, shafts and garbage rooms along with individual flats prevents re-infestation from neighbouring units.",
      },
      {
        heading: "What does cockroach pest control cost in Mumbai?",
        body:
          "The price depends on **flat size (1, 2, 3 BHK or more), infestation level, number of kitchens and bathrooms, and whether you choose a one-time service or an annual plan**. Commercial sites are quoted per area and frequency.\n\nWe inspect first and give a fixed written quote before starting. There are no extra charges added on the day.",
      },
    ],
    process: [
      { name: "Inspect", text: "We locate harbourage points — hinges, appliance motors, drains and electrical points — and assess species and infestation level." },
      { name: "Prepare", text: "We guide you to clear food from open counters. No need to empty cupboards for gel treatment." },
      { name: "Apply gel bait", text: "Odourless gel is placed as small dots in cracks and crevices where cockroaches live, out of reach of children and pets." },
      { name: "Treat drains and entry points", text: "Where required, drains, ducts and outdoor areas receive a targeted residual or growth-regulator treatment." },
      { name: "Follow up", text: "A follow-up visit (as per plan) re-baits active areas to catch nymphs hatching from egg cases." },
    ],
    preparation: [
      "Store open food, fruit and pet food in sealed containers.",
      "Clear the kitchen counter and the area under the sink so the technician can reach hinges and pipes.",
      "Do not spray household insecticide for 3–4 days before the visit — it contaminates the bait and repels cockroaches.",
      "Keep children and pets in another room while the technician works.",
    ],
    aftercare: [
      "Do not wipe or wash the gel dots. Clean around them with a dry cloth.",
      "Avoid any cockroach spray or chalk for at least two weeks.",
      "Seeing more cockroaches for 2–5 days is normal — the bait draws them out of hiding.",
      "Keep sinks dry at night and close drain covers.",
    ],
    prevention: [
      "Fix leaking taps and pipes; cockroaches need water more than food.",
      "Seal gaps around pipes, switchboards and kitchen platforms with sealant.",
      "Empty kitchen dustbins every night and keep lids closed.",
      "Inspect cardboard boxes and grocery bags before bringing them inside — they often carry egg cases.",
    ],
    faqs: [
      { question: "How long does cockroach pest control take to work?", answer: "Most homes see a clear reduction in cockroach activity within 7–10 days of gel treatment. Heavy German cockroach infestations can take 3–4 weeks and a follow-up visit, because nymphs keep hatching from egg cases that bait cannot penetrate." },
      { question: "Do I need to leave my house during cockroach gel treatment?", answer: "No. Gel treatment is odourless and applied as small dots in cracks and hinges, so you can stay at home. If a spray is also needed for drains or heavy infestation, the technician will tell you in advance how long to keep that area clear." },
      { question: "Is cockroach gel safe for children and pets?", answer: "The gel is a registered product applied in tiny amounts inside cracks and hinges that children and pets cannot normally reach. We still advise keeping them away from treated areas and not letting them touch the gel dots." },
      { question: "Why am I seeing more cockroaches after treatment?", answer: "This is normal for the first few days. The bait affects cockroaches' nervous system and draws them out of hiding, so you may see more of them in the open before numbers drop sharply. Do not spray them during this time." },
      { question: "How many visits are needed to get rid of cockroaches?", answer: "Light infestations are often controlled with one visit plus a follow-up. Heavy infestations, restaurants and older buildings usually need two to three visits or an annual maintenance plan, because egg cases hatch over several weeks." },
      { question: "Can I clean the kitchen after cockroach treatment?", answer: "Yes, you can cook and clean normally, but do not wash or wipe the gel dots. Clean around them with a dry cloth and avoid using strong cleaners on hinges and cracks where gel was placed for about two weeks." },
      { question: "Which cockroaches are common in Mumbai?", answer: "The two most common are the German cockroach, a small light-brown species that lives in kitchens and appliances, and the American cockroach, a large reddish-brown species that comes from drains and sewers. They need different treatment points, which is why we inspect first." },
      { question: "Will cockroaches come back from my neighbour's flat?", answer: "They can, because cockroaches travel through shared drains, shafts and pipe openings. Sealing gaps, treating drains and, ideally, treating the building's common areas reduces re-entry. Our annual plans include re-treatment if activity returns." },
      { question: "How much does cockroach pest control cost in Mumbai?", answer: "Cost depends on flat size, infestation level and whether you choose a one-time service or an annual plan. We give a fixed written quote after a free inspection, with no extra charges added on the day." },
      { question: "Do you offer cockroach control for restaurants and hotels?", answer: "Yes. Commercial kitchens get scheduled treatment, usually monthly or fortnightly, with service reports and pest activity records that help with food-safety and FSSAI audits." },
      { question: "Is gel treatment better than cockroach spray?", answer: "For indoor kitchens, gel baiting is usually more effective because it reaches the colony and does not scatter cockroaches. Sprays are still useful for drains, ducts and outdoor areas, so we often combine both based on inspection." },
      { question: "Do you give a warranty on cockroach treatment?", answer: "Yes. The warranty or service period depends on the plan you choose and is written on your service report. If cockroach activity returns within that period, we re-treat at no extra cost." },
    ],
    related: ["bed-bugs-control", "rodent-control", "mosquito-control"],
  },

  // ---------------------------------------------------------------- TERMITE
  {
    slug: "termite-control",
    aliases: ["termite-pest-control", "anti-termite-treatment", "termite"],
    title: "Termite Control",
    h1: "Termite Control & Anti-Termite Treatment in Mumbai",
    metaTitle: "Termite Control in Mumbai | Anti-Termite Treatment",
    metaDescription:
      "Drill-fill-seal anti-termite treatment for flats, bungalows & offices in Mumbai, Thane & Navi Mumbai. Pre/post-construction, written warranty, free inspection.",
    shortDescription:
      "Drill-fill-seal post-construction and soil pre-construction anti-termite treatment that protects walls, wooden furniture and door frames from subterranean termites.",
    quickAnswer:
      "Anti-termite treatment in Mumbai is usually done by the drill-fill-seal method: small holes are drilled along the wall-floor junction, a registered termiticide is injected to create a chemical barrier, and the holes are sealed. Infested wood is treated separately. A typical 2 BHK takes 4–6 hours.",
    image: "/services/termite.webp",
    imageAlt: "Termite damage on a wooden door frame and a technician injecting termiticide along the wall-floor junction",
    keywords: ["termite control Mumbai", "anti termite treatment", "termite pest control", "drill fill seal termite", "pre construction termite treatment"],
    pest: "Termites",
    facts: [
      { label: "Method", value: "Drill-fill-seal + wood treatment" },
      { label: "Treatment time", value: "4–6 hours (typical 2 BHK)" },
      { label: "Need to vacate?", value: "Not usually; avoid treated rooms for a few hours" },
      { label: "Warranty", value: "Written, period as per plan" },
      { label: "Best for", value: "Flats, bungalows, offices, new construction" },
    ],
    signs: [
      "Mud tubes (thin tunnels of soil) on walls, skirting or behind wardrobes",
      "Hollow-sounding door frames, skirting boards or furniture",
      "Small piles of discarded wings near windows after the first rains",
      "Bubbling or peeling paint and damp patches on walls",
      "Doors and windows that suddenly stick or no longer close properly",
    ],
    sections: [
      {
        heading: "Why are termites such a problem in Mumbai?",
        body:
          "Subterranean termites thrive in Mumbai's humidity and long monsoon. They live in the soil, travel through **cracks in floors, expansion joints, electrical conduits and plumbing lines**, and feed on cellulose — door frames, wardrobes, modular kitchens, books and even wallpaper.\n\nBecause they work hidden inside wood and walls, damage is often found only after it is expensive to repair. Swarms of winged termites after the first monsoon showers are a common early warning sign.",
      },
      {
        heading: "What is the drill-fill-seal anti-termite method?",
        body:
          "Drill-fill-seal is the standard post-construction treatment for existing buildings.\n\n1. **Drill** — small holes are drilled at regular intervals along the junction of the wall and floor, and around door frames and entry points.\n2. **Fill** — a CIB&RC-registered termiticide is injected under pressure to create a continuous treated zone in the soil and masonry.\n3. **Seal** — holes are sealed with white cement or a matching filler so the floor looks finished.\n\nActive galleries in furniture and frames are treated separately with wood injection and spray.",
      },
      {
        heading: "Pre-construction vs post-construction termite treatment",
        body:
          "**Pre-construction treatment** is done at the foundation stage: the soil in foundation pits, plinth areas and under the floor is treated before concreting, creating a barrier beneath the whole building. It is the most effective time to protect a new structure.\n\n**Post-construction treatment** is for occupied homes and offices, using the drill-fill-seal method plus targeted wood treatment. Most Mumbai apartments need post-construction treatment.",
      },
      {
        heading: "Can termites spread from one flat to another?",
        body:
          "Yes. Termites travel through shared walls, ducts, electrical conduits and wooden fixtures, so a colony can affect several flats or floors. If termites are found in your flat, it is worth informing your society — **treating common areas and adjoining flats** gives longer-lasting protection than treating one unit alone.",
      },
      {
        heading: "How much does anti-termite treatment cost in Mumbai?",
        body:
          "Cost depends on **carpet area, the number of rooms and wooden fixtures, infestation level, and whether it is pre- or post-construction work**. Commercial and society jobs are quoted per running foot or area.\n\nWe inspect first, show you the activity we find, and give a fixed written quote with warranty terms before work begins.",
      },
    ],
    process: [
      { name: "Inspect", text: "We check skirting, door frames, wardrobes, kitchen units and walls with moisture and tap testing to find active galleries and entry points." },
      { name: "Plan the barrier", text: "We mark drilling points along wall-floor junctions, door frames and plumbing entries based on the layout." },
      { name: "Drill and inject", text: "Small holes are drilled and a registered termiticide is injected to form a continuous treated zone." },
      { name: "Treat infested wood", text: "Active wooden fixtures are injected and sprayed to eliminate termites already inside." },
      { name: "Seal and document", text: "Holes are sealed neatly and you receive a service report with warranty and follow-up inspection details." },
    ],
    preparation: [
      "Move light furniture about 1–2 feet away from walls so skirting can be reached.",
      "Empty the bottom shelf of wardrobes and kitchen cabinets that touch the floor.",
      "Cover or remove food, utensils and aquarium tanks from rooms being treated.",
      "Tell us where you have seen mud tubes or damage — it helps target treatment.",
    ],
    aftercare: [
      "Keep children and pets out of treated rooms for 3–4 hours and ventilate well.",
      "Do not wash the floor along the drilled line for 24 hours.",
      "Do not remove the sealing from drilled holes.",
      "Report any new mud tubes during the warranty period for free re-inspection.",
    ],
    prevention: [
      "Fix plumbing leaks and seepage quickly — damp walls attract termites.",
      "Keep wooden furniture slightly away from damp walls.",
      "Do not store cardboard, old newspapers or wood on the floor or in lofts for long periods.",
      "Schedule an annual termite inspection, especially before and after the monsoon.",
    ],
    faqs: [
      { question: "How long does anti-termite treatment take?", answer: "A typical 2 BHK post-construction treatment takes about 4–6 hours. Larger homes, bungalows and offices can take a full day, and pre-construction treatment is timed with the foundation and flooring work." },
      { question: "Do I need to leave home during termite treatment?", answer: "Usually not, but you should keep away from the room being drilled and treated, and keep children and pets out of treated rooms for 3–4 hours while it ventilates." },
      { question: "How long does termite treatment last?", answer: "A properly done chemical barrier can protect for several years, but life depends on the product, building condition and moisture. Your written warranty states the covered period, and we recommend an inspection every year." },
      { question: "What is the drill-fill-seal method?", answer: "It is a post-construction method where small holes are drilled along the wall-floor junction, a registered termiticide is injected to form a treated zone, and the holes are sealed. It stops termites coming up from the soil and through the masonry." },
      { question: "Can termites damage concrete walls?", answer: "Termites cannot eat concrete, but they travel through cracks, joints and conduits in it to reach wood, paper and other cellulose. That is why treatment targets the wall-floor junction and entry points, not just the furniture." },
      { question: "What are the first signs of termites in a flat?", answer: "Common early signs are mud tubes on walls or behind furniture, hollow-sounding door frames, discarded wings near windows after rain, and bubbling paint on damp walls." },
      { question: "Is anti-termite treatment safe for children and pets?", answer: "The termiticide is injected into the floor and wall junction and then sealed, so exposure in living areas is low. Keep children and pets out of treated rooms for a few hours and follow the technician's ventilation advice." },
      { question: "Do you treat termites in wooden furniture?", answer: "Yes. Active furniture, door frames and modular units are treated by wood injection and surface spray. Badly damaged pieces may need repair or replacement, which we point out during inspection." },
      { question: "What is pre-construction termite treatment?", answer: "It is soil treatment done during construction — in foundation pits, around the plinth and under the floor before concreting — to create a termite barrier under the whole building. It is the most effective time to protect a new structure." },
      { question: "How much does termite control cost in Mumbai?", answer: "The cost depends on carpet area, number of rooms and wooden fixtures, infestation level and the type of treatment. We provide a fixed written quote after a free inspection." },
      { question: "Do you provide a warranty for termite treatment?", answer: "Yes. Termite treatment comes with a written warranty whose period depends on the plan selected. If termite activity returns during that period, we re-inspect and re-treat at no extra cost." },
      { question: "Can termites come back after treatment?", answer: "Termites can return if the treated barrier is broken by new construction, plumbing work or heavy seepage, or if neighbouring areas are untreated. Annual inspections and fixing moisture problems keep protection effective." },
    ],
    related: ["wood-borer-control", "cockroach-control", "rodent-control"],
  },

  // ---------------------------------------------------------------- BED BUGS
  {
    slug: "bed-bugs-control",
    aliases: ["bed-bugs-pest-control", "bed-bug-control", "bedbug-control", "bed-bugs"],
    title: "Bed Bugs Control",
    h1: "Bed Bug Treatment in Mumbai",
    metaTitle: "Bed Bug Treatment in Mumbai | 2-Visit Bed Bug Control",
    metaDescription:
      "Two-visit bed bug treatment for homes, hostels and hotels in Mumbai, Thane & Navi Mumbai. Mattress, furniture and crack treatment with clear prep guidance.",
    shortDescription:
      "Two-visit bed bug treatment covering mattresses, bed frames, sofas, curtains and cracks — designed to kill hatching nymphs, not just adult bugs.",
    quickAnswer:
      "Getting rid of bed bugs needs at least two treatments about 10–15 days apart. The first visit kills adults and nymphs in mattresses, bed frames, sofas and cracks; the second kills bugs that hatch from eggs afterwards. Washing bedding in hot water and drying it on high heat supports the treatment.",
    image: "/services/bedbug.webp",
    imageAlt: "Close-up of bed bugs and eggs along a mattress seam being inspected before treatment",
    keywords: ["bed bug treatment Mumbai", "bed bugs control", "bed bug pest control near me", "mattress bed bug treatment", "bed bug spray service"],
    pest: "Bed bugs",
    facts: [
      { label: "Visits", value: "2 visits, 10–15 days apart" },
      { label: "Treatment time", value: "1–2 hours per visit (typical flat)" },
      { label: "Re-entry", value: "After 3–4 hours with ventilation" },
      { label: "Results", value: "Clear drop after the 2nd visit" },
      { label: "Best for", value: "Homes, PGs, hostels, hotels, trains-to-home cases" },
    ],
    signs: [
      "Itchy red bites in a line or cluster on arms, neck and legs after sleeping",
      "Small rust-coloured or dark spots on bed sheets and mattress seams",
      "Live flat, brown bugs or pale nymphs in mattress seams, bed joints and sofa folds",
      "Tiny white eggs and shed skins in cracks of the bed frame and headboard",
      "A sweet, musty smell in heavily infested rooms",
    ],
    sections: [
      {
        heading: "Why are bed bugs so hard to get rid of?",
        body:
          "Bed bugs hide in seams, joints and cracks only millimetres wide, can survive for months without feeding, and their **eggs are protected from most sprays**. That is why a single spray — or a home remedy — usually reduces bugs for a few days before they return.\n\nIn Mumbai, bed bugs commonly arrive through **luggage after travel, second-hand furniture, PG and hostel stays, and shared walls in apartment buildings**.",
      },
      {
        heading: "How does our 2-visit bed bug treatment work?",
        body:
          "**Visit 1** treats mattresses, bed frames, headboards, sofas, curtain folds, cupboards, switchboards and wall cracks with a registered residual insecticide, focusing on seams and joints where bugs hide.\n\n**Visit 2**, about 10–15 days later, is timed to catch nymphs that have hatched from eggs since the first visit, before they mature and lay new eggs. Skipping the second visit is the most common reason bed bugs come back.",
      },
      {
        heading: "Should I throw away my mattress if it has bed bugs?",
        body:
          "Usually **no**. Most mattresses can be treated successfully. Throwing an infested mattress out without treating the room often spreads bugs to other rooms or flats, and the new mattress gets re-infested from the bed frame and furniture.\n\nAfter treatment, a zippered bed-bug-proof mattress encasement helps trap any remaining bugs and makes future inspection easy.",
      },
      {
        heading: "Bed bug treatment for hostels, PGs and hotels",
        body:
          "Shared accommodation needs room-by-room inspection, treatment of adjoining rooms, and a schedule that fits occupancy. We provide **discreet service, after-hours visits and treatment records** for hotels, hostels and PG operators.",
      },
      {
        heading: "What does bed bug treatment cost in Mumbai?",
        body:
          "Pricing depends on **the number of rooms and beds, sofas and furniture to be treated, and infestation level**. Both visits are included in the quoted price. We confirm the fixed price after inspection.",
      },
    ],
    process: [
      { name: "Inspect", text: "We check mattress seams, bed joints, sofas, curtains, switchboards and cracks to find infested areas and estimate severity." },
      { name: "Prepare the room", text: "You wash bedding and clothes in hot water, de-clutter, and stand mattresses on edge as per our checklist." },
      { name: "First treatment", text: "Seams, joints, cracks and furniture are treated with a registered residual insecticide." },
      { name: "Second treatment", text: "10–15 days later we re-treat to kill nymphs that hatched from eggs after the first visit." },
      { name: "Review", text: "We check for activity and advise on encasements and prevention while travelling." },
    ],
    preparation: [
      "Wash bed sheets, pillow covers, curtains and clothes from infested rooms in hot water and dry them in the sun or on high heat.",
      "Remove clutter from under beds and around sofas; pack clean clothes in sealed bags.",
      "Strip the bed and stand the mattress on its side so all seams can be treated.",
      "Do not move furniture or mattresses to another room — this spreads bed bugs.",
    ],
    aftercare: [
      "Stay out of treated rooms for 3–4 hours and ventilate well before using them.",
      "Do not wash mattresses, bed frames or sofas for at least a week after treatment.",
      "Expect occasional bites for a few days as hatching nymphs contact the treatment.",
      "Keep the second-visit appointment — it is essential for complete control.",
    ],
    prevention: [
      "Inspect hotel beds and keep luggage on a rack, not on the bed or floor, when travelling.",
      "Unpack and wash travel clothes immediately after returning home.",
      "Check second-hand beds, sofas and mattresses carefully before bringing them in.",
      "Use bed-bug-proof encasements on mattresses and pillows.",
    ],
    faqs: [
      { question: "How many treatments are needed for bed bugs?", answer: "At least two treatments about 10–15 days apart are needed. The first kills adults and nymphs; the second kills bugs that hatch from eggs, which most sprays cannot penetrate. Heavy infestations may need a third visit." },
      { question: "How long should I stay out after bed bug treatment?", answer: "Keep out of treated rooms for 3–4 hours and ventilate them well before using them again. Children, pregnant women and pets should wait until the room is fully dry and aired." },
      { question: "Will bed bugs go away on their own?", answer: "No. Bed bugs can survive for months without feeding and keep breeding. Without professional treatment the infestation usually grows and spreads to other rooms." },
      { question: "Can I sleep on my bed after bed bug treatment?", answer: "Yes, once the treatment has dried and the room has been ventilated for a few hours. Use freshly washed bedding and do not wash the mattress itself for about a week." },
      { question: "Do I need to throw away my mattress?", answer: "Usually not. Most mattresses can be treated successfully. Discarding it without treating the room can spread bugs and the new mattress may get infested again." },
      { question: "Why do I still get bites after the first treatment?", answer: "Eggs that were laid before treatment continue to hatch for about two weeks. Those nymphs may bite before they contact the treatment, which is exactly why the second visit is scheduled." },
      { question: "How did I get bed bugs?", answer: "Bed bugs usually hitchhike in luggage, bags, used furniture or clothing, often after travel, hostel or PG stays, or from a neighbouring flat. They are not a sign of an unclean home." },
      { question: "Is bed bug treatment safe for children?", answer: "Registered products are applied to seams, joints and cracks rather than open surfaces. Keep children out of treated rooms for a few hours and until the treatment is dry, and follow the technician's re-entry advice." },
      { question: "Do you treat sofas and curtains for bed bugs?", answer: "Yes. Sofas, recliners, curtains, cupboards, switchboards and wall cracks near beds are all included, because bed bugs hide in many places besides the mattress." },
      { question: "How much does bed bug treatment cost in Mumbai?", answer: "The cost depends on the number of rooms, beds and sofas to be treated and the infestation level. Both visits are included, and we confirm a fixed price after inspection." },
      { question: "Do home remedies work for bed bugs?", answer: "Home remedies like neem, camphor or naphthalene may repel a few bugs but do not reach eggs and hidden colonies. Hot washing and vacuuming help, but professional treatment is needed to eliminate an infestation." },
      { question: "Do you offer a warranty on bed bug treatment?", answer: "Yes. The service period is written on your service report. If live bed bug activity is found within that period after both visits are completed, we re-treat at no extra cost." },
    ],
    related: ["cockroach-control", "mosquito-control", "rodent-control"],
  },

  // ---------------------------------------------------------------- RODENT
  {
    slug: "rodent-control",
    aliases: ["rat-control", "rodent-pest-control", "rats-control", "mice-control"],
    title: "Rodent / Rat Pest Control",
    h1: "Rodent & Rat Control in Mumbai",
    metaTitle: "Rat & Rodent Control in Mumbai | Homes, Shops, Warehouses",
    metaDescription:
      "Rat control in Mumbai, Thane & Navi Mumbai with tamper-resistant bait stations, traps and rodent-proofing for homes, societies, shops and warehouses.",
    shortDescription:
      "Integrated rat and mouse control using tamper-resistant bait stations, mechanical traps and rodent-proofing of entry points for homes, societies and businesses.",
    quickAnswer:
      "Effective rat control combines three steps: finding entry points and runways, using tamper-resistant bait stations and traps to reduce the population, and proofing gaps so rodents cannot return. Bait is always placed in locked stations away from children and pets, and most sites need follow-up visits over 2–4 weeks.",
    image: "/services/rodent.webp",
    imageAlt: "Tamper-resistant rodent bait station placed along a wall in a Mumbai warehouse",
    keywords: ["rodent control Mumbai", "rat pest control", "rat control near me", "mice control", "rodent proofing"],
    pest: "Rats and mice",
    facts: [
      { label: "Methods", value: "Bait stations, traps, proofing" },
      { label: "Visits", value: "Initial + 2–3 follow-ups" },
      { label: "Need to vacate?", value: "No" },
      { label: "Results", value: "Activity drops over 2–4 weeks" },
      { label: "Best for", value: "Homes, societies, shops, restaurants, warehouses" },
    ],
    signs: [
      "Droppings near food, along walls, in cupboards or false ceilings",
      "Gnawed wires, pipes, food packets, doors or furniture edges",
      "Scratching or running sounds in ceilings and walls at night",
      "Grease marks along walls and holes near drains or gutters",
      "Shredded paper, cloth or plastic used as nesting material",
    ],
    sections: [
      {
        heading: "Why is rat control urgent in Mumbai?",
        body:
          "Rats and mice contaminate food and surfaces with urine and droppings, damage electrical wiring (a fire risk), and are linked to diseases such as **leptospirosis**, which rises in Mumbai during the monsoon. Rodents breed quickly, so a few sightings can become a large population within weeks.",
      },
      {
        heading: "How does professional rodent control work?",
        body:
          "We follow an **integrated approach** rather than just leaving poison:\n\n- **Inspection** to find nests, runways, food sources and entry points.\n- **Tamper-resistant bait stations** — lockable boxes that hold registered rodenticide out of reach of children, pets and non-target animals.\n- **Mechanical traps** for indoor areas and food zones where baiting is not appropriate.\n- **Proofing** — sealing gaps around pipes, drains and doors with wire mesh, door sweeps and sealant so rodents cannot return.\n- **Monitoring** on follow-up visits to remove carcasses, refill stations and track activity.",
      },
      {
        heading: "Is rat poison safe to use in a home?",
        body:
          "Loose rat poison is risky around children and pets and can cause rodents to die inside walls, producing odour. That is why we **only place rodenticide inside locked bait stations**, use traps indoors where appropriate, and focus on proofing. We do not recommend glue boards because they are inhumane.",
      },
      {
        heading: "Rodent control for warehouses, restaurants and societies",
        body:
          "Commercial sites need a **perimeter of numbered bait stations, internal traps, a site map and service logs** — the format most food-safety and warehouse audits expect. For housing societies we cover compound walls, garbage areas, basements, parking and drains, which is where most building infestations start.",
      },
      {
        heading: "What does rodent control cost in Mumbai?",
        body:
          "Cost depends on **property size, rodent species and activity level, the number of bait stations and traps needed, proofing work, and visit frequency**. We provide a fixed written quote after inspection.",
      },
    ],
    process: [
      { name: "Inspect", text: "We trace droppings, gnaw marks and runways to find nests, food sources and entry points." },
      { name: "Place stations and traps", text: "Tamper-resistant bait stations go along walls and the perimeter; traps are used in sensitive indoor areas." },
      { name: "Proof entry points", text: "We recommend or install mesh, door sweeps and sealant to close gaps around pipes, drains and doors." },
      { name: "Monitor", text: "Follow-up visits remove carcasses, refill stations and record activity until it stops." },
      { name: "Maintain", text: "For commercial sites, a monthly plan keeps a permanent monitoring perimeter in place." },
    ],
    preparation: [
      "Store food and grains in hard, sealed containers.",
      "Clear clutter from lofts, storerooms and areas under kitchen platforms.",
      "Note where you have heard or seen rodents to guide placement.",
      "Keep pets indoors or away from areas where stations will be placed outdoors.",
    ],
    aftercare: [
      "Do not move or open bait stations and traps.",
      "Report any bad odour so we can locate and remove carcasses.",
      "Keep garbage covered and remove food scraps every night.",
      "Complete proofing work recommended in the report to prevent re-entry.",
    ],
    prevention: [
      "Seal gaps larger than a pencil around pipes, cables and drains.",
      "Fit mesh on drain outlets, ventilation openings and AC duct holes.",
      "Keep garbage in closed bins and clear it daily.",
      "Trim tree branches and creepers touching the building.",
    ],
    faqs: [
      { question: "How long does it take to get rid of rats?", answer: "Most homes see rodent activity fall within 2–4 weeks of baiting, trapping and proofing. Larger sites like warehouses or societies take longer and are best kept on a monthly monitoring plan." },
      { question: "Is rodent control safe for children and pets?", answer: "Yes, when done correctly. We place rodenticide only inside locked, tamper-resistant bait stations and use traps indoors where appropriate, so children and pets cannot reach the bait." },
      { question: "Will rats die inside my walls and smell?", answer: "It can occasionally happen with any baiting. Placing stations along outer runways, using traps indoors and monitoring regularly reduce the chance, and we help locate and remove carcasses if odour occurs." },
      { question: "Do you use glue boards for rats?", answer: "No. We do not recommend glue boards because they cause suffering to trapped animals. We use bait stations, mechanical traps and rodent-proofing instead." },
      { question: "How do rats get into flats on higher floors?", answer: "Rats climb drain pipes, electrical shafts, creepers and tree branches, and travel through duct and pipe openings. Sealing these routes is as important as reducing the population." },
      { question: "What diseases can rats spread?", answer: "Rats can spread diseases including leptospirosis, salmonellosis and rat-bite fever, and they contaminate food and surfaces. Leptospirosis cases often rise in Mumbai during the monsoon." },
      { question: "How many visits does rodent control need?", answer: "A typical home needs an initial visit and two or three follow-ups. Commercial premises usually need monthly service with a permanent bait station perimeter." },
      { question: "Can you rodent-proof my home?", answer: "Yes. We identify gaps and recommend or install wire mesh, door sweeps and sealants around pipes, drains, doors and ducts so rodents cannot get back in." },
      { question: "Do you provide rodent control for warehouses and restaurants?", answer: "Yes. We set up numbered bait stations and traps with a site map and service logs, which supports food-safety and warehouse audits." },
      { question: "How much does rat control cost in Mumbai?", answer: "Cost depends on property size, activity level, the number of stations and traps, proofing work and visit frequency. We give a fixed written quote after a free inspection." },
      { question: "What is the difference between rats and mice control?", answer: "Rats are larger and cautious of new objects, so they need careful station placement and patience. Mice are small, curious and enter through tiny gaps, so traps and close proofing work well. Inspection tells us which you have." },
      { question: "Do you offer a warranty on rodent control?", answer: "Rodent control works best as an ongoing service. One-time jobs include the follow-up visits in the quote, and annual or monthly plans include re-treatment whenever activity is reported." },
    ],
    related: ["cockroach-control", "termite-control", "mosquito-control"],
  },

  // ---------------------------------------------------------------- MOSQUITO
  {
    slug: "mosquito-control",
    aliases: ["mosquito-pest-control", "mosquitoes-control", "mosquito-fogging", "mosquito"],
    title: "Mosquito Pest Control",
    h1: "Mosquito Control & Fogging in Mumbai",
    metaTitle: "Mosquito Control in Mumbai | Fogging & Larvicide Treatment",
    metaDescription:
      "Mosquito control in Mumbai, Thane & Navi Mumbai: breeding-site larvicide, indoor residual spray and fogging for homes, societies, offices and schools.",
    shortDescription:
      "Larvicide treatment of breeding sites, indoor residual spray and thermal or cold fogging for homes, housing societies, offices and campuses.",
    quickAnswer:
      "Lasting mosquito control targets larvae, not just adult mosquitoes. A technician finds stagnant water, treats breeding sites with larvicide, sprays resting areas with a residual insecticide, and uses fogging for quick knockdown of adults. Monthly service through the monsoon gives the best results in Mumbai.",
    image: "/services/mosquito.webp",
    imageAlt: "Technician fogging a housing society garden to control mosquitoes during the monsoon in Mumbai",
    keywords: ["mosquito control Mumbai", "mosquito fogging service", "dengue mosquito control", "mosquito pest control near me", "society mosquito fogging"],
    pest: "Mosquitoes",
    facts: [
      { label: "Methods", value: "Larvicide, residual spray, fogging" },
      { label: "Treatment time", value: "1–3 hours depending on area" },
      { label: "Re-entry", value: "After fog settles (about 1 hour)" },
      { label: "Frequency", value: "Monthly; fortnightly in monsoon" },
      { label: "Best for", value: "Societies, bungalows, offices, schools, hospitals" },
    ],
    signs: [
      "Frequent bites at dawn and dusk, or during the day (Aedes mosquitoes)",
      "Stagnant water in flower pots, coolers, tyres, overhead tanks or terraces",
      "Larvae ('wrigglers') visible in buckets or water containers",
      "Mosquitoes resting in dark corners, under furniture and behind curtains",
      "Dengue or malaria cases reported in your building or neighbourhood",
    ],
    sections: [
      {
        heading: "Why is mosquito control important in Mumbai?",
        body:
          "Mumbai's monsoon creates thousands of small breeding sites — terrace water, construction sites, flower-pot plates, old tyres and blocked gutters. These support **Aedes mosquitoes (dengue, chikungunya)** and **Anopheles mosquitoes (malaria)**. Aedes mosquitoes breed in clean water and bite during the day, so they are common inside homes and offices.",
      },
      {
        heading: "How does professional mosquito control work?",
        body:
          "Fogging alone gives temporary relief. We combine:\n\n- **Source reduction** — finding and removing stagnant water during inspection.\n- **Larvicide** — treating water that cannot be removed (drains, sumps, ducts) so larvae cannot develop into adults.\n- **Indoor residual spray** — treating walls and dark resting areas where adult mosquitoes rest.\n- **Thermal or cold fogging (ULV)** — fast knockdown of adult mosquitoes in gardens, compounds, parking and common areas.",
      },
      {
        heading: "Is mosquito fogging safe?",
        body:
          "Fogging uses registered insecticides at low doses. To stay safe, **close windows during fogging, keep children and pets indoors, cover fish tanks and food, and wait about an hour** before using fogged outdoor areas. Our technicians use protective equipment and avoid fogging near open food and water.",
      },
      {
        heading: "Mosquito control for housing societies and campuses",
        body:
          "Societies, schools and hospitals benefit most from a **monthly schedule, increasing to fortnightly during June–September**. We cover compounds, gardens, basements, parking, drains, overhead and underground tank areas and terraces, and share a breeding-site report with the managing committee.",
      },
      {
        heading: "What does mosquito control cost?",
        body:
          "Pricing depends on **area, number of breeding sites, the methods needed and visit frequency**. Societies and commercial campuses usually choose annual contracts. We quote after a site survey.",
      },
    ],
    process: [
      { name: "Survey breeding sites", text: "We inspect terraces, gutters, tanks, pots, drains and construction areas for stagnant water and larvae." },
      { name: "Source reduction", text: "We help remove or empty containers and advise on covering tanks and fixing blocked drains." },
      { name: "Larvicide", text: "Water that cannot be removed is treated so larvae cannot develop." },
      { name: "Residual spray and fogging", text: "Resting areas are sprayed and outdoor areas fogged to knock down adult mosquitoes." },
      { name: "Repeat", text: "Monthly visits — fortnightly in monsoon — keep populations low." },
    ],
    preparation: [
      "Close windows and doors before outdoor fogging.",
      "Cover food, utensils, fish tanks and bird cages.",
      "Keep children and pets indoors during and for about an hour after fogging.",
      "Empty water from coolers, pots and buckets before the visit.",
    ],
    aftercare: [
      "Ventilate rooms after indoor residual spraying before re-entering.",
      "Do not wash sprayed walls for at least two weeks.",
      "Change water in flower vases and pet bowls every two days.",
      "Report new stagnant-water sites in your building to the society.",
    ],
    prevention: [
      "Empty and scrub water containers once a week — eggs stick to the sides.",
      "Cover overhead tanks and keep gutters and drains clear.",
      "Use window mesh and mosquito nets, especially in monsoon.",
      "Check terraces, balconies and AC drip trays after rain.",
    ],
    faqs: [
      { question: "Does mosquito fogging really work?", answer: "Fogging quickly kills adult mosquitoes flying at the time, but its effect is short. Lasting control needs larvicide in breeding sites and residual spray in resting areas, which is why we combine all three." },
      { question: "How long does mosquito treatment last?", answer: "Fogging gives relief for a few days. Residual spray lasts several weeks and larvicide protects treated water for a period depending on the product. Monthly service, or fortnightly in monsoon, keeps numbers low." },
      { question: "Is mosquito fogging safe for children and pets?", answer: "Fogging uses registered insecticides at low doses. Keep children and pets indoors with windows closed during fogging and for about an hour after, and cover fish tanks and food." },
      { question: "How do I stop mosquitoes breeding at home?", answer: "Empty and scrub containers weekly, cover water tanks, clear blocked drains and gutters, change vase water every two days and check AC drip trays and terraces after rain." },
      { question: "Which mosquitoes spread dengue?", answer: "Dengue is spread mainly by Aedes aegypti, a mosquito with white stripes that breeds in clean stagnant water and bites during the day. Removing indoor breeding sites is the most important step." },
      { question: "When is the best time for mosquito control in Mumbai?", answer: "Start before the monsoon, around May, and continue through September, when breeding peaks. Year-round monthly service is best for societies, hospitals and campuses." },
      { question: "Do you do mosquito fogging for housing societies?", answer: "Yes. We treat compounds, gardens, parking, basements, drains, tank areas and terraces, and provide a breeding-site report for the society committee." },
      { question: "What is the difference between thermal and cold fogging?", answer: "Thermal fogging creates a visible dense fog, useful for gardens and drains. Cold or ULV fogging produces a fine mist with no visible smoke, often preferred indoors and in sensitive areas. We choose based on the site." },
      { question: "Do I need to leave home during mosquito treatment?", answer: "Not usually. For indoor residual spray, avoid the treated rooms until they are ventilated. For outdoor fogging, stay indoors with windows closed during the treatment and for about an hour after." },
      { question: "How much does mosquito control cost in Mumbai?", answer: "Cost depends on area, number of breeding sites, the methods needed and frequency. Societies and offices usually take an annual contract. We quote after a free site survey." },
      { question: "Can mosquitoes become resistant to insecticides?", answer: "Yes, repeated use of the same chemical can lead to resistance. We rotate product groups and focus on larvicide and source reduction, which reduces reliance on fogging." },
      { question: "Do you treat offices, schools and hospitals?", answer: "Yes. We schedule treatments outside working or class hours, use methods suited to sensitive areas and keep service records for facility management." },
    ],
    related: ["cockroach-control", "rodent-control", "bed-bugs-control"],
  },

  // ---------------------------------------------------------------- WOOD BORER
  {
    slug: "wood-borer-control",
    aliases: ["wood-borer-pest-control", "woodborer-control", "wood-borer", "powder-post-beetle-control"],
    title: "Wood Borer Control",
    h1: "Wood Borer Treatment in Mumbai",
    metaTitle: "Wood Borer Treatment in Mumbai | Furniture & Door Protection",
    metaDescription:
      "Wood borer treatment for furniture, doors, frames and antiques in Mumbai, Thane & Navi Mumbai. Hole-by-hole injection and surface treatment. Free inspection.",
    shortDescription:
      "Hole-by-hole injection and surface treatment that kills wood borer larvae inside furniture, doors, frames and wooden flooring before damage spreads.",
    quickAnswer:
      "Wood borer treatment involves injecting a registered wood-preservative insecticide into every exit hole so it reaches larvae tunnelling inside the wood, then brushing or spraying all surfaces to stop new eggs. Fine powder (frass) below small round holes is the main sign. Damaged areas may also need filling and polishing.",
    image: "/services/woodborer.webp",
    imageAlt: "Small wood borer exit holes and fine powder on a teak furniture surface before injection treatment",
    keywords: ["wood borer treatment Mumbai", "wood borer control", "furniture wood borer", "powder post beetle treatment", "wood borer pest control near me"],
    pest: "Wood borers",
    facts: [
      { label: "Method", value: "Hole injection + surface treatment" },
      { label: "Treatment time", value: "2–4 hours (typical home)" },
      { label: "Need to vacate?", value: "Not usually; ventilate treated rooms" },
      { label: "Visits", value: "1 treatment + inspection" },
      { label: "Best for", value: "Furniture, doors, frames, antiques, wooden floors" },
    ],
    signs: [
      "Small round exit holes (1–3 mm) on furniture, doors or frames",
      "Fine, flour-like powder (frass) collecting below holes or furniture",
      "Wood that crumbles easily at the edges or under light pressure",
      "Fresh holes appearing after the monsoon",
      "Tiny beetles near windows or lights in warm months",
    ],
    sections: [
      {
        heading: "What are wood borers and why do they damage furniture?",
        body:
          "Wood borers are beetles — such as **powder-post beetles and furniture beetles** — whose larvae live inside wood for months, eating it and leaving tunnels filled with fine powder. Adult beetles emerge through small round holes, mate, and lay eggs in cracks and pores of untreated wood, so damage spreads from one piece to another.\n\nMumbai's humidity softens wood and favours borers, especially in **plywood, softwood, old teak, cane and antique furniture**.",
      },
      {
        heading: "Are wood borers the same as termites?",
        body:
          "No. Termites come from the soil, work in colonies, build **mud tubes** and leave muddy galleries. Wood borers are beetles whose larvae live inside a single piece of wood and leave **round exit holes and fine powder**, with no mud. The treatment is different, which is why correct identification matters.",
      },
      {
        heading: "How does wood borer treatment work?",
        body:
          "1. **Inspection** of all wooden items to find active holes and fresh powder.\n2. **Injection** — a registered wood-preservative insecticide is injected into each exit hole so it travels through larval tunnels.\n3. **Surface treatment** — all surfaces, especially unpolished and hidden sides, are brushed or sprayed to stop new egg laying.\n4. **Finishing advice** — holes can be filled with wax or wood putty and the piece polished once treatment has dried.",
      },
      {
        heading: "Can wood borer damage be repaired?",
        body:
          "Light damage is usually cosmetic and can be filled and polished after treatment. **Structural pieces with heavy damage** — crumbling frames, legs or beams — may need carpentry repair or replacement, which we point out in the inspection report.",
      },
      {
        heading: "What does wood borer treatment cost?",
        body:
          "Cost depends on **the number and size of wooden items, the extent of infestation and whether doors, frames or flooring are included**. We provide a fixed quote after inspecting the affected furniture.",
      },
    ],
    process: [
      { name: "Inspect", text: "We examine furniture, doors, frames and flooring for active holes and fresh powder." },
      { name: "Inject holes", text: "A registered wood-preservative insecticide is injected into exit holes to reach larvae inside." },
      { name: "Treat surfaces", text: "All surfaces, especially unpolished back and underside panels, are brushed or sprayed." },
      { name: "Dry and ventilate", text: "Treated items are left to dry with the room ventilated." },
      { name: "Re-inspect", text: "We check for fresh powder on follow-up and advise on filling and polishing." },
    ],
    preparation: [
      "Empty drawers and cupboards of furniture to be treated.",
      "Move furniture away from walls so back panels can be reached.",
      "Mark items where you have seen fresh powder.",
      "Remove clothes, books and food from treated furniture.",
    ],
    aftercare: [
      "Keep treated furniture empty and the room ventilated for 24 hours.",
      "Do not polish or paint until the treatment has dried completely.",
      "Wipe away old powder and watch for fresh powder in the following weeks.",
      "Report new holes or powder for re-inspection.",
    ],
    prevention: [
      "Polish or seal all surfaces of wooden furniture, including the back and underside.",
      "Keep furniture away from damp walls and control humidity.",
      "Inspect second-hand and antique furniture before bringing it home.",
      "Treat new plywood or softwood before installation where possible.",
    ],
    faqs: [
      { question: "How do I know if my furniture has wood borers?", answer: "Look for small round holes about 1–3 mm wide and fine flour-like powder below them. Fresh powder that keeps reappearing after cleaning means the infestation is active." },
      { question: "Are wood borers and termites the same?", answer: "No. Termites come from the soil and leave mud tubes and muddy galleries, while wood borers are beetles that leave round exit holes and fine powder. They need different treatments." },
      { question: "Can wood borer spread to other furniture?", answer: "Yes. Adult beetles emerge, mate and lay eggs on other untreated wood, so an infestation can spread through a home over time. Treating all affected and nearby items stops this." },
      { question: "How long does wood borer treatment take?", answer: "A typical home takes 2–4 hours depending on the number of items. Treated furniture should be kept empty and the room ventilated for about 24 hours." },
      { question: "Is wood borer treatment safe?", answer: "The treatment uses registered products applied directly into holes and onto wood surfaces. Keep children and pets away from treated items until they have dried and the room has been ventilated." },
      { question: "Will the holes disappear after treatment?", answer: "No, treatment kills the larvae but does not fill existing holes. Once dry, holes can be filled with wax or wood putty and the piece polished." },
      { question: "Why do I still see powder after treatment?", answer: "Old powder can keep falling out of existing tunnels for a few days. Clean it and watch for fresh powder; if it keeps appearing after a few weeks, we re-inspect." },
      { question: "Can antique furniture be treated for wood borers?", answer: "Yes. Antique and polished pieces are treated carefully through the holes and on unpolished surfaces to avoid damaging the finish." },
      { question: "Do wood borers attack plywood and modular furniture?", answer: "Yes, borers can attack plywood, softwood and the unfinished edges of modular furniture, especially in humid conditions. Sealing all surfaces reduces risk." },
      { question: "How can I prevent wood borers?", answer: "Polish or seal all wood surfaces, including backs and undersides, keep furniture away from damp walls, and inspect second-hand furniture before bringing it home." },
      { question: "How much does wood borer treatment cost in Mumbai?", answer: "Cost depends on the number and size of wooden items and the extent of damage. We give a fixed quote after a free inspection." },
      { question: "Do you treat wooden doors and frames?", answer: "Yes. Doors, frames, windows, wooden flooring and fixed panels are treated by injection and surface application, and we flag heavily damaged pieces that need repair." },
    ],
    related: ["termite-control", "cockroach-control", "bed-bugs-control"],
  },
];

const bySlug = new Map<string, ServiceContent>();
for (const content of SERVICE_CONTENT) {
  bySlug.set(content.slug, content);
  for (const alias of content.aliases ?? []) bySlug.set(alias, content);
}

export function findServiceContent(slug: string | undefined | null): ServiceContent | undefined {
  if (!slug) return undefined;
  return bySlug.get(slug.toLowerCase());
}
