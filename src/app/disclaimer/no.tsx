import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export function DisclaimerNO() {
  return (
    <LegalPage current="/disclaimer" title="Ansvarsfraskrivelse" intro={`${SITE.name} er et selvbetjent verktøy, ikke et advokatfirma.`}>
      <p>
        {SITE.name} tilbyr generelle maler for juridiske dokumenter som du fyller ut selv. Vi gir ikke juridisk rådgivning,
        anbefaler ikke hvilket dokument eller hvilke valg som passer for deg, og ser ikke over svarene dine. Ingenting på
        nettstedet erstatter råd fra en advokat.
      </p>
      <h2>Malene er generelle</h2>
      <p>
        Malene er laget for vanlige situasjoner etter norsk rett. Lover endres, og enkelte situasjoner krever egne vilkår,
        skjema eller formkrav. Eksempler er fremtidsfullmakt, salg eller pantsettelse av fast eiendom, arv og ektepakt, og
        avtaler der en næringsdrivende selger til en forbruker. Du er selv ansvarlig for å sjekke kravene som gjelder for deg.
      </p>
      <h2>Når bør du snakke med en advokat?</h2>
      <ul>
        <li>Avtalen gjelder store verdier, eller er uvanlig.</li>
        <li>Den andre parten har advokat, eller er uenig i vilkårene.</li>
        <li>Det har allerede oppstått en tvist.</li>
        <li>Du er usikker på om dokumentet passer til din situasjon.</li>
      </ul>
      <p>
        Mange advokater tilbyr gjennomgang av et ferdig utkast til fastpris, og det er ofte mye billigere enn å få dokumentet
        skrevet fra bunnen av. Har du lav inntekt, kan du ha rett til fri rettshjelp, og flere studentdrevne rettshjelpstiltak
        gir gratis hjelp.
      </p>
    </LegalPage>
  );
}
