import Link from "next/link";
import { getTemplates } from "@/content";
import { SITE } from "@/lib/site";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-cream/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Simple legal documents at one honest price. Pay once per document, keep it forever. No subscription, no
            account, no surprises.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Documents</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            {getTemplates().map((t) => (
              <li key={t.slug}>
                <Link href={`/documents/${t.slug}`} className="hover:text-ink">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">{SITE.name}</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><Link href="/#pricing" className="hover:text-ink">Pricing</Link></li>
            <li><Link href="/legal" className="hover:text-ink">Terms &amp; privacy</Link></li>
            <li><Link href="/legal#disclaimer" className="hover:text-ink">Not legal advice</Link></li>
            <li><a href={`mailto:${SITE.supportEmail}`} className="hover:text-ink">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs leading-relaxed text-muted sm:px-6">
          {SITE.name} is not a law firm and does not provide legal advice. Our templates are general documents that
          you complete yourself. For advice about your specific situation, talk to a licensed attorney in your state.
        </p>
      </div>
    </footer>
  );
}
