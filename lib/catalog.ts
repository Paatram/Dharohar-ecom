export type ProductCategory =
  | "cookware"
  | "drinkware"
  | "kitchen-tools"
  | "kitchen-sets";

export type Audience =
  | "households"
  | "offices"
  | "restaurants"
  | "hotels"
  | "interior-designers"
  | "gifting";

export type Material = "brass" | "copper" | "kansa" | "mixed";

export type CatalogProduct = {
  slug: string;
  name: string;
  category: ProductCategory;
  material: Material;
  finish: string;
  audiences: Audience[];
  landedCostPaise: number;
  sellingPricePaise: number;
  launchStock: number;
  image: string;
  description: string;
  featured?: boolean;
};

export type ProductGalleryImage = {
  src: string;
  alt: string;
  label: string;
};

export type ProductSubcategory = {
  slug: string;
  name: string;
  description: string;
  productSlugs: string[];
};

export const categoryContent: Record<
  ProductCategory,
  { name: string; description: string; image: string }
> = {
  cookware: {
    name: "Cookware",
    description: "Tawas, patilas, kadais and lagaans shaped for the everyday Indian flame.",
    image: "/images/dharohar/categories/cookware.webp",
  },
  drinkware: {
    name: "Drinkware",
    description: "Copper and peetal vessels for considered hydration and warm hospitality.",
    image: "/images/dharohar/categories/drinkware-clean.webp",
  },
  "kitchen-tools": {
    name: "Kitchen Tools",
    description: "Purposeful ladles, strainers and cutlery that bring metal craft into daily use.",
    image: "/images/dharohar/categories/kitchen-utensils.webp",
  },
  "kitchen-sets": {
    name: "Kitchen Sets",
    description: "Complete dining and serving compositions for homes, gifting and hospitality.",
    image: "/images/dharohar/categories/sets.webp",
  },
};

export const audienceContent: Record<
  Audience,
  { name: string; eyebrow: string; description: string; image: string }
> = {
  households: {
    name: "Households",
    eyebrow: "For the family rasoi",
    description: "Everyday cookware and table pieces selected around the way your family cooks, serves and gathers.",
    image: "/images/dharohar/commissions/homes-collectors.webp",
  },
  offices: {
    name: "Offices",
    eyebrow: "For thoughtful workplaces",
    description: "Desk hydration, pantry service and meaningful employee or client gifting in enduring metals.",
    image: "/images/dharohar/commissions/corporate-gifting.webp",
  },
  restaurants: {
    name: "Restaurants",
    eyebrow: "For professional service",
    description: "Cookware and serveware selected for repeat use, visual character and dependable replenishment.",
    image: "/images/dharohar/commissions/restaurants-hotels.webp",
  },
  hotels: {
    name: "Hotels",
    eyebrow: "For memorable hospitality",
    description: "Room, table and banqueting pieces supported by project quantities and coordinated fulfilment.",
    image: "/images/dharohar/commissions/restaurants-hotels.webp",
  },
  "interior-designers": {
    name: "Interior Designers",
    eyebrow: "For considered spaces",
    description: "Material-led statement objects, finish references and project sourcing for residential and hospitality briefs.",
    image: "/images/dharohar/commissions/interior-designers.webp",
  },
  gifting: {
    name: "Gifting",
    eyebrow: "For occasions that endure",
    description: "Wedding, personal and corporate gifts made distinctive through presentation and personalisation.",
    image: "/images/dharohar/commissions/weddings-gifting.webp",
  },
};

const allTradeAudiences: Audience[] = [
  "households",
  "restaurants",
  "hotels",
  "interior-designers",
  "gifting",
];

export const products: CatalogProduct[] = [
  {
    slug: "dosa-tawa",
    name: "Dosa Tawa",
    category: "cookware",
    material: "brass",
    finish: "Plain",
    audiences: ["households", "restaurants", "hotels"],
    landedCostPaise: 385000,
    sellingPricePaise: 442750,
    launchStock: 5,
    image: "/images/dharohar/categories/cookware.webp",
    description: "A broad traditional tawa selected for evenly spread dosas and everyday griddle cooking.",
    featured: true,
  },
  {
    slug: "roti-tawa",
    name: "Roti Tawa",
    category: "cookware",
    material: "brass",
    finish: "Plain",
    audiences: ["households", "restaurants", "hotels"],
    landedCostPaise: 322500,
    sellingPricePaise: 370875,
    launchStock: 5,
    image: "/images/dharohar/categories/cookware.webp",
    description: "A weighty peetal griddle made for the familiar rhythm of rotis, parathas and daily breads.",
  },
  {
    slug: "hammered-patila",
    name: "Hammered Patila",
    category: "cookware",
    material: "brass",
    finish: "Hammered",
    audiences: allTradeAudiences,
    landedCostPaise: 572500,
    sellingPricePaise: 658375,
    launchStock: 5,
    image: "/images/dharohar/products/brass-patila.webp",
    description: "A hand-finished cooking vessel whose hammered surface carries the visible rhythm of its making.",
    featured: true,
  },
  {
    slug: "plain-patila",
    name: "Plain Patila",
    category: "cookware",
    material: "brass",
    finish: "Plain",
    audiences: ["households", "restaurants", "hotels"],
    landedCostPaise: 510000,
    sellingPricePaise: 586500,
    launchStock: 5,
    image: "/images/dharohar/products/brass-patila.webp",
    description: "A restrained peetal patila designed to move naturally from cooking to generous family service.",
  },
  {
    slug: "peetal-lagaan",
    name: "Peetal Lagaan",
    category: "cookware",
    material: "brass",
    finish: "Plain",
    audiences: allTradeAudiences,
    landedCostPaise: 635000,
    sellingPricePaise: 730250,
    launchStock: 5,
    image: "/images/dharohar/products/brass-lagaan.webp",
    description: "A wide, low traditional vessel for slow preparations, shared tables and celebratory cooking.",
    featured: true,
  },
  {
    slug: "peetal-kadai",
    name: "Peetal Kadai",
    category: "cookware",
    material: "brass",
    finish: "Plain",
    audiences: ["households", "restaurants", "hotels"],
    landedCostPaise: 572500,
    sellingPricePaise: 658375,
    launchStock: 5,
    image: "/images/dharohar/products/brass-flat-kadhai.webp",
    description: "A warm brass kadai with a generous profile for curries, frying and table-side presentation.",
    featured: true,
  },
  {
    slug: "peetal-fry-pan",
    name: "Peetal Fry Pan",
    category: "cookware",
    material: "brass",
    finish: "Plain",
    audiences: ["households", "restaurants"],
    landedCostPaise: 322500,
    sellingPricePaise: 370875,
    launchStock: 5,
    image: "/images/dharohar/products/brass-flat-kadhai.webp",
    description: "A practical peetal pan for measured everyday cooking with a quietly luminous presence.",
  },
  {
    slug: "copper-bottle-lasered",
    name: "Copper Bottle — Lasered",
    category: "drinkware",
    material: "copper",
    finish: "Lasered",
    audiences: ["households", "offices", "hotels", "gifting"],
    landedCostPaise: 111000,
    sellingPricePaise: 127650,
    launchStock: 6,
    image: "/images/dharohar/products/copper-bottle.jpg",
    description: "An upright copper bottle detailed with a precise lasered surface treatment.",
    featured: true,
  },
  {
    slug: "copper-bottle-uv-meena",
    name: "Copper Bottle — UV Meena",
    category: "drinkware",
    material: "copper",
    finish: "UV Meena",
    audiences: ["households", "offices", "hotels", "interior-designers", "gifting"],
    landedCostPaise: 123500,
    sellingPricePaise: 142025,
    launchStock: 6,
    image: "/images/dharohar/products/copper-bottle-lifestyle.jpg",
    description: "A decorated copper bottle balancing traditional colour language with a clean contemporary form.",
  },
  {
    slug: "copper-bottle-embossed",
    name: "Copper Bottle — Embossed",
    category: "drinkware",
    material: "copper",
    finish: "Embossed",
    audiences: ["households", "offices", "hotels", "gifting"],
    landedCostPaise: 111000,
    sellingPricePaise: 127650,
    launchStock: 6,
    image: "/images/dharohar/products/copper-bottle.jpg",
    description: "A tactile copper bottle whose embossed detail catches light without feeling ornamental.",
  },
  {
    slug: "copper-glass-lacquered",
    name: "Copper Glass — Lacquered",
    category: "drinkware",
    material: "copper",
    finish: "Lacquered",
    audiences: ["households", "offices", "restaurants", "hotels", "gifting"],
    landedCostPaise: 48500,
    sellingPricePaise: 55775,
    launchStock: 10,
    image: "/images/dharohar/products/copper-tumbler-engraving.jpg",
    description: "A polished copper tumbler protected with a lacquered exterior finish for an easy everyday ritual.",
  },
  {
    slug: "copper-glass-antique",
    name: "Copper Glass — Antique",
    category: "drinkware",
    material: "copper",
    finish: "Antique",
    audiences: ["households", "restaurants", "hotels", "interior-designers", "gifting"],
    landedCostPaise: 48500,
    sellingPricePaise: 55775,
    launchStock: 10,
    image: "/images/dharohar/products/copper-tumbler-engraving.jpg",
    description: "A warm-toned copper glass finished to suggest the quiet depth of a naturally aged object.",
  },
  {
    slug: "copper-glass-embossed",
    name: "Copper Glass — Embossed",
    category: "drinkware",
    material: "copper",
    finish: "Embossed",
    audiences: ["households", "restaurants", "hotels", "gifting"],
    landedCostPaise: 48500,
    sellingPricePaise: 55775,
    launchStock: 10,
    image: "/images/dharohar/products/copper-tumbler-engraving.jpg",
    description: "A tactile drinking glass with a decorative embossed skin and enduring copper character.",
  },
  {
    slug: "copper-bedroom-bottle-lacquered",
    name: "Copper Bedroom Bottle — Lacquered",
    category: "drinkware",
    material: "copper",
    finish: "Lacquered",
    audiences: ["households", "offices", "hotels", "gifting"],
    landedCostPaise: 161000,
    sellingPricePaise: 185150,
    launchStock: 6,
    image: "/images/dharohar/products/copper-bottle-lifestyle.jpg",
    description: "A bedside copper water set designed as one calm, practical object for private rooms and suites.",
  },
  {
    slug: "copper-bottle-glass-set-two",
    name: "Copper Bottle & Two-Glass Set",
    category: "drinkware",
    material: "copper",
    finish: "Plain",
    audiences: ["households", "offices", "hotels", "gifting"],
    landedCostPaise: 198500,
    sellingPricePaise: 228275,
    launchStock: 3,
    image: "/images/dharohar/products/copper-bottle-lifestyle.jpg",
    description: "A coordinated copper hydration set for two, ready for a guest room, desk or considered gift.",
    featured: true,
  },
  {
    slug: "copper-bottle-glass-set-one",
    name: "Copper Bottle & Glass Set",
    category: "drinkware",
    material: "copper",
    finish: "Plain",
    audiences: ["households", "offices", "hotels", "gifting"],
    landedCostPaise: 148500,
    sellingPricePaise: 170775,
    launchStock: 3,
    image: "/images/dharohar/products/copper-bottle-lifestyle.jpg",
    description: "A compact bottle-and-glass pairing made for bedside, desk and personal gifting rituals.",
  },
  {
    slug: "peetal-glass-set-plain",
    name: "Peetal Glass Set — Plain, 6 Pieces",
    category: "drinkware",
    material: "brass",
    finish: "Plain",
    audiences: ["households", "restaurants", "hotels", "gifting"],
    landedCostPaise: 238500,
    sellingPricePaise: 274275,
    launchStock: 2,
    image: "/images/dharohar/gallery/brass-davara.jpg",
    description: "Six restrained peetal glasses composed for family tables, guest service and gifting.",
  },
  {
    slug: "peetal-glass-set-antique",
    name: "Peetal Glass Set — Antique, 6 Pieces",
    category: "drinkware",
    material: "brass",
    finish: "Antique",
    audiences: ["households", "restaurants", "hotels", "interior-designers", "gifting"],
    landedCostPaise: 238500,
    sellingPricePaise: 274275,
    launchStock: 2,
    image: "/images/dharohar/gallery/brass-davara.jpg",
    description: "A six-piece brass glass set with a deeper antique finish for expressive table settings.",
  },
  {
    slug: "peetal-palta",
    name: "Peetal Palta",
    category: "kitchen-tools",
    material: "brass",
    finish: "Plain",
    audiences: ["households", "restaurants", "hotels", "gifting"],
    landedCostPaise: 48500,
    sellingPricePaise: 63050,
    launchStock: 12,
    image: "/images/dharohar/products/brass-ladles-clean.png",
    description: "A traditional brass turner balanced for everyday movement at the stove.",
  },
  {
    slug: "peetal-serving-spoon",
    name: "Peetal Serving Spoon",
    category: "kitchen-tools",
    material: "brass",
    finish: "Plain",
    audiences: ["households", "restaurants", "hotels", "gifting"],
    landedCostPaise: 36000,
    sellingPricePaise: 46800,
    launchStock: 12,
    image: "/images/dharohar/products/brass-ladles-clean.png",
    description: "A generous peetal serving spoon for shared dishes and warm table service.",
  },
  {
    slug: "chai-chhanni",
    name: "Chai Chhanni",
    category: "kitchen-tools",
    material: "brass",
    finish: "Plain",
    audiences: ["households", "offices", "restaurants", "hotels", "gifting"],
    landedCostPaise: 36000,
    sellingPricePaise: 46800,
    launchStock: 6,
    image: "/images/dharohar/products/brass-ladles-clean.png",
    description: "A familiar tea strainer recast in warm peetal for a small but distinctly Indian daily ritual.",
  },
  {
    slug: "kalchul-peetal",
    name: "Peetal Kalchul",
    category: "kitchen-tools",
    material: "brass",
    finish: "Plain",
    audiences: ["households", "restaurants", "hotels"],
    landedCostPaise: 48500,
    sellingPricePaise: 63050,
    launchStock: 6,
    image: "/images/dharohar/products/brass-ladles-clean.png",
    description: "A long-handled brass ladle made for stirring, portioning and serving with control.",
  },
  {
    slug: "peetal-fork",
    name: "Peetal Fork",
    category: "kitchen-tools",
    material: "brass",
    finish: "Plain",
    audiences: ["households", "restaurants", "hotels", "gifting"],
    landedCostPaise: 17250,
    sellingPricePaise: 22425,
    launchStock: 30,
    image: "/images/dharohar/products/brass-cutlery.jpg",
    description: "A refined brass dining fork designed to add warmth without visual excess.",
  },
  {
    slug: "peetal-spoon",
    name: "Peetal Spoon",
    category: "kitchen-tools",
    material: "brass",
    finish: "Plain",
    audiences: ["households", "restaurants", "hotels", "gifting"],
    landedCostPaise: 17250,
    sellingPricePaise: 22425,
    launchStock: 30,
    image: "/images/dharohar/products/brass-cutlery.jpg",
    description: "A quiet brass spoon for everyday place settings and coordinated hospitality service.",
  },
  {
    slug: "peetal-dinner-set-plain",
    name: "Peetal Dinner Set — Plain",
    category: "kitchen-sets",
    material: "brass",
    finish: "Plain",
    audiences: allTradeAudiences,
    landedCostPaise: 1900000,
    sellingPricePaise: 2185000,
    launchStock: 2,
    image: "/images/dharohar/gallery/dinnerware.webp",
    description: "A complete peetal dining composition for milestone gifting and tables intended to endure.",
    featured: true,
  },
  {
    slug: "peetal-dinner-set-antique",
    name: "Peetal Dinner Set — Antique",
    category: "kitchen-sets",
    material: "brass",
    finish: "Antique",
    audiences: allTradeAudiences,
    landedCostPaise: 1900000,
    sellingPricePaise: 2185000,
    launchStock: 2,
    image: "/images/dharohar/gallery/dinnerware.webp",
    description: "A complete brass dinner service finished with the dimensional warmth of an antique surface.",
  },
  {
    slug: "kansa-dinner-set-plain",
    name: "Kansa Dinner Set — Plain",
    category: "kitchen-sets",
    material: "kansa",
    finish: "Plain",
    audiences: allTradeAudiences,
    landedCostPaise: 3150000,
    sellingPricePaise: 3622500,
    launchStock: 2,
    image: "/images/dharohar/products/kansa-thaali-clean.jpg",
    description: "A substantial kansa dinner setting chosen for its grounded tone, weight and heirloom presence.",
  },
  {
    slug: "peetal-katori-set-plain",
    name: "Peetal Katori Set — Plain, 6 Pieces",
    category: "kitchen-sets",
    material: "brass",
    finish: "Plain",
    audiences: ["households", "restaurants", "hotels", "gifting"],
    landedCostPaise: 207500,
    sellingPricePaise: 290500,
    launchStock: 2,
    image: "/images/dharohar/gallery/tableware.webp",
    description: "Six polished peetal katoris for coordinated daily dining and generous festive service.",
  },
  {
    slug: "peetal-katori-set-antique",
    name: "Peetal Katori Set — Antique, 6 Pieces",
    category: "kitchen-sets",
    material: "brass",
    finish: "Antique",
    audiences: ["households", "restaurants", "hotels", "gifting"],
    landedCostPaise: 201000,
    sellingPricePaise: 281400,
    launchStock: 2,
    image: "/images/dharohar/gallery/tableware.webp",
    description: "A six-piece brass katori set with an antique finish for layered table compositions.",
  },
  {
    slug: "peetal-thali-set-two",
    name: "Peetal Thali Set — 2 Pieces",
    category: "kitchen-sets",
    material: "brass",
    finish: "Plain",
    audiences: ["households", "restaurants", "hotels", "gifting"],
    landedCostPaise: 163500,
    sellingPricePaise: 228900,
    launchStock: 2,
    image: "/images/dharohar/gallery/brass-thali-top.png",
    description: "A pair of luminous peetal thalis for intimate dining, gifting and considered hospitality.",
  },
  {
    slug: "kansa-katori-set-plain",
    name: "Kansa Katori Set — Plain, 6 Pieces",
    category: "kitchen-sets",
    material: "kansa",
    finish: "Plain",
    audiences: ["households", "restaurants", "hotels", "gifting"],
    landedCostPaise: 238500,
    sellingPricePaise: 274275,
    launchStock: 2,
    image: "/images/dharohar/products/kansa-thaali-clean.jpg",
    description: "Six grounded kansa bowls for a table setting with material consistency and calm weight.",
  },
  {
    slug: "kansa-katori-set-antique",
    name: "Kansa Katori Set — Antique, 6 Pieces",
    category: "kitchen-sets",
    material: "kansa",
    finish: "Antique",
    audiences: ["households", "restaurants", "hotels", "gifting"],
    landedCostPaise: 238500,
    sellingPricePaise: 274275,
    launchStock: 2,
    image: "/images/dharohar/products/kansa-thaali-clean.jpg",
    description: "A six-piece kansa bowl set with a deeper finish selected for expressive dining rituals.",
  },
  {
    slug: "kansa-thali-set-two",
    name: "Kansa Thali Set — 2 Pieces",
    category: "kitchen-sets",
    material: "kansa",
    finish: "Plain",
    audiences: ["households", "restaurants", "hotels", "gifting"],
    landedCostPaise: 520000,
    sellingPricePaise: 598000,
    launchStock: 2,
    image: "/images/dharohar/products/kansa-thaali-clean.jpg",
    description: "A pair of kansa thalis for quiet daily meals and lasting ceremonial gifts.",
  },
  {
    slug: "peetal-donga-set-glass-lid",
    name: "Peetal Donga Set — Glass Lid",
    category: "kitchen-sets",
    material: "mixed",
    finish: "Plain brass · Glass",
    audiences: allTradeAudiences,
    landedCostPaise: 1900000,
    sellingPricePaise: 2185000,
    launchStock: 3,
    image: "/images/dharohar/products/brass-kadhai-set.webp",
    description: "A coordinated peetal serving set with glass lids for celebratory tables and premium hospitality.",
  },
];

export const subcategoryContent: Record<ProductCategory, ProductSubcategory[]> = {
  cookware: [
    { slug: "tawas", name: "Tawas", description: "Dosa and roti griddles for everyday Indian breads and batters.", productSlugs: ["dosa-tawa", "roti-tawa"] },
    { slug: "patilas", name: "Patilas", description: "Deep traditional vessels in plain and hammered finishes.", productSlugs: ["hammered-patila", "plain-patila"] },
    { slug: "kadais-pans", name: "Kadais & Pans", description: "Versatile brass forms for frying, curries and table service.", productSlugs: ["peetal-kadai", "peetal-fry-pan"] },
    { slug: "lagaans", name: "Lagaans", description: "Wide, low vessels for slow cooking and shared preparations.", productSlugs: ["peetal-lagaan"] },
  ],
  drinkware: [
    { slug: "copper-bottles", name: "Copper Bottles", description: "Personal and bedside copper bottles in distinctive finishes.", productSlugs: ["copper-bottle-lasered", "copper-bottle-uv-meena", "copper-bottle-embossed", "copper-bedroom-bottle-lacquered"] },
    { slug: "copper-glasses", name: "Copper Glasses", description: "Copper tumblers for daily hydration and hospitality service.", productSlugs: ["copper-glass-lacquered", "copper-glass-antique", "copper-glass-embossed"] },
    { slug: "bottle-glass-sets", name: "Bottle & Glass Sets", description: "Coordinated copper bottle sets for desks, rooms and gifting.", productSlugs: ["copper-bottle-glass-set-two", "copper-bottle-glass-set-one"] },
    { slug: "peetal-glass-sets", name: "Peetal Glass Sets", description: "Six-piece brass tumbler sets in plain and antique finishes.", productSlugs: ["peetal-glass-set-plain", "peetal-glass-set-antique"] },
  ],
  "kitchen-tools": [
    { slug: "ladles-serving-tools", name: "Ladles & Serving Tools", description: "Palta, serving spoon and kalchul forms for cooking and service.", productSlugs: ["peetal-palta", "peetal-serving-spoon", "kalchul-peetal"] },
    { slug: "strainers", name: "Strainers", description: "Purposeful strainers for familiar kitchen rituals.", productSlugs: ["chai-chhanni"] },
    { slug: "cutlery", name: "Cutlery", description: "Brass forks and spoons for a warm, coordinated table.", productSlugs: ["peetal-fork", "peetal-spoon"] },
  ],
  "kitchen-sets": [
    { slug: "dinner-sets", name: "Dinner Sets", description: "Complete peetal and kansa dining compositions.", productSlugs: ["peetal-dinner-set-plain", "peetal-dinner-set-antique", "kansa-dinner-set-plain"] },
    { slug: "katori-sets", name: "Katori Sets", description: "Six-piece bowl sets across peetal and kansa finishes.", productSlugs: ["peetal-katori-set-plain", "peetal-katori-set-antique", "kansa-katori-set-plain", "kansa-katori-set-antique"] },
    { slug: "thali-sets", name: "Thali Sets", description: "Paired peetal and kansa thalis for everyday and ceremonial tables.", productSlugs: ["peetal-thali-set-two", "kansa-thali-set-two"] },
    { slug: "serving-sets", name: "Serving Sets", description: "Coordinated brass serveware for generous tables and hospitality.", productSlugs: ["peetal-donga-set-glass-lid"] },
  ],
};

export const featuredProducts = products.filter((product) => product.featured);

export function formatInr(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: paise % 100 === 0 ? 0 : 2,
  }).format(paise / 100);
}

export function findProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function productGallery(product: CatalogProduct): ProductGalleryImage[] {
  const cookware = [
    product.image,
    "/images/dharohar/gallery/brass-kadhai-angle.png",
    "/images/dharohar/products/brass-flat-kadhai.webp",
    "/images/dharohar/categories/cookware.webp",
  ];
  const tawas = [
    product.image,
    "/images/dharohar/gallery/brass-paraat.jpg",
    "/images/dharohar/products/brass-flat-kadhai.webp",
    "/images/dharohar/categories/cookware.webp",
  ];
  const patilas = [
    product.image,
    "/images/dharohar/products/brass-lagaan.webp",
    "/images/dharohar/gallery/brass-kadhai-angle.png",
    "/images/dharohar/categories/cookware.webp",
  ];
  const copperBottles = [
    product.image,
    "/images/dharohar/gallery/copper-bottle-front.png",
    "/images/dharohar/products/copper-bottle-lifestyle.jpg",
    "/images/dharohar/gallery/copper-detail.webp",
  ];
  const copperGlasses = [
    product.image,
    "/images/dharohar/gallery/copper-tumbler-angle.png",
    "/images/dharohar/gallery/copper-pair.webp",
    "/images/dharohar/gallery/copper-detail.webp",
  ];
  const peetalGlasses = [
    product.image,
    "/images/dharohar/gallery/tableware.webp",
    "/images/dharohar/gallery/brass-thali-top.png",
    "/images/dharohar/categories/drinkware-clean.webp",
  ];
  const tools = [
    product.image,
    product.slug.includes("fork") || product.slug.includes("spoon")
      ? "/images/dharohar/products/brass-cutlery.jpg"
      : "/images/dharohar/products/brass-ladles-clean.png",
    "/images/dharohar/categories/kitchen-utensils.webp",
    "/images/dharohar/gallery/tableware.webp",
  ];
  const kansaSets = [
    product.image,
    "/images/dharohar/gallery/kansa.webp",
    "/images/dharohar/products/kansa-thaali-clean.jpg",
    "/images/dharohar/gallery/dinnerware.webp",
  ];
  const peetalSets = [
    product.image,
    "/images/dharohar/gallery/brass-thali-top.png",
    "/images/dharohar/gallery/tableware.webp",
    "/images/dharohar/gallery/dinnerware.webp",
  ];

  let sources = cookware;
  if (product.slug.includes("tawa")) sources = tawas;
  else if (product.slug.includes("patila")) sources = patilas;
  else if (product.category === "drinkware" && product.slug.includes("bottle")) sources = copperBottles;
  else if (product.category === "drinkware" && product.material === "copper") sources = copperGlasses;
  else if (product.category === "drinkware") sources = peetalGlasses;
  else if (product.category === "kitchen-tools") sources = tools;
  else if (product.category === "kitchen-sets" && product.material === "kansa") sources = kansaSets;
  else if (product.category === "kitchen-sets") sources = peetalSets;

  const labels = ["Primary view", "Alternate view", "Material detail", "Collection view"];
  return [...new Set(sources)].slice(0, 4).map((src, index) => ({
    src,
    label: labels[index],
    alt: `${product.name} — ${labels[index].toLowerCase()}`,
  }));
}

export function findSubcategory(category: ProductCategory, subcategorySlug: string) {
  return subcategoryContent[category].find((subcategory) => subcategory.slug === subcategorySlug);
}

export function productsForSubcategory(subcategory: ProductSubcategory) {
  const included = new Set(subcategory.productSlugs);
  return products.filter((product) => included.has(product.slug));
}

export function catalogSummary() {
  return products.reduce(
    (summary, product) => ({
      skus: summary.skus + 1,
      units: summary.units + product.launchStock,
      landedCostPaise:
        summary.landedCostPaise + product.landedCostPaise * product.launchStock,
      selloutRevenuePaise:
        summary.selloutRevenuePaise +
        product.sellingPricePaise * product.launchStock,
    }),
    { skus: 0, units: 0, landedCostPaise: 0, selloutRevenuePaise: 0 },
  );
}
