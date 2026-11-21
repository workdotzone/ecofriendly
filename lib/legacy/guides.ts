/** Editorial guides that exist in the original sitemap. Each reuses its pest family's facts but has its own angle. */
export type GuideConfig = {
  slug: string;
  family: string;
  title: string;
  h1: string;
  metaDescription: string;
  intro: string[];
  diyHeading: string;
  diySteps: string[];
  callHeading: string;
  whenToCall: string[];
};

export const GUIDES: GuideConfig[] = [
  {
    slug: "how-to-get-rid-of-cockroaches",
    family: "cockroach-control",
    title: "How to Get Rid of Cockroaches at Home (Step-by-Step)",
    h1: "How to Get Rid of Cockroaches at Home",
    metaDescription: "A step-by-step guide to getting rid of cockroaches: why sprays fail, how gel bait works, kitchen hygiene that actually helps, and when to call a professional.",
    intro: [
      "Cockroaches are the most common pest in Indian kitchens, and the most frustrating — you spray, they vanish for a week, and then they are back. That is because sprays rarely reach the egg cases and the hidden colony behind hinges, motors and drains.",
      "This guide explains what works at home, what doesn’t, and the point at which professional gel treatment saves you time and money.",
    ],
    diyHeading: "What you can do yourself, starting tonight",
    diySteps: [
      "Remove water first: fix dripping taps, dry the sink and platform before bed, and keep drain covers closed.",
      "Seal food: move sugar, flour, snacks and pet food into airtight containers.",
      "Clear clutter: cardboard boxes, paper bags and newspaper stacks are favourite hiding and egg-laying spots.",
      "Clean behind appliances: grease behind the fridge, microwave and stove feeds cockroaches for weeks.",
      "Use bait, not spray: store-bought gel or bait stations reach the colony; sprays mostly scatter it.",
      "Stop spraying where bait is placed: sprays contaminate bait and make cockroaches avoid it.",
    ],
    callHeading: "When to call a professional",
    whenToCall: [
      "You see cockroaches during the day — a sign of a large hidden population.",
      "Small light-brown German cockroaches are in appliances, switchboards or hinges.",
      "DIY bait hasn’t reduced activity within three weeks.",
      "Cockroaches are coming from shared drains or neighbouring flats.",
    ],
  },
  {
    slug: "how-to-get-rid-of-ants",
    family: "ant-control",
    title: "How to Get Rid of Ants in the Kitchen and Home",
    h1: "How to Get Rid of Ants",
    metaDescription: "Why ants keep returning, which home remedies help briefly, how ant bait reaches the colony, and when professional ant control is worth it.",
    intro: [
      "An ant trail across the kitchen platform is one of the most common household annoyances — and one of the most misunderstood. Killing the ants you can see does almost nothing, because the queen and most of the colony stay hidden in a wall, under tiles or in a planter.",
      "Here is how to deal with ants properly, from quick fixes to a lasting solution.",
    ],
    diyHeading: "Step-by-step ant control at home",
    diySteps: [
      "Follow the trail to find where ants enter — a tile gap, window frame or switchboard.",
      "Wipe sugar, oil and food spills immediately and keep sweet foods sealed.",
      "Place slow-acting ant bait beside the trail, not on it, and leave it alone.",
      "Don’t spray or wipe the trail while ants collect bait — they need to carry it home.",
      "After activity stops, seal the entry gap with silicone or tile grout.",
      "Trim plants and creepers that touch windows, walls or balconies.",
    ],
    callHeading: "When to call a professional",
    whenToCall: [
      "Ants are coming out of switchboards, appliances or wall voids.",
      "Winged ants appear indoors, a sign of a mature nest nearby.",
      "Ants keep returning after several weeks of baiting.",
      "It’s a restaurant, bakery or food business.",
    ],
  },
  {
    slug: "how-to-get-rid-of-houseflies",
    family: "fly-pest-control",
    title: "How to Get Rid of Houseflies: Find and Stop the Source",
    h1: "How to Get Rid of Houseflies",
    metaDescription: "How to get rid of houseflies, fruit flies and drain flies by finding where they breed, plus screening, hygiene and when professional fly control helps.",
    intro: [
      "Flies are a sign that something nearby is giving them a place to breed. Swatting and spraying the adults is endless unless you find that source — usually garbage, drain sludge, rotting fruit or organic waste.",
      "This guide helps you identify the type of fly, locate where it is breeding and keep it from coming back.",
    ],
    diyHeading: "Getting rid of flies, step by step",
    diySteps: [
      "Identify the fly: big house flies, tiny fruit flies or fuzzy drain flies each breed in different places.",
      "Empty and wash garbage bins, and keep lids closed at all times.",
      "Clean drain traps and floor drains with a brush to remove the slimy film.",
      "Refrigerate fruit and clear juice or sweet residues around bars and counters.",
      "Fit window mesh and door strips, especially near the kitchen.",
      "Check balconies and nearby plots for waste, compost or animal droppings.",
    ],
    callHeading: "When to call a professional",
    whenToCall: [
      "Flies persist after you’ve cleared the obvious sources.",
      "You run a restaurant, café, bakery or food-processing unit.",
      "The breeding source is in a shared drain or common area.",
      "There are farm animals, cattle sheds or large waste areas on the property.",
    ],
  },
  {
    slug: "wood-borer-signs-and-treatment",
    family: "wood-borer-control",
    title: "Wood Borer Signs and Treatment: A Practical Guide",
    h1: "Wood Borer Signs and Treatment",
    metaDescription: "How to spot wood borer damage — round holes and fine powder — how it differs from termites, and how injection treatment saves furniture and doors.",
    intro: [
      "Tiny round holes and a little heap of fine powder under a cupboard are easy to ignore — until a chair leg crumbles or a door frame weakens. Wood borers are beetle larvae that live inside wood for months, and by the time you see holes, the infestation is already active.",
      "This guide explains how to confirm wood borers, what you can check yourself and how professional treatment works.",
    ],
    diyHeading: "How to check your furniture for wood borers",
    diySteps: [
      "Look for round exit holes 1–3 mm wide, especially on unpolished backs and undersides.",
      "Wipe away old powder and check after a week — fresh powder means active larvae.",
      "Press gently around holes; soft or crumbling wood shows deeper damage.",
      "Check nearby pieces too — adult beetles lay eggs on other untreated wood.",
      "Move affected furniture away from damp walls.",
      "Don’t polish over holes until the wood has been treated.",
    ],
    callHeading: "When to get professional treatment",
    whenToCall: [
      "Fresh powder keeps appearing under furniture or frames.",
      "Holes are spreading to doors, frames or wooden flooring.",
      "Antique or expensive furniture is affected.",
      "You’re unsure whether it’s wood borers or termites.",
    ],
  },
  {
    slug: "honey-bee-hive-removal-guide",
    family: "honey-bee-control",
    title: "Honey Bee Hive Removal Guide: What to Do (and Not Do)",
    h1: "Honey Bee Hive Removal Guide",
    metaDescription: "What to do when bees build a hive on your balcony or building: identification, safety steps, why DIY removal is risky and how professional removal works.",
    intro: [
      "Finding a honey bee hive on your balcony, window or water tank can be alarming. The most important thing is not to disturb it — a frightened colony can attack in large numbers.",
      "This guide walks you through keeping everyone safe, identifying the insect and getting the hive removed properly.",
    ],
    diyHeading: "What to do as soon as you spot a hive",
    diySteps: [
      "Keep children, pets and elderly family members away from the area.",
      "Close windows and doors near the hive.",
      "Don’t throw water, smoke, kerosene or stones at the hive.",
      "Take a photo from a safe distance to help identify the insect.",
      "Inform your building society or neighbours.",
      "Note the floor, height and access so the removal team can plan.",
    ],
    callHeading: "When to call for removal",
    whenToCall: [
      "The hive is near a doorway, window, play area or walkway.",
      "Someone in the household is allergic to stings.",
      "The colony is inside a wall, duct or AC opening.",
      "Bees keep returning to the same spot after a previous removal.",
    ],
  },
  {
    slug: "termite-signs-and-prevention",
    family: "termite-control",
    title: "Termite Signs and Prevention: Protect Your Home",
    h1: "Termite Signs and Prevention",
    metaDescription: "Early signs of termites — mud tubes, hollow wood, discarded wings — plus practical prevention steps and when to book anti-termite treatment.",
    intro: [
      "Termites work silently, often inside walls and furniture, so most people find them only when a door frame sounds hollow or a wardrobe starts crumbling. Catching the early signs saves expensive repairs.",
      "This guide lists the warning signs to check, simple prevention habits and the point at which anti-termite treatment is needed.",
    ],
    diyHeading: "A 10-minute termite check you can do yourself",
    diySteps: [
      "Check skirting, wall-floor joints and behind wardrobes for pencil-thin mud tubes.",
      "Tap door frames and wooden fixtures — hollow sounds suggest damage inside.",
      "Look for discarded wings near windows after the first rains.",
      "Check for bubbling paint or damp patches on walls.",
      "Inspect stored cardboard, books and old furniture in lofts.",
      "Look at wooden planters, garden borders and compound walls if you have a garden.",
    ],
    callHeading: "When to book anti-termite treatment",
    whenToCall: [
      "You find mud tubes or live termites anywhere in the home.",
      "Wood sounds hollow or crumbles when pressed.",
      "Neighbouring flats have had termite problems.",
      "You are buying, renovating or building a property.",
    ],
  },
  {
    slug: "bed-bug-treatment-guide",
    family: "bed-bugs-control",
    title: "Bed Bug Treatment Guide: How to Get Rid of Bed Bugs",
    h1: "Bed Bug Treatment Guide",
    metaDescription: "How to confirm bed bugs, what to do before treatment, why two visits are needed and how to stop bed bugs coming back after travel.",
    intro: [
      "Bed bugs are small, fast and very good at hiding. Most people realise they have them only after weeks of itchy bites. The good news is that a well-prepared, two-visit treatment clears most infestations.",
      "Use this guide to confirm bed bugs, prepare properly and avoid the common mistakes that make them spread.",
    ],
    diyHeading: "Confirming and containing bed bugs",
    diySteps: [
      "Check mattress seams, bed joints and headboards with a torch for bugs, eggs and dark spots.",
      "Wash bedding and clothes from affected rooms in hot water and dry on high heat or strong sun.",
      "Vacuum mattress seams and bed frames, then seal the vacuum bag in a plastic bag.",
      "Don’t move mattresses or furniture to other rooms — it spreads the infestation.",
      "Reduce clutter under and around beds.",
      "Use a zippered mattress encasement after treatment.",
    ],
    callHeading: "When to book professional treatment",
    whenToCall: [
      "You find live bugs, eggs or blood spots on bedding.",
      "Bites continue for more than a few nights.",
      "Bed bugs are in sofas, curtains or more than one room.",
      "You run a PG, hostel or hotel.",
    ],
  },
  {
    slug: "mosquito-prevention-monsoon",
    family: "mosquito-control",
    title: "Mosquito Prevention in the Monsoon: A Practical Checklist",
    h1: "Mosquito Prevention in the Monsoon",
    metaDescription: "A monsoon mosquito-prevention checklist for homes and housing societies: stopping breeding, protecting the family and when to book professional control.",
    intro: [
      "The monsoon brings relief from the heat — and a sharp rise in mosquitoes. Dengue-carrying Aedes mosquitoes breed in clean water in tiny containers, so prevention starts at home and on the terrace.",
      "This checklist covers what families and housing societies can do each week, and when professional mosquito control makes sense.",
    ],
    diyHeading: "Weekly monsoon checklist",
    diySteps: [
      "Empty and scrub flower-pot plates, buckets, coolers and pet bowls once a week.",
      "Cover overhead and underground tanks and check lids after storms.",
      "Clear blocked gutters, terrace drains and AC drip trays.",
      "Dispose of old tyres, coconut shells and containers that collect water.",
      "Use window mesh and mosquito nets, especially for children and the elderly.",
      "Ask the society to check construction sites and common areas for stagnant water.",
    ],
    callHeading: "When to call for professional mosquito control",
    whenToCall: [
      "There are dengue or malaria cases in the building or neighbourhood.",
      "Breeding sites are in common areas, drains or sumps you can’t clear.",
      "Mosquitoes remain a problem despite weekly source reduction.",
      "You manage a housing society, school, hospital or office campus.",
    ],
  },
  {
    slug: "rodent-control-guide",
    family: "rodent-control",
    title: "Rodent Control Guide: Getting Rid of Rats and Mice",
    h1: "Rodent Control Guide",
    metaDescription: "How to tell rats from mice, find entry points, use traps and bait safely, and rodent-proof your home or building — plus when to call professionals.",
    intro: [
      "Rats and mice don’t just damage food and wires — they can spread disease, and their numbers grow quickly. The secret to lasting control is combining population reduction with proofing so new rodents can’t get in.",
      "This guide covers identification, safe DIY steps and the signs that it’s time for a professional programme.",
    ],
    diyHeading: "Rodent control steps for homes",
    diySteps: [
      "Identify the rodent: droppings size and gnaw marks tell rats from mice.",
      "Find runways and entry points along walls, drains, pipes and lofts.",
      "Store food and grain in hard, sealed containers; clear garbage nightly.",
      "Use snap traps along walls with the trigger facing the wall.",
      "Seal gaps larger than a pencil with wire mesh and sealant.",
      "Avoid loose poison and glue boards around children and pets.",
    ],
    callHeading: "When to call a professional",
    whenToCall: [
      "You hear rodents in ceilings or walls at night.",
      "Wires, pipes or doors are being gnawed.",
      "It’s a restaurant, shop, warehouse or housing society.",
      "Activity continues after two to three weeks of trapping.",
    ],
  },
];

export const GUIDE_BY_SLUG = new Map(GUIDES.map((g) => [g.slug, g]));
