import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import Script from "next/script";
import { CookieBanner } from "@/components/CookieBanner";
import { t } from "@/i18n";
import { ADS_ID, consentBootstrap } from "@/lib/ads";
import { HTML_LANG } from "@/lib/market";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: t.meta.title,
    template: `%s | ${SITE.name}`,
  },
  description: t.meta.description,
  openGraph: { siteName: SITE.name, type: "website", locale: HTML_LANG === "nb" ? "nb_NO" : "en_US" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={HTML_LANG} className={`${inter.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                { "@type": "Organization", name: SITE.name, url: SITE.url, email: SITE.supportEmail, logo: `${SITE.url}/icon.svg` },
                { "@type": "WebSite", name: SITE.name, url: SITE.url },
              ],
            }),
          }}
        />
        {children}
        {ADS_ID && (
          <>
            {/* Consent Mode v2: everything denied until the visitor accepts. */}
            <Script id="consent-default" strategy="beforeInteractive">
              {consentBootstrap(ADS_ID)}
            </Script>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`} strategy="afterInteractive" />
            <CookieBanner />
          </>
        )}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
