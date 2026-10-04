import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy policy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <LegalPage current="/privacy" title="Privacy policy" intro="The short version: your document answers stay on your device, and we collect as little as we can.">
      <h2>Your document answers</h2>
      <p>
        The answers you type into a document are saved <strong>only in your own browser</strong> (local storage), so you can
        leave and come back. They are not sent to us while you fill in the form. When you download, your answers are sent to
        our server once to create the PDF; the PDF is created in memory, sent back to you, and not stored. We do not keep a
        copy of your answers or your document.
      </p>
      <p>To delete your answers, use &quot;Start over&quot; in the editor or clear your browser&apos;s site data.</p>

      <h2>Payments</h2>
      <p>
        Payments are handled by Stripe, which collects your card details and email address to process the payment and send
        your receipt. We receive the payment status, amount, the document you bought and your email address. We never see
        your full card number. Stripe&apos;s use of your data is covered by the{" "}
        <a href="https://stripe.com/privacy" rel="noopener noreferrer" target="_blank">
          Stripe privacy policy
        </a>
        .
      </p>

      <h2>Analytics</h2>
      <p>
        We may use privacy-friendly, cookie-free analytics to count page visits and key steps (for example how many people
        start or finish a document). These events never include your document answers.
      </p>

      <h2>Cookies</h2>
      <p>We don&apos;t use advertising or tracking cookies. Local storage is used only for your draft and purchase reference.</p>

      <h2>What we keep and for how long</h2>
      <ul>
        <li>Payment records: as long as required for accounting and tax law (typically 5 to 7 years).</li>
        <li>Emails you send us: as long as needed to help you, then deleted.</li>
        <li>Server logs (IP address, browser type): up to 30 days, for security.</li>
      </ul>

      <h2>Your rights</h2>
      <p>
        Depending on where you live (for example under the GDPR or CCPA) you can ask to see, correct or delete personal data
        we hold about you, and object to how we use it. We don&apos;t sell personal data. Email{" "}
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> and we&apos;ll respond within 30 days.
      </p>

      <h2>Who is responsible</h2>
      <p>
        {SITE.company}, {SITE.companyAddress}, is responsible for your personal data on {SITE.name}.
      </p>
    </LegalPage>
  );
}
