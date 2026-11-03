import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function NotFound() {
  return (
    <PageHeader eyebrow="404" title="This page has gone off bypass" intro="We couldn't find what you were looking for.">
      <div className="mt-8 flex gap-3"><Link href="/" className="btn-primary">Back home</Link><Link href="/search" className="btn-ghost">Search</Link></div>
    </PageHeader>
  );
}
