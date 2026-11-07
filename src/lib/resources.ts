/**
 * Downloadable resources: presentations and books.
 *
 * EASIEST WAY: sign in as an editor or super administrator, open /admin > Resources and
 * upload the file there (needs Supabase, see README). Uploaded files appear on /resources
 * straight away.
 *
 * You can also add files in code:
 * 1. Put the file in  public/resources/presentations/  or  public/resources/books/
 *    (PDF works best; PowerPoint .pptx is fine too). Use a simple file name with no spaces,
 *    e.g. cpb-basics-2026.pdf
 * 2. Add an entry to PRESENTATIONS or BOOKS below. `file` is the path after /public,
 *    e.g. "/resources/presentations/cpb-basics-2026.pdf"
 * 3. Commit. Vercel redeploys and the file appears on /resources with a Download button.
 *
 * Files over about 50 MB are better hosted on Google Drive (share as "Anyone with the link")
 * and added with `url` instead of `file`.
 *
 * Only add books and slides you wrote, or that the author or publisher allows to be shared
 * freely (open access). For other books, add a `url` to where people can buy or borrow them.
 */

export type ResourceKind = "presentation" | "book";

/** Presentation categories: the CVP courses grouped by year of study. */
export const COURSE_GROUPS = [
  { year: "Year 1", courses: ["CVP 1", "CVP 2"] },
  { year: "Year 2", courses: ["CVP 3", "CVP 4"] },
] as const;
export const COURSES = ["CVP 1", "CVP 2", "CVP 3", "CVP 4"] as const;
export type Course = (typeof COURSES)[number] | "Other";

export type Resource = {
  /** Presentations only: which CVP course it belongs to. */
  course?: Course;
  title: string;
  /** Speaker or author(s). */
  author: string;
  /** Year, or full date such as "2026-11-07". */
  year?: string;
  description?: string;
  /** Event or publisher, e.g. "TaCPA Annual Meeting, Dar es Salaam". */
  source?: string;
  /** File in /public, e.g. "/resources/books/handbook.pdf". */
  file?: string;
  /** External link (Google Drive, publisher page) when the file is not in the repo. */
  url?: string;
  /** Shown on the card, e.g. "PDF · 4 MB". */
  format?: string;
  /** Licence or permission note, e.g. "Shared with the author's permission". */
  licence?: string;
};

export const PRESENTATIONS: Resource[] = [
  // Example (remove the // to use):
  // {
  //   course: "CVP 1",
  //   title: "Basics of Cardiopulmonary Bypass",
  //   author: "Alfred Luvakule",
  //   year: "2026",
  //   source: "TaCPA teaching session",
  //   description: "Circuit components, priming and the conduct of bypass.",
  //   file: "/resources/presentations/cpb-basics-2026.pdf",
  //   format: "PDF · 3 MB",
  // },
];

export const BOOKS: Resource[] = [
  // Example:
  // {
  //   title: "Perfusion Handbook",
  //   author: "Author name",
  //   year: "2024",
  //   source: "Publisher",
  //   file: "/resources/books/perfusion-handbook.pdf",
  //   format: "PDF · 12 MB",
  //   licence: "Open access (CC BY 4.0)",
  // },
];

/** A resource as shown on the site, from this file or uploaded through /admin. */
export type ResourceItem = Omit<Resource, "file" | "url"> & {
  /** Stable id used in the download log. */
  key: string;
  kind: ResourceKind;
  href: string;
  /** true = file download, false = external link. */
  isFile: boolean;
};

export function fileFormat(name?: string | null, size?: number | null) {
  const ext = name?.split(".").pop()?.toUpperCase();
  const mb = size ? (size / 1048576 < 1 ? "<1 MB" : `${Math.round(size / 1048576)} MB`) : null;
  return [ext, mb].filter(Boolean).join(" · ") || undefined;
}

export function staticResources(): ResourceItem[] {
  const map = (kind: ResourceKind) => (r: Resource): ResourceItem => {
    const { file, url, ...rest } = r;
    return { ...rest, kind, key: file ?? url ?? r.title, href: file ?? url ?? "#", isFile: Boolean(file) };
  };
  return [...PRESENTATIONS.map(map("presentation")), ...BOOKS.map(map("book"))];
}
