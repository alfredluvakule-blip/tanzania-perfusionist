/**
 * Seed / fallback content.
 *
 * Shown when Supabase is not configured, or when a table is still empty.
 * RULES FOR THIS FILE
 *  - Global history and research entries are real, documented events/papers with references.
 *    Verify each against the original source before launch.
 *  - Anything Tanzania-specific, any person profile, news item, event or opportunity is a
 *    clearly flagged PLACEHOLDER (is_placeholder / is_sample) and must be replaced with
 *    verified, consented content through the admin dashboard.
 */
import type {
  CaseReport,
  EventItem,
  LegacyStory,
  MediaItem,
  MemberProfile,
  Milestone,
  NewsArticle,
  Opportunity,
  Publication,
} from "./types";
import { THEATRE_PHOTOS } from "./site";

const STONEY = {
  label:
    "Stoney WS. Evolution of cardiopulmonary bypass. Circulation. 2009;119(21):2844–2853.",
  url: "https://doi.org/10.1161/CIRCULATIONAHA.108.830174",
};

export const milestones: Milestone[] = [
  {
    id: "m-1628",
    year: 1628,
    title: "Harvey describes the circulation of the blood",
    description:
      "William Harvey publishes 'Exercitatio Anatomica de Motu Cordis et Sanguinis in Animalibus', demonstrating that blood circulates continuously, pumped by the heart. Every perfusion circuit rests on this idea.",
    era: "Foundations",
    people: "William Harvey",
    region: "Global",
    references: [
      { label: "Harvey W. Exercitatio Anatomica de Motu Cordis et Sanguinis in Animalibus. Frankfurt; 1628." },
    ],
    verified: true,
  },
  {
    id: "m-1812",
    year: 1812,
    title: "Le Gallois proposes artificial perfusion",
    description:
      "French physiologist Julien Jean César Le Gallois suggests that any part of the body could be kept alive if a supply of arterial blood could be injected in place of the heart: the first written concept of artificial perfusion.",
    era: "Foundations",
    people: "Julien Jean César Le Gallois",
    region: "Global",
    references: [{ label: "Le Gallois JJC. Expériences sur le principe de la vie. Paris; 1812." }, STONEY],
    verified: true,
  },
  {
    id: "m-1885",
    year: 1885,
    title: "Von Frey and Gruber build an early pump-oxygenator",
    description:
      "In Leipzig, Max von Frey and Max Gruber construct one of the first apparatuses to oxygenate and pump blood through isolated organs: an ancestor of the heart-lung machine.",
    era: "Extracorporeal pioneers",
    people: "Max von Frey, Max Gruber",
    region: "Global",
    references: [STONEY],
    verified: true,
  },
  {
    id: "m-1916",
    year: 1916,
    title: "Heparin is discovered",
    description:
      "Jay McLean, a medical student working with William Howell at Johns Hopkins, identifies an anticoagulant substance later named heparin. Safe anticoagulation made extracorporeal circulation in humans possible.",
    era: "Extracorporeal pioneers",
    people: "Jay McLean, William H. Howell",
    region: "Global",
    references: [
      { label: "McLean J. The thromboplastic action of cephalin. Am J Physiol. 1916;41:250–257." },
      STONEY,
    ],
    verified: true,
  },
  {
    id: "m-1926",
    year: 1926,
    title: "Brukhonenko's 'autojektor'",
    description:
      "In the Soviet Union, Sergei Brukhonenko demonstrates the 'autojektor', a device for total body perfusion in animals, using donor lungs for oxygenation.",
    era: "Extracorporeal pioneers",
    people: "Sergei S. Brukhonenko",
    region: "Global",
    references: [
      {
        label:
          "Konstantinov IE, Alexi-Meskishvili VV. Sergei S. Brukhonenko: the development of the first heart-lung machine for total body perfusion. Ann Thorac Surg. 2000;69(3):962–966.",
      },
    ],
    verified: true,
  },
  {
    id: "m-1937",
    year: 1937,
    title: "Gibbon reports experimental extracorporeal circulation",
    description:
      "John H. Gibbon Jr., working with his wife Mary Hopkinson Gibbon, reports maintaining circulation in cats during occlusion of the pulmonary artery, the start of two decades of work towards a clinical heart-lung machine.",
    era: "Extracorporeal pioneers",
    people: "John H. Gibbon Jr., Mary Hopkinson Gibbon",
    region: "Global",
    references: [
      {
        label:
          "Gibbon JH Jr. Artificial maintenance of circulation during experimental occlusion of pulmonary artery. Arch Surg. 1937;34(6):1105–1131.",
      },
    ],
    verified: true,
  },
  {
    id: "m-1953",
    year: 1953,
    year_label: "6 May 1953",
    title: "First successful open-heart operation with a heart-lung machine",
    description:
      "Gibbon closes an atrial septal defect in 18-year-old Cecelia Bavolek in Philadelphia, with his machine supporting her circulation and gas exchange for 26 minutes. Cardiopulmonary bypass enters clinical practice.",
    era: "Birth of CPB",
    people: "John H. Gibbon Jr.",
    region: "Global",
    references: [
      {
        label:
          "Gibbon JH Jr. Application of a mechanical heart and lung apparatus to cardiac surgery. Minn Med. 1954;37(3):171–185.",
      },
      STONEY,
    ],
    verified: true,
  },
  {
    id: "m-1954",
    year: 1954,
    title: "Lillehei's controlled cross-circulation",
    description:
      "At the University of Minnesota, C. Walton Lillehei and colleagues repair congenital heart defects in children using a parent as the 'oxygenator' through controlled cross-circulation.",
    era: "Birth of CPB",
    people: "C. Walton Lillehei, Morley Cohen, Herbert Warden, Richard Varco",
    region: "Global",
    references: [
      {
        label:
          "Lillehei CW, Cohen M, Warden HE, Varco RL. The direct-vision intracardiac correction of congenital anomalies by controlled cross circulation. Surgery. 1955;38(1):11–29.",
      },
    ],
    verified: true,
  },
  {
    id: "m-1955a",
    year: 1955,
    title: "Mayo-Gibbon pump-oxygenator series",
    description:
      "John W. Kirklin's team at the Mayo Clinic reports a series of intracardiac operations using a refined Gibbon-type pump-oxygenator, showing that CPB could be used reproducibly.",
    era: "Birth of CPB",
    people: "John W. Kirklin",
    region: "Global",
    references: [
      {
        label:
          "Kirklin JW, DuShane JW, Patrick RT, et al. Intracardiac surgery with the aid of a mechanical pump-oxygenator system (Gibbon type): report of eight cases. Proc Staff Meet Mayo Clin. 1955;30(10):201–206.",
      },
    ],
    verified: true,
  },
  {
    id: "m-1955b",
    year: 1955,
    title: "DeWall-Lillehei bubble oxygenator",
    description:
      "Richard DeWall develops a simple, disposable bubble oxygenator with Lillehei, making CPB far cheaper and more widely available.",
    era: "Birth of CPB",
    people: "Richard A. DeWall, C. Walton Lillehei",
    region: "Global",
    references: [
      {
        label:
          "DeWall RA, Warden HE, Read RC, et al. A simple, expendable, artificial oxygenator for open heart surgery. Surg Clin North Am. 1956;36(4):1025–1034.",
      },
      STONEY,
    ],
    verified: true,
  },
  {
    id: "m-1955c",
    year: 1955,
    title: "Elective cardiac arrest: the idea of cardioplegia",
    description:
      "Denis Melrose and colleagues in London describe arresting the heart with potassium citrate to provide a still, bloodless field: the starting point of myocardial protection.",
    era: "Birth of CPB",
    people: "Denis G. Melrose",
    region: "Global",
    references: [
      { label: "Melrose DG, Dreyer B, Bentall HH, Baker JBE. Elective cardiac arrest. Lancet. 1955;269(6879):21–22." },
    ],
    verified: true,
  },
  {
    id: "m-1956",
    year: 1956,
    title: "First membrane oxygenator",
    description:
      "George Clowes and colleagues describe an artificial lung in which gas exchange happens through a plastic membrane, separating blood from gas. This principle is used by modern oxygenators.",
    era: "Refinement",
    people: "George H. A. Clowes Jr.",
    region: "Global",
    references: [
      {
        label:
          "Clowes GHA Jr, Hopkins AL, Neville WE. An artificial lung dependent upon diffusion of oxygen and carbon dioxide through plastic membranes. J Thorac Surg. 1956;32(5):630–637.",
      },
    ],
    verified: true,
  },
  {
    id: "m-1964",
    year: 1964,
    title: "AmSECT is founded",
    description:
      "The American Society of Extra-Corporeal Technology is founded, one of the first professional bodies for perfusionists, helping define perfusion as a distinct profession.",
    era: "Refinement",
    region: "Global",
    references: [{ label: "American Society of ExtraCorporeal Technology", url: "https://www.amsect.org" }],
    verified: true,
  },
  {
    id: "m-1967",
    year: 1967,
    year_label: "3 Dec 1967",
    title: "First human heart transplant, Cape Town",
    description:
      "Christiaan Barnard and his team perform the world's first human-to-human heart transplant at Groote Schuur Hospital, South Africa, with the operation supported by cardiopulmonary bypass. A landmark for cardiac surgery in Africa.",
    era: "Refinement",
    people: "Christiaan Barnard",
    region: "Africa",
    references: [
      {
        label:
          "Barnard CN. The operation. A human cardiac transplant: an interim report of a successful operation performed at Groote Schuur Hospital, Cape Town. S Afr Med J. 1967;41(48):1271–1274.",
      },
    ],
    verified: true,
  },
  {
    id: "m-1972",
    year: 1972,
    title: "First successful prolonged ECMO in an adult",
    description:
      "J. Donald Hill and colleagues report support of a young trauma patient with respiratory failure for about three days using a membrane oxygenator: the beginning of clinical ECMO.",
    era: "ECMO & life support",
    people: "J. Donald Hill",
    region: "Global",
    references: [
      {
        label:
          "Hill JD, O'Brien TG, Murray JJ, et al. Prolonged extracorporeal oxygenation for acute post-traumatic respiratory failure (shock-lung syndrome). N Engl J Med. 1972;286(12):629–634.",
        url: "https://doi.org/10.1056/NEJM197203232861204",
      },
    ],
    verified: true,
  },
  {
    id: "m-1975",
    year: 1975,
    title: "First neonatal ECMO survivor",
    description:
      "Robert Bartlett's team successfully supports a newborn with respiratory failure on ECMO, opening the field of neonatal and paediatric extracorporeal life support.",
    era: "ECMO & life support",
    people: "Robert H. Bartlett",
    region: "Global",
    references: [
      {
        label:
          "Bartlett RH, Gazzaniga AB, Jefferies MR, et al. Extracorporeal membrane oxygenation (ECMO) cardiopulmonary support in infancy. Trans Am Soc Artif Intern Organs. 1976;22:80–93.",
      },
    ],
    verified: true,
  },
  {
    id: "m-1975b",
    year: 1975,
    title: "American Board of Cardiovascular Perfusion",
    description:
      "The ABCP is established to certify clinical perfusionists, a key step in professional standards and training.",
    era: "ECMO & life support",
    region: "Global",
    references: [{ label: "American Board of Cardiovascular Perfusion", url: "https://www.abcp.org" }],
    verified: true,
  },
  {
    id: "m-1989",
    year: 1989,
    title: "ELSO is founded",
    description:
      "The Extracorporeal Life Support Organization is formed to share data, guidelines and training for ECMO centres worldwide, including its international registry.",
    era: "ECMO & life support",
    region: "Global",
    references: [{ label: "Extracorporeal Life Support Organization", url: "https://www.elso.org" }],
    verified: true,
  },
  {
    id: "m-2009",
    year: 2009,
    title: "The CESAR trial",
    description:
      "A UK randomised trial finds that referral to an ECMO-capable centre improves survival without severe disability in adults with severe respiratory failure.",
    era: "Modern era",
    region: "Global",
    references: [
      {
        label:
          "Peek GJ, Mugford M, Tiruvoipati R, et al. Efficacy and economic assessment of conventional ventilatory support versus extracorporeal membrane oxygenation for severe adult respiratory failure (CESAR). Lancet. 2009;374(9698):1351–1363.",
        url: "https://doi.org/10.1016/S0140-6736(09)61069-2",
      },
    ],
    verified: true,
  },
  {
    id: "m-2016",
    year: 2016,
    title: "Minimal invasive extracorporeal circulation defined",
    description:
      "An international position paper sets out principles and definitions for minimal invasive extracorporeal circulation (MiECC): closed, low-prime circuits designed to reduce haemodilution and inflammatory response.",
    era: "Modern era",
    region: "Global",
    references: [
      {
        label:
          "Anastasiadis K, Murkin J, Antonitsis P, et al. Use of minimal invasive extracorporeal circulation in cardiac surgery: principles, definitions and potential benefits. A position paper from MiECTiS. Interact Cardiovasc Thorac Surg. 2016;22(5):647–662.",
      },
    ],
    verified: true,
  },
  {
    id: "m-2018",
    year: 2018,
    title: "The EOLIA trial",
    description:
      "An international RCT of early ECMO for very severe ARDS. 60-day mortality was 35% with ECMO vs 46% with conventional care, which did not reach statistical significance; the trial shaped debate and later analyses.",
    era: "Modern era",
    region: "Global",
    references: [
      {
        label:
          "Combes A, Hajage D, Capellier G, et al. Extracorporeal membrane oxygenation for severe acute respiratory distress syndrome. N Engl J Med. 2018;378(21):1965–1975.",
        url: "https://doi.org/10.1056/NEJMoa1800385",
      },
    ],
    verified: true,
  },
  {
    id: "m-2019",
    year: 2019,
    title: "First joint EACTS/EACTA/EBCP CPB guidelines",
    description:
      "European surgical, anaesthesia and perfusion bodies publish joint evidence-based guidelines on cardiopulmonary bypass in adult cardiac surgery.",
    era: "Modern era",
    region: "Global",
    references: [
      {
        label:
          "Wahba A, Milojevic M, Boer C, et al. 2019 EACTS/EACTA/EBCP guidelines on cardiopulmonary bypass in adult cardiac surgery. Eur J Cardiothorac Surg. 2020;57(2):210–251.",
        url: "https://doi.org/10.1093/ejcts/ezz267",
      },
    ],
    verified: true,
  },
  // ---- Placeholders: to be replaced with verified, referenced information ----
  {
    id: "m-africa-training",
    year: 1990,
    year_label: "Date to be verified",
    title: "Perfusion training and practice across Africa",
    description:
      "PLACEHOLDER. This milestone will document the development of perfusion training programmes and professional practice in Africa. Contributors with verified sources are invited to submit details.",
    era: "Refinement",
    region: "Africa",
    references: [],
    verified: false,
    is_placeholder: true,
  },
  {
    id: "m-tz-first-cpb",
    year: 2000,
    year_label: "Date to be verified",
    title: "First open-heart surgery with CPB in Tanzania",
    description:
      "PLACEHOLDER. The date, institution and team of the first cardiopulmonary bypass case performed in Tanzania will be added once confirmed with primary sources (hospital records, publications, or first-hand accounts).",
    era: "Modern era",
    region: "Tanzania",
    references: [],
    verified: false,
    is_placeholder: true,
  },
  {
    id: "m-tz-services",
    year: 2010,
    year_label: "Date to be verified",
    title: "Growth of perfusion services in Tanzania",
    description:
      "PLACEHOLDER. Establishment of dedicated cardiac centres, local perfusion teams and paediatric programmes in Tanzania. Awaiting verified contributions.",
    era: "Modern era",
    region: "Tanzania",
    references: [],
    verified: false,
    is_placeholder: true,
  },
  {
    id: "m-tz-training",
    year: 2020,
    year_label: "Date to be verified",
    title: "Local perfusion training in Tanzania",
    description:
      "PLACEHOLDER. Milestones in training Tanzanian perfusionists locally and abroad, including partnerships and the first graduates, to be added from verified sources.",
    era: "Modern era",
    region: "Tanzania",
    references: [],
    verified: false,
    is_placeholder: true,
  },
];

export const publications: Publication[] = [
  {
    id: "p-luvakule-2026-cpb-complications",
    title: "Cardiopulmonary bypass complications and their predictors in open-heart surgery at a tertiary cardiac care facility in Tanzania",
    authors: "Luvakule A, Gamba S, Lugazia E",
    journal: "Global Cardiology Science and Practice",
    year: 2026,
    doi: "10.21542/gcsp.2026.11",
    summary:
      "Retrospective review of 195 paediatric and adult patients who underwent open-heart surgery on cardiopulmonary bypass at the Jakaya Kikwete Cardiac Institute, Dar es Salaam, from January to December 2020, describing CPB-related complications and their predictors.",
    key_findings: [
      "Major complications in 31.3% of patients, most often cardiovascular (10.8%) and bleeding (9.2%); prolonged ICU stay in 52.8%; mortality 4.1%.",
      "Younger age, diagnosis, procedure type, CPB duration and cross-clamp time were significant predictors of complications.",
      "Longer CPB duration was associated with cardiovascular, renal and bleeding complications, and CPB over 120 minutes with prolonged ICU stay (52.3% vs 35.1%).",
    ],
    category: "Cardiopulmonary Bypass",
    publication_type: "Clinical Research",
    content_kind: "original",
    open_access: true,
  },
  {
    id: "p-salim-2025-bmh",
    title: "Transformation of Cardiology and Cardiothoracic Services at Benjamin Mkapa Hospital, Tanzania: Findings and Experiences from 1,313 Cardiovascular Procedures in Five Years",
    authors: "Salim AA, Luvakule A, Ibrahim H, Kessy SA, Khatib S, et al.",
    journal: "Global Heart",
    year: 2025,
    doi: "10.5334/gh.1488",
    summary:
      "Retrospective review of cardiology and cardiothoracic services at Benjamin Mkapa Hospital, Dodoma, from February 2019 to August 2024, covering 1,313 procedures: 1,215 adult catheterisations, 55 paediatric catheterisations and 43 open-heart surgeries.",
    key_findings: [
      "Reported success rates of 96.5% for percutaneous coronary intervention and 93.0% for open-heart surgery.",
      "The authors highlight strategic investment, leadership and partnerships as key to building cardiac services in a low-resource setting.",
    ],
    category: "Research and Innovation",
    publication_type: "Clinical Research",
    content_kind: "original",
    open_access: true,
  },
  {
    id: "p-eacts-2019",
    title: "2019 EACTS/EACTA/EBCP guidelines on cardiopulmonary bypass in adult cardiac surgery",
    authors: "Wahba A, Milojevic M, Boer C, et al.",
    journal: "European Journal of Cardio-Thoracic Surgery",
    year: 2020,
    doi: "10.1093/ejcts/ezz267",
    summary:
      "Joint guideline from the European Association for Cardio-Thoracic Surgery, the European Association of Cardiothoracic Anaesthesiology and the European Board of Cardiovascular Perfusion covering CPB equipment, circuit management, anticoagulation, blood management and organ protection in adult cardiac surgery.",
    key_findings: [
      "First guideline jointly written by surgeons, anaesthesiologists and perfusionists.",
      "Provides graded recommendations across the whole CPB pathway; consult the full text for each recommendation and its level of evidence.",
    ],
    category: "Cardiopulmonary Bypass",
    publication_type: "Guideline / Consensus Statement",
    content_kind: "original",
    open_access: true,
  },
  {
    id: "p-cesar",
    title:
      "Efficacy and economic assessment of conventional ventilatory support versus extracorporeal membrane oxygenation for severe adult respiratory failure (CESAR): a multicentre randomised controlled trial",
    authors: "Peek GJ, Mugford M, Tiruvoipati R, et al.",
    journal: "The Lancet",
    year: 2009,
    doi: "10.1016/S0140-6736(09)61069-2",
    summary:
      "180 adults with severe but potentially reversible respiratory failure were randomised to conventional management or referral to a single ECMO-capable centre in the UK.",
    key_findings: [
      "Death or severe disability at 6 months: 37% in the ECMO-referral group vs 53% with conventional management.",
      "The trial tested referral to an ECMO centre, not ECMO alone; not all referred patients received ECMO.",
    ],
    category: "ECMO",
    publication_type: "Randomised Controlled Trial",
    content_kind: "original",
  },
  {
    id: "p-eolia",
    title: "Extracorporeal membrane oxygenation for severe acute respiratory distress syndrome",
    authors: "Combes A, Hajage D, Capellier G, et al.",
    journal: "New England Journal of Medicine",
    year: 2018,
    doi: "10.1056/NEJMoa1800385",
    summary:
      "The EOLIA trial randomised 249 patients with very severe ARDS to early venovenous ECMO or conventional lung-protective ventilation (with crossover to ECMO allowed as rescue).",
    key_findings: [
      "60-day mortality was 35% with ECMO vs 46% in the control group; the difference was not statistically significant.",
      "28% of control patients crossed over to rescue ECMO, which complicates interpretation.",
    ],
    category: "ECMO",
    publication_type: "Randomised Controlled Trial",
    content_kind: "original",
  },
  {
    id: "p-hill-1972",
    title:
      "Prolonged extracorporeal oxygenation for acute post-traumatic respiratory failure (shock-lung syndrome)",
    authors: "Hill JD, O'Brien TG, Murray JJ, et al.",
    journal: "New England Journal of Medicine",
    year: 1972,
    doi: "10.1056/NEJM197203232861204",
    summary:
      "Case report describing the first successful prolonged use of a membrane oxygenator to support a young adult with post-traumatic respiratory failure.",
    key_findings: ["Historic report widely regarded as the first successful clinical use of adult ECMO."],
    category: "Extracorporeal Circulation Technology",
    publication_type: "Case Report",
    content_kind: "original",
  },
  {
    id: "p-stoney-2009",
    title: "Evolution of cardiopulmonary bypass",
    authors: "Stoney WS.",
    journal: "Circulation",
    year: 2009,
    doi: "10.1161/CIRCULATIONAHA.108.830174",
    summary:
      "Historical review tracing cardiopulmonary bypass from early perfusion experiments to the heart-lung machines and oxygenators of modern cardiac surgery.",
    key_findings: ["Narrative history; useful starting point for students and for the site's history timeline."],
    category: "Research and Innovation",
    publication_type: "Journal Article",
    content_kind: "original",
    open_access: true,
  },
  {
    id: "p-edu-circuit",
    title: "Educational summary: components of a standard CPB circuit",
    authors: "Tanzania Perfusionist Editorial Team",
    journal: "Tanzania Perfusionist (educational content)",
    year: 2026,
    summary:
      "A plain-language overview of the main parts of a conventional CPB circuit: venous drainage, venous reservoir, arterial pump (roller or centrifugal), membrane oxygenator with heat exchanger, arterial line filter, cardioplegia delivery, suction and vents, and the monitoring that ties them together.",
    key_findings: [
      "Educational overview for students. It is not a protocol; follow your institution's procedures.",
    ],
    category: "Cardiopulmonary Bypass",
    publication_type: "Journal Article",
    content_kind: "educational",
  },
];

export const news: NewsArticle[] = [
  {
    id: "n-1",
    slug: "welcome-to-tanzania-perfusionist",
    title: "Welcome to Tanzania Perfusionist",
    summary:
      "A new digital home for perfusionists, cardiac teams, students and researchers in Tanzania and beyond.",
    body:
      "Tanzania Perfusionist brings together news, research, case discussions, history and media for the perfusion community. Members can register, build profiles and submit content, which is reviewed by editors before publication.\n\nThis is a sample article. Replace it from the admin dashboard.",
    category: "Announcements",
    author: "Editorial Team",
    published_at: "2026-11-01",
    tags: ["platform"],
    is_sample: true,
  },
  {
    id: "n-2",
    slug: "call-for-history-contributions",
    title: "Call for contributions: help document perfusion history in Tanzania",
    summary:
      "We are collecting verified dates, photographs and first-hand accounts of how perfusion services developed in Tanzania.",
    body:
      "If you took part in early cardiac surgery programmes, have photographs from training or surgical camps, or hold records of key milestones, please submit them through the contribution form. Every entry is checked against sources and published only with permission.\n\nThis is a sample article.",
    category: "Tanzania",
    author: "Editorial Team",
    published_at: "2026-10-28",
    tags: ["history", "call"],
    is_sample: true,
  },
  {
    id: "n-3",
    slug: "sample-international-update",
    title: "Sample: international perfusion society update",
    summary:
      "Placeholder for an international news item, such as a guideline release, registry report or society announcement, with a link to the original source.",
    body: "Sample article. Replace with a real news item and link the original source.",
    category: "International",
    author: "Editorial Team",
    published_at: "2026-10-20",
    is_sample: true,
  },
  {
    id: "n-4",
    slug: "sample-technology-update",
    title: "Sample: CPB technology and equipment developments",
    summary:
      "Placeholder for coverage of oxygenators, pumps, monitoring systems and circuit innovations.",
    body: "Sample article. Replace with a real news item and link the original source.",
    category: "Technology",
    author: "Editorial Team",
    published_at: "2026-10-15",
    is_sample: true,
  },
  {
    id: "n-5",
    slug: "sample-training-workshop",
    title: "Sample: perfusion training workshop announcement",
    summary: "Placeholder for training opportunities, conferences and workshops.",
    body: "Sample article. Replace with real event details.",
    category: "Training & Conferences",
    author: "Editorial Team",
    published_at: "2026-10-10",
    is_sample: true,
  },
  {
    id: "n-6",
    slug: "sample-cardiac-surgery-update",
    title: "Sample: cardiac surgery programme update",
    summary: "Placeholder for cardiac surgery updates from Tanzanian and regional centres.",
    body: "Sample article. Replace with a real, verified update.",
    category: "Cardiac Surgery",
    author: "Editorial Team",
    published_at: "2026-10-05",
    is_sample: true,
  },
];

export const legacyStories: LegacyStory[] = [
  {
    id: "l-1",
    slug: "profile-placeholder-1",
    name: "Perfusionist profile",
    role: "Placeholder: awaiting a consented profile",
    kind: "Profile",
    excerpt:
      "Profiles of Tanzanian perfusionists, their training and career milestones will appear here once submitted and approved with the person's permission.",
    consent_confirmed: false,
    is_placeholder: true,
  },
  {
    id: "l-2",
    slug: "interview-placeholder",
    name: "Interview",
    role: "Placeholder: oral history",
    kind: "Interview",
    excerpt:
      "Recorded conversations with perfusionists about their journeys, the cases that shaped them and how the profession has changed.",
    consent_confirmed: false,
    is_placeholder: true,
  },
  {
    id: "l-3",
    slug: "tribute-placeholder",
    name: "Tribute",
    role: "Placeholder: published only with family authorisation",
    kind: "Tribute",
    excerpt:
      "Tributes to retired and late perfusionists, prepared with their families and colleagues.",
    consent_confirmed: false,
    is_placeholder: true,
  },
  {
    id: "l-4",
    slug: "story-placeholder",
    name: "How perfusion began here",
    role: "Placeholder: verified story",
    kind: "Story",
    excerpt:
      "Stories about the development of perfusion services in Tanzania, from the first cases to today's teams.",
    consent_confirmed: false,
    is_placeholder: true,
  },
];

export const caseReports: CaseReport[] = [
  {
    id: "c-template",
    slug: "case-report-template",
    title: "Case report template: how to structure an educational perfusion case",
    age_group: "Adult",
    procedure: "Template",
    tags: ["template"],
    author: "Editorial Team",
    published_at: "2026-11-01",
    is_template: true,
    sections: {
      clinical_background:
        "Age group and relevant history only. Do not include names, dates of birth, hospital numbers, exact dates or any detail that could identify the patient.",
      surgical_procedure: "Planned and performed procedure, urgency, approach.",
      perfusion_setup: "Circuit configuration, oxygenator, pump type, prime volume and composition.",
      cannulation_strategy: "Arterial and venous cannulation sites and sizes, venting.",
      cpb_parameters: "Target flows, pressures, CPB and cross-clamp times.",
      temperature_management: "Cooling and rewarming strategy and targets.",
      cardioplegia_strategy: "Solution, route, dosing interval.",
      monitoring: "Blood gas management (alpha-stat / pH-stat), electrolytes, lactate, ACT.",
      challenges: "What was unexpected or difficult.",
      interventions: "What the team did and why.",
      outcomes: "Immediate and short-term outcome, in general terms.",
      lessons_learned: "The teaching point for other perfusionists.",
    },
    references: ["List each source in full, with a DOI or link where available."],
  },
];

export const mediaItems: MediaItem[] = [
  ...THEATRE_PHOTOS.map((p, i) => ({
    id: `photo-${i + 1}`,
    title: p.caption,
    kind: "photo" as const,
    category: "In the theatre" as const,
    topic: "Clinical practice",
    url: p.src,
    credit: "Photo: TaCPA",
  })),
  { id: "md-1", title: "Heart-lung machine demonstration", kind: "video", category: "Demonstrations", year: 2026, topic: "CPB", is_placeholder: true },
  { id: "md-2", title: "CPB circuit setup tutorial", kind: "video", category: "Tutorials", year: 2026, topic: "CPB", is_placeholder: true },
  { id: "md-3", title: "Perfusionist interview", kind: "video", category: "Interviews", year: 2026, topic: "Careers", is_placeholder: true },
  { id: "md-4", title: "Conference recording", kind: "video", category: "Conferences", year: 2026, topic: "ECMO", is_placeholder: true },
  { id: "md-5", title: "Surgical camp photographs", kind: "photo", category: "Events", year: 2026, topic: "Community", is_placeholder: true },
  { id: "md-6", title: "Historical photograph archive", kind: "photo", category: "Historical", year: 1953, topic: "History", is_placeholder: true },
  { id: "md-7", title: "CPB circuit infographic", kind: "infographic", category: "Infographics", year: 2026, topic: "CPB", is_placeholder: true },
  { id: "md-8", title: "Cardioplegia delivery animation", kind: "video", category: "Animations", year: 2026, topic: "Myocardial Protection", is_placeholder: true },
];

export const events: EventItem[] = [
  {
    id: "e-1",
    title: "Your conference or workshop here",
    starts_on: "2027-01-15",
    location: "To be announced",
    kind: "Conference",
    description: "Placeholder event. Editors add conferences, workshops, webinars and surgical camps from the admin dashboard.",
    is_placeholder: true,
  },
  {
    id: "e-2",
    title: "Perfusion webinar series",
    starts_on: "2027-02-10",
    location: "Online",
    kind: "Webinar",
    description: "Placeholder event.",
    is_placeholder: true,
  },
];

export const opportunities: Opportunity[] = [
  {
    id: "o-1",
    title: "Training opportunity",
    organisation: "To be announced",
    kind: "Training",
    location: "To be announced",
    description: "Placeholder. Training programmes, fellowships, scholarships and jobs are added by editors and verified with the organiser.",
    is_placeholder: true,
  },
];

export const members: MemberProfile[] = [
  {
    id: "u-1",
    full_name: "Member profile",
    title: "Clinical Perfusionist",
    show_institution: false,
    interests: ["Adult CPB", "ECMO"],
    bio: "Placeholder profile. Registered members create their own profiles and choose what is public.",
    open_to_collaboration: true,
    is_placeholder: true,
  },
  {
    id: "u-2",
    full_name: "Member profile",
    title: "Perfusion Student",
    show_institution: false,
    interests: ["Paediatric perfusion", "Research"],
    bio: "Placeholder profile.",
    open_to_collaboration: true,
    is_placeholder: true,
  },
  {
    id: "u-3",
    full_name: "Member profile",
    title: "Cardiac Anaesthesiologist",
    show_institution: false,
    interests: ["Blood management", "Monitoring"],
    bio: "Placeholder profile.",
    open_to_collaboration: false,
    is_placeholder: true,
  },
];
