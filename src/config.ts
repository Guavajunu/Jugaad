/* ===== CENTRAL CONFIG — edit contact details here only ===== */
export const CFG = {
  brand: "Jugaad Advisory",
  descriptor: "The Problem Solver",
  legalEntity: "Guava Creative Solutions Private Limited",
  founder: "Junaid Memon",
  founderAlt: ["Zunaid Memon"], // alternate spelling, shown on the About page and in structured data
  founderLinks: ["https://www.facebook.com/junaidnomad", "https://x.com/junaidfarmer", "https://www.instagram.com/zunaidmemon"] as string[], // add Wikipedia/other social URLs here when supplied; LinkedIn is added automatically
  url: "https://jugaadadvisory.com",
  phone: "+91 98200 79484",
  wa: "919820079484",
  publicEmail: "inquiry@jugaadadvisory.com",
  publicEmailLive: true, // set false to fall back to the founder email if the mailbox is not working
  founderEmail: "junaid@guavaindia.com",
  linkedin: "https://www.linkedin.com/in/junaidnomad/",
  social: { facebook: "", instagram: "https://www.instagram.com/jugaadadvisory", x: "", youtube: "" }, // TODO: add exact URLs when supplied
  formEndpoint: "", // TODO: optional form service URL. Empty = visitor's email app is used (no false "sent" message)
  analytics: "", // TODO: privacy-conscious analytics integration point (e.g. a Cloudflare Web Analytics token)
  lastModified: "2026-11-21",
};
export const EMAIL = CFG.publicEmailLive ? CFG.publicEmail : CFG.founderEmail;
