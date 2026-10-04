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

// Each locale brings its own templates, region list and currency. To add
// Norwegian, create src/content/nb-NO/ with its own templates (e.g.
// husleiekontrakt) and register it here.
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
};

export const DEFAULT_LOCALE = "en-US";

export function getLocale(code = DEFAULT_LOCALE) {
  return LOCALES[code] ?? LOCALES[DEFAULT_LOCALE];
}

export function getTemplates(locale = DEFAULT_LOCALE) {
  return getLocale(locale).templates;
}

export function getTemplate(slug: string, locale = DEFAULT_LOCALE) {
  return getTemplates(locale).find((t) => t.slug === slug);
}
