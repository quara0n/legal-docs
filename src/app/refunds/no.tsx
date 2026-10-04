import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export function RefundsNO() {
  return (
    <LegalPage
      current="/refunds"
      title="Angrerett og refusjon"
      intro={`Ikke fornøyd? Du får pengene tilbake. ${SITE.refundDays} dager, ingen spørsmål.`}
    >
      <h2>Slik får du pengene tilbake</h2>
      <ul>
        <li>
          Send en e-post til <a href={`mailto:${SITE.supportEmail}?subject=Angrer%20kj%C3%B8p`}>{SITE.supportEmail}</a> innen{" "}
          {SITE.refundDays} dager etter kjøpet. Det holder å skrive at du angrer. Du kan også bruke angreskjemaet nedenfor.
        </li>
        <li>Oppgi e-postadressen du betalte med, eller legg ved kvitteringen fra Stripe.</li>
        <li>
          Vi betaler tilbake hele beløpet til samme betalingsmåte, senest innen 14 dager og vanligvis innen én virkedag. Det kan
          ta noen dager før banken viser beløpet.
        </li>
      </ul>

      <h2>Angrerett for digitalt innhold</h2>
      <p>
        Etter angrerettloven har du normalt 14 dagers angrerett ved kjøp på nett. For digitalt innhold som du laster ned med en
        gang, kan angreretten falle bort når leveringen starter. Vi praktiserer likevel full angrerett i {SITE.refundDays}{" "}
        dager, også etter at du har lastet ned dokumentet. Du trenger ikke å oppgi noen grunn.
      </p>

      <h2>Ingen abonnement, ingenting å si opp</h2>
      <p>
        Hvert kjøp er én betaling. Du blir aldri belastet igjen uten at du kjøper et nytt dokument, så det er ingenting å si opp.
      </p>

      <h2>Belastet to ganger eller ved en feil?</h2>
      <p>Send oss en e-post, så betaler vi tilbake dobbelt- eller feilbelastninger med en gang, uansett dato.</p>

      <h2>Angreskjema</h2>
      <p>Fyll ut og send skjemaet bare hvis du vil gå fra avtalen. Du kan også skrive med egne ord.</p>
      <div className="rounded-xl border border-line bg-white p-5 text-[15px]">
        <p>
          Til: {SITE.company}, {SITE.companyAddress}, {SITE.supportEmail}
        </p>
        <p>Jeg underretter herved om at jeg ønsker å gå fra min avtale om kjøp av følgende digitale innhold:</p>
        <p>Dokument: ________________________________</p>
        <p>Kjøpt den: ____________</p>
        <p>Navn: ________________________________</p>
        <p>Adresse: ________________________________</p>
        <p>E-post brukt ved kjøpet: ________________________________</p>
        <p>Dato: ____________</p>
        <p className="mb-0">Underskrift (bare hvis skjemaet sendes på papir): ________________________</p>
      </div>
    </LegalPage>
  );
}
