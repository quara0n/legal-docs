import { getTemplate, getTemplates } from "@/content";
import { formatPrice } from "@/lib/doc";
import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Document template";

export function generateStaticParams() {
  return getTemplates().map((t) => ({ slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const t = getTemplate((await params).slug);
  return ogImage({
    eyebrow: t ? `${formatPrice(t.price)} once · no subscription` : "",
    title: t ? `${t.name} template` : "Legal documents",
    footer: t ? `Ready in about ${t.minutes} minutes · free preview` : "",
  });
}
