import Stripe from "stripe";
import { SITE } from "./site";

// Stripe Checkout, one-time payments only. Without STRIPE_SECRET_KEY the app
// runs in demo mode: checkout skips straight to the download page.

const key = process.env.STRIPE_SECRET_KEY;
export const stripe = key ? new Stripe(key) : null;
export const demoMode = !stripe;

export type Verification = { ok: true; slug: string; createdAt: number } | { ok: false; reason: string };

export async function verifyPurchase(sessionId: string, slug: string): Promise<Verification> {
  if (!sessionId) return { ok: false, reason: "Missing purchase reference." };

  if (sessionId.startsWith("demo_")) {
    if (!demoMode) return { ok: false, reason: "Demo purchases are disabled." };
    const [, demoSlug, ts] = sessionId.split("__");
    if (demoSlug !== slug) return { ok: false, reason: "This purchase is for a different document." };
    return { ok: true, slug, createdAt: Number(ts) || Date.now() };
  }

  if (!stripe) return { ok: false, reason: "Payments are not configured." };
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return { ok: false, reason: "We couldn't find that purchase." };
  }
  if (session.payment_status !== "paid") return { ok: false, reason: "Payment has not completed yet." };
  if (session.metadata?.slug !== slug) return { ok: false, reason: "This purchase is for a different document." };
  const createdAt = session.created * 1000;
  if (Date.now() - createdAt > SITE.editDays * 86400_000)
    return { ok: false, reason: `Free edits ended ${SITE.editDays} days after purchase. Your earlier download is still yours to keep.` };
  return { ok: true, slug, createdAt };
}
