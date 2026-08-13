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
  assert.match(text, /Shop the collection/);
  assert.ok(text.indexOf("Choose for where it belongs") < text.indexOf("Shop the collection."), "space-led shopping must be the first storefront section");
  assert.ok(text.indexOf("Shop the collection.") < text.indexOf("Made in India"), "product categories must remain above supporting assurances");
  assert.doesNotMatch(html, /class="hero"|dharohar-hero-tableau/, "the ecommerce homepage must not render a campaign hero");
  assert.doesNotMatch(html, /#b78b3c|#e2c580|226,\s*197,\s*128/i, "legacy gold-brown theme values must not return");
  assert.match(text, /Every piece, one place/);
  assert.match(text, /All products 34/);
  assert.match(html, /category-filter-toggles/);
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

test("server-renders a launch product with accurate gating", async () => {
  const response = await render("/products/peetal-kadai");
  assert.equal(response.status, 200);
  const html = await response.text();
  const text = visibleText(html);
  assert.match(html, /Peetal Kadai/);
  assert.match(html, /Register purchase interest/);
  assert.match(html, /data-quality gate/);
  assert.match(html, /application\/ld\+json/);
  assert.match(text, /Add to selection bag/);
  assert.match(text, /Check delivery readiness/);
  assert.doesNotMatch(html, /schema.org\/(InStock|LimitedAvailability|PreOrder)/);
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
  assert.match(text, /No recurring payment is taken today/i);
  assert.match(text, /Save my care plan/i);
  assert.match(text, /Stored only in this browser/i);
});

test("care-plan interest pre-fills the enquiry subject", async () => {
  const response = await render("/contact?subject=Care%20Circle%20annual%20membership");
  assert.equal(response.status, 200);
  const text = visibleText(await response.text());
  assert.match(text, /Selected enquiry/i);
  assert.match(text, /Care Circle annual membership/i);
});

for (const [pathname, expected] of [
  ["/collections/all", "34 pieces"],
  ["/collections/cookware/tawas", "Dosa Tawa"],
  ["/collections/drinkware/copper-bottles", "Copper Bottle"],
  ["/collections/kitchen-tools/cutlery", "Peetal Fork"],
  ["/collections/kitchen-sets/dinner-sets", "Kansa Dinner Set"],
  ["/shop-for/hotels", "Hotels"],
  ["/materials", "Know the metal"],
  ["/our-craft", "Craft should be documented"],
  ["/care", "Use leaves a history"],
  ["/shipping-returns", "Shipping terms will open"],
  ["/privacy", "No customer data collection"],
  ["/terms", "commercial terms are not yet active"],
  ["/contact?product=peetal-kadai", "Interest in Peetal Kadai"],
  ["/search?q=copper", "Results for"],
  ["/gifting", "Given once"],
  ["/trade", "supported like a project"],
  ["/wishlist", "Saved pieces"],
  ["/compare", "Compare without guesswork"],
  ["/cart", "considered group of objects"],
  ["/account", "Orders, addresses and care"],
  ["/track-order", "honest order timeline"],
  ["/checkout-readiness", "Checkout opens"],
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

test("returns a real not-found response for an unknown product", async () => {
  const response = await render("/products/not-a-real-product");
  assert.equal(response.status, 404);
});
