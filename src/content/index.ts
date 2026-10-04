import type { Template } from "@/lib/doc";
import { US_STATES } from "./en-US/shared";
import { nda } from "./en-US/nda";
import { lease } from "./en-US/lease";
import { billOfSale } from "./en-US/bill-of-sale";
import { serviceAgreement } from "./en-US/service-agreement";
import { powerOfAttorney } from "./en-US/power-of-attorney";
import { promissoryNote } from "./en-US/promissory-note";
import { roommate } from "./en-US/roommate";
import { sublease } from "./en-US/sublease";
import { husleiekontrakt } from "./nb-NO/husleiekontrakt";
import { fremleiekontrakt } from "./nb-NO/fremleiekontrakt";
import { kjopekontrakt } from "./nb-NO/kjopekontrakt";
import { gjeldsbrev } from "./nb-NO/gjeldsbrev";
import { fullmakt } from "./nb-NO/fullmakt";
import { oppdragsavtale } from "./nb-NO/oppdragsavtale";
import { taushetserklaering } from "./nb-NO/taushetserklaering";
import { LANG } from "@/lib/market";

// Each locale brings its own templates, region list and currency. The site
// shows one locale, picked by the market (NEXT_PUBLIC_MARKET); the others stay
// in the code but are not published.
export interface Locale {
  code: string;
  currency: string;
  regions: string[];
  regionLabel: string;
  templates: Template[];
}

export const LOCALES: Record<string, Locale> = {
  "en-US": {
    code: "en-US",
    currency: "usd",
    regions: US_STATES,
    regionLabel: "State",
    templates: [nda, lease, billOfSale, serviceAgreement, powerOfAttorney, promissoryNote, sublease, roommate],
  },
  "nb-NO": {
    code: "nb-NO",
    currency: "nok",
    regions: [],
    regionLabel: "Fylke",
    templates: [husleiekontrakt, fremleiekontrakt, kjopekontrakt, gjeldsbrev, fullmakt, oppdragsavtale, taushetserklaering],
  },
};

export const DEFAULT_LOCALE: string = LANG;

export function getLocale(code = DEFAULT_LOCALE) {
  return LOCALES[code] ?? LOCALES[DEFAULT_LOCALE];
}

export function getTemplates(locale = DEFAULT_LOCALE) {
  return getLocale(locale).templates;
}

export function getTemplate(slug: string, locale = DEFAULT_LOCALE) {
  return getTemplates(locale).find((t) => t.slug === slug);
}
