// A guide article: plain, general information that answers one search query
// and points to the matching document template.

/** A paragraph of text, or a bullet list (ordered when `ordered` is set). */
export type GuideBlock = string | { list: string[]; ordered?: boolean };

export interface GuideSection {
  h2: string;
  body: GuideBlock[];
}

export interface Guide {
  slug: string;
  /** The search phrase the guide is written for. */
  keyword: string;
  /** Slug of the template the guide leads to (src/content/<locale>/*.ts). */
  template: string;
  /** The <title>, keyword first, at most 65 characters. */
  title: string;
  /** Meta description, at most 160 characters. */
  description: string;
  h1: string;
  /** Short link text, used for "Les guiden: ..." on the document page. */
  linkText: string;
  /** Short lead paragraph under the H1. */
  lead: string;
  /** Text for the call-to-action box. */
  cta: string;
  /** ISO dates. */
  published: string;
  updated: string;
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  /** Slugs of two related guides. */
  related: string[];
}
