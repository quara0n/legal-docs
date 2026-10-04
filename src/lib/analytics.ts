"use client";

// Cookie-free product analytics via Plausible, only when
// NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set. Never send document answers here.

type Props = Record<string, string | number>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

export function track(event: "Document started" | "Step completed" | "Checkout started" | "Purchase completed" | "PDF downloaded", props?: Props) {
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    /* analytics must never break the app */
  }
}
