import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export function RefundsUS() {
  return (
    <LegalPage current="/refunds" title="Refund policy" intro={`Not happy? You get your money back. ${SITE.refundDays} days, no forms, no questions.`}>
      <h2>How it works</h2>
      <ul>
        <li>
          Email <a href={`mailto:${SITE.supportEmail}?subject=Refund`}>{SITE.supportEmail}</a> within {SITE.refundDays} days of
          your purchase.
        </li>
        <li>Include the email address you paid with, or the receipt Stripe sent you.</li>
        <li>We refund the full amount to your original payment method, usually within one business day. Your bank may take 5 to 10 days to show it.</li>
      </ul>

      <h2>No subscriptions, nothing to cancel</h2>
      <p>
        Every purchase is a one-time payment. You will never be charged again unless you buy another document, so there is
        nothing to cancel.
      </p>

      <h2>Charged twice or by mistake?</h2>
      <p>Email us and we&apos;ll refund any duplicate or accidental charge straight away, whatever the date.</p>
    </LegalPage>
  );
}
