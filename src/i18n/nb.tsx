import Link from "next/link";
import { SITE } from "@/lib/site";
import type { Dict } from "./en";

// All interface text for the Norwegian site.
export const nb: Dict = {
  meta: {
    title: `${SITE.name}: Avtaler, rett fram. Juridiske dokumenter til én ærlig pris`,
    description:
      "Lag husleiekontrakt, kjøpekontrakt, gjeldsbrev, fullmakt og andre avtaler på få minutter. Se hele dokumentet gratis, betal én gang per dokument. Ingen abonnement.",
    ogAlt: "Juridiske dokumenter til én ærlig pris",
    ogEyebrow: "Avtaler, rett fram.",
    ogTitle: "Juridiske dokumenter til én ærlig pris.",
    ogFooter: "Se gratis · Betal én gang · Behold for alltid",
    docOgAlt: "Dokumentmal",
    docOgEyebrow: (price: string) => `${price} én gang · ingen abonnement`,
    docOgTitle: (name: string) => `${name}: mal`,
    docOgFooter: (min: number) => `Ferdig på ca. ${min} minutter · gratis forhåndsvisning`,
    docsTitle: "Maler for kontrakter og avtaler",
    docsDescription:
      "Husleiekontrakt, fremleiekontrakt, kjøpekontrakt, gjeldsbrev, fullmakt, taushetserklæring og oppdragsavtale. Se gratis, betal én gang per dokument.",
    createTitle: (name: string) => `Lag ${name.toLowerCase()}`,
    readyTitle: "Dokumentet ditt er klart",
  },

  nav: {
    documents: "Dokumenter",
    pricing: "Priser",
    faq: "Spørsmål",
    create: "Lag et dokument",
  },

  footer: {
    blurb: "Enkle juridiske dokumenter til én ærlig pris. Betal én gang per dokument og behold det for alltid. Ingen abonnement, ingen konto, ingen overraskelser.",
    documents: "Dokumenter",
    pricing: "Priser",
    guides: "Guider",
    terms: "Vilkår",
    privacy: "Personvern",
    refunds: "Angrerett og refusjon",
    disclaimer: "Ikke juridisk rådgivning",
    contact: "Kontakt",
    legal: `${SITE.name} er ikke et advokatfirma og gir ikke juridisk rådgivning. Malene våre er generelle dokumenter som du fyller ut selv, og de erstatter ikke råd fra en advokat. Trenger du råd om din egen situasjon, snakk med en advokat.`,
  },

  legalNav: {
    label: "Juridiske sider",
    terms: "Vilkår",
    privacy: "Personvern",
    refunds: "Angrerett og refusjon",
    disclaimer: "Ansvarsfraskrivelse",
    updated: (d: string) => `Sist oppdatert ${d}`,
  },

  categories: { Business: "Næring", "Real estate": "Bolig", Personal: "Privat" },

  card: {
    once: (min: number) => ` én gang · ca. ${min} min`,
    start: "Start",
  },

  home: {
    badge: "Ingen abonnement. Ingen konto. Ingen overraskelser.",
    h1: (
      <>
        Juridiske dokumenter til én <em className="text-brand">ærlig</em> pris.
      </>
    ),
    lead: (min: string) =>
      `Svar på noen enkle spørsmål, og se husleiekontrakten, kjøpekontrakten eller avtalen skrive seg selv. Les hvert ord gratis. Betal én gang, fra ${min}, først når du vil laste ned.`,
    cta: "Lag et dokument",
    how: "Slik fungerer det",
    bullets: ["Gratis forhåndsvisning av hele dokumentet", "Betal én gang, behold for alltid", "Ferdig på ca. 5 minutter"],
    heroStep: "Steg 2 av 8",
    heroQuestion: "Hvem skal leie boligen?",
    heroAnswer: "Ola Nordmann",
    continue: "Fortsett",
    trustLabel: "Derfor kan du stole på oss",
    trust: [
      { icon: "lock", title: "Personvern først", text: "Svarene blir i nettleseren din" },
      { icon: "shield", title: "Trygg betaling", text: "Betaling håndteres av Stripe" },
      { icon: "refresh", title: `${SITE.refundDays} dagers angrerett`, text: "Pengene tilbake, uten spørsmål" },
      { icon: "file", title: "Ditt for alltid", text: "Ren PDF, uten vannmerke" },
    ],
    pickTitle: "Velg dokument",
    pickLead: "Prisen du ser, er prisen du betaler. Ingen tillegg.",
    allDocs: "Alle dokumenter →",
    moreTitle: "Flere kommer",
    moreText: "Samboeravtale, kollektivavtale, arbeidsavtale og mer. Savner du noe? Si fra.",
    moreLink: "Ønsk deg et dokument →",
    moreSubject: "Ønske om dokument",
    howEyebrow: "Slik fungerer det",
    howTitle: "Fra blankt ark til signert i fire steg",
    howLead: "Du ser alltid hvor du er, hva som kommer, og hva det koster.",
    pricingEyebrow: "Priser",
    pricingTitle: "Du trenger ett dokument, ikke et abonnement.",
    pricingLead:
      "Mange nettsteder med avtalemaler krever medlemskap, abonnement eller pakkekjøp, eller viser ikke prisen før til slutt. Vi synes det er feil vei å gå. Her er alle prisene våre:",
    compareThem: "Vanlige malsider",
    compare: [
      { label: "Pris", them: "Ofte medlemskap, abonnement eller pakker", us: "99–199 kr én gang per dokument" },
      { label: "Se dokumentet før du betaler", them: "Ofte først etter kjøp", us: "Ja, hvert ord, mens du skriver" },
      { label: "Krever konto", them: "Ofte", us: "Nei" },
      { label: "Noe å si opp", them: "Ofte, ellers fortsetter trekkene", us: "Aldri" },
      { label: "Behold dokumentet", them: "Tilgangen kan forsvinne", us: "PDF-en er din for alltid" },
    ],
    faqTitle: "Spørsmål og svar",
    faqLead: (
      <>
        Lurer du på noe annet? Send en e-post til{" "}
        <a href={`mailto:${SITE.supportEmail}`} className="font-medium text-brand underline">
          {SITE.supportEmail}
        </a>
        . Et ekte menneske svarer.
      </>
    ),
    faq: [
      {
        q: "Er det virkelig bare én betaling?",
        a: "Ja. Du betaler én gang for dokumentet du laster ned. Det er ingen prøveperiode, ingenting fornyes, og det er ikke noe abonnement å si opp. Du trenger ikke engang lage en konto.",
      },
      {
        q: "Kan jeg se dokumentet før jeg betaler?",
        a: "Ja. Hele dokumentet bygges mens du svarer, og du kan lese hvert ord før du betaler. Du betaler først når du vil ha den ferdige PDF-en.",
      },
      {
        q: "Hva om jeg må endre noe senere?",
        a: `Du kan endre svarene og laste ned på nytt gratis i ${SITE.editDays} dager etter kjøpet, fra samme nettleser. Selve PDF-en er din for alltid.`,
      },
      {
        q: "Hvor lagres svarene mine?",
        a: "Bare i din egen nettleser. Vi har ingen kopi på serverne våre. PDF-en lages når du laster den ned, og lagres ikke hos oss.",
      },
      {
        q: "Er dokumentene juridisk bindende?",
        a: "Avtaler som disse er normalt bindende når partene har signert, men hva som gjelder, avhenger av situasjonen. Malene er selvbetjente dokumenter og ikke juridisk rådgivning. Er saken stor eller komplisert, bør du få en advokat til å se på den.",
      },
      {
        q: "Hva om jeg ikke er fornøyd?",
        a: `Send en e-post til ${SITE.supportEmail} innen ${SITE.refundDays} dager, så får du pengene tilbake. Ingen skjema, ingen spørsmål.`,
      },
    ],
    finalTitle: "Dokumentet ditt, ferdig på fem minutter.",
    finalLead: "Start nå. Du blir ikke spurt om kort eller e-post før du velger å laste ned.",
  },

  showcase: {
    label: "Slik fungerer det",
    stages: [
      { icon: "file", short: "Velg", title: "Velg dokument", text: "Husleiekontrakt, kjøpekontrakt, gjeldsbrev og mer. Prisen står på kortet før du begynner." },
      { icon: "edit", short: "Svar", title: "Svar på enkle spørsmål", text: "Ett spørsmål om gangen, med hjelpetekst der du trenger det. Ingen juss-sjargong, ingen lange skjema." },
      { icon: "eye", short: "Se", title: "Se det skrive seg selv", text: "Hvert svar dukker opp i dokumentet med en gang, markert, så du vet nøyaktig hva du signerer." },
      { icon: "download", short: "Last ned", title: "Betal én gang, last ned, signer", text: "Fornøyd? Betal én gang og få en ren, utskriftsklar PDF. Ingen abonnement, ingenting å si opp." },
    ],
    stepOf: (i: number) => `Steg ${i} av 4`,
    docs: [
      ["home", "Husleiekontrakt", "199 kr"],
      ["receipt", "Kjøpekontrakt", "99 kr"],
      ["cash", "Gjeldsbrev", "99 kr"],
    ],
    question: "Hvem skal leie boligen?",
    fieldLabel: "Fullt navn",
    answer: "Ola Nordmann",
    docTitle: "Husleiekontrakt",
    docText: (name: React.ReactNode, purpose: React.ReactNode) => (
      <>
        Denne avtalen er inngått mellom <strong>Kari Hansen</strong> som utleier og {name} som leietaker, for boligen i {purpose}.
      </>
    ),
    purpose: "[adresse]",
    oneTime: "Én betaling",
    from: (p: string) => `fra ${p}`,
    payDownload: "Betal og last ned",
    file: "husleiekontrakt.pdf",
    fileReady: "Klar til utskrift og signering",
  },

  docs: {
    title: "Dokumenter",
    lead: "Velg et dokument for å starte. Du ser det ta form mens du svarer, og betaler bare hvis du laster ned.",
  },

  doc: {
    breadcrumb: "Dokumenter",
    h1: (name: string) => `${name}: mal`,
    oneTime: "én gang",
    takes: (min: number) => `Tar ca. ${min} minutter`,
    start: () => "Start nå",
    perks: ["Gratis forhåndsvisning, betal for å laste ned", "Ingen abonnement eller konto", `Gratis endringer i ${SITE.editDays} dager`, "Utskriftsklar PDF"],
    previewNote: "De markerte delene fylles inn fra svarene dine.",
    when: () => "Når bruker du denne?",
    included: "Dette er med",
    howTitle: () => "Slik lager du dokumentet",
    howLead: (n: number, min: number) => `${n} korte steg, ca. ${min} minutter. Du kan gå tilbake og endre alt helt til du laster ned.`,
    stepFallback: (label: string) => `Svar på noen raske spørsmål om ${label.toLowerCase()}.`,
    reviewTitle: "Se over",
    reviewText: "Les hele dokumentet med alle svarene markert. Endre hva som helst med ett klikk.",
    downloadTitle: "Last ned og signer",
    downloadText: (price: string) => `Betal ${price} én gang og få en utskriftsklar PDF. Alle parter signerer og beholder et eksemplar.`,
    faqTitle: "Vanlige spørsmål",
    createFor: (_short: string, price: string) => `Lag dokumentet for ${price}`,
    notAdvice: "Ikke juridisk rådgivning.",
    others: "Andre dokumenter",
    howToName: (name: string) => `Slik lager du ${name.toLowerCase()}`,
  },

  wizard: {
    autosaved: "Lagres automatisk i nettleseren",
    oneTimeBadge: "én gang · betal bare for å laste ned",
    close: "Lukk",
    questions: "Spørsmål",
    progress: "Fremdrift",
    step: (n: number) => `Steg ${n}`,
    of: (n: number) => `av ${n}`,
    stepAria: (i: number, label: string, done: boolean) => `Steg ${i}: ${label}${done ? " (ferdig)" : ""}`,
    back: "Tilbake",
    orPress: "eller trykk",
    review: "Se over",
    reviewDoc: "Se over dokumentet",
    continue: "Fortsett",
    reviewTitle: "Se over og last ned",
    required: "Dette trengs i dokumentet.",
    checkoutUnavailable: "Betaling er ikke tilgjengelig akkurat nå.",
    wrong: "Noe gikk galt.",
    confirmReset: "Slette alle svar og starte på nytt?",
    payOnce: (price: string) => `Betal én gang · ${price}`,
    downloadSign: "Last ned og signer",
    pdfReady: "Utskriftsklar PDF",
    staysOnDevice: "Svarene blir på denne enheten til du laster ned.",
    startOver: "Start på nytt",
    preview: "Forhåndsvisning",
    livePreview: "Forhåndsvisning",
    filled: (a: number, b: number) => `${a} av ${b} opplysninger fylt ut`,
    watermarkNote: "Vannmerket finnes bare i forhåndsvisningen. PDF-en din er ren, med sidetall og signaturfelt.",
    previewBtn: "Se dokumentet",
    closePreview: "Lukk forhåndsvisning",
    backToQuestions: "Tilbake til spørsmålene",
    selected: (n: number) => `${n} valgt`,
    reviewLead: "Sjekk svarene mot forhåndsvisningen. Du kan fortsatt endre alt.",
    missing: "Noen svar mangler fortsatt:",
    owned: "Du har allerede kjøpt dette dokumentet",
    ownedText: `Endringer og nye nedlastinger er gratis i ${SITE.editDays} dager etter kjøpet.`,
    downloadUpdated: "Last ned oppdatert PDF",
    yourDoc: "Dokumentet ditt",
    perks: [
      "Utskriftsklar PDF, uten vannmerke og uten logo",
      `Gratis endringer og nye nedlastinger i ${SITE.editDays} dager`,
      "Ingen abonnement, ingenting fornyes, ingen konto",
      `Ikke fornøyd? Pengene tilbake innen ${SITE.refundDays} dager, bare send en e-post`,
    ],
    agree: (
      <>
        Jeg forstår at {SITE.name} ikke er et advokatfirma, at dette er en selvbetjent mal og ikke juridisk rådgivning, og at
        jeg selv er ansvarlig for at dokumentet passer til min situasjon. Jeg godtar{" "}
        <Link href="/terms" target="_blank" className="font-medium text-brand underline">
          vilkårene
        </Link>
        .
      </>
    ),
    opening: "Åpner sikker betaling…",
    pay: (price: string) => `Betal ${price} og last ned`,
    secure: process.env.NEXT_PUBLIC_VIPPS === "1" ? "Sikker betaling med Stripe. Vipps, kort, Apple Pay og Google Pay." : "Sikker betaling med Stripe. Kort, Apple Pay og Google Pay.",
    yourAnswers: "Svarene dine",
    notAnswered: "Ikke besvart ennå",
    edit: "Endre",
    disclaimer: `${SITE.name} tilbyr selvbetjente maler, ikke juridisk rådgivning, og erstatter ikke råd fra en advokat. Er saken stor eller komplisert, bør du få en advokat til å se over dokumentet.`,
  },

  rail: {
    label: "Veien til ferdig dokument",
    yourPath: "Din vei",
    filledIn: (pct: number) => `${pct} % fylt ut`,
    here: "Du er her",
    once: (price: string) => `${price} én gang, helt til slutt`,
    noAccount: "Ingen konto, kort eller e-post før du velger å laste ned.",
  },

  field: {
    choose: "Velg…",
    selectAll: "Velg alle",
    clear: "Fjern",
  },

  download: {
    couldNot: "Vi klarte ikke å lage PDF-en.",
    wrong: "Noe gikk galt.",
    missingRef: "Lenken mangler kjøpsreferansen.",
    snag: "Her stoppet det opp",
    charged: (
      <>
        Har du blitt belastet, send en e-post til{" "}
        <a className="font-medium text-brand underline" href={`mailto:${SITE.supportEmail}`}>
          {SITE.supportEmail}
        </a>
        , så ordner vi det samme dag.
      </>
    ),
    tryAgain: "Prøv igjen",
    received: "Betalingen er mottatt",
    noAnswers: `Svarene dine er bare lagret i nettleseren der du fylte dem ut, og vi finner dem ikke her. Åpne siden i den nettleseren, eller fyll ut skjemaet på nytt: kjøpet ditt gjelder i ${SITE.editDays} dager.`,
    fillIn: "Fyll ut skjemaet",
    progressLabel: "Fremdriften din",
    progress: ["Besvart", "Sett over", "Betalt", "Klar"],
    ready: () => "Dokumentet ditt er klart",
    thanks: "Takk for kjøpet. Dokumentet er ditt, uten abonnement og uten noe å si opp.",
    downloadPdf: "Last ned PDF",
    preparing: "Lager PDF-en…",
    editAnswers: "Endre svar",
    nextTitle: "Dette gjør du nå",
    next: [
      "Les gjennom én gang til, og sjekk at alle navn, beløp og datoer stemmer.",
      "Skriv ut og signer, eller signer elektronisk. Lag ett eksemplar til hver part.",
      "Skal noe registreres, for eksempel eierskifte på bil, gjør du det hos riktig etat.",
      `Trenger du å endre noe? Endre og last ned på nytt gratis i ${SITE.editDays} dager, fra denne nettleseren.`,
    ],
  },

  notFound: {
    title: "Fant ikke siden",
    text: "Siden finnes ikke. Var det et dokument du lette etter?",
    browse: "Se dokumentene",
  },

  error: {
    eyebrow: "Noe gikk galt",
    title: "Det fungerte ikke",
    text: (
      <>
        Svarene dine er fortsatt lagret i nettleseren. Prøv igjen, og hvis det fortsetter, send en e-post til{" "}
        <a className="font-medium text-brand underline" href={`mailto:${SITE.supportEmail}`}>
          {SITE.supportEmail}
        </a>
        .
      </>
    ),
    tryAgain: "Prøv igjen",
    home: "Forsiden",
  },

  api: {
    unknownDoc: "Ukjent dokument.",
    productDescription: `Engangskjøp. PDF til nedlasting, gratis endringer i ${SITE.editDays} dager. Ingen abonnement.`,
    checkoutNote: "Selvbetjent dokumentmal. Ikke et advokatfirma, ikke juridisk rådgivning. Én betaling, ingen abonnement.",
    pdfNote:
      "Dokumentet er laget med en selvbetjent mal. Det er ikke juridisk rådgivning og er ikke gjennomgått av advokat. Du er selv ansvarlig for at det passer til din situasjon.",
    missingRef: "Kjøpsreferansen mangler.",
    demoDisabled: "Demokjøp er slått av.",
    otherDoc: "Dette kjøpet gjelder et annet dokument.",
    notConfigured: "Betaling er ikke satt opp.",
    notFound: "Vi fant ikke kjøpet.",
    notPaid: "Betalingen er ikke fullført ennå.",
    editsEnded: `Gratis endringer gikk ut ${SITE.editDays} dager etter kjøpet. PDF-en du lastet ned tidligere, er fortsatt din.`,
  },

  pdf: {
    page: (i: number, n: number) => `Side ${i} av ${n}`,
    initials: "Parafering: ______",
  },

  cookies: {
    text: "Vi vil gjerne bruke informasjonskapsler fra Google og Microsoft til besøksstatistikk og til å måle hvilke annonser som virker. Svarene i dokumentet ditt deles aldri.",
    accept: "Godta",
    reject: "Avvis",
    more: "Personvern",
    change: "Endre valg for informasjonskapsler",
  },
};
