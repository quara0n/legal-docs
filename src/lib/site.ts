// Everything brand- or company-specific lives here. Env vars override the defaults.
import { formatDate } from "./doc";
import { LANG, MARKET } from "./market";

export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Rettfram",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rettframavtaler.no").replace(/\/$/, ""),
  slogan: process.env.NEXT_PUBLIC_SITE_SLOGAN ?? (MARKET === "no" ? "Avtaler, rett fram." : ""),
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "kundeservice@rettframavtaler.no",
  // The legal entity that sells the documents, shown in the terms.
  company: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Rune Finne",
  // Organisasjonsnummer (Norway) or similar registration number, shown in the terms and footer.
  companyId: process.env.NEXT_PUBLIC_COMPANY_ID ?? "915553346",
  companyAddress: process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? "Aksdal Senter, Raglamyrvegen 20, 5536 Haugesund",
  legalUpdated: formatDate("2026-10-04", LANG),
  editDays: 30, // free edits and re-downloads after purchase
  refundDays: 14,
};
