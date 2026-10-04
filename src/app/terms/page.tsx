import type { Metadata } from "next";
import { t } from "@/i18n";
import { MARKET } from "@/lib/market";
import { TermsNO } from "./no";
import { TermsUS } from "./us";

export const metadata: Metadata = { title: t.legalNav.terms, alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return MARKET === "no" ? <TermsNO /> : <TermsUS />;
}
