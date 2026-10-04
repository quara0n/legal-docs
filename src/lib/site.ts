// Everything brand- or company-specific lives here, so launch only needs env vars.
import { formatDate } from "./doc";
import { LANG } from "./market";

export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Rettfram",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "hei@rettfram.no",
  // The legal entity that sells the documents, shown in the terms.
  company: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "[Company name]",
  // Organisasjonsnummer (Norway) or similar registration number, shown in the terms and footer.
  companyId: process.env.NEXT_PUBLIC_COMPANY_ID ?? "",
  companyAddress: process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? "[Company address]",
  legalUpdated: formatDate("2026-10-04", LANG),
  editDays: 30, // free edits and re-downloads after purchase
  refundDays: 14,
};
