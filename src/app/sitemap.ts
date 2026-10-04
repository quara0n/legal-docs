import type { MetadataRoute } from "next";
import { getTemplates } from "@/content";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/documents`, changeFrequency: "weekly", priority: 0.8 },
    ...getTemplates().map((t) => ({ url: `${SITE.url}/documents/${t.slug}`, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: `${SITE.url}/legal`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
