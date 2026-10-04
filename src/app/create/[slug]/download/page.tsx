import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTemplate, getTemplates } from "@/content";
import { DownloadClient } from "@/components/DownloadClient";
import { SiteHeader } from "@/components/SiteHeader";
import { t } from "@/i18n";

export function generateStaticParams() {
  return getTemplates().map((t) => ({ slug: t.slug }));
}

export const metadata: Metadata = { title: t.meta.readyTitle, robots: { index: false } };

export default async function DownloadPage(props: PageProps<"/create/[slug]/download">) {
  const { slug } = await props.params;
  if (!getTemplate(slug)) notFound();
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<div className="mx-auto mt-24 h-40 max-w-xl animate-pulse rounded-2xl bg-line/40" />}>
        <DownloadClient slug={slug} />
      </Suspense>
    </>
  );
}
