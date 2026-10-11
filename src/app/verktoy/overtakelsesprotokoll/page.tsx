import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContractCta } from "@/components/ContractCta";
import { ProtocolForm } from "@/components/ProtocolForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { t as tr } from "@/i18n";
import { LANG, MARKET } from "@/lib/market";
import { SITE } from "@/lib/site";

const PATH = "/verktoy/overtakelsesprotokoll";
const TITLE = "Overtakelsesprotokoll for bolig: gratis mal som PDF";
const DESCRIPTION =
  "Fyll ut overtakelsesprotokoll ved inn- eller utflytting rom for rom, med strøm, nøkler og røykvarsler. Last ned som PDF gratis, uten registrering.";

export async function generateMetadata(): Promise<Metadata> {
  if (MARKET !== "no") return {};
  return {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    alternates: { canonical: PATH },
    openGraph: { title: TITLE, description: DESCRIPTION },
  };
}

const faq = [
  {
    q: "Hva er en overtakelsesprotokoll?",
    a: "Et skjema der utleier og leietaker skriver ned tilstanden i boligen når leietaker flytter inn eller ut. Begge signerer, slik at det senere er enkelt å se hva som var der fra før.",
  },
  {
    q: "Er overtakelsesprotokoll påkrevd?",
    a: "Nei, men den gjør oppgjøret av depositumet mye enklere. Uten protokoll er det ofte ord mot ord om en skade var der fra før eller kom i leietiden.",
  },
  {
    q: "Bør jeg ta bilder?",
    a: "Ja. Ta bilder av hvert rom og av skader du skriver ned, og ta vare på dem sammen med protokollen. Bilder med dato er det beste beviset.",
  },
  {
    q: "Kan utleier trekke for vanlig slitasje?",
    a: "Nei. Leietaker svarer for skader utover vanlig slitasje etter normal bruk, ikke for at boligen har blitt brukt.",
  },
];

export default function OvertakelsesprotokollPage() {
  if (MARKET !== "no") notFound();
  const url = `${SITE.url}${PATH}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Overtakelsesprotokoll for bolig",
        url,
        description: DESCRIPTION,
        inLanguage: LANG,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "NOK" },
        publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-sm font-medium text-brand">Gratis verktøy</p>
        <h1 className="mt-2 font-serif text-[34px] leading-[1.08] break-words font-medium tracking-tight text-ink sm:text-5xl">Overtakelsesprotokoll for bolig</h1>
        <p className="mt-5 text-lg text-ink-soft">
          Gå gjennom boligen rom for rom ved inn- eller utflytting, og last ned en ferdig protokoll som begge signerer. Gratis, uten konto.
        </p>

        <div className="mt-10">
          <ProtocolForm />
        </div>

        <article className="mt-14 leading-relaxed text-ink-soft [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-ink [&_li]:mb-2 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-5 [&_p]:mb-5">
          <h2>Slik bruker du protokollen</h2>
          <ul>
            <li>Gå gjennom boligen sammen, utleier og leietaker, samme dag som nøklene overleveres.</li>
            <li>Skriv ned alt dere ser av skader og slitasje, rom for rom, og ta bilder.</li>
            <li>Les av strømmåleren og noter hvor mange nøkler som overleveres.</li>
            <li>Signer begge, og ta en kopi hver.</li>
            <li>Bruk den samme protokollen ved utflytting, så ser dere hva som har endret seg.</li>
          </ul>

          <h2>Vanlige spørsmål</h2>
          <div className="divide-y divide-line rounded-2xl border border-line bg-white">
            {faq.map((f) => (
              <div key={f.q} className="p-6">
                <h3 className="font-semibold text-ink">{f.q}</h3>
                <p className="mt-2 mb-0!">{f.a}</p>
              </div>
            ))}
          </div>
        </article>

        <ContractCta
          slug="husleiekontrakt"
          title="Trenger du kontrakten også?"
          text="Lag husleiekontrakt med depositum, leietid og regler for inn- og utflytting etter husleieloven. Se hele kontrakten gratis før du betaler."
        />
        <p className="text-xs text-muted">{tr.footer.legal}</p>
      </main>
      <SiteFooter />
    </>
  );
}
