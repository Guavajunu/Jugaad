import { CFG, EMAIL } from "./config";
import { Route, u } from "./routes";

const NAV: [string, string][] = [["about", "About"], ["approach", "Approach"], ["practice", "Practice Areas"], ["connect", "International Connect"], ["insights", "Insights"]];
const FOOT: [string, string][] = [["about", "About"], ["approach", "Approach"], ["practice", "Practice Areas"], ["connect", "International & National Connect"], ["insights", "Insights"]];
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const abs = (p: string) => CFG.url + (p === "/" ? "/" : p);

function jsonLd(r: Route): string {
  const org = {
    "@type": "Organization", "@id": CFG.url + "/#organization", name: CFG.brand, alternateName: CFG.descriptor, url: CFG.url + "/",
    logo: CFG.url + "/assets/img/logo.jpg", telephone: CFG.phone.replace(/\s/g, ""), email: EMAIL,
    parentOrganization: { "@type": "Organization", name: CFG.legalEntity },
    founder: { "@type": "Person", name: CFG.founder },
    sameAs: [CFG.linkedin, ...Object.values(CFG.social).filter(Boolean)],
    contactPoint: { "@type": "ContactPoint", contactType: "enquiries", telephone: CFG.phone.replace(/\s/g, ""), email: EMAIL, availableLanguage: ["English", "Hindi"] },
  };
  const graph: object[] = [];
  if (r.key === "home") {
    graph.push(org, { "@type": "WebSite", "@id": CFG.url + "/#website", url: CFG.url + "/", name: CFG.brand, description: r.description, publisher: { "@id": CFG.url + "/#organization" }, inLanguage: "en-IN" });
  } else {
    graph.push({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: CFG.url + "/" }, ...r.crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 2, name: c[0], item: abs(c[1]) }))] });
  }
  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c")}</script>`;
}

export function render(r: Route, body: string): string {
  body = body.replace(/&(?!(?:amp|lt|gt|quot|apos|nbsp|#\d+|#x[0-9a-fA-F]+);)/g, "&amp;"); // valid HTML: escape bare ampersands in text
  const canon = abs(r.path);
  const nav = NAV.map(([k, l]) => `<li><a href="${u(k)}"${r.key === k || (k === "practice" && r.path.startsWith("/practice-areas/")) ? ' aria-current="page"' : ""}>${l}</a></li>`).join("") +
    `<li><a class="cta" href="${u("contact")}"${r.key === "contact" ? ' aria-current="page"' : ""}>Contact</a></li>`;
  const foot = `<div class="cols"><div><div class="serif" style="font-size:1.5rem;color:var(--ink)">${CFG.brand}</div><div class="eyebrow">${CFG.descriptor}</div><p>Every problem is different. Every solution should be too.</p></div><div>${FOOT.map(([k, l]) => `<a href="${u(k)}">${l}</a>`).join("")}<a href="${u("contact")}">Contact</a></div><div><a href="tel:+${CFG.wa}">${CFG.phone}</a><a href="mailto:${EMAIL}">${EMAIL}</a><a href="${CFG.url}/">jugaadadvisory.com</a><a href="${CFG.linkedin}" rel="noopener">LinkedIn</a></div></div><p style="margin-top:30px">${CFG.brand} is a brand of ${CFG.legalEntity}. ${CFG.brand} provides advisory, coordination and facilitation services within agreed scopes. Specialist and regulated professional services are provided by appropriately qualified and authorised professionals. No particular commercial, legal, institutional or regulatory outcome is guaranteed.</p><p><a style="display:inline" href="${u("privacy")}">Privacy Policy</a> · <a style="display:inline" href="${u("terms")}">Terms</a></p>`;
  const analytics = CFG.analytics ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${esc(CFG.analytics)}"}'></script>` : "";
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(r.title)}</title>
<meta name="description" content="${esc(r.description)}">
<link rel="canonical" href="${canon}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${CFG.brand}"><meta property="og:locale" content="en_IN"><meta property="og:url" content="${canon}"><meta property="og:title" content="${esc(r.title)}"><meta property="og:description" content="${esc(r.description)}"><meta property="og:image" content="${CFG.url}/og-image.jpg"><meta property="og:image:secure_url" content="${CFG.url}/og-image.jpg"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Jugaad Advisory logo with the tagline The Problem Solver">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(r.title)}"><meta name="twitter:description" content="${esc(r.description)}"><meta name="twitter:image" content="${CFG.url}/og-image.jpg">
<meta name="theme-color" content="#f6f1e7">
<link rel="icon" type="image/png" href="/favicon.png"><link rel="apple-touch-icon" href="/favicon.png">
${jsonLd(r)}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/assets/site.css">
<noscript><style>#mb{display:none}nav ul#menu{display:flex!important;position:static;flex-direction:row;flex-wrap:wrap;padding:0;border:0}.nav{height:auto;padding:8px 0;flex-wrap:wrap}</style></noscript>
</head><body>
<a class="skip" href="#main">Skip to content</a>
<header><div class="wrap nav"><a class="brand" href="/" aria-label="${CFG.brand} — ${CFG.descriptor}, home"><img class="logo" src="/assets/img/logo.jpg" alt="${CFG.brand} — ${CFG.descriptor}" width="94" height="56"></a>
<nav aria-label="Main"><button id="mb" type="button" aria-expanded="false" aria-controls="menu">Menu</button><ul id="menu">${nav}</ul></nav></div></header>
<main id="main" tabindex="-1">${body}</main><footer><div class="wrap" id="ft">${foot}</div></footer>
<script src="/assets/site.js" defer></script>${analytics}
</body></html>`;
}
