import { describe, expect, it } from "vitest";
import { demoMode, verifyPurchase } from "@/lib/payments";

describe("purchase verification (demo mode)", () => {
  it("runs in demo mode without a Stripe key", () => {
    expect(demoMode).toBe(!process.env.STRIPE_SECRET_KEY && process.env.VERCEL_ENV !== "production");
  });

  it("accepts a demo purchase for the right document only", async () => {
    const id = `demo__bill-of-sale__${Date.now()}`;
    expect((await verifyPurchase(id, "bill-of-sale")).ok).toBe(true);
    expect((await verifyPurchase(id, "non-disclosure-agreement")).ok).toBe(false);
  });

  it("rejects missing or unknown references", async () => {
    expect((await verifyPurchase("", "bill-of-sale")).ok).toBe(false);
    expect((await verifyPurchase("cs_test_123", "bill-of-sale")).ok).toBe(false);
  });
});
