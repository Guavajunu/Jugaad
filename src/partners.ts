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
  meta?: string;         // search-result description, 50-200 characters (needed only when `about` is filled)
  about: string[];       // paragraphs for the profile page. Leave EMPTY ([]) to show the card only, with no profile page yet
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
  {
    id: "mihir-sojitra",
    name: "CS Mihir Sojitra",
    initials: "MS",
    title: "Partner, Corporate Governance & Compliance",
    card: "Practising Company Secretary in Surat and past Chairman of the Surat Chapter of the Institute of Company Secretaries of India (ICSI). Works in corporate governance, compliance and CSR.",
    about: [
      "CS Mihir Sojitra is a network partner of Jugaad Advisory for corporate governance and compliance. He is a practising Company Secretary based in Surat. He was Chairman of the Surat Chapter of the Institute of Company Secretaries of India (ICSI) in 2025, and earlier served as its Secretary in 2023 and 2024.",
      "His qualifications include Company Secretary (CS), Master of Commerce (M.Com), certification as an Independent Director from the Indian Institute of Corporate Affairs (IICA), a certificate course in import and export, and a CSR professional certification. He is pursuing a Ph.D. at Veer Narmad South Gujarat University (VNSGU).",
      "He is also a regular speaker at schools and colleges.",
    ],
    meta: "Partner, Corporate Governance & Compliance. Practising Company Secretary and past Chairman of the Surat Chapter of ICSI, working in governance, compliance and CSR.",
    areas: ["Company law and corporate governance", "Corporate compliance", "Independent directorship", "CSR", "Import and export"],
    related: [["Business", "/practice-areas/business"], ["Legal & Resolution", "/practice-areas/legal-resolution"]],
    photo: "/assets/img/partner-mihir-sojitra.jpg",
  },
  {
    id: "harmesh-gupta",
    name: "Harmesh Gupta",
    initials: "HG",
    title: "Partner, Corporate Finance & Restructuring",
    card: "Entrepreneur, investor and consultant with more than 18 years of experience in management consulting, debt syndication, due diligence, M&A and the restructuring of distressed accounts.",
    about: [
      "Harmesh Gupta is a network partner of Jugaad Advisory for corporate finance and restructuring. He is an entrepreneur, investor and consultant with more than 18 years of experience, and his work covers trading, management consulting, mergers and acquisitions, debt syndication and due diligence.",
      "He has a particular knack for restructuring distressed accounts. He has worked with some of the leading business houses in India and abroad, and with India's top public sector banks on due diligence and syndication. He is on the panel of a debt restructuring agency as an advisor.",
      "Within the network, he supports businesses that need to plan ahead, meet the benchmarks they have set, shape long-term strategy and raise funds.",
    ],
    meta: "Partner, Corporate Finance & Restructuring. Over 18 years in management consulting, debt syndication, due diligence, M&A and distressed account restructuring.",
    areas: ["Management consulting", "Debt syndication", "Due diligence", "Mergers and acquisitions", "Restructuring of distressed accounts", "Forecasting and fundraising"],
    related: [["Business", "/practice-areas/business"], ["Legal & Resolution", "/practice-areas/legal-resolution"]],
    photo: "/assets/img/partner-harmesh-gupta.jpg",
  },
  {
    id: "ajay-vaghasia",
    name: "CA Ajay Vaghasia",
    initials: "AV",
    title: "Partner, Tax Advisory",
    card: "Chartered Accountant, working in tax advisory.",
    about: [], // card only for now; add paragraphs, areas and a `meta` line when his details arrive and he approves them
    areas: [],
    related: [],
  },
];
