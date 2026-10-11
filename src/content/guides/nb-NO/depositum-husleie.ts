import type { Guide } from "../types";

export const depositumHusleie: Guide = {
  slug: "depositum-husleie",
  keyword: "depositum husleie",
  template: "husleiekontrakt",
  title: "Depositum husleie: hvor mye, hvilken konto og når du får det",
  description:
    "Hvor stort depositum kan utleier kreve, hvem betaler kontoen, og hvordan får du pengene tilbake? Reglene for depositum ved leie av bolig, forklart enkelt.",
  linkText: "Depositum ved leie av bolig",
  h1: "Depositum ved leie av bolig: regler for utleier og leietaker",
  lead:
    "Nesten alle utleiere ber om depositum, og nesten alle krangler om leieforhold handler om det når leietaker flytter ut. Her ser du hvor mye som kan kreves, hvordan pengene skal oppbevares, og hvordan dere gjør oppgjøret på slutten uten unødvendig strid.",
  cta: "Lag husleiekontrakt med depositum eller garanti, skrevet etter husleieloven. Se hele kontrakten gratis før du betaler.",
  published: "2026-10-11",
  updated: "2026-10-11",
  sections: [
    {
      h2: "Hva er depositum?",
      body: [
        "Depositum er en sikkerhet for utleier. Hvis leietaker ikke betaler leien, ødelegger noe i boligen eller ikke rydder og vasker ved utflytting, kan utleier få dekket kravet sitt av depositumet. Det er ikke en betaling til utleier, og pengene tilhører leietaker så lenge det ikke er noe krav å dekke.",
        "Husleieloven § 3-5 regulerer depositum ved leie av bolig. Reglene er ufravikelige til fordel for leietaker, så en kontrakt kan ikke gi leietaker dårligere vilkår enn loven.",
      ],
    },
    {
      h2: "Hvor stort depositum kan utleier kreve?",
      body: [
        "Sikkerheten kan være på inntil seks måneders leie. Er leien 12 000 kr i måneden, kan depositumet altså være på inntil 72 000 kr. Det vanligste i praksis er tre måneders leie.",
        "Taket gjelder samlet sikkerhet. Utleier kan ikke kreve både seks måneders depositum og en garanti i tillegg. Avtales det for mye, kan leietaker kreve det overskytende tilbake.",
      ],
    },
    {
      h2: "Depositumskonto: slik skal pengene oppbevares",
      body: [
        "Et depositum i penger skal settes inn på en egen konto i leietakers navn, en depositumskonto. Det er ikke lov å la depositumet stå på utleiers vanlige konto, og heller ikke å betale det kontant til utleier.",
        {
          list: [
            "Kontoen opprettes i en bank, i leietakers navn.",
            "Utleier betaler kostnadene ved å opprette kontoen.",
            "Renter tilfaller leietaker.",
            "Verken utleier eller leietaker kan ta ut pengene alene mens leieforholdet varer.",
          ],
        },
        "De fleste banker har ferdige løsninger der utleier bestiller kontoen og leietaker signerer med BankID. Det tar som regel noen minutter.",
      ],
    },
    {
      h2: "Garanti i stedet for depositum",
      body: [
        "Mange leietakere har ikke flere måneders leie på bok. I stedet for depositum kan partene avtale en garanti, for eksempel fra NAV, fra en kommersiell garantitilbyder eller fra en privatperson.",
        "Les vilkårene i garantien nøye. Noen garantier dekker bare husleie, ikke skader på boligen, og mange har frister for når utleier må melde krav. Det bør stå i husleiekontrakten hvilken type sikkerhet som er avtalt, og hvor stort beløpet er.",
      ],
    },
    {
      h2: "Når leietaker flytter ut",
      body: [
        "Gå gjennom boligen sammen når leietaker flytter ut, og skriv ned hva dere ser. En overtakelsesprotokoll fra innflyttingen, med bilder, gjør det mye enklere å skille vanlig slitasje fra skader. Vanlig slitasje etter normal bruk kan ikke trekkes fra depositumet.",
        "Er dere enige om oppgjøret, signerer begge på at banken kan utbetale depositumet, helt eller delvis til hver av dere. Det er den enkleste og vanligste løsningen.",
        "Er dere uenige, kan utleier sette fram et skriftlig krav. Banken kan da utbetale beløpet til utleier hvis leietaker ikke har tatt saken videre til forliksrådet eller Husleietvistutvalget innen fem uker etter at kravet ble mottatt. Leietaker som er uenig i et krav, bør derfor svare skriftlig og ikke la fristen gå ut.",
      ],
    },
    {
      h2: "Tips for å unngå krangel",
      body: [
        {
          list: [
            "Skriv beløp og type sikkerhet i husleiekontrakten.",
            "Ta bilder av hvert rom ved innflytting og legg dem ved protokollen.",
            "Avtal hva som skal være gjort ved utflytting, for eksempel vask og maling.",
            "Gjør opp så snart som mulig etter at leietaker har flyttet.",
          ],
        },
        "Denne guiden er generell informasjon og ikke juridisk rådgivning om din situasjon. Ved uenighet kan Husleietvistutvalget, forliksrådet eller en advokat hjelpe.",
      ],
    },
  ],
  faq: [
    {
      q: "Hvor mye depositum kan utleier kreve?",
      a: "Inntil seks måneders leie. Det vanligste er tre måneder.",
    },
    {
      q: "Hvem betaler for depositumskontoen?",
      a: "Utleier betaler kostnadene ved å opprette depositumskontoen. Rentene på kontoen tilfaller leietaker.",
    },
    {
      q: "Kan jeg betale depositum direkte til utleier?",
      a: "Nei. Depositum i penger skal stå på en egen konto i leietakers navn, som ingen av partene kan disponere alene mens leieforholdet varer.",
    },
    {
      q: "Kan utleier trekke for vanlig slitasje?",
      a: "Nei. Leietaker svarer ikke for vanlig slitasje etter normal bruk, bare for skader og mangler utover det, og for ubetalt leie.",
    },
    {
      q: "Hva skjer hvis utleier og leietaker er uenige om depositumet?",
      a: "Utleier kan sette fram et skriftlig krav. Tar ikke leietaker saken til forliksrådet eller Husleietvistutvalget innen fem uker, kan banken utbetale beløpet til utleier.",
    },
  ],
  related: ["husleiekontrakt-mal", "oppsigelse-leiekontrakt"],
};
