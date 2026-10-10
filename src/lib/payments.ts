import Stripe from "stripe";
import { t } from "@/i18n";
import { SITE } from "./site";

// Stripe Checkout, one-time payments only. Without STRIPE_SECRET_KEY the app
// runs in demo mode: checkout skips straight to the download page.

// Trimmed: a key pasted with a trailing newline makes every Stripe call fail.
const key = process.env.STRIPE_SECRET_KEY?.trim();
export const stripe = key ? new Stripe(key) : null;
// Never on the live site: without a key there, checkout just reports that
// payments aren't set up, instead of handing out free documents.
export const demoMode = !stripe && process.env.VERCEL_ENV !== "production";

// Vipps runs through Stripe (Norway, NOK). It is in Stripe private preview, so it
// stays off until Stripe has approved the account and NEXT_PUBLIC_VIPPS=1 is set.
export const vippsEnabled = process.env.NEXT_PUBLIC_VIPPS === "1";
// Preview features need the ".preview" release of the SDK's API version, plus the
// Vipps flag (docs.stripe.com/payments/vipps/accept-a-payment).
export const VIPPS_API_VERSION = `${Stripe.API_VERSION.replace(/\.[a-z]+$/, ".preview")}; vipps_preview=v1`;

export type Verification = { ok: true; slug: string; createdAt: number } | { ok: false; reason: string };

export async function verifyPurchase(sessionId: string, slug: string): Promise<Verification> {
  if (!sessionId) return { ok: false, reason: t.api.missingRef };

  if (sessionId.startsWith("demo_")) {
    if (!demoMode) return { ok: false, reason: t.api.demoDisabled };
    const [, demoSlug, ts] = sessionId.split("__");
    if (demoSlug !== slug) return { ok: false, reason: t.api.otherDoc };
    return { ok: true, slug, createdAt: Number(ts) || Date.now() };
  }

  if (!stripe) return { ok: false, reason: t.api.notConfigured };
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return { ok: false, reason: t.api.notFound };
  }
  if (session.payment_status !== "paid") return { ok: false, reason: t.api.notPaid };
  if (session.metadata?.slug !== slug) return { ok: false, reason: t.api.otherDoc };
  const createdAt = session.created * 1000;
  if (Date.now() - createdAt > SITE.editDays * 86400_000)
    return { ok: false, reason: t.api.editsEnded };
  return { ok: true, slug, createdAt };
}
