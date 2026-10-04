import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export function TermsUS() {
  return (
    <LegalPage current="/terms" title="Terms of service" intro={`The rules for using ${SITE.name}, written to be read.`}>
      <h2>1. Who we are</h2>
      <p>
        {SITE.name} is operated by {SITE.company}, {SITE.companyAddress} (&quot;we&quot;, &quot;us&quot;). By using this website
        you agree to these terms. If you don&apos;t agree, please don&apos;t use the site.
      </p>

      <h2>2. What we provide</h2>
      <p>
        We provide self-help legal document templates. You answer questions, and our software fills your answers into a
        template you can download as a PDF. <strong>We are not a law firm and we don&apos;t give legal advice.</strong> No
        attorney reviews your answers or your document, and using the site does not create an attorney-client relationship.
        See our <Link href="/disclaimer">legal disclaimer</Link>.
      </p>

      <h2>3. Prices and payment</h2>
      <ul>
        <li>Each document is a single, one-time purchase at the price shown on the document page before you start.</li>
        <li>There are no subscriptions, free trials that convert, or recurring charges of any kind.</li>
        <li>Prices are in US dollars and include any fees we charge. Your bank may add its own currency or card fees.</li>
        <li>Payments are processed by Stripe. We never see or store your full card number.</li>
      </ul>

      <h2>4. What you get</h2>
      <p>
        After payment you can download your document as a PDF. For {SITE.editDays} days after purchase you can change your
        answers and download the same document again at no extra cost, from the same browser. The documents you download are
        yours to keep and use for your own personal or business purposes.
      </p>

      <h2>5. Refunds</h2>
      <p>
        If you&apos;re not satisfied, email us within {SITE.refundDays} days of purchase for a full refund. Details are in
        our <Link href="/refunds">refund policy</Link>.
      </p>

      <h2>6. Your responsibilities</h2>
      <ul>
        <li>You are responsible for the answers you give and for checking that the document fits your situation.</li>
        <li>You must have the right to enter into the agreement you create, and the information about other parties must be accurate.</li>
        <li>You may not resell, republish or redistribute our templates themselves, or use the site to build a competing template library.</li>
        <li>You may not misuse the site, for example by attempting to bypass payment, overload the service or access other people&apos;s data.</li>
      </ul>

      <h2>7. Our content</h2>
      <p>
        The website, software and template wording belong to us. Buying a document gives you a license to use the completed
        document; it does not transfer ownership of the underlying template.
      </p>

      <h2>8. No warranty</h2>
      <p>
        We work hard to keep our templates accurate and up to date, but laws change and differ by state. The site and the
        documents are provided &quot;as is&quot;, without warranties of any kind, including that a document is suitable for
        your purpose or enforceable in your jurisdiction.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law: (a) we are not liable for any indirect, incidental, special, consequential
        or punitive damages, or for lost profits, lost deposits, unpaid rent or loans, legal fees, or any loss arising from
        how a document is used, interpreted or enforced; and (b) <strong>our total liability for all claims relating to a
        document is limited to the amount you paid for that document</strong>. Some places don&apos;t allow these limits,
        so parts of them may not apply to you.
      </p>
      <p>
        You agree that you chose the document and every answer in it yourself, that we did not advise you, and that you
        will not hold us responsible for the legal effect of a document you created.
      </p>

      <h2>10. Changes and governing law</h2>
      <p>
        We may update these terms; the date at the top shows the latest version, and the terms in force when you bought a
        document apply to that purchase. These terms are governed by the laws of the place where {SITE.company} is
        established, unless the law where you live gives you stronger protection.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions? Email <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.
      </p>
    </LegalPage>
  );
}
