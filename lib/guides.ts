export type Guide = { slug: string; title: string; excerpt: string; sections: { title: string; body: string }[] };
export const guides: Guide[] = [
  { slug: "copper-peetal-kansa-guide", title: "Copper, Peetal or Kansa? Begin with the use.", excerpt: "A practical way to choose among three expressive traditional metals without relying on sweeping wellness claims.", sections: [
    { title: "Start with the object", body: "Choose first by intended use: cooking, drinking, dining or serving. The exact construction, lining and compatibility of a specific object matter more than a broad claim about its metal." },
    { title: "Then consider care", body: "Copper, brass and bronze all change naturally with air, moisture and handling. Before purchase, compare the approved cleaning method, drying needs, lining and whether restoration is available." },
    { title: "Read the exact product record", body: "Material name alone does not establish composition, food-contact suitability or cooktop compatibility. Dharohar publishes those details only after exact-SKU verification." },
  ] },
  { slug: "choose-a-traditional-tawa", title: "How to choose a traditional tawa.", excerpt: "Think through size, weight, construction, handle, cooking surface and compatibility before comparing price.", sections: [
    { title: "Match the food and flame", body: "Dosa and roti cooking favour different working surfaces and movements. Consider usable diameter, rim profile, weight and the way the tawa will be lifted and stored." },
    { title: "Confirm construction", body: "Ask for exact metal composition, food-contact lining if relevant, base construction and compatible heat sources. Do not infer induction suitability from appearance." },
    { title: "Plan for ownership", body: "A good choice includes cleaning, drying, storage and any future relining or restoration process—not merely the first use." },
  ] },
  { slug: "care-for-copper-drinkware", title: "A restrained care routine for copper drinkware.", excerpt: "Daily drying, finish-aware cleaning and careful storage help preserve both function and character.", sections: [
    { title: "After every use", body: "Empty, rinse and dry the vessel fully. Do not leave moisture trapped under a cap or inside a nested set." },
    { title: "Respect the finish", body: "Lacquered, embossed, antique and untreated surfaces may require different methods. Follow the exact care card rather than applying an abrasive or acidic home remedy universally." },
    { title: "Natural change is not a defect", body: "Traditional metal surfaces can deepen, mark and patinate. The product record should distinguish expected variation from a quality issue." },
  ] },
  { slug: "hospitality-metalware-buying-guide", title: "A metalware brief for restaurants and hotels.", excerpt: "Translate an aesthetic selection into quantities, service conditions, replenishment and a realistic delivery plan.", sections: [
    { title: "Document the service context", body: "Record food or beverage use, guest touchpoints, cleaning method, handling frequency and visual direction before choosing a finish." },
    { title: "Prototype before volume", body: "Approve exact dimensions, weight, balance, finish variation and packaging on a sample or documented reference before committing project quantities." },
    { title: "Plan continuity", body: "Agree MOQ, batch variation, replacement availability, inspection criteria and promised dates in the written quotation." },
  ] },
];
export function findGuide(slug: string) { return guides.find((guide) => guide.slug === slug); }
