import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export function PrivacyNO() {
  return (
    <LegalPage current="/privacy" title="Personvern" intro="Kort fortalt: svarene i dokumentet blir på enheten din, og vi samler inn så lite som mulig.">
      <h2>Hvem er ansvarlig</h2>
      <p>
        {SITE.company}
        {SITE.companyId && <> (org.nr. {SITE.companyId})</>}, {SITE.companyAddress}, er behandlingsansvarlig for
        personopplysningene dine på {SITE.name}. Kontakt oss på <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.
      </p>

      <h2>Svarene i dokumentet</h2>
      <p>
        Svarene du skriver inn, lagres <strong>bare i din egen nettleser</strong> (local storage), slik at du kan gå fra og
        komme tilbake. De sendes ikke til oss mens du fyller ut. Når du laster ned, sendes svarene én gang til serveren vår for
        å lage PDF-en. PDF-en lages i minnet, sendes tilbake til deg og lagres ikke. Vi har ingen kopi av svarene eller
        dokumentet ditt.
      </p>
      <p>Du sletter svarene med «Start på nytt» i skjemaet, eller ved å slette nettstedsdata i nettleseren.</p>

      <h2>Betaling</h2>
      <p>
        Betalingen håndteres av Stripe, som behandler kortopplysningene og e-postadressen din for å gjennomføre betalingen og
        sende kvittering. Vi får vite betalingsstatus, beløp, hvilket dokument du kjøpte, og e-postadressen din. Vi ser aldri
        hele kortnummeret. Stripes behandling er beskrevet i{" "}
        <a href="https://stripe.com/no/privacy" rel="noopener noreferrer" target="_blank">
          Stripes personvernerklæring
        </a>
        . Grunnlaget er at behandlingen er nødvendig for å oppfylle kjøpsavtalen (personvernforordningen artikkel 6 nr. 1
        bokstav b).
      </p>

      <h2>Statistikk</h2>
      <p>
        Vi kan bruke personvernvennlig statistikk uten informasjonskapsler (Plausible) for å telle sidevisninger og viktige
        steg, for eksempel hvor mange som starter eller fullfører et dokument. Statistikken inneholder aldri svarene dine, og
        kan ikke brukes til å identifisere deg. Grunnlaget er vår berettigede interesse i å forbedre tjenesten (artikkel 6
        nr. 1 bokstav f).
      </p>

      <h2>Informasjonskapsler</h2>
      <p>
        Vi bruker ikke informasjonskapsler (cookies) til reklame eller sporing. Nettleserens lokale lagring brukes bare til
        utkastet ditt og kjøpsreferansen, som er nødvendig for at tjenesten skal virke. Betalingssiden til Stripe kan sette
        egne nødvendige informasjonskapsler.
      </p>

      <h2>Hvem vi deler med</h2>
      <ul>
        <li>Stripe (betaling)</li>
        <li>Vercel (drift av nettstedet)</li>
        <li>Plausible (anonym statistikk, hvis slått på)</li>
        <li>Leverandøren av e-posten vår, når du skriver til oss</li>
      </ul>
      <p>
        Leverandørene behandler opplysningene på våre vegne etter databehandleravtaler. Noen av dem kan behandle opplysninger
        utenfor EØS, for eksempel i USA. Da skjer det med lovlig overføringsgrunnlag, som EU-kommisjonens standardkontrakter
        eller EU–US Data Privacy Framework. Vi selger aldri personopplysninger.
      </p>

      <h2>Hvor lenge vi lagrer</h2>
      <ul>
        <li>Betalingsopplysninger og regnskapsbilag: så lenge bokføringsloven krever, normalt fem år.</li>
        <li>E-post du sender oss: så lenge vi trenger den for å hjelpe deg, deretter slettes den.</li>
        <li>Serverlogger (IP-adresse, nettlesertype): opptil 30 dager, av sikkerhetshensyn.</li>
      </ul>

      <h2>Dine rettigheter</h2>
      <p>
        Du kan be om innsyn i, retting eller sletting av personopplysninger vi har om deg, be om begrenset behandling, protestere
        mot behandlingen og be om å få utlevert opplysningene (dataportabilitet). Send en e-post til{" "}
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>, så svarer vi innen 30 dager. Mener du at vi behandler
        opplysningene dine i strid med regelverket, kan du klage til Datatilsynet.
      </p>
    </LegalPage>
  );
}
