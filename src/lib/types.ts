export type Role = "super_admin" | "editor" | "contributor" | "member";
export type Status = "draft" | "pending_review" | "published" | "rejected" | "archived";

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  category: NewsCategory;
  author: string;
  published_at: string;
  image_url?: string | null;
  tags?: string[];
  is_sample?: boolean;
}

export type NewsCategory =
  | "Tanzania"
  | "International"
  | "Cardiac Surgery"
  | "Technology"
  | "Training & Conferences"
  | "Announcements";

export const RESEARCH_CATEGORIES = [
  "Cardiopulmonary Bypass",
  "ECMO",
  "Myocardial Protection",
  "Blood Management",
  "Paediatric Perfusion",
  "Adult Cardiac Surgery",
  "Perfusion Monitoring",
  "Extracorporeal Circulation Technology",
  "Research and Innovation",
] as const;
export type ResearchCategory = (typeof RESEARCH_CATEGORIES)[number];

export type PublicationType =
  | "Journal Article"
  | "Randomised Controlled Trial"
  | "Systematic Review / Meta-analysis"
  | "Clinical Research"
  | "Case Report"
  | "Research Protocol"
  | "Guideline / Consensus Statement";

export interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string | null;
  url?: string | null;
  summary: string;
  key_findings: string[];
  category: ResearchCategory;
  publication_type: PublicationType;
  /** "original" = links to and summarises a published paper; "educational" = an educational summary written for this site */
  content_kind: "original" | "educational";
  open_access?: boolean;
}

export interface Milestone {
  id: string;
  year: number;
  year_label?: string;
  title: string;
  description: string;
  era: Era;
  people?: string;
  region: "Global" | "Africa" | "Tanzania";
  references: { label: string; url?: string }[];
  verified: boolean;
  is_placeholder?: boolean;
  image_url?: string | null;
}

export type Era =
  | "Foundations"
  | "Extracorporeal pioneers"
  | "Birth of CPB"
  | "Refinement"
  | "ECMO & life support"
  | "Modern era";

export interface LegacyStory {
  id: string;
  slug: string;
  name: string;
  role: string;
  kind: "Profile" | "Interview" | "Tribute" | "Story" | "Event";
  excerpt: string;
  body?: string;
  image_url?: string | null;
  consent_confirmed: boolean;
  is_placeholder?: boolean;
}

export interface CaseReport {
  id: string;
  slug: string;
  title: string;
  age_group: "Neonate" | "Infant" | "Child" | "Adolescent" | "Adult" | "Older adult";
  procedure: string;
  tags: string[];
  author: string;
  published_at: string;
  sections: Record<CaseSectionKey, string>;
  references: string[];
  is_template?: boolean;
}

export const CASE_SECTIONS = [
  ["clinical_background", "Clinical background"],
  ["surgical_procedure", "Surgical procedure"],
  ["perfusion_setup", "Perfusion setup"],
  ["cannulation_strategy", "Cannulation strategy"],
  ["cpb_parameters", "CPB parameters"],
  ["temperature_management", "Temperature management"],
  ["cardioplegia_strategy", "Cardioplegia strategy"],
  ["monitoring", "Blood gas & electrolyte monitoring"],
  ["challenges", "Challenges encountered"],
  ["interventions", "Interventions & management"],
  ["outcomes", "Outcomes"],
  ["lessons_learned", "Lessons learned"],
] as const;
export type CaseSectionKey = (typeof CASE_SECTIONS)[number][0];

export interface MediaItem {
  id: string;
  title: string;
  kind: "video" | "photo" | "infographic";
  category:
    | "In the theatre"
    | "Education"
    | "Demonstrations"
    | "Tutorials"
    | "Interviews"
    | "Conferences"
    | "Events"
    | "Historical"
    | "Animations"
    | "Infographics";
  /** Leave empty when the year is not known; never guess. */
  year?: number | null;
  topic: string;
  /** For videos: a YouTube or Vimeo URL. For photos: an image URL. */
  url?: string | null;
  thumbnail_url?: string | null;
  credit?: string;
  is_placeholder?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  starts_on: string;
  ends_on?: string;
  location: string;
  kind: "Conference" | "Workshop" | "Webinar" | "Surgical camp" | "Meeting";
  description: string;
  url?: string | null;
  is_placeholder?: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  organisation: string;
  kind: "Training" | "Fellowship" | "Job" | "Scholarship" | "Course";
  location: string;
  deadline?: string;
  description: string;
  url?: string | null;
  is_placeholder?: boolean;
}

export interface MemberProfile {
  id: string;
  full_name: string;
  title: string;
  institution?: string | null;
  show_institution: boolean;
  training?: string;
  interests: string[];
  bio?: string;
  avatar_url?: string | null;
  open_to_collaboration: boolean;
  is_placeholder?: boolean;
}
