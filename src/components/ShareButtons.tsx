"use client";

import { useState } from "react";
import { Link2, Share2 } from "lucide-react";

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? new URL(path, window.location.origin).toString() : path;
  const enc = encodeURIComponent;
  const links = [
    { name: "WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { name: "X", href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="inline-flex items-center gap-1 text-navy-500"><Share2 className="h-4 w-4" /> Share</span>
      {links.map((l) => (
        <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className="chip hover:bg-teal-50 hover:text-teal-700">{l.name}</a>
      ))}
      <button
        onClick={async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="chip gap-1 hover:bg-teal-50 hover:text-teal-700"
      >
        <Link2 className="h-3.5 w-3.5" />{copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
