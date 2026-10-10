import { MARKET } from "@/lib/market";
import type { Guide } from "./types";
import { husleiekontraktMal } from "./nb-NO/husleiekontrakt-mal";
import { kjopekontraktBilPrivat } from "./nb-NO/kjopekontrakt-bil-privat";
import { fremleiekontraktMal } from "./nb-NO/fremleiekontrakt-mal";
import { gjeldsbrevMal } from "./nb-NO/gjeldsbrev-mal";
import { fullmaktMal } from "./nb-NO/fullmakt-mal";
import { oppdragsavtaleFrilanser } from "./nb-NO/oppdragsavtale-frilanser";
import { taushetserklaeringMal } from "./nb-NO/taushetserklaering-mal";
import { oppsigelseLeiekontrakt } from "./nb-NO/oppsigelse-leiekontrakt";
import { depositumHusleie } from "./nb-NO/depositum-husleie";

export type { Guide, GuideBlock, GuideSection } from "./types";

/** All Norwegian guides, regardless of market (used by tests). */
export const NB_GUIDES: Guide[] = [
  husleiekontraktMal,
  kjopekontraktBilPrivat,
  fremleiekontraktMal,
  gjeldsbrevMal,
  fullmaktMal,
  oppdragsavtaleFrilanser,
  taushetserklaeringMal,
  oppsigelseLeiekontrakt,
  depositumHusleie,
];

/** Guides published on this deployment. Only the Norwegian site has guides. */
export function getGuides(): Guide[] {
  return MARKET === "no" ? NB_GUIDES : [];
}

export function getGuide(slug: string) {
  return getGuides().find((g) => g.slug === slug);
}

/** The guide written for a template, if there is one. */
export function getGuideForTemplate(templateSlug: string) {
  return getGuides().find((g) => g.template === templateSlug);
}
