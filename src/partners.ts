/* ===== NETWORK PARTNERS — add a new partner by adding ONE entry to this list =====
 * Each entry automatically gets: a card on /network-partners, its own profile page at
 * /network-partners/<id>, navigation breadcrumbs, a sitemap entry and Person structured data.
 * Only add a person once they have consented in writing (a WhatsApp message is fine).
 * Wording below is a DRAFT built only from what the founder supplied; each partner must approve their own text.
 * To show a photo: put the file in public/assets/img/ and set `photo` (e.g. "/assets/img/partner-name.jpg").
 */
export interface Partner {
  id: string;            // URL slug: /network-partners/<id>
  name: string;
  initials: string;      // shown on the card until a photo is added
  title: string;         // e.g. "Partner, International Relations"
  card: string;          // 1-2 sentences for the card
  meta: string;          // search-result description, 50-200 characters
  about: string[];       // paragraphs for the profile page
  areas: string[];       // short list shown as ticks
  related: [string, string][]; // [label, path] links to the matching practice areas
  linkedin?: string;     // optional, only if the partner wants it shown
  photo?: string;        // optional, real photograph supplied by the partner
}

export const PARTNERS: Partner[] = [
  {
    id: "shahid-siddiqui",
    name: "Dr. M. Shahid Siddiqui",
    initials: "SS",
    title: "Partner, International Relations",
    card: "Strategic diplomacy and business affairs, with experience across CSR, ESG, media, ICT and sustainable development. Based in New Delhi.",
    about: [
      "Dr. Siddiqui is a network partner of Jugaad Advisory for international relations. His work is in strategic diplomacy and business affairs, and also spans corporate social responsibility, ESG, media, information and communication technology, and sustainable development.",
    ],
    meta: "Partner, International Relations. Strategic diplomacy and business affairs, with experience across CSR, ESG, media, ICT and sustainable development.",
    areas: ["Strategic diplomacy", "Business affairs", "CSR and ESG", "Media", "ICT", "Sustainable development"],
    related: [["International & National Connect", "/international-connect"]],
    linkedin: "https://www.linkedin.com/in/dr-m-shahid-siddiqui-6b45a013",
  },
  {
    id: "kp-singh",
    name: "K. P. Singh",
    initials: "KS",
    title: "Partner, Infrastructure & Civic Governance",
    card: "Retired from the Municipal Corporation of Delhi after about 36 years of service, including more than 12 years as Engineer-in-Chief. An engineer by training, with an MBA and a law qualification.",
    about: [
      "Mr. Singh is a network partner of Jugaad Advisory for infrastructure and civic governance. He retired from the Municipal Corporation of Delhi after about 36 years of service, including more than 12 years as Engineer-in-Chief.",
      "An engineer by training, he also holds an MBA and a law qualification, which gives him a combined technical, management and legal view of civic and property matters.",
    ],
    meta: "Partner, Infrastructure & Civic Governance. Retired after about 36 years with the Municipal Corporation of Delhi, including over 12 years as Engineer-in-Chief.",
    areas: ["Engineering and infrastructure", "Municipal and civic administration", "Management", "Law"],
    related: [["Property & Realty", "/practice-areas/realty"], ["Legal & Resolution", "/practice-areas/legal-resolution"]],
  },
];
