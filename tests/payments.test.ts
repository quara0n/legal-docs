import { describe, expect, it } from "vitest";
import { VIPPS_API_VERSION, demoMode, verifyPurchase } from "@/lib/payments";

describe("Vipps API version", () => {
  it("uses the preview release with the Vipps flag", () => {
    expect(VIPPS_API_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}\.preview; vipps_preview=v1$/);
  });
});

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
