import type { MetadataRoute } from "next";
import { getCases, getNews } from "@/lib/content";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const STATIC = ["", "/about", "/news", "/legacy", "/history", "/research", "/cases", "/media", "/community", "/events", "/training", "/contact", "/guidelines"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, cases] = await Promise.all([getNews(), getCases()]);
  return [
    ...STATIC.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...news.map((n) => ({ url: `${base}/news/${n.slug}`, lastModified: n.published_at })),
    ...cases.map((c) => ({ url: `${base}/cases/${c.slug}`, lastModified: c.published_at })),
  ];
}
