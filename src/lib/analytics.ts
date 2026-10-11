"use client";

// Funnel events: Plausible (cookie-free, only when NEXT_PUBLIC_PLAUSIBLE_DOMAIN
// is set) and GA4 (via gtag, which respects the consent banner). Only the
// document slug, step name or tool name is sent, never document answers.

import { GA4_ID } from "./tracking";

type Props = Record<string, string | number>;
type Event = "Document started" | "Step completed" | "Checkout started" | "Purchase completed" | "PDF downloaded" | "Free tool PDF";

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

// GA4 names. Purchases are sent by trackPurchase with value and transaction id.
const GA4_EVENT: Partial<Record<Event, string>> = {
  "Document started": "document_start",
  "Step completed": "document_step",
  "Checkout started": "begin_checkout",
  "PDF downloaded": "pdf_download",
  "Free tool PDF": "free_tool_pdf",
};

export function track(event: Event, props?: Props) {
  try {
    window.plausible?.(event, props ? { props } : undefined);
    const name = GA4_EVENT[event];
    if (GA4_ID && name) window.gtag?.("event", name, props ?? {});
  } catch {
    /* analytics must never break the app */
  }
}
