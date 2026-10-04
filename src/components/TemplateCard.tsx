import Link from "next/link";
import { formatPrice, type Template } from "@/lib/doc";
import { Icon } from "./Icon";

export function TemplateCard({ t }: { t: Template }) {
  return (
    <Link
      href={`/documents/${t.slug}`}
      className="group flex flex-col rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-[0_18px_40px_-20px_rgba(20,23,31,0.3)]"
    >
      <div className="flex items-start justify-between">
        <span className="grid size-11 place-items-center rounded-xl bg-brand-soft text-brand">
          <Icon name={t.icon} className="size-5.5" />
        </span>
        <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-ink-soft">{t.category}</span>
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">{t.name}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-soft">{t.tagline}</p>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
        <span>
          <span className="font-semibold">{formatPrice(t.price)}</span>
          <span className="text-muted"> once · ~{t.minutes} min</span>
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-brand">
          Start <Icon name="arrowRight" className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
