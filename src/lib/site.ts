// Everything brand- or company-specific lives here, so launch only needs env vars.
export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Fairform",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "hello@fairform.example",
  // The legal entity that sells the documents, shown in the terms.
  company: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "[Company name]",
  companyAddress: process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? "[Company address]",
  legalUpdated: "October 4, 2026",
  editDays: 30, // free edits and re-downloads after purchase
  refundDays: 14,
};
