import type { MetadataRoute } from "next";
import { getTemplates } from "@/content";
import { getGuides } from "@/content/guides";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/documents`, changeFrequency: "weekly", priority: 0.8 },
    ...getTemplates().map((t) => ({ url: `${SITE.url}/documents/${t.slug}`, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...(getGuides().length > 0 ? [{ url: `${SITE.url}/guide`, changeFrequency: "weekly" as const, priority: 0.7 }] : []),
    ...getGuides().map((g) => ({ url: `${SITE.url}/guide/${g.slug}`, lastModified: g.updated, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...["terms", "privacy", "refunds", "disclaimer"].map((p) => ({ url: `${SITE.url}/${p}`, changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
