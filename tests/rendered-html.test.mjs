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

test("server-renders the Dharohar storefront", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /The Heritage Kitchen, Reimagined/i);
  assert.match(html, /Made for today/i);
  assert.match(html, /Households/);
  assert.match(html, /Interior Designers/);
  assert.match(html, /Shop the collection/);
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
    assert.match(await response.text(), new RegExp(expected, "i"));
  });
}

test("returns a real not-found response for an unknown product", async () => {
  const response = await render("/products/not-a-real-product");
  assert.equal(response.status, 404);
});
