import Link from "next/link";
import { getTemplate } from "@/content";
import { formatPrice } from "@/lib/doc";
import { t as tr } from "@/i18n";
import { LANG } from "@/lib/market";
import { Icon } from "./Icon";

/** Box that sends readers of a free tool to the matching paid template. */
export function ContractCta({ slug, title, text }: { slug: string; title: string; text: string }) {
  const t = getTemplate(slug);
  if (!t) return null;
  return (
    <aside className="my-12 rounded-2xl border border-line bg-white p-6 shadow-[0_18px_40px_-28px_rgba(20,23,31,0.35)]">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
          <Icon name={t.icon} className="size-5.5" />
        </span>
        <div>
          <p className="font-serif text-2xl font-medium text-ink">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{text}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
        <p className="text-ink">
          <span className="font-serif text-3xl font-medium">{formatPrice(t.price, LANG)}</span>{" "}
          <span className="text-sm text-muted">{tr.doc.oneTime}</span>
        </p>
        <Link
          href={`/documents/${t.slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-sm hover:bg-brand-dark"
        >
          Lag {t.shortName.toLowerCase()} <Icon name="arrowRight" className="size-4" />
        </Link>
      </div>
    </aside>
  );
}
