import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { CFG } from "./config";
import { ROUTES } from "./routes";
import { V } from "./pages";
import { render } from "./layout";

const OUT = join(process.cwd(), "dist");
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(process.cwd(), "public"), OUT, { recursive: true });

const write = (rel: string, data: string) => { const f = join(OUT, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, data); };

for (const r of ROUTES) {
  const body = V[r.key];
  if (!body) throw new Error("No template for route " + r.key);
  // "/" -> index.html, "/about" -> about.html, "/practice-areas/business" -> practice-areas/business.html
  write(r.path === "/" ? "index.html" : r.path.slice(1) + ".html", render(r, body()));
}

write("404.html", render({ key: "404", path: "/404", title: "Page not found | Jugaad Advisory", description: "This page could not be found.", crumbs: [] },
  `<section><div class="wrap read"><div class="eyebrow">404</div><h1 style="margin:12px 0 22px">That page is not here.</h1><p>The address may have changed. You can start again from the <a href="/" style="color:var(--brick)">home page</a> or <a href="/contact" style="color:var(--brick)">tell us what you are looking for</a>.</p></div></section>`)
  .replace("<head><meta charset", "<head><meta name=\"robots\" content=\"noindex\"><meta charset"));

write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  ROUTES.map((r) => `  <url><loc>${CFG.url}${r.path === "/" ? "/" : r.path}</loc><lastmod>${CFG.lastModified}</lastmod></url>`).join("\n") + `\n</urlset>\n`);
// Hide from search engines on every build that is NOT the production branch (main), so the preview site stays private.
// Cloudflare Workers Builds sets WORKERS_CI_BRANCH. Local builds and builds from main stay fully indexable.
const BRANCH = process.env.WORKERS_CI_BRANCH;
const HIDE = process.env.SITE_NOINDEX === "1" || (!!BRANCH && BRANCH !== "main");
write("robots.txt", HIDE ? `User-agent: *\nDisallow: /\n` : `User-agent: *\nAllow: /\n\nSitemap: ${CFG.url}/sitemap.xml\n`);
write("_headers", `/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Strict-Transport-Security: max-age=31536000\n${HIDE ? "  X-Robots-Tag: noindex, nofollow, noarchive\n" : ""}\n/assets/*\n  Cache-Control: public, max-age=86400\n`);
if (HIDE) {
  const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const q = join(d, f); return statSync(q).isDirectory() ? walk(q) : q.endsWith(".html") ? [q] : []; });
  for (const f of walk(OUT)) { const h = readFileSync(f, "utf8"); if (!h.includes('name="robots"')) writeFileSync(f, h.replace("<head>", '<head><meta name="robots" content="noindex, nofollow, noarchive">')); }
}
console.log(HIDE ? "Search engines HIDDEN (non-production build)" : "Search engines allowed (production build)");
console.log(`Built ${ROUTES.length} pages + 404, sitemap.xml, robots.txt, _headers -> dist/`);
