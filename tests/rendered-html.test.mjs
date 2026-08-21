import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

function visibleText(html) {
  return html.replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ");
}

test("server-renders the Dharohar storefront", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  const text = visibleText(html);
  assert.match(text, /The Heritage Kitchen, Reimagined/i);
  assert.match(text, /Choose for where it belongs/i);
  assert.match(text, /Households/);
  assert.match(text, /Interior Designers/);
  assert.match(text, /Find the right piece/);
  assert.ok(text.indexOf("The Heritage Kitchen, Reimagined") < text.indexOf("Choose for where it belongs"), "the professional storefront hero must lead the page");
  assert.ok(text.indexOf("Choose for where it belongs") < text.indexOf("Find the right piece"), "space-led shopping must remain directly above catalogue discovery");
  assert.ok(text.indexOf("Find the right piece") < text.indexOf("Made in India"), "catalogue discovery must remain above supporting assurances");
  assert.match(html, /class="hero storefront-hero"|dharohar-hero-tableau/, "the ecommerce homepage must render the requested visual hero");
  assert.match(html, /aria-roledescription="carousel"/, "the hero must render as an accessible carousel");
  assert.match(html, /Previous featured collection/);
  assert.match(html, /Next featured collection/);
  assert.equal((html.match(/Show slide \d:/g) ?? []).length, 4, "the hero must offer four directly selectable slides");
  assert.doesNotMatch(html, /#b78b3c|#e2c580|226,\s*197,\s*128/i, "legacy gold-brown theme values must not return");
  assert.match(text, /All products 35/);
  assert.match(html, /category-filter-toggles/);
  assert.match(html, /home-filter-panel/);
  assert.match(text, /All prices/);
  assert.match(text, /All metals/);
  assert.match(text, /All spaces/);
  assert.doesNotMatch(html, /class="category-product-row/);
  assert.match(text, /All products/);
  assert.match(text, /Hotels/);
  assert.match(html, /class="nav-trigger"/);
  assert.doesNotMatch(html, /<details class="nav-menu"/);
  assert.equal((html.match(/class="site-header"/g) ?? []).length, 1, "the storefront must render one unified site header");
  assert.doesNotMatch(html, /class="announcement|class="category-nav/, "secondary stacked navigation rows must not return");
  assert.match(html, /aria-controls="mobile-drawer"/);
  assert.match(text, /Care Circle/);
  assert.match(text, /Trade/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("server-renders a purchase-ready product detail", async () => {
  const response = await render("/products/peetal-kadai");
  assert.equal(response.status, 200);
  const html = await response.text();
  const text = visibleText(html);
  assert.match(html, /Peetal Kadhai/);
  assert.match(text, /₹3,999/);
  assert.match(text, /1 qt\./);
  assert.match(html, /peetal-kadai-01\.webp/);
  assert.match(html, /peetal-kadai-04\.webp/);
  assert.match(html, /Previous Peetal Kadhai image/);
  assert.match(html, /Next Peetal Kadhai image/);
  assert.match(html, /ProductGallery/);
  assert.match(html, /Frequently paired/);
  assert.match(html, /application\/ld\+json/);
  assert.match(text, /Add to bag/);
  assert.match(text, /Buy now/);
  assert.match(text, /Check delivery location/);
  assert.match(text, /Customer reviews/);
  assert.match(html, /schema.org\/InStock/);
});

test("server-renders the exact six-piece steel and copper-lined glass set", async () => {
  const response = await render("/products/steel-copper-glass-set-six");
  assert.equal(response.status, 200);
  const html = await response.text();
  const text = visibleText(html);
  assert.match(text, /Steel Glass Set with Copper Lining/);
  assert.match(text, /₹2,599/);
  assert.match(text, /6 glasses/);
  assert.match(html, /steel-copper-glass-set-01\.webp/);
  assert.match(html, /steel-copper-glass-set-04\.webp/);
  assert.match(html, /Previous Steel Glass Set with Copper Lining — 6 Pieces image/);
  assert.match(html, /Next Steel Glass Set with Copper Lining — 6 Pieces image/);
});

test("server-renders the exact Kansa Thali Set", async () => {
  const response = await render("/products/kansa-thali-set-two");
  assert.equal(response.status, 200);
  const html = await response.text();
  const text = visibleText(html);
  assert.match(text, /Kansa Thali Set/);
  assert.match(text, /₹8,249/);
  assert.match(html, /kansa-thali-set-01\.webp/);
  assert.match(html, /kansa-thali-set-06\.webp/);
  assert.match(html, /Previous Kansa Thali Set image/);
  assert.match(html, /Next Kansa Thali Set image/);
});

test("server-renders the exact Brass Masala Daani without claiming unknown stock", async () => {
  const response = await render("/products/brass-masala-daani");
  assert.equal(response.status, 200);
  const html = await response.text();
  const text = visibleText(html);
  assert.match(text, /Brass Masala Daani/);
  assert.match(text, /₹5,299/);
  assert.match(text, /Confirmed before payment/);
  assert.match(html, /brass-masala-daani-01\.webp/);
  assert.match(html, /brass-masala-daani-04\.webp/);
  assert.match(html, /Previous Brass Masala Daani image/);
  assert.match(html, /Next Brass Masala Daani image/);
  assert.doesNotMatch(html, /schema.org\/InStock/);
});

test("server-renders the device-private Care Circle workflow", async () => {
  const response = await render("/care");
  assert.equal(response.status, 200);
  const text = visibleText(await response.text());
  assert.match(text, /Keep care close to the object/i);
  assert.match(text, /Choose how closely we stay involved/i);
  assert.match(text, /Care Notes/i);
  assert.match(text, /Care Circle/i);
  assert.match(text, /Collector Care/i);
  assert.match(text, /Start with complimentary care notes/i);
  assert.match(text, /Save my care plan/i);
  assert.match(text, /saved on this device/i);
});

test("care-plan interest pre-fills the enquiry subject", async () => {
  const response = await render("/contact?subject=Care%20Circle%20annual%20membership");
  assert.equal(response.status, 200);
  const text = visibleText(await response.text());
  assert.match(text, /Selected enquiry/i);
  assert.match(text, /Care Circle annual membership/i);
});

for (const [pathname, expected] of [
  ["/collections/all", "35 pieces"],
  ["/collections/cookware/tawas", "Dosa Tawa"],
  ["/collections/drinkware/copper-bottles", "Copper Bottle"],
  ["/collections/kitchen-tools/cutlery", "Peetal Fork"],
  ["/collections/kitchen-sets/dinner-sets", "Kansa Dinner Set"],
  ["/shop-for/hotels", "Hotels"],
  ["/materials", "Know the metal"],
  ["/our-craft", "Craft should be documented"],
  ["/care", "Use leaves a history"],
  ["/shipping-returns", "Delivery information for your order"],
  ["/privacy", "Data is collected for clear customer actions"],
  ["/terms", "Terms of using the Dharohar store"],
  ["/contact?product=peetal-kadai", "Ask about Peetal Kadhai"],
  ["/search?q=copper", "Results for"],
  ["/gifting", "Given once"],
  ["/trade", "supported like a project"],
  ["/wishlist", "Saved pieces"],
  ["/compare", "Choose the right piece"],
  ["/cart", "Review your order"],
  ["/account", "Sign in or create your Dharohar account"],
  ["/track-order", "clear order timeline"],
  ["/checkout", "Complete your order"],
  ["/journal", "Useful knowledge"],
  ["/journal/choose-a-traditional-tawa", "traditional tawa"],
  ["/faq", "Questions, answered plainly"],
]) {
  test(`server-renders ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(visibleText(await response.text()), new RegExp(expected, "i"));
  });
}

test("legacy checkout-readiness route redirects customers to checkout", async () => {
  const response = await render("/checkout-readiness");
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "/checkout");
});

test("returns a real not-found response for an unknown product", async () => {
  const response = await render("/products/not-a-real-product");
  assert.equal(response.status, 404);
});
