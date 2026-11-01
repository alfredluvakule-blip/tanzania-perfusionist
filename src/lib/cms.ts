/**
 * CMS configuration: one entry per content collection. Drives the admin editor,
 * the review queue and the public submission form, so adding a field here is all
 * that is needed to expose it in the dashboard (plus a column in supabase/schema.sql).
 */
import { CASE_SECTIONS, RESEARCH_CATEGORIES, type Role } from "./types";

export type FieldType =
  | "text" | "textarea" | "richtext" | "select" | "date" | "number" | "url"
  | "tags" | "lines" | "refs" | "boolean" | "image";

export interface Field {
  name: string; // dot-path allowed, e.g. "sections.outcomes"
  label: string;
  type: FieldType;
  options?: readonly string[];
  required?: boolean;
  help?: string;
}

export interface Collection {
  key: string;
  table: string;
  label: string;
  singular: string;
  titleField: string;
  dateField?: string;
  /** Lowest role that may submit into this collection (submissions start as pending_review). */
  submitRole: Role;
  /** Consent checkboxes the submitter must tick. Stored in the row's consent jsonb. */
  consents?: { key: string; label: string }[];
  fields: Field[];
}

const slug: Field = { name: "slug", label: "URL slug", type: "text", help: "Lowercase words separated by hyphens. Leave blank to generate from the title." };

export const COLLECTIONS: Collection[] = [
  {
    key: "news", table: "news_articles", label: "News", singular: "news article", titleField: "title", dateField: "published_at", submitRole: "contributor",
    fields: [
      { name: "title", label: "Headline", type: "text", required: true }, slug,
      { name: "category", label: "Category", type: "select", options: ["Tanzania", "International", "Cardiac Surgery", "Technology", "Training & Conferences", "Announcements"], required: true },
      { name: "summary", label: "Short summary", type: "textarea", required: true },
      { name: "body", label: "Article", type: "richtext", required: true, help: "Separate paragraphs with a blank line. Link original sources." },
      { name: "author", label: "Author", type: "text", required: true },
      { name: "published_at", label: "Publication date", type: "date", required: true },
      { name: "image_url", label: "Photograph", type: "image" },
      { name: "tags", label: "Tags", type: "tags" },
    ],
  },
  {
    key: "research", table: "publications", label: "Research", singular: "publication", titleField: "title", submitRole: "contributor",
    fields: [
      { name: "title", label: "Article title", type: "text", required: true },
      { name: "authors", label: "Authors", type: "text", required: true, help: "As listed in the publication, e.g. 'Peek GJ, Mugford M, et al.'" },
      { name: "journal", label: "Journal", type: "text", required: true },
      { name: "year", label: "Publication year", type: "number", required: true },
      { name: "doi", label: "DOI", type: "text", help: "e.g. 10.1016/S0140-6736(09)61069-2 (without https://doi.org/)" },
      { name: "url", label: "Original link (if no DOI)", type: "url" },
      { name: "category", label: "Category", type: "select", options: RESEARCH_CATEGORIES, required: true },
      { name: "publication_type", label: "Publication type", type: "select", options: ["Journal Article", "Randomised Controlled Trial", "Systematic Review / Meta-analysis", "Clinical Research", "Case Report", "Research Protocol", "Guideline / Consensus Statement"], required: true },
      { name: "content_kind", label: "Content kind", type: "select", options: ["original", "educational"], required: true, help: "'original' = summarises a published paper; 'educational' = written for this site." },
      { name: "summary", label: "Abstract / summary", type: "textarea", required: true },
      { name: "key_findings", label: "Main clinical findings", type: "lines", help: "One finding per line, exactly as reported in the paper." },
      { name: "open_access", label: "Open access", type: "boolean" },
    ],
    consents: [{ key: "details_verified", label: "I have checked the title, authors, journal, year and DOI against the original publication." }],
  },
  {
    key: "cases", table: "case_reports", label: "Case reports", singular: "case report", titleField: "title", dateField: "published_at", submitRole: "contributor",
    fields: [
      { name: "title", label: "Case title", type: "text", required: true }, slug,
      { name: "age_group", label: "Patient age group", type: "select", options: ["Neonate", "Infant", "Child", "Adolescent", "Adult", "Older adult"], required: true },
      { name: "procedure", label: "Procedure (short)", type: "text", required: true },
      ...CASE_SECTIONS.map(([k, l]) => ({ name: `sections.${k}`, label: l, type: "textarea" as const })),
      { name: "references", label: "References", type: "lines", help: "One reference per line." },
      { name: "author", label: "Author(s)", type: "text", required: true },
      { name: "published_at", label: "Date", type: "date" },
      { name: "tags", label: "Tags", type: "tags" },
    ],
    consents: [
      { key: "anonymised", label: "All patient-identifiable information has been removed." },
      { key: "patient_consent", label: "Patient (or guardian) consent for publication has been obtained." },
      { key: "institutional_approval", label: "Required institutional / ethics approval has been obtained." },
      { key: "media_permission", label: "I have permission to use any photos, diagrams or videos included." },
    ],
  },
  {
    key: "timeline", table: "timeline_milestones", label: "History timeline", singular: "milestone", titleField: "title", submitRole: "contributor",
    fields: [
      { name: "year", label: "Year", type: "number", required: true },
      { name: "year_label", label: "Display date", type: "text", help: "Optional, e.g. '6 May 1953'" },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "era", label: "Era", type: "select", options: ["Foundations", "Extracorporeal pioneers", "Birth of CPB", "Refinement", "ECMO & life support", "Modern era"], required: true },
      { name: "region", label: "Region", type: "select", options: ["Global", "Africa", "Tanzania"], required: true },
      { name: "people", label: "People involved", type: "text" },
      { name: "references", label: "References / sources", type: "refs", required: true, help: "One per line: citation | optional URL. Required for verification." },
      { name: "image_url", label: "Historical photograph", type: "image" },
      { name: "verified", label: "Verified against sources (editors only)", type: "boolean" },
    ],
    consents: [{ key: "sources_provided", label: "I have provided sources that support this milestone." }],
  },
  {
    key: "legacy", table: "legacy_stories", label: "Memories & legacy", singular: "story", titleField: "name", submitRole: "member",
    fields: [
      { name: "name", label: "Name / title", type: "text", required: true }, slug,
      { name: "role", label: "Role or subtitle", type: "text" },
      { name: "kind", label: "Type", type: "select", options: ["Profile", "Interview", "Tribute", "Story", "Event"], required: true },
      { name: "excerpt", label: "Short excerpt", type: "textarea", required: true },
      { name: "body", label: "Full story", type: "richtext" },
      { name: "image_url", label: "Photograph", type: "image" },
    ],
    consents: [
      { key: "subject_consent", label: "The person featured (or, for a tribute, their family) has authorised publication." },
      { key: "photo_permission", label: "I own or have permission to share these photographs." },
    ],
  },
  {
    key: "media", table: "media_items", label: "Media", singular: "media item", titleField: "title", submitRole: "contributor",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "kind", label: "Type", type: "select", options: ["video", "photo", "infographic"], required: true },
      { name: "category", label: "Category", type: "select", options: ["Education", "Demonstrations", "Tutorials", "Interviews", "Conferences", "Events", "Historical", "Animations", "Infographics"], required: true },
      { name: "topic", label: "Topic", type: "text", required: true },
      { name: "year", label: "Year", type: "number", required: true },
      { name: "url", label: "YouTube / Vimeo link, or photo", type: "url", help: "Paste a video link, or upload a photo below." },
      { name: "thumbnail_url", label: "Photo / thumbnail upload", type: "image" },
      { name: "credit", label: "Credit / licence", type: "text", required: true },
    ],
    consents: [{ key: "licence", label: "I own this media or it is used with permission / an appropriate licence." }],
  },
  {
    key: "events", table: "events", label: "Events", singular: "event", titleField: "title", dateField: "starts_on", submitRole: "contributor",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "kind", label: "Type", type: "select", options: ["Conference", "Workshop", "Webinar", "Surgical camp", "Meeting"], required: true },
      { name: "starts_on", label: "Start date", type: "date", required: true },
      { name: "ends_on", label: "End date", type: "date" },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "url", label: "Website / registration", type: "url" },
    ],
  },
  {
    key: "opportunities", table: "opportunities", label: "Training & careers", singular: "opportunity", titleField: "title", submitRole: "contributor",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "organisation", label: "Organisation", type: "text", required: true },
      { name: "kind", label: "Type", type: "select", options: ["Training", "Fellowship", "Job", "Scholarship", "Course"], required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "deadline", label: "Deadline", type: "date" },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "url", label: "Link", type: "url" },
    ],
  },
  {
    key: "discussions", table: "discussions", label: "Discussions", singular: "discussion", titleField: "title", submitRole: "member",
    fields: [
      { name: "title", label: "Topic", type: "text", required: true },
      { name: "category", label: "Category", type: "select", options: ["CPB practice", "ECMO", "Paediatrics", "Education & training", "Research", "Equipment", "Careers", "General"], required: true },
      { name: "body", label: "Your post", type: "textarea", required: true, help: "No patient-identifiable information. Follow the professional conduct guidelines." },
    ],
  },
];

export const getCollection = (key: string) => COLLECTIONS.find((c) => c.key === key);

export const ROLE_RANK: Record<Role, number> = { member: 1, contributor: 2, editor: 3, super_admin: 4 };
export const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Super Administrator", editor: "Editor", contributor: "Contributor", member: "Registered Member",
};
export const can = (role: Role | null | undefined, min: Role) => !!role && ROLE_RANK[role] >= ROLE_RANK[min];

export function getPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), obj);
}
export function setPath(obj: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split(".");
  let o = obj;
  keys.slice(0, -1).forEach((k) => { o[k] = (o[k] as Record<string, unknown>) ?? {}; o = o[k] as Record<string, unknown>; });
  o[keys[keys.length - 1]] = value;
}
export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 80);
