import type { Metadata } from "next";
import { t } from "@/i18n";
import { MARKET } from "@/lib/market";
import { RefundsNO } from "./no";
import { RefundsUS } from "./us";

export const metadata: Metadata = { title: t.legalNav.refunds, alternates: { canonical: "/refunds" } };

export default function RefundsPage() {
  return MARKET === "no" ? <RefundsNO /> : <RefundsUS />;
}
