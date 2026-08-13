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
  assert.match(text, /Made for today/i);
  assert.match(text, /Households/);
  assert.match(text, /Interior Designers/);
  assert.match(text, /Shop the collection/);
  assert.ok(text.indexOf("Shop the collection.") < text.indexOf("Made in India"), "categories must appear immediately after the hero");
  assert.match(text, /Shop by category/);
  assert.match(text, /View all Cookware/);
  assert.match(text, /All products/);
  assert.match(text, /Hospitality/);
  assert.match(html, /class="nav-trigger"/);
  assert.doesNotMatch(html, /<details class="nav-menu"/);
  assert.match(html, /aria-controls="mobile-drawer"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("server-renders a launch product with accurate gating", async () => {
  const response = await render("/products/peetal-kadai");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Peetal Kadai/);
  assert.match(html, /Register purchase interest/);
  assert.match(html, /data-quality gate/);
  assert.match(html, /application\/ld\+json/);
  assert.doesNotMatch(html, /schema.org\/(InStock|LimitedAvailability|PreOrder)/);
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
