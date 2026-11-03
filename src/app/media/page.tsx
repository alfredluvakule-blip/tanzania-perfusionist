import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { MediaGallery } from "@/components/MediaGallery";
import { getMedia } from "@/lib/content";

export const metadata: Metadata = { title: "Perfusion Media Hub" };
export const revalidate = 300;

export default async function MediaPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const media = await getMedia();
  return (
    <>
      <PageHeader eyebrow="Perfusion media hub" title="Videos, photographs and teaching media"
        intro="Educational videos, heart-lung machine demonstrations, CPB setup tutorials, interviews, conference recordings, historical photographs, animations and infographics.">
        <div className="mt-8"><Link href="/submit?type=media" className="btn-primary">Contribute media</Link></div>
      </PageHeader>
      <section className="container-x py-14">
        <MediaGallery items={media} initialCategory={category ?? "All"} />
        <p className="mt-8 text-xs text-navy-500">Videos are embedded from YouTube or Vimeo. Photographs are uploaded by authorised contributors and used only with permission or an appropriate licence.</p>
      </section>
    </>
  );
}
