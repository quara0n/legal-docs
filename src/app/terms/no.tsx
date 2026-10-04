import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export function TermsNO() {
  return (
    <LegalPage current="/terms" title="Vilkår" intro={`Reglene for bruk av ${SITE.name}, skrevet for å bli lest.`}>
      <h2>1. Hvem vi er</h2>
      <p>
        {SITE.name} drives av {SITE.company}
        {SITE.companyId && <> (org.nr. {SITE.companyId})</>}, {SITE.companyAddress} («vi», «oss»). Du når oss på{" "}
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>. Ved å bruke nettstedet godtar du disse vilkårene.
      </p>

      <h2>2. Hva vi tilbyr</h2>
      <p>
        Vi tilbyr selvbetjente maler for juridiske dokumenter. Du svarer på spørsmål, og programmet fyller svarene dine inn i
        en mal som du kan laste ned som PDF. <strong>Vi er ikke et advokatfirma og gir ikke juridisk rådgivning.</strong>{" "}
        Ingen advokat ser over svarene eller dokumentet ditt, og bruk av nettstedet gjør deg ikke til klient hos oss. Les
        også <Link href="/disclaimer">ansvarsfraskrivelsen</Link>.
      </p>

      <h2>3. Priser og betaling</h2>
      <ul>
        <li>Hvert dokument er ett enkelt kjøp, til prisen som står på dokumentsiden før du begynner.</li>
        <li>Prisen er i norske kroner og er totalprisen. Det kommer ingen gebyrer eller tillegg fra oss.</li>
        <li>Det finnes ingen abonnement, prøveperioder som går over til betaling, eller gjentakende trekk.</li>
        <li>Betalingen håndteres av Stripe. Vi ser aldri og lagrer aldri hele kortnummeret ditt.</li>
      </ul>

      <h2>4. Levering</h2>
      <p>
        Du får laste ned dokumentet som PDF med en gang betalingen er gjennomført. I {SITE.editDays} dager etter kjøpet kan du
        endre svarene og laste ned det samme dokumentet på nytt uten ekstra kostnad, fra samme nettleser. Dokumentene du laster
        ned, er dine og kan brukes til egne private eller forretningsmessige formål.
      </p>

      <h2>5. Angrerett og pengene tilbake</h2>
      <p>
        Ved kjøp på nett har du normalt 14 dagers angrerett etter angrerettloven. For digitalt innhold som leveres med en gang,
        kan angreretten falle bort når nedlastingen starter. <strong>Vi gir deg likevel pengene tilbake hvis du angrer innen{" "}
        {SITE.refundDays} dager, også etter at du har lastet ned dokumentet.</strong> Se{" "}
        <Link href="/refunds">angrerett og refusjon</Link>, der du også finner angreskjema.
      </p>

      <h2>6. Ditt ansvar</h2>
      <ul>
        <li>Du er ansvarlig for svarene du gir, og for å sjekke at dokumentet passer til din situasjon.</li>
        <li>Du må ha rett til å inngå avtalen du lager, og opplysningene om de andre partene må være riktige.</li>
        <li>Du kan ikke selge videre, publisere eller dele selve malene, eller bruke nettstedet til å bygge et konkurrerende malbibliotek.</li>
        <li>Du kan ikke misbruke nettstedet, for eksempel ved å omgå betalingen, overbelaste tjenesten eller forsøke å få tilgang til andres data.</li>
      </ul>

      <h2>7. Rettigheter til innholdet</h2>
      <p>
        Nettstedet, programvaren og teksten i malene tilhører oss. Når du kjøper et dokument, får du rett til å bruke det
        ferdige dokumentet. Du får ikke eiendomsretten til selve malen.
      </p>

      <h2>8. Feil og reklamasjon</h2>
      <p>
        Vi jobber for at malene skal være riktige og oppdaterte, men lover endres, og en mal kan ikke dekke alle situasjoner.
        Er det feil ved dokumentet, for eksempel at PDF-en ikke virker eller at innholdet ikke er som beskrevet, kan du klage
        til oss innen rimelig tid. Du har de rettighetene som følger av forbrukerlovgivningen, blant annet digitalytelsesloven.
      </p>

      <h2>9. Ansvarsbegrensning</h2>
      <p>
        Så langt loven tillater: (a) er vi ikke ansvarlige for indirekte tap, som tapt fortjeneste, tapt depositum, ubetalt
        leie eller lån, advokatutgifter, eller tap som skyldes hvordan et dokument blir brukt, tolket eller håndhevet; og (b){" "}
        <strong>er vårt samlede ansvar for et dokument begrenset til det du betalte for dokumentet</strong>. Begrensningene
        gjelder ikke hvis vi har opptrådt grovt uaktsomt eller forsettlig, eller der ufravikelige regler i forbrukerlovgivningen
        sier noe annet.
      </p>
      <p>
        Du bekrefter at du selv har valgt dokumentet og alle svarene i det, og at vi ikke har gitt deg råd om din situasjon.
      </p>

      <h2>10. Endringer, lovvalg og tvister</h2>
      <p>
        Vi kan endre vilkårene. Datoen øverst viser gjeldende versjon, og vilkårene som gjaldt da du kjøpte et dokument,
        gjelder for det kjøpet. Vilkårene er underlagt norsk rett. Har du en klage, ta kontakt med oss først. Får vi ikke
        løst saken, kan du som forbruker få hjelp av Forbrukerrådet. Tvister kan ellers bringes inn for forliksrådet og de
        alminnelige domstolene, og som forbruker kan du alltid bruke domstolen der du bor.
      </p>

      <h2>11. Kontakt</h2>
      <p>
        Spørsmål? Send en e-post til <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.
      </p>
    </LegalPage>
  );
}
