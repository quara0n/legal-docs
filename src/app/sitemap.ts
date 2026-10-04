import type { MetadataRoute } from "next";
import { getTemplates } from "@/content";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/documents`, changeFrequency: "weekly", priority: 0.8 },
    ...getTemplates().map((t) => ({ url: `${SITE.url}/documents/${t.slug}`, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...["terms", "privacy", "refunds", "disclaimer"].map((p) => ({ url: `${SITE.url}/${p}`, changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
