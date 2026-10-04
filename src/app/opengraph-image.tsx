import { t } from "@/i18n";
import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = t.meta.ogAlt;

export default function Image() {
  return ogImage({ eyebrow: t.meta.ogEyebrow, title: t.meta.ogTitle, footer: t.meta.ogFooter });
}
