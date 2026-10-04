import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}: Legal documents, one honest price`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Create NDAs, leases, bills of sale, contracts and powers of attorney in minutes. Preview free, pay once per document. No subscription, no account.",
  openGraph: { siteName: SITE.name, type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
