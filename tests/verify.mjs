// Verifies the built site in dist/ the way a crawler and a visitor would see it.
import http from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const DIST = join(process.cwd(), "dist"), SITE = "https://jugaadadvisory.com";
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".jpg": "image/jpeg", ".png": "image/png", ".xml": "application/xml", ".txt": "text/plain" };

// Local server that mimics Cloudflare static assets with html_handling "drop-trailing-slash" + 404 page
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const send = (code, file, extra = {}) => { res.writeHead(code, { "content-type": MIME[extname(file)] || "application/octet-stream", ...extra }); res.end(readFileSync(file)); };
  if (p.length > 1 && p.endsWith("/")) { res.writeHead(308, { location: p.slice(0, -1) }); return res.end(); }
  if (p.endsWith(".html") && p !== "/404.html") { res.writeHead(308, { location: p === "/index.html" ? "/" : p.slice(0, -5) }); return res.end(); }
  const cands = p === "/" ? ["index.html"] : [p.slice(1), p.slice(1) + ".html"];
  for (const c of cands) { const f = join(DIST, c); if (existsSync(f) && statSync(f).isFile()) return send(200, f); }
  send(404, join(DIST, "404.html"));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}`;

const results = []; let failures = 0;
const check = (page, name, ok, detail = "") => { results.push({ page, name, ok, detail }); if (!ok) { failures++; console.log(`  FAIL [${page}] ${name} ${detail}`); } };

// ---- expected routes and content that must be in the INITIAL HTML (no JS)
const ROUTES = {
  "/": ["Every problem is different.", "Not every problem has a ready-made answer.", "What we bring to the table", "Understand first. Solve second.", "One practice. Different perspectives.", "You may attend hundreds of seminars", "Local understanding. Wider connections."],
  "/about": ["A different way of looking at problems.", "What Jugaad means", "Jugaad is not about cutting corners.", "Our philosophy", "Experience across different worlds.", "Crystal Communications, Nomad Films and Guava Creative Solutions", "Green TV India", "ARDEAF Foundation", "What we are not", "not a law firm"],
  "/approach": ["The problem comes first. The solution follows.", "Listen", "Understand", "Explore", "Connect", "Move Forward", "Not every assignment requires every stage", "A note on practical solutions"],
  "/practice-areas": ["Seven perspectives, one practice.", "Business", "Creative", "Production", "Legal &amp; Resolution", "Realty", "Connect &amp; Industry", "Earth &amp; Agriculture"],
  "/practice-areas/business": ["Strategy. Structure. New possibilities.", "Business strategy and business-model evaluation", "Connecting relevant business and industry expertise"],
  "/practice-areas/creative": ["Ideas need clarity. Stories need direction.", "Screenplay consultation", "Concept development and creative direction"],
  "/practice-areas/production": ["Good ideas need workable plans.", "Budget review and cost estimates", "Professional execution is arranged"],
  "/practice-areas/legal-resolution": ["When matters become complicated, clarity matters.", "Mediation support", "not a law firm", "No settlement or outcome is guaranteed"],
  "/practice-areas/realty": ["Property is not always just about property.", "Landowner–developer discussions", "RERA-registered broker"],
  "/practice-areas/connect-industry": ["The right conversation can open a different route.", "Manufacturing and technology partnerships", "International Business &amp; Diplomatic Connect", "established international network across business, government, diplomatic missions and institutions", "not lobbying, influence-selling"],
  "/practice-areas/earth-agriculture": ["Development and ecology must be considered together.", "Biodiversity and ecological projects", "Green TV India", "Agriculture Rural Development &amp; Environment Awareness Foundation"],
  "/international-connect": ["The right conversation can open a different route.", "National", "International Business &amp; Diplomatic Connect", "Connecting opportunities across borders.", "established international network across business, government, diplomatic missions and institutions", "Our role may include", "We do not represent governments or diplomatic missions", "Local understanding. Wider connections. International possibilities."],
  "/insights": ["Observations from the work.", "Placeholder — article to come"],
  "/contact": ["Tell us what you are trying to solve.", "Name", "Country", "Area of interest", "Brief description of the situation", "Preferred method of contact", "Prepare my enquiry", "inquiry@jugaadadvisory.com", "+91 98200 79484", "wa.me/919820079484", "linkedin.com/in/junaidnomad"],
  "/privacy-policy": ["Privacy Policy", "Starter text"],
  "/terms": ["Terms of Use", "Starter text"],
};
const paths = Object.keys(ROUTES);
const get = async (p, opt = {}) => fetch(BASE + p, { redirect: "manual", ...opt });
const attr = (html, re) => (html.match(re) || [])[1];

console.log("\n== 1. Raw HTML tests (no JavaScript executed) ==");
const titles = new Set(), descs = new Set(), internal = new Set(), assets = new Set();
for (const p of paths) {
  const r = await get(p), html = await r.text();
  check(p, "HTTP 200", r.status === 200, `status ${r.status}`);
  check(p, "content-type html", /text\/html/.test(r.headers.get("content-type") || ""));
  const title = attr(html, /<title>([^<]*)<\/title>/), desc = attr(html, /<meta name="description" content="([^"]*)"/);
  check(p, "title present, unique, <=70 chars", !!title && !titles.has(title) && title.length <= 70, title);
  check(p, "meta description present, unique, 50-200 chars", !!desc && !descs.has(desc) && desc.length >= 50 && desc.length <= 200, `${desc?.length} chars`);
  titles.add(title); descs.add(desc);
  const canon = attr(html, /<link rel="canonical" href="([^"]*)"/);
  check(p, "canonical correct", canon === SITE + p, canon);
  check(p, "og:title/description/url/image + twitter card", ["og:title", "og:description", "og:url", "og:image"].every((k) => new RegExp(`property="${k}" content="[^"]+"`).test(html)) && /twitter:card" content="summary_large_image"/.test(html));
  check(p, "og:url equals canonical", attr(html, /property="og:url" content="([^"]*)"/) === canon);
  const h1 = (html.match(/<h1[ >]/g) || []).length;
  check(p, "exactly one <h1>", h1 === 1, `${h1} found`);
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  check(p, "substantial text in initial HTML", text.length > 900, `${text.length} chars`);
  const missing = ROUTES[p].filter((s) => !html.includes(s));
  check(p, "approved content present in initial HTML", missing.length === 0, missing.length ? "missing: " + missing.join(" | ") : `${ROUTES[p].length} phrases found`);
  let ld = []; try { ld = JSON.parse(attr(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/))["@graph"].map((x) => x["@type"]); } catch { ld = ["PARSE ERROR"]; }
  const wantLd = p === "/" ? ["Organization", "WebSite"] : ["BreadcrumbList"];
  check(p, "structured data valid", wantLd.every((t) => ld.includes(t)) && !/Review|Rating/.test(ld.join()), ld.join(","));
  check(p, "no hash-navigation links", !/href="#(?!main)/.test(html));
  check(p, "no placeholder/template text", !/Your Short Catchy|lorem ipsum|undefined|\[object/i.test(html));
  for (const m of html.matchAll(/<a [^>]*href="([^"]+)"/g)) if (m[1].startsWith("/")) internal.add(m[1].split("#")[0]);
  for (const m of html.matchAll(/(?:src|href)="(\/[^"]+\.(?:jpg|png|css|js))"/g)) assets.add(m[1]);
  for (const m of html.matchAll(/(?:src|href)="(https:\/\/jugaadadvisory\.com\/[^"]+\.(?:jpg|png))"/g)) assets.add(m[1].replace(SITE, ""));
}
console.log("\n== 2. Links, images and assets ==");
for (const l of internal) { const r = await get(l); check("links", `internal link ${l} -> 200`, r.status === 200, `status ${r.status}`); }
for (const a of assets) { const r = await get(a); check("assets", `asset ${a} -> 200`, r.status === 200 && Number(r.headers.get("content-length") ?? 1) > 0, `status ${r.status}`); }
check("links", `crawled ${internal.size} distinct internal links and ${assets.size} assets`, true);

console.log("\n== 3. sitemap.xml, robots.txt, 404, redirects ==");
{
  const sm = await (await get("/sitemap.xml")).text(), locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const want = paths.map((p) => SITE + p);
  check("sitemap", "sitemap.xml accessible", (await get("/sitemap.xml")).status === 200);
  check("sitemap", `lists all ${want.length} public pages, nothing extra`, locs.length === want.length && want.every((w) => locs.includes(w)), `${locs.length} urls`);
  const rb = await (await get("/robots.txt")).text();
  check("robots", "robots.txt accessible, allows all, points to sitemap", /User-agent: \*/.test(rb) && /Allow: \//.test(rb) && !/Disallow:\s*\//.test(rb) && rb.includes(`Sitemap: ${SITE}/sitemap.xml`), JSON.stringify(rb));
  const nf = await get("/does-not-exist"); check("404", "unknown URL returns real 404", nf.status === 404 && /noindex/.test(await nf.text()));
  check("redirect", "trailing slash redirects to canonical", (await get("/about/")).status === 308 && (await get("/about/")).headers.get("location") === "/about");
  check("headers", "_headers file has security headers", /X-Content-Type-Options/.test(readFileSync(join(DIST, "_headers"), "utf8")));
}

console.log("\n== 4. Browser tests (Chromium): desktop + mobile, console errors, layout, images ==");
const browser = await chromium.launch();
mkdirSync("tests/shots", { recursive: true });
const blockExternal = (ctx) => ctx.route(/^(?!http:\/\/127\.0\.0\.1)/, (r) => r.abort());
for (const [label, vp, mobile] of [["desktop", { width: 1280, height: 900 }, false], ["mobile", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 }); await blockExternal(ctx);
  for (const p of paths) {
    const page = await ctx.newPage(), errs = [];
    page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => m.type() === "error" && !/Failed to load resource|ERR_FAILED/.test(m.text()) && errs.push(m.text()));
    const resp = await page.goto(BASE + p, { waitUntil: "load" });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 250)); });
    const info = await page.evaluate(() => ({ over: document.documentElement.scrollWidth - document.documentElement.clientWidth, broken: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src), h1: document.querySelector("h1")?.textContent?.trim() }));
    check(`${label} ${p}`, "loads (200), no JS errors", resp.status() === 200 && errs.length === 0, errs.join("; "));
    check(`${label} ${p}`, "no horizontal overflow", info.over <= 1, `${info.over}px`);
    check(`${label} ${p}`, "no broken images", info.broken.length === 0, info.broken.join(","));
    if (["/", "/about", "/practice-areas/connect-industry", "/international-connect", "/contact"].includes(p)) await page.screenshot({ path: `tests/shots/${label}${p === "/" ? "-home" : p.replace(/\//g, "-")}.png`, fullPage: true });
    await page.close();
  }
  await ctx.close();
}
{ // mobile navigation
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true }); await blockExternal(ctx);
  const page = await ctx.newPage(); await page.goto(BASE + "/");
  check("nav", "mobile menu hidden before opening", !(await page.locator("#menu").isVisible()));
  await page.click("#mb"); check("nav", "mobile menu opens (aria-expanded=true)", (await page.locator("#menu").isVisible()) && (await page.getAttribute("#mb", "aria-expanded")) === "true");
  await page.click('#menu a[href="/international-connect"]'); await page.waitForURL("**/international-connect");
  check("nav", "menu link navigates to /international-connect", (await page.locator("h1").innerText()).includes("different route"));
  await page.click("#mb"); await page.click('#menu a[href="/practice-areas"]'); await page.waitForURL("**/practice-areas");
  await page.click('a[href="/practice-areas/realty"]'); await page.waitForURL("**/practice-areas/realty");
  check("nav", "practice list links to individual page", (await page.locator("h1").innerText()).includes("Property"));
  await page.click('.crumb a[href="/practice-areas"]'); await page.waitForURL("**/practice-areas"); check("nav", "breadcrumb works", true);
  await ctx.close();
}
{ // desktop nav + keyboard + deep link
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); await blockExternal(ctx);
  const page = await ctx.newPage(); await page.goto(BASE + "/practice-areas/earth-agriculture");
  check("nav", "deep link opens directly (no home redirect)", page.url().endsWith("/practice-areas/earth-agriculture") && (await page.locator("h1").innerText()).includes("ecology"));
  check("nav", "desktop nav shows visible Contact link", await page.locator('nav a.cta[href="/contact"]').isVisible());
  await page.keyboard.press("Tab"); check("nav", "skip link reachable by keyboard", (await page.evaluate(() => document.activeElement?.className)) === "skip");
  await ctx.close();
}
{ // JavaScript disabled: content and navigation still work
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } }); await blockExternal(ctx);
  const page = await ctx.newPage(); await page.goto(BASE + "/about");
  check("no-js", "page content visible with JavaScript off", (await page.locator("h1").innerText()).includes("different way"));
  check("no-js", "navigation visible and usable with JavaScript off", await page.locator('#menu a[href="/contact"]').isVisible());
  await ctx.close();
}
{ // contact form
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); await blockExternal(ctx);
  const page = await ctx.newPage(); await page.goto(BASE + "/contact");
  await page.click('button[type="submit"]');
  check("form", "empty submit shows validation errors, no success message", (await page.locator("#st").innerText()).includes("correct the highlighted") && (await page.locator('[aria-invalid="true"]').count()) >= 4);
  await page.fill("#nm", "Test Visitor"); await page.fill("#em", "not-an-email"); await page.fill("#co", "India"); await page.fill("#ds", "A test."); 
  await page.click('button[type="submit"]'); check("form", "invalid email is rejected", (await page.getAttribute("#em", "aria-invalid")) === "true");
  await page.fill("#em", "test@example.com"); await page.check("#cs"); await page.check('input[name="ar"][value="Business"]');
  await page.click('button[type="submit"]').catch(() => {}); await page.waitForTimeout(300);
  const st = await page.locator("#st").innerText().catch(() => "");
  check("form", "valid submit states honestly that nothing has been sent yet", /has not been sent yet/.test(st), st.slice(0, 80));
  await ctx.close();
}
await browser.close(); server.close();

const pass = results.filter((r) => r.ok).length;
writeFileSync("tests/results.json", JSON.stringify(results, null, 1));
console.log(`\nRESULT: ${pass}/${results.length} checks passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
