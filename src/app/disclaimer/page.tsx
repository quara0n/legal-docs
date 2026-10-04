import type { Metadata } from "next";
import { t } from "@/i18n";
import { MARKET } from "@/lib/market";
import { DisclaimerNO } from "./no";
import { DisclaimerUS } from "./us";

export const metadata: Metadata = { title: t.legalNav.disclaimer, alternates: { canonical: "/disclaimer" } };

export default function DisclaimerPage() {
  return MARKET === "no" ? <DisclaimerNO /> : <DisclaimerUS />;
}
