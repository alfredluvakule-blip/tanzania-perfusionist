/**
 * Downloadable resources: presentations and books.
 *
 * HOW TO ADD A FILE
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

export type Resource = {
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
