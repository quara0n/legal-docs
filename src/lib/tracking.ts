// Google Analytics 4, Google Ads conversions and Microsoft Clarity, all behind
// one consent banner. Each is off unless its env var is set. Consent Mode v2
// keeps Google cookies denied until the visitor accepts, and Clarity only loads
// after acceptance. Document answers are never sent to any of them: the wizard
// and download pages are masked for Clarity.

export const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? ""; // AW-…
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? ""; // G-…
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "";
const CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL ?? "";
export const GTAG_ID = GA4_ID || ADS_ID;
export const TRACKING_ON = Boolean(GTAG_ID || CLARITY_ID);

const KEY = "rettfram:consent";
export const CONSENT_OPEN_EVENT = "rettfram:consent-open";

export type Consent = "granted" | "denied";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function loadConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: Consent) {
  try {
    window.localStorage.setItem(KEY, choice);
  } catch {
    /* private mode: the choice just isn't remembered */
  }
  window.gtag?.("consent", "update", {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  });
  if (choice === "granted") loadClarity();
  else window.clarity?.("consent", false);
}

// Clarity sets cookies as soon as it loads, so it is only injected after consent.
export function loadClarity() {
  if (!CLARITY_ID || window.clarity) return;
  const c = ((...args: unknown[]) => {
    (c.q = c.q || []).push(args);
  }) as ((...args: unknown[]) => void) & { q?: unknown[][] };
  window.clarity = c;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  document.head.appendChild(s);
  c("consent");
}

export function trackPurchase(item: { slug: string; name: string }, value: number, currency: string, transactionId: string) {
  try {
    if (GA4_ID)
      window.gtag?.("event", "purchase", {
        transaction_id: transactionId,
        value,
        currency,
        items: [{ item_id: item.slug, item_name: item.name, price: value, quantity: 1 }],
      });
    if (ADS_ID && CONVERSION_LABEL)
      window.gtag?.("event", "conversion", { send_to: `${ADS_ID}/${CONVERSION_LABEL}`, value, currency, transaction_id: transactionId });
  } catch {
    /* tracking must never break the download */
  }
}

// Runs before gtag.js loads: deny everything by default, then apply a saved choice.
export const consentBootstrap = () => `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });
try { var c = localStorage.getItem('${KEY}'); if (c === 'granted') gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' }); } catch (e) {}
gtag('js', new Date());
${[GA4_ID, ADS_ID].filter(Boolean).map((id) => `gtag('config', '${id}');`).join("\n")}
`;
