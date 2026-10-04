import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTemplate, getTemplates } from "@/content";
import { Wizard } from "@/components/Wizard";

export function generateStaticParams() {
  return getTemplates().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: PageProps<"/create/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const t = getTemplate(slug);
  return { title: t ? `Create your ${t.name}` : "Create", robots: { index: false } };
}

export default async function CreatePage(props: PageProps<"/create/[slug]">) {
  const { slug } = await props.params;
  if (!getTemplate(slug)) notFound();
  return <Wizard slug={slug} />;
}
