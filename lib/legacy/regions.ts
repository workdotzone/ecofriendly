/**
 * Region + locality-type detection for the ~1,800 localities in the original sitemap.
 * Region copy describes real, general conditions (building stock, climate, typical pest pressure) —
 * nothing here claims a branch office in that locality.
 */

export type RegionKey =
  | "south-mumbai" | "central-mumbai" | "western-suburbs" | "eastern-suburbs" | "thane"
  | "navi-mumbai" | "mira-vasai-palghar" | "raigad" | "pune" | "outside" | "mmr";

export type Region = {
  key: RegionKey;
  name: string;
  /** Short phrase used in sentences: "in the western suburbs" */
  inPhrase: string;
  served: boolean;
  context: string[]; // housing / environment paragraphs (one picked per page)
  pressure: string[]; // typical pest-pressure sentences (two picked per page)
  tokens: string[];
};

export const REGIONS: Region[] = [
  {
    key: "south-mumbai",
    name: "South Mumbai",
    inPhrase: "in South Mumbai",
    served: true,
    context: [
      "Much of South Mumbai is made up of older cessed buildings, heritage structures and chawls alongside newer towers, so pests travel easily through shared walls, old wooden fittings and decades-old drain lines.",
      "South Mumbai mixes century-old stone buildings, busy wholesale markets and dense residential lanes. Old timber, shared ducts and constant food trade give pests plenty of shelter and food.",
      "Between the sea-facing apartments, markets and office districts of South Mumbai, salty humid air and ageing plumbing create damp corners that cockroaches, termites and rodents favour.",
    ],
    pressure: [
      "Old wooden staircases, doors and lofts make termite and wood borer checks especially important here.",
      "Wholesale markets and eateries nearby mean German cockroaches and rodents can move between commercial and residential floors.",
      "Shared light-wells and drain stacks in older buildings let cockroaches travel between flats, so treating drains matters.",
      "Monsoon seepage in older masonry keeps walls damp for months, which termites take advantage of.",
    ],
    tokens: ["colaba", "fort", "cuffe-parade", "churchgate", "marine-lines", "marine-drive", "charni-road", "grant-road", "malabar-hill", "malabar-hil", "nariman-point", "girgaon", "mumbai-central", "byculla", "cst", "mumbai-cst", "masjid-bunder", "masjid-bandar", "sandhurst-road", "sandhurst", "kalbadevi", "bhuleshwar", "mazgaon", "dongri", "tardeo", "breach-candy", "peddar-road", "haji-ali", "hajiali", "mahalaxmi", "mahalakshmi", "kemps-corner", "altamount-road", "cumballa-hill", "gamdevi", "opera-house", "chira-bazaar", "chira-bazar", "chor-bazaar", "crawford-market", "kala-ghoda", "regal-cinema", "gateway-of-india", "nagpada", "agripada", "kamathipura", "mumbadevi", "mumba-devi-temple", "pydhonie", "dockyard-road", "reay-road", "cotton-green", "coton-green", "sewri", "wadi-bunder", "khetwadi", "walkeshwar", "navy-nagar", "jacob-circle", "lower-parel", "lowe-parel", "worli", "south-mumbai", "sobo-central", "cotton-exchange", "zaveri-bazaar", "lohar-chawl", "mangaldas-market", "dava-bazaar", "gowalia-tank", "cp-tank", "kemps", "lamington-road", "mohammed-ali-road", "bhendi-bazaar", "umerkhadi", "chinchpokli", "currey-road", "curry-road", "mumbai-chinchpokli", "mumbai-byculla"],
  },
  {
    key: "central-mumbai",
    name: "Central Mumbai",
    inPhrase: "in Central Mumbai",
    served: true,
    context: [
      "Central Mumbai — from Parel and Lalbaug to Dadar, Matunga and Wadala — combines redeveloped mill-land towers with older chawls and housing colonies, all close to railway lines and markets.",
      "This part of the city blends new high-rises with older housing colonies and busy station areas. Construction activity, open drains and dense markets create year-round pest pressure.",
      "Central Mumbai’s mix of redevelopment sites, mill compounds and established colonies means pests disturbed by construction often move into neighbouring homes.",
    ],
    pressure: [
      "Ongoing redevelopment disturbs rodent burrows and termite colonies, pushing them into nearby occupied buildings.",
      "Station-side markets and food stalls keep cockroach and rat populations active around residential lanes.",
      "Older colonies with wooden furniture and lofts benefit from regular termite and wood borer inspections.",
      "Low-lying pockets near Hindmata and Wadala see heavy monsoon water-logging, which drives mosquito breeding.",
    ],
    tokens: ["parel", "lalbaug", "lal-baug", "dadar", "matunga", "wadala", "prabhadevi", "elphinstone", "elphinstone-road", "naigaon-dadar", "sion", "king-circle", "kings-circle", "antop-hill", "mahim", "shivaji-park", "dharavi", "hindu-colony", "five-gardens", "gtb-nagar", "koliwada", "chunabhatti", "chuna-bhatti", "chunnabhatti", "dadar-central", "bmc-building", "l-ward", "cs-complex", "imax-adlabs-wadala"],
  },
  {
    key: "western-suburbs",
    name: "Western Suburbs",
    inPhrase: "in Mumbai’s western suburbs",
    served: true,
    context: [
      "The western suburbs stretch from Bandra and Khar through Andheri, Goregaon and Malad to Borivali and Dahisar — a mix of high-rise societies, bungalows, slum redevelopment and commercial hubs along the Western Express Highway.",
      "Western suburban neighbourhoods combine gated towers, older cooperative societies and independent bungalows, often close to creeks, mangroves or the Sanjay Gandhi National Park edge.",
      "Here, busy commercial streets, malls and offices sit right beside residential societies, and greenery from parks, creeks and hills keeps humidity high for much of the year.",
    ],
    pressure: [
      "Proximity to creeks and mangroves means mosquito pressure is high during and after the monsoon.",
      "Greenery near Aarey, Borivali National Park and hillside pockets brings termites, ants and occasional snakes attracted by rodents.",
      "Restaurants and cloud kitchens in commercial lanes keep German cockroach populations active in nearby buildings.",
      "Bungalows and row houses with gardens need perimeter termite and rodent protection, not just indoor treatment.",
    ],
    tokens: ["bandra", "khar", "santacruz", "vile-parle", "vileparle", "andheri", "andher-east", "jogeshwari", "goregaon", "malad", "kandivali", "borivali", "dahisar", "juhu", "versova", "lokhandwala", "oshiwara", "marol", "chakala", "saki-naka", "sakinaka", "gorai", "madh", "madh-island", "manori", "charkop", "aarey", "aarey-road", "amboli", "dn-nagar", "four-bungalows", "seven-bungalows", "seven-bunglow", "pali-hill", "carter-road", "linking-road", "link-road", "orlem", "malvani", "dindoshi", "magathane", "poisar", "gokuldham", "gokuldam", "bangur-nagar", "evershine-nagar", "kalina", "vakola", "sahar", "seepz", "mahakali", "kanakia-road", "kanheri-caves", "mandapeshwar", "ic-colony", "gulmohar-road", "irla", "domestic-airport", "international-airport", "mumbai-airport", "marve-beach", "mogra-village", "bandra-kurla-complex", "ashok-van", "kokilaben", "nesco-colony", "infinity-mall", "oberoi-mall", "raghuleela-mall-kandivali", "hp-nagar"],
  },
  {
    key: "eastern-suburbs",
    name: "Eastern Suburbs",
    inPhrase: "in Mumbai’s eastern suburbs",
    served: true,
    context: [
      "The eastern suburbs — Kurla, Ghatkopar, Vikhroli, Bhandup, Mulund, Chembur and Powai — combine large housing societies, industrial estates, slum pockets and green belts around Powai and Vihar lakes.",
      "Between the Central and Harbour railway lines, the eastern suburbs mix older industrial land, newly built towers and established colonies, with lakes, hills and the Thane creek close by.",
      "Eastern suburban neighbourhoods range from Powai’s high-rises and Chembur’s colonies to busy station areas in Kurla and Ghatkopar, with industrial zones never far away.",
    ],
    pressure: [
      "Lakes, hills and the Thane creek edge raise mosquito and termite pressure, especially after the monsoon.",
      "Industrial estates and godowns support rodent populations that move into nearby residential areas.",
      "Dense station markets in Kurla and Ghatkopar keep cockroach activity high in surrounding buildings.",
      "Hillside societies in Powai, Bhandup and Mulund often see termites and ants coming in from surrounding greenery.",
    ],
    tokens: ["kurla", "ghatkopar", "vikhroli", "kanjurmarg", "kanjur-marg", "bhandup", "mulund", "nahur", "chembur", "govandi", "mankhurd", "deonar", "trombay", "powai", "chandivali", "asalpha", "vidyavihar", "vidya-vihar", "tilak-nagar", "new-tilak-nagar", "pant-nagar", "garodia-nagar", "rajawadi", "anushakti-nagar", "chedda-nagar", "mahul", "jari-mari", "saki-vihar", "hiranandani-gardens", "nitie", "indian-institute-of-technology-bombay-campus", "iit", "r-city-ghatkopar", "r-mall-mulund", "phoenix-market-city-kurla", "lbs-marg", "kamraj-nagar", "sindhi-society", "shell-colony", "ramabai-nagar", "kannamwar-nagar", "tagore-nagar", "jogeshwari-vikhroli"],
  },
  {
    key: "thane",
    name: "Thane district",
    inPhrase: "in the Thane–Kalyan belt",
    served: true,
    context: [
      "The Thane district belt — Thane city, Kalwa, Mumbra, Diva, Dombivli, Kalyan, Ulhasnagar, Ambernath and Badlapur — has grown rapidly, with new townships alongside older chawls and independent houses.",
      "From Thane’s lake-side neighbourhoods to the fast-growing townships around Kalyan, Dombivli and Badlapur, this belt combines new construction, open land and creeks.",
      "This part of the metropolitan region has many new residential complexes next to older buildings and open plots, which means pests disturbed by construction regularly move into occupied homes.",
    ],
    pressure: [
      "New townships built on former open land often face termites and rodents displaced by construction.",
      "Creeks, lakes and open plots raise mosquito breeding, so monsoon mosquito programmes are valuable for societies.",
      "Independent houses and ground-floor flats need perimeter protection against termites, rodents and ants.",
      "Rapid growth means many buildings share older drainage lines where cockroaches travel between homes.",
    ],
    tokens: ["thane", "kalwa", "mumbra", "diva", "dombivli", "dombivali", "kalyan", "ulhasnagar", "ambernath", "badlapur", "shahad", "titwala", "bhiwandi", "kasara", "asangaon", "shahapur", "vasind", "ghodbunder", "ghod-bunder-road", "ghodbunder-junction", "majiwada", "naupada", "wagle-estate", "manpada", "kolshet", "kasarvadavali", "vartak-nagar", "lokmanya-nagar", "thakurli", "kopar", "khardi", "atgaon", "murbad", "palava", "shil-phata", "shilphata", "kalher", "padgha", "r-mall-thane", "viviana", "korum-mall", "pokharan", "hiranandani-estate", "brahmand", "dhokali", "vitawa", "sativali", "kalyan-shil-road", "ambivli", "mohone", "vithalwadi", "khadavli", "nevali", "dolavli"],
  },
  {
    key: "navi-mumbai",
    name: "Navi Mumbai & Panvel",
    inPhrase: "in Navi Mumbai",
    served: true,
    context: [
      "Navi Mumbai’s planned nodes — Vashi, Nerul, Airoli, Ghansoli, Kopar Khairane, Belapur, Kharghar, Kamothe and Panvel — are laid out in CIDCO sectors with societies, bungalows, row houses and large commercial zones.",
      "Navi Mumbai combines planned sectors, wide roads and plenty of greenery with creeks, mangroves and hills such as Parsik and Kharghar, so humidity and greenery are part of daily life.",
      "From Vashi’s established sectors to new developments in Ulwe, Taloja and Panvel, this part of the region has many recently built societies close to open land, creeks and industrial MIDC belts.",
    ],
    pressure: [
      "Mangroves and creeks along the Thane–Belapur stretch and around Vashi and Nerul raise mosquito pressure significantly.",
      "Newly developed nodes such as Ulwe, Kamothe and Taloja often see termites and rodents disturbed by surrounding construction.",
      "Row houses and bungalows in sectors benefit from perimeter termite treatment and rodent stations around compound walls.",
      "The TTC and Taloja MIDC belts support rodent populations that can reach nearby residential sectors.",
    ],
    tokens: ["vashi", "nerul", "airoli", "ghansoli", "kopar-khairane", "kopar-khairne", "koparkhairne", "khairane", "sanpada", "juinagar", "jui-nagar", "turbhe", "belapur", "cbd-belapur", "kharghar", "kamothe", "kalamboli", "panvel", "new-panvel", "ulwe", "taloja", "taloje", "seawood", "seawoods", "khandeshwar", "dronagiri", "uran", "rabale", "mahape", "navi-mumbai", "greater-khanda", "khanda-colony", "karave-nagar", "darave", "shahbaz-village", "kopra", "jawaharlal-nehru-port-trust-township", "raghuleela-mall-vashi", "palm-beach-road", "sion-panvel-highway", "nhava", "kalundre", "roadpali", "karanjade", "shiravane", "sarsole"],
  },
  {
    key: "mira-vasai-palghar",
    name: "Mira–Bhayandar, Vasai–Virar & Palghar",
    inPhrase: "in the Mira–Bhayandar and Vasai–Virar belt",
    served: true,
    context: [
      "North of Dahisar, Mira Road, Bhayandar, Naigaon, Vasai, Nalasopara and Virar have grown into a dense residential belt, while Palghar, Boisar and Dahanu remain greener and more spread out.",
      "This belt combines fast-growing residential complexes with salt pans, creeks, orchards and village pockets, so humidity and standing water are common for much of the year.",
      "From new towers in Mira Road and Virar to bungalows, wadis and farmhouses around Vasai and Palghar, homes here range from compact flats to properties with large gardens.",
    ],
    pressure: [
      "Salt pans, creeks and low-lying land make mosquito control particularly important during the monsoon.",
      "Bungalows and wadis with gardens and coconut groves often need termite, rodent and tick treatment around the property.",
      "New construction on open land disturbs termite colonies and rodent burrows nearby.",
      "Farmhouses and independent homes with dogs commonly face tick problems in compounds and gardens.",
    ],
    tokens: ["mira-road", "mira-bhayandar", "bhayandar", "kashimira", "naigaon", "vasai", "virar", "nalasopara", "palghar", "boisar", "dahanu", "dahanu-road", "saphale", "kelve", "kelve-road", "satpati", "agashi", "arnala", "manor", "jawhar", "umroli", "sopara", "evershine-city", "global-city", "chandansar", "manikpur", "papdy"],
  },
  {
    key: "raigad",
    name: "Raigad & Konkan",
    inPhrase: "in Raigad",
    served: true,
    context: [
      "Raigad’s towns and villages — Alibag, Karjat, Khopoli, Neral, Pen, Roha and beyond — include farmhouses, weekend homes, bungalows and industrial estates set among hills, rivers and coastline.",
      "Many properties here are farmhouses and second homes that stay closed for weeks at a time, which gives termites, rodents and wasps undisturbed time to settle in.",
      "With heavy monsoon rainfall, wooded hills and rivers, this part of Maharashtra has strong termite, mosquito and wood borer pressure on homes and resorts alike.",
    ],
    pressure: [
      "Closed-up weekend homes and farmhouses often face termites, rodents and wasp nests between visits.",
      "Heavy Konkan rainfall keeps timber damp, which favours termites and wood borers.",
      "Resorts and farmhouses with gardens and pools need monsoon mosquito programmes.",
      "Rural plots near fields and forests see snakes attracted by rodents — rodent control reduces that draw.",
    ],
    tokens: ["alibag", "karjat", "khopoli", "neral", "pen", "roha", "mahad", "murud", "nagothane", "kolad", "lonere", "chiplun", "raigad", "rasayani", "khalapur", "matheran", "harihareshwar", "pali", "vadkhal", "mangaon", "shrivardhan", "kashele", "bhivpuri", "kadav", "shelu"],
  },
  {
    key: "pune",
    name: "Pune & Pimpri-Chinchwad",
    inPhrase: "in Pune",
    served: true,
    context: [
      "Pune and Pimpri-Chinchwad range from the old city’s peths and cantonment bungalows to IT corridors in Hinjewadi, Kharadi and Baner, and fast-growing suburbs such as Wagholi, Undri and Moshi.",
      "Pune’s milder climate is drier than Mumbai’s, but heavy monsoon rains, river-side neighbourhoods and plenty of greenery still support termites, mosquitoes and rodents.",
      "Across Pune — old wadas in the peths, independent bungalows, gated townships and IT parks — the mix of new construction and established gardens shapes which pests are most common.",
    ],
    pressure: [
      "Bungalows and row houses with gardens in Pune often face subterranean termites coming up from the soil.",
      "New townships on the city’s edges see rodents and termites displaced by ongoing construction.",
      "Neighbourhoods along the Mula–Mutha rivers see higher mosquito activity after the monsoon.",
      "IT parks, hostels and PG accommodation keep bed bug and cockroach demand steady.",
    ],
    tokens: ["pune", "punecity", "pimpri", "chinchwad", "pimpri-chinchwad", "hinjewadi", "hinjawadi", "baner", "aundh", "kothrud", "hadapsar", "kharadi", "wagholi", "magarpatta", "kondhwa", "katraj", "pashan", "bavdhan", "nigdi", "akurdi", "moshi", "chakan", "talegaon", "lonavala", "wakad", "ravet", "punawale", "kiwale", "dehu", "dehu-road", "dapodi", "khadki", "yerwada", "vishrantwadi", "dhanori", "dhanore", "lohegaon", "viman-nagar", "kalyani-nagar", "koregaon-park", "mundhwa", "manjri", "manjari-budruk", "manjari-khurd", "fursungi", "phursungi", "undri", "pisoli", "nibm", "nibm-road", "nibm-annexe", "wanowrie", "camp", "swargate", "sadashiv-peth", "shaniwar-peth", "kasba-peth", "rasta-peth", "budhwar-peth", "somwar-peth", "guruwar-peth", "narayan-peth", "ganesh-peth", "shukrawar-peth", "mahatma-phule-peth", "deccan", "fc-road", "jm-road", "prabhat-road", "erandwane", "karve-nagar", "karve-road", "warje", "sinhagad", "sinhagad-road", "dhayari", "narhe", "nerhe", "ambegaon", "dhankawadi", "bibwewadi", "market-yard", "parvati-darshan", "parvati-gaon", "dattawadi", "sangamwadi", "sangamvadi", "ghorpadi", "khadakwasla", "kirkatwadi", "nanded", "shirur", "daund", "baramati", "indapur", "bhor", "junnar", "jejuri", "purandar", "purandar-fort", "saswad", "uruli", "loni-kalbhor", "kesnand", "lonikand", "shikrapur", "ranjangaon", "koregaon-bhima", "sanaswadi", "rajgurunagar", "khed-shivapur", "manchar", "narayangaon", "otur", "alandi", "mulshi", "paud", "paud-road", "pirangut", "lavale", "lavasa", "panshet", "velha", "nasrapur", "shirwal", "satara-road", "marunji", "mahalunge", "sus", "balewadi", "pimple-saudagar", "pimple-gurav", "pimple-nilakh", "sangvi", "new-sangvi", "kalewadi-phata", "rahatani", "tathawade", "thergaon", "chikhli", "chikhali", "talawade", "dighi", "bhosari", "charholi", "dudulgaon", "kasarwadi", "gahunje", "somatne", "somatane", "somatne-phata", "kamshet", "induri", "kanhe", "maval", "nighoje", "mamurdi", "ganeshkhind", "range-hills", "pune-cantonment", "law-college-road", "low-college-road", "senapati-bapat-road", "golf-club-road", "pune-nagar-road", "pune-sholapur-road", "nagar-road", "mit-collage-road", "salisbury-park", "kondhwa-budruk", "gultekdi", "wagholi-road", "ramtekdi", "handewadi", "mohammadwadi", "kale-padal", "sasane-nagar", "bhekrai-nagar", "keshav-nagar", "dhole-patil", "tingre-nagar", "vadgaon-sheri", "wadgaon-sheri", "kharadi-bypass-road", "khese-park", "lulla-nagar", "gangadham", "ganga-dham", "atur-parki", "bhosale-nagar", "model-colony", "shivaji-nagar-pune", "baner-road", "karegaon-shirur", "pune-cantonment", "kondhapuri", "kurkumbh", "dapodi"],
  },
  {
    key: "outside",
    name: "Outside Maharashtra",
    inPhrase: "outside our main service region",
    served: false,
    context: [
      "Eco-Friendly Pests is based in Mumbai and mainly serves Mumbai, Thane, Navi Mumbai and Pune. For this location, please call to confirm whether a visit can be arranged before booking.",
    ],
    pressure: [
      "Whichever city you are in, the same principles apply: identify the pest, treat where it lives, and remove the conditions that attract it.",
      "If we can’t attend your location, we will tell you upfront rather than taking a booking we can’t fulfil.",
    ],
    tokens: ["delhi", "new-delhi", "karol-bagh", "janakpuri", "lajpat-nagar", "rohini", "pitampura", "dwarka", "okhla", "saket", "nangloi", "indirapuram", "greater-kailash", "model-town", "mayur-vihar", "paschim-vihar", "shalimar-bagh", "salimar-bagh", "mukherjee-nagar", "jangpura", "malviya-nagar", "palam-vihar", "hyderabad", "bangalore", "chennai", "lucknow", "ahmedabad", "sigra", "lanka", "pandeypur", "mahmoorganj", "sarnath", "dubagga", "varanasi", "chintapallyguda", "badarpur", "shahdara", "shshdara", "patliputra-nagar", "aiims", "ambawadi", "hazratganj", "aliganj", "old-katra", "rajrooppur", "ramnathpur", "chitaipur", "sigra", "karol", "naini", "sarita-vihar", "paschim", "punjabi-bagh"],
  },
];

const DEFAULT_REGION: Region = {
  key: "mmr",
  name: "Mumbai Metropolitan Region",
  inPhrase: "in the Mumbai region",
  served: true,
  context: [
    "Homes across the Mumbai region share the same challenge: a long, humid monsoon, dense housing and shared drainage that lets pests move easily between buildings.",
    "Whether it is a cooperative housing society, a redeveloped tower or an independent house, high humidity and closely packed buildings keep pests active almost all year here.",
    "This neighbourhood shares the conditions found across the Mumbai region — warm, humid weather, busy markets nearby and older plumbing alongside new construction.",
  ],
  pressure: [
    "Monsoon humidity keeps cockroaches, termites and mosquitoes active for most of the year.",
    "Shared drains and ducts in apartment buildings allow cockroaches to travel between flats.",
    "Nearby construction often pushes rodents and termites into occupied buildings.",
    "Food stalls and markets in the area can support rodent and cockroach populations close to homes.",
  ],
  tokens: [],
};

const escape = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const COMPILED = REGIONS.flatMap((region) =>
  region.tokens.map((token) => ({ region, token, re: new RegExp(`(?:^|-)${escape(token)}(?=-|$)`, "g") })),
);
const REGION_CACHE = new Map<string, Region>();

export function findRegion(localitySlug: string): Region {
  const s = localitySlug.toLowerCase();
  const cached = REGION_CACHE.get(s);
  if (cached) return cached;
  let best: { region: Region; end: number; len: number } | null = null;
  for (const { region, token, re } of COMPILED) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(s))) {
      const end = m.index + m[0].length;
      // Prefer the match closest to the end (the "-thane-west" qualifier style), then the longest token.
      if (!best || end > best.end || (end === best.end && token.length > best.len)) best = { region, end, len: token.length };
    }
  }
  const result = best?.region ?? DEFAULT_REGION;
  REGION_CACHE.set(s, result);
  return result;
}

export type LocalityType =
  | "station" | "hospital" | "commercial" | "landmark" | "road" | "sector" | "industrial" | "village" | "residential" | "area";

const TYPE_RULES: [LocalityType, RegExp][] = [
  ["station", /(railway-station|metro-station|-station$|station-colony)/],
  ["hospital", /(hospital|aiims|clinic)/],
  ["industrial", /(midc|industrial|industry|estate$|seepz|udyog|godown|factory|port|-mill)/],
  ["commercial", /(mall|market|bazaar|bazar|shopping|complex|plaza|center|centre|bkc|kurla-complex|phoenix|imax)/],
  ["landmark", /(temple|church|mosque|masjid|dargah|caves|beach|chowpatty|lake|fort$|gateway|planetarium|library|museum|society-of-mumbai|campus|cinema)/],
  ["road", /(road|marg|street|lane|path|highway|expressway|chowk|circle|junction|naka|cross|bypass)/],
  ["sector", /(^|-)sector-/],
  ["village", /(gaon|village|wasti|vasti|wadi$|-pada$|koliwada|budruk|khurd|tarf)/],
  ["residential", /(nagar|colony|society|park|baug|bagh|vihar|apartment|heights|township|gardens|enclave|chawl)/],
];

export function findLocalityType(localitySlug: string): LocalityType {
  const s = localitySlug.toLowerCase();
  for (const [type, re] of TYPE_RULES) if (re.test(s)) return type;
  return "area";
}

export const TYPE_COPY: Record<LocalityType, string[]> = {
  station: [
    "Railway and metro station areas like {loc} combine food stalls, shops and dense housing within a few minutes’ walk — ideal conditions for cockroaches and rats, which then move into nearby buildings through drains and shared walls.",
    "Around {loc}, commuter traffic, eateries and late-night trade keep food waste around for long hours. Buildings close to the station benefit from treating drains and ground-floor shops as well as individual flats.",
  ],
  hospital: [
    "Housing, pharmacies, canteens and guest houses around {loc} need careful, low-odour pest control — especially where patients, elderly relatives or newborns are staying nearby.",
    "Near {loc}, clinics, canteens and residential buildings share drains and service lanes. Low-odour gel and bait methods are usually preferred in this kind of setting.",
  ],
  industrial: [
    "{loc} includes industrial units, godowns and offices where stored goods and loading bays attract rodents and stored-product pests. Scheduled programmes with documented visits suit these sites best.",
    "Industrial and warehousing areas such as {loc} need perimeter rodent control, crawling-insect treatment in canteens, and service reports for compliance.",
  ],
  commercial: [
    "Shopping and market areas like {loc} have food courts, eateries and stores that need regular, documented pest control — and nearby homes benefit when commercial neighbours are treated too.",
    "Around {loc}, retail outlets, restaurants and offices sit close together. Shared service lanes and waste areas mean one untreated unit can affect its neighbours.",
  ],
  landmark: [
    "Neighbourhoods around {loc} see steady footfall from visitors, which means food stalls, flower shops and waste — conditions that support cockroaches, rats and flies close to homes.",
    "Homes and shops near {loc} benefit from treatment that covers drains and ground-floor areas, because busy public spaces nearby bring extra food waste and pest pressure.",
  ],
  road: [
    "Along {loc}, shops, restaurants and residential buildings share the same drains and service lanes, so pest activity in one building quickly spreads to the next.",
    "Buildings lining {loc} often have commercial ground floors with homes above. Treating drains, shafts and the ground-floor perimeter protects every floor.",
  ],
  sector: [
    "{loc} is a planned sector with cooperative societies, row houses and commercial plots. Compound walls, gardens and shared drainage make perimeter treatment as important as indoor treatment.",
    "In planned sectors such as {loc}, buildings are spaced out with gardens and open plots between them — great for living, but also good cover for termites, ants and rodents.",
  ],
  village: [
    "{loc} has a mix of independent houses, older homes and open land. Gardens, cattle sheds and stored grain mean rodents, termites, ticks and flies are common concerns.",
    "Village and semi-rural areas like {loc} have more open land and older structures, so termite, rodent and fly control usually covers the whole compound, not just indoors.",
  ],
  residential: [
    "{loc} is a residential neighbourhood of societies and colonies where pests travel between flats through shared drains, ducts and walls — treating common areas along with flats gives the longest-lasting results.",
    "In residential colonies such as {loc}, the most common requests are cockroach, termite and bed bug treatment, often for the whole building through the housing society.",
  ],
  area: [
    "Homes and businesses in {loc} face the same humid conditions as the rest of the region, with shared drains and nearby shops keeping pests active all year.",
    "Families in {loc} typically call us for cockroaches in the kitchen, termites in wooden furniture and mosquitoes after the rains — the treatments below cover each of these.",
  ],
};
