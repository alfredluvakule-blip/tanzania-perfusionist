import "server-only";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./supabase";
import * as seed from "./seed";
import { fileFormat, staticResources, type ResourceItem } from "./resources";
import type {
  CaseReport, EventItem, LegacyStory, MediaItem, MemberProfile, Milestone,
  NewsArticle, Opportunity, Publication,
} from "./types";

/**
 * Content access layer. Reads published rows from Supabase (RLS only exposes
 * status = 'published' to anonymous visitors). Falls back to seed content when
 * Supabase is not configured or a table is empty, so the site always renders.
 */
const anon = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
  : null;

async function fromTable<T>(table: string, fallback: T[], order: string, ascending = false): Promise<T[]> {
  if (!anon) return fallback;
  const { data, error } = await anon.from(table).select("*").eq("status", "published").order(order, { ascending });
  if (error || !data || data.length === 0) return fallback;
  return data as T[];
}

export const getNews = () => fromTable<NewsArticle>("news_articles", seed.news, "published_at");
export const getPublications = () => fromTable<Publication>("publications", seed.publications, "year");
export const getMilestones = () => fromTable<Milestone>("timeline_milestones", seed.milestones, "year", true);
export const getLegacy = () => fromTable<LegacyStory>("legacy_stories", seed.legacyStories, "created_at");
export const getCases = () => fromTable<CaseReport>("case_reports", seed.caseReports, "published_at");
export const getMedia = () => fromTable<MediaItem>("media_items", seed.mediaItems, "year");
export const getEvents = () => fromTable<EventItem>("events", seed.events, "starts_on", true);
export const getOpportunities = () => fromTable<Opportunity>("opportunities", seed.opportunities, "created_at");

export async function getMembers(): Promise<MemberProfile[]> {
  if (!anon) return seed.members;
  const { data } = await anon.from("public_profiles").select("*").limit(48);
  return data && data.length ? (data as MemberProfile[]) : seed.members;
}

export async function getNewsBySlug(slug: string) {
  return (await getNews()).find((n) => n.slug === slug) ?? null;
}
export async function getCaseBySlug(slug: string) {
  return (await getCases()).find((c) => c.slug === slug) ?? null;
}

/** Presentations and books: built-in list (src/lib/resources.ts) plus files uploaded in /admin. */
export async function getResources(): Promise<ResourceItem[]> {
  const builtIn = staticResources();
  if (!anon) return builtIn;
  const { data } = await anon.from("resources").select("*").eq("status", "published").order("created_at", { ascending: false });
  const uploaded: ResourceItem[] = (data ?? []).map((r) => ({
    key: r.id,
    kind: r.kind,
    course: r.course ?? undefined,
    title: r.title,
    author: r.author,
    year: r.year ?? undefined,
    description: r.description ?? undefined,
    source: r.source ?? undefined,
    licence: r.licence ?? undefined,
    format: r.file_path ? fileFormat(r.file_name, r.file_size) : undefined,
    href: r.file_path ? anon.storage.from("resources").getPublicUrl(r.file_path).data.publicUrl : r.external_url,
    isFile: Boolean(r.file_path),
  }));
  return [...uploaded, ...builtIn];
}
