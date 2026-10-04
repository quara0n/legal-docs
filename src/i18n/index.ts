import { MARKET } from "@/lib/market";
import { en } from "./en";
import { nb } from "./nb";

// Interface text for this deployment's market.
export const t = MARKET === "no" ? nb : en;
