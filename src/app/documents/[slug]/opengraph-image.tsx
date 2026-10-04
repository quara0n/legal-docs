import { getTemplate, getTemplates } from "@/content";
import { formatPrice } from "@/lib/doc";
import { t as tr } from "@/i18n";
import { LANG } from "@/lib/market";
import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = tr.meta.docOgAlt;

export function generateStaticParams() {
  return getTemplates().map((t) => ({ slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const t = getTemplate((await params).slug);
  return ogImage({
    eyebrow: t ? tr.meta.docOgEyebrow(formatPrice(t.price, LANG)) : "",
    title: t ? tr.meta.docOgTitle(t.name) : tr.meta.ogTitle,
    footer: t ? tr.meta.docOgFooter(t.minutes) : "",
  });
}
