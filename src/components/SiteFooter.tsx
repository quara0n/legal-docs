import Link from "next/link";
import { getTemplates } from "@/content";
import { getGuides } from "@/content/guides";
import { t } from "@/i18n";
import { SITE } from "@/lib/site";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-cream/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t.footer.blurb}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">{t.footer.documents}</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            {getTemplates().map((d) => (
              <li key={d.slug}>
                <Link href={`/documents/${d.slug}`} className="hover:text-ink">
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">{SITE.name}</h3>
          {SITE.slogan && <p className="mt-1 text-sm text-muted">{SITE.slogan}</p>}
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><Link href="/#pricing" className="hover:text-ink">{t.footer.pricing}</Link></li>
            {getGuides().length > 0 && <li><Link href="/guide" className="hover:text-ink">{t.footer.guides}</Link></li>}
            <li><Link href="/terms" className="hover:text-ink">{t.footer.terms}</Link></li>
            <li><Link href="/privacy" className="hover:text-ink">{t.footer.privacy}</Link></li>
            <li><Link href="/refunds" className="hover:text-ink">{t.footer.refunds}</Link></li>
            <li><Link href="/disclaimer" className="hover:text-ink">{t.footer.disclaimer}</Link></li>
            <li><a href={`mailto:${SITE.supportEmail}`} className="hover:text-ink">{t.footer.contact}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs leading-relaxed text-muted sm:px-6">
          {t.footer.legal}
          {SITE.company && !SITE.company.startsWith("[") && (
            <>
              {" "}
              {SITE.company}
              {SITE.companyId && `, org.nr. ${SITE.companyId}`}
              {SITE.companyAddress && !SITE.companyAddress.startsWith("[") && `, ${SITE.companyAddress}`}.
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
