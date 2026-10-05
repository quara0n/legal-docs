// Google Ads conversion tracking with Consent Mode v2. Off unless
// NEXT_PUBLIC_GOOGLE_ADS_ID (AW-…) is set. Ad cookies stay denied until the
// visitor accepts in the cookie banner; never send document answers here.

export const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";
const CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL ?? "";
const KEY = "rettfram:consent";
export const CONSENT_OPEN_EVENT = "rettfram:consent-open";

export type Consent = "granted" | "denied";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
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
}

export function trackConversion(value: number, currency: string, transactionId: string) {
  if (!ADS_ID || !CONVERSION_LABEL) return;
  try {
    window.gtag?.("event", "conversion", { send_to: `${ADS_ID}/${CONVERSION_LABEL}`, value, currency, transaction_id: transactionId });
  } catch {
    /* tracking must never break the download */
  }
}

// Runs before gtag.js loads: deny everything by default, then apply a saved choice.
export const consentBootstrap = (id: string) => `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });
try { var c = localStorage.getItem('${KEY}'); if (c === 'granted') gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' }); } catch (e) {}
gtag('js', new Date());
gtag('config', '${id}');
`;
