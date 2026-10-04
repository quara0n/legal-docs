import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Terms, privacy and disclaimer" };

export default function LegalPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-4 py-16 leading-relaxed text-ink-soft sm:px-6 [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-ink [&_p]:mb-4">
        <h1 className="font-serif text-5xl font-medium tracking-tight text-ink">Terms, privacy and disclaimer</h1>
        <p className="mt-4 text-sm text-muted">Plain-language version. Replace with your final terms before launch.</p>

        <h2 id="disclaimer">Not legal advice</h2>
        <p>
          {SITE.name} is not a law firm, and using this site does not create an attorney-client relationship. We provide
          self-help document templates that you complete yourself. We don&apos;t review your answers or tell you which
          document or option is right for you. Laws vary by state and change over time. For advice about your situation,
          consult a licensed attorney.
        </p>

        <h2 id="pricing">Pricing and refunds</h2>
        <p>
          Each document is a single one-time purchase at the price shown before you start. There are no subscriptions,
          trials or recurring charges. After purchase you can edit and re-download the same document for {SITE.editDays}{" "}
          days. If you&apos;re not satisfied, email {SITE.supportEmail} within 14 days for a full refund.
        </p>

        <h2 id="privacy">Privacy</h2>
        <p>
          The answers you type are saved only in your own browser (local storage) so you can come back to them. When you
          download, your answers are sent to our server once to generate the PDF, and are not stored. Payments are handled
          by Stripe; we receive your email address and payment status, never your card number. We use no advertising
          trackers on the document editor.
        </p>

        <h2 id="terms">Using the site</h2>
        <p>
          You may use the documents you buy for your own personal or business purposes. You may not resell the templates
          themselves. The site is provided &quot;as is&quot;, and our total liability is limited to the amount you paid
          for the document.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
