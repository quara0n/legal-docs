import type { Metadata } from "next";
import { t } from "@/i18n";
import { MARKET } from "@/lib/market";
import { PrivacyNO } from "./no";
import { PrivacyUS } from "./us";

export const metadata: Metadata = { title: t.legalNav.privacy, alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return MARKET === "no" ? <PrivacyNO /> : <PrivacyUS />;
}
