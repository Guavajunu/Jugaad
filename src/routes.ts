import { P } from "./content";

export interface Route { key: string; path: string; title: string; description: string; crumbs: [string, string][]; }

const PA: [string, string] = ["Practice Areas", "/practice-areas"];
const practiceMeta: Record<string, [string, string]> = {
  business: ["Business Strategy & Advisory | Jugaad Advisory", ""],
  creative: ["Creative, Film & Media Advisory | Jugaad Advisory", ""],
  production: ["Production Planning & Cost Advisory | Jugaad Advisory", ""],
  "legal-resolution": ["Dispute-Resolution Support | Jugaad Advisory", ""],
  realty: ["Property & Realty Advisory | Jugaad Advisory", ""],
  "connect-industry": ["Institutional & Industry Connect | Jugaad Advisory", ""],
  "earth-agriculture": ["Agriculture, Rural & Environment | Jugaad Advisory", ""],
};

export const ROUTES: Route[] = [
  { key: "home", path: "/", title: "Jugaad Advisory | The Problem Solver",
    description: "An independent, founder-led advisory practice helping businesses, entrepreneurs, institutions and individuals understand complicated situations and find a practical way forward.", crumbs: [] },
  { key: "about", path: "/about", title: "About Jugaad Advisory | A Founder-Led Advisory Practice",
    description: "Real-world problems rarely arrive in neat categories. Learn what Jugaad means, how the practice works, and the experience of founder Junaid Memon.", crumbs: [["About", "/about"]] },
  { key: "approach", path: "/approach", title: "The Approach | Jugaad Advisory",
    description: "The problem comes first and the solution follows: listen, understand, explore, connect and move forward, within a scope agreed for each assignment.", crumbs: [["The Approach", "/approach"]] },
  { key: "practice", path: "/practice-areas", title: "Practice Areas | Jugaad Advisory",
    description: "Seven perspectives, one practice: business, creative, production, legal and resolution support, realty, connect and industry, and earth and agriculture.", crumbs: [PA] },
  ...P.map((p): Route => ({
    key: p.id, path: `/practice-areas/${p.id}`, title: practiceMeta[p.id][0],
    description: `${p.tag} ${p.s}`, crumbs: [PA, [`Jugaad ${p.t}`, `/practice-areas/${p.id}`]],
  })),
  { key: "connect", path: "/international-connect", title: "International & National Connect | Jugaad Advisory",
    description: "Relationship-led introductions and institutional engagement across India and internationally: business, industry, government and diplomatic-institutional networks. No outcomes guaranteed.", crumbs: [["International & National Connect", "/international-connect"]] },
  { key: "insights", path: "/insights", title: "Insights | Jugaad Advisory",
    description: "An independent journal of observations on strategy, creativity, property, institutions, agriculture and the environment. Articles will be published here.", crumbs: [["Insights", "/insights"]] },
  { key: "contact", path: "/contact", title: "Contact Jugaad Advisory | Tell Us What You Are Trying to Solve",
    description: "Tell us about the situation, what you are trying to achieve and where you need help. Call, WhatsApp, email or use the enquiry form.", crumbs: [["Contact", "/contact"]] },
  { key: "privacy", path: "/privacy-policy", title: "Privacy Policy | Jugaad Advisory",
    description: "How Jugaad Advisory, a brand of Guava Creative Solutions Private Limited, handles the details you share when you contact us.", crumbs: [["Privacy Policy", "/privacy-policy"]] },
  { key: "terms", path: "/terms", title: "Terms of Use | Jugaad Advisory",
    description: "Terms of use for the Jugaad Advisory website: general information only, services within agreed scopes, and no guaranteed outcomes.", crumbs: [["Terms of Use", "/terms"]] },
];

export const u = (key: string): string => ROUTES.find((r) => r.key === key)?.path ?? (() => { throw new Error("Unknown route key: " + key); })();
