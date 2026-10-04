import { makeCtx, type Answers, type Block, type Template, type Warning } from "@/lib/doc";
import { NORWEGIAN_LAW, partyFields, partyIntro, sigParty } from "./shared";

// Adds a full stop unless the answer already ends with punctuation.
const dot = (raw: string) => (/[.!?]$/.test(raw) ? "" : ".");

// Days between two ISO dates, or NaN.
const daysBetween = (from?: string, to?: string) => {
  if (!from || !to) return NaN;
  return (Date.parse(to + "T00:00:00Z") - Date.parse(from + "T00:00:00Z")) / 86_400_000;
};

const looksLikeEmployment = (a: Answers) =>
  a.feeType === "maaned" || a.durationType === "lopende" || daysBetween(a.startDate, a.endDate) > 182;

export const oppdragsavtale: Template = {
  slug: "oppdragsavtale",
  locale: "nb-NO",
  name: "Oppdragsavtale",
  shortName: "Oppdragsavtale",
  tagline: "For frilansere, konsulenter og kundene deres: avtal leveranse, honorar og rettigheter før jobben starter.",
  category: "Business",
  price: 12900,
  minutes: 7,
  icon: "briefcase",
  seo: {
    title: "Oppdragsavtale mal for frilansere og konsulenter",
    description:
      "Lag en oppdragsavtale med leveranse, honorar, mva, fakturering, rettigheter, ansvar og oppsigelse etter norsk rett. Forhåndsvis gratis, betal 129 kr én gang for PDF-en.",
    intro:
      "En oppdragsavtale (også kalt konsulentavtale eller frilansavtale) regulerer hva en selvstendig oppdragstaker skal levere, hva det koster, og hvem som eier resultatet. En tydelig avtale gjør det lettere å få betalt i tide og å unngå uenighet om hva som var avtalt.",
    whenToUse: [
      "Du er frilanser eller har ENK og starter et oppdrag for en ny kunde",
      "Du leier inn en designer, utvikler, skribent eller konsulent",
      "Dere vil ha en løpende avtale med fast månedshonorar",
      "Dere vil skrive ned en muntlig avtale som allerede er i gang",
    ],
    includes: [
      "Beskrivelse av oppdraget, oppstart og varighet",
      "Fastpris, timepris med anslag eller tak, eller fast månedshonorar",
      "Mva, fakturering, betalingsfrist og forsinkelsesrente",
      "Hvem som eier resultatet, og rett til bruk i portefølje",
      "Taushetsplikt, retting av mangler og ansvarsbegrensning",
      "Oppsigelse med varsel og heving ved vesentlig mislighold",
    ],
    faq: [
      {
        q: "Hva er forskjellen på oppdragstaker og arbeidstaker?",
        a: "En arbeidstaker jobber under ledelse og kontroll av arbeidsgiveren, får lønn og har rettigheter som oppsigelsesvern, feriepenger og sykepenger fra arbeidsgiver. En oppdragstaker driver egen virksomhet, bestemmer selv hvordan arbeidet gjøres, bruker egne verktøy og bærer risikoen for resultatet. Det er de faktiske forholdene som avgjør, ikke hva avtalen kalles. Ligner oppdraget en vanlig jobb, kan det bli regnet som et arbeidsforhold etter arbeidsmiljøloven.",
      },
      {
        q: "Må jeg ta mva?",
        a: "Du må registrere deg i Merverdiavgiftsregisteret når den avgiftspliktige omsetningen din blir mer enn 50 000 kroner i løpet av en periode på tolv måneder. Etter registrering skal du legge mva på fakturaene. Noen tjenester er unntatt fra mva, for eksempel en del helsetjenester og undervisning. Sjekk reglene hos Skatteetaten hvis du er usikker.",
      },
      {
        q: "Hvem eier det jeg lager?",
        a: "Etter åndsverkloven får den som skaper et verk, opphavsretten. Oppdragsgiver får bare de rettighetene som er avtalt, og uten en tydelig avtale ofte bare det som er nødvendig for formålet med oppdraget. Derfor bør avtalen si klart om rettighetene går over til oppdragsgiver, eller om oppdragstaker beholder dem og gir en bruksrett. Den ideelle retten, som retten til å bli navngitt, kan ikke overdras.",
      },
    ],
  },
  steps: [
    {
      id: "client", label: "Oppdragsgiver",
      title: "Hvem er oppdragsgiver?",
      description: "Personen eller virksomheten som bestiller og betaler for oppdraget.",
      fields: partyFields("og", "oppdragsgiver", { email: true }),
    },
    {
      id: "contractor", label: "Oppdragstaker",
      title: "Hvem utfører oppdraget?",
      description: "Frilanseren, konsulenten eller byrået. Har du ENK, velg «Et selskap» og bruk navnet og organisasjonsnummeret til foretaket.",
      fields: partyFields("ot", "oppdragstaker", { email: true }),
    },
    {
      id: "scope", label: "Oppdraget",
      title: "Hva skal leveres, og når?",
      fields: [
        {
          id: "deliverable",
          label: "Beskrivelse av oppdraget",
          type: "textarea",
          required: true,
          placeholder: "Design og utvikling av en nettside på fem sider, inkludert to runder med endringer.",
          help: "Vær konkret. En tydelig beskrivelse hindrer uenighet senere.",
        },
        { id: "startDate", label: "Oppstart", type: "date", required: true, half: true },
        {
          id: "durationType",
          label: "Varighet",
          type: "choice",
          defaultValue: "fast",
          options: [
            { value: "fast", label: "Til en bestemt dato", description: "Oppdraget har en sluttdato." },
            { value: "lopende", label: "Løpende", description: "Varer til en av partene sier opp." },
          ],
        },
        { id: "endDate", label: "Sluttdato", type: "date", half: true, showIf: (a) => a.durationType !== "lopende" },
      ],
    },
    {
      id: "fee", label: "Honorar",
      title: "Honorar og betaling",
      fields: [
        {
          id: "feeType",
          label: "Hvordan beregnes honoraret?",
          type: "choice",
          defaultValue: "fastpris",
          options: [
            { value: "fastpris", label: "Fastpris", description: "Én samlet pris for oppdraget." },
            { value: "timepris", label: "Timepris", description: "Betaling for medgått tid." },
            { value: "maaned", label: "Per måned", description: "Samme beløp hver måned." },
          ],
        },
        {
          id: "amount",
          label: "Beløp",
          type: "money",
          required: true,
          half: true,
          placeholder: "40 000",
          help: "Fastpris: hele beløpet. Timepris: per time. Per måned: per måned.",
        },
        {
          id: "hoursLimit",
          label: "Antall timer (valgfritt)",
          type: "number",
          half: true,
          placeholder: "60",
          showIf: (a) => a.feeType === "timepris",
        },
        {
          id: "hoursLimitType",
          label: "Er timetallet et anslag eller et tak?",
          type: "select",
          half: true,
          defaultValue: "anslag",
          options: [
            { value: "anslag", label: "Anslag (ikke bindende)" },
            { value: "tak", label: "Tak (krever godkjenning for mer)" },
          ],
          showIf: (a) => a.feeType === "timepris" && !!(a.hoursLimit ?? "").trim(),
        },
        {
          id: "vat",
          label: "Er oppdragstaker mva-registrert?",
          type: "choice",
          defaultValue: "ja",
          options: [
            { value: "ja", label: "Ja", description: "Beløpene er eks. mva, og mva kommer i tillegg." },
            { value: "nei", label: "Nei", description: "Oppdragstaker er ikke mva-registrert." },
          ],
        },
        {
          id: "invoicingFixed",
          label: "Fakturering",
          type: "select",
          defaultValue: "levering",
          options: [
            { value: "maanedlig", label: "Månedlig, for utført arbeid" },
            { value: "levering", label: "Ved levering" },
            { value: "forskudd", label: "50 % ved oppstart, resten ved levering" },
          ],
          showIf: (a) => (a.feeType ?? "fastpris") === "fastpris",
        },
        {
          id: "invoicingHourly",
          label: "Fakturering",
          type: "select",
          defaultValue: "maanedlig",
          options: [
            { value: "maanedlig", label: "Månedlig" },
            { value: "levering", label: "Ved levering" },
          ],
          showIf: (a) => a.feeType === "timepris",
        },
        { id: "payDays", label: "Betalingsfrist (dager)", type: "number", defaultValue: "14", half: true },
      ],
    },
    {
      id: "rights", label: "Rettigheter",
      title: "Rettigheter og oppsigelse",
      fields: [
        {
          id: "ip",
          label: "Hvem skal eie resultatet?",
          type: "choice",
          defaultValue: "oppdragsgiver",
          options: [
            { value: "oppdragsgiver", label: "Oppdragsgiver", description: "Rettighetene går over når honoraret er betalt i sin helhet." },
            { value: "oppdragstaker", label: "Oppdragstaker", description: "Oppdragsgiver får en varig rett til å bruke resultatet." },
          ],
        },
        {
          id: "portfolio",
          label: "Kan oppdragstaker vise frem arbeidet i porteføljen sin?",
          type: "choice",
          defaultValue: "ja",
          options: [
            { value: "ja", label: "Ja", description: "Med mindre arbeidet er konfidensielt." },
            { value: "nei", label: "Nei", description: "Bare med skriftlig samtykke." },
          ],
        },
        { id: "noticeDays", label: "Oppsigelsesfrist (dager)", type: "number", defaultValue: "14", half: true },
      ],
    },
  ],
  render(a) {
    const c = makeCtx(a, "nb-NO");
    const fee = c.raw("feeType") || "fastpris";
    const vat = c.is("vat", "ja");

    let feeText: string;
    if (fee === "timepris") {
      feeText = `Oppdragsgiver betaler ${c.money("amount", "timepris")} per time for medgått tid. Oppdragstaker fører timelister som legges ved fakturaen.`;
      if (c.has("hoursLimit"))
        feeText += c.is("hoursLimitType", "tak")
          ? ` Det kan ikke faktureres mer enn ${c.v("hoursLimit", "antall")} timer uten at Oppdragsgiver har godkjent det skriftlig på forhånd.`
          : ` Oppdraget er anslått til ca. ${c.v("hoursLimit", "antall")} timer. Anslaget er ikke bindende, men Oppdragstaker skal varsle Oppdragsgiver så snart det er klart at det vil bli vesentlig overskredet.`;
    } else if (fee === "maaned") feeText = `Oppdragsgiver betaler et fast honorar på ${c.money("amount", "månedsbeløp")} per måned.`;
    else feeText = `Oppdragsgiver betaler et fast honorar på ${c.money("amount", "fastpris")} for Oppdraget.`;

    const vatText = vat
      ? "Oppdragstaker er registrert i Merverdiavgiftsregisteret. Alle beløp i Avtalen er oppgitt eksklusive merverdiavgift (mva), og mva kommer i tillegg."
      : "Oppdragstaker er ikke registrert i Merverdiavgiftsregisteret, og det beregnes ikke mva på honoraret. Dersom Oppdragstaker blir mva-pliktig mens Avtalen gjelder, kommer mva i tillegg for arbeid som utføres etter registreringen, og Oppdragstaker skal varsle Oppdragsgiver om dette.";

    let invoiceText: string;
    if (fee === "maaned") invoiceText = "Månedshonoraret faktureres ved starten av hver måned.";
    else if (fee === "timepris")
      invoiceText = c.is("invoicingHourly", "levering")
        ? "Medgått tid faktureres når Oppdraget er levert."
        : "Medgått tid faktureres etterskuddsvis hver måned.";
    else {
      const inv = c.raw("invoicingFixed") || "levering";
      invoiceText =
        inv === "maanedlig"
          ? "Honoraret faktureres etterskuddsvis hver måned, for den delen av Oppdraget som er utført."
          : inv === "forskudd"
            ? "50 prosent av honoraret faktureres ved oppstart, og resten faktureres når Oppdraget er levert."
            : "Honoraret faktureres når Oppdraget er levert.";
    }

    const term =
      c.raw("durationType") === "lopende"
        ? `Avtalen gjelder fra ${c.date("startDate", "oppstartsdato")} og løper til den blir sagt opp etter punktet om oppsigelse nedenfor.`
        : `Avtalen gjelder fra ${c.date("startDate", "oppstartsdato")} til ${c.date("endDate", "sluttdato")}, med mindre den blir sagt opp eller hevet før.`;

    const liabilityCap =
      fee === "fastpris"
        ? "det avtalte honoraret for Oppdraget"
        : "honoraret som er fakturert for Oppdraget de siste tolv månedene før kravet oppsto";

    const blocks: Block[] = [
      { type: "title", text: "Oppdragsavtale" },
      {
        type: "paragraph",
        text: `Denne oppdragsavtalen («Avtalen») er inngått mellom ${partyIntro(c, "og", "oppdragsgiver")} («Oppdragsgiver») og ${partyIntro(c, "ot", "oppdragstaker")} («Oppdragstaker»).`,
      },
      {
        type: "clause",
        title: "Oppdraget",
        paragraphs: [
          `Oppdragstaker skal utføre følgende oppdrag («Oppdraget»): ${c.v("deliverable", "beskrivelse av oppdraget")}${dot(c.raw("deliverable"))}`,
          "Oppdragstaker skal utføre Oppdraget faglig forsvarlig og i tråd med god bransjeskikk. Endringer og tilleggsarbeid som ikke er beskrevet ovenfor, skal avtales skriftlig, også hvordan de påvirker pris og tidsplan.",
        ],
      },
      { type: "clause", title: "Varighet", paragraphs: [term] },
      {
        type: "clause",
        title: "Honorar",
        paragraphs: [
          feeText,
          vatText,
          "Utlegg, for eksempel reiser, lisenser eller innkjøp, dekkes bare dersom Oppdragsgiver har godkjent dem på forhånd. Godkjente utlegg faktureres uten påslag og med kvittering.",
        ],
      },
      {
        type: "clause",
        title: "Fakturering og betaling",
        paragraphs: [
          `${invoiceText} Betalingsfristen er ${c.v("payDays", "antall")} dager fra fakturadato.`,
          "Ved forsinket betaling har Oppdragstaker krav på forsinkelsesrente etter forsinkelsesrenteloven. Er en faktura mer enn 14 dager på overtid, kan Oppdragstaker etter skriftlig varsel stanse arbeidet til fakturaen er betalt.",
        ],
      },
      {
        type: "clause",
        title: "Selvstendig oppdragstaker",
        paragraphs: [
          "Oppdragstaker er selvstendig næringsdrivende og ikke ansatt hos Oppdragsgiver. Oppdragstaker bestemmer selv hvordan og når arbeidet utføres, innenfor det som er avtalt om leveranse og frister, og bruker egne verktøy og eget utstyr.",
          "Oppdragstaker er selv ansvarlig for egen skatt, trygdeavgift, forsikringer og pensjon. Oppdragstaker kan bare bruke medhjelpere eller underleverandører dersom Oppdragsgiver har godkjent det skriftlig, og er i så fall ansvarlig for deres arbeid som for sitt eget.",
        ],
      },
      {
        type: "clause",
        title: "Rettigheter til resultatet",
        paragraphs: [
          c.is("ip", "oppdragstaker")
            ? "Oppdragstaker beholder opphavsretten og andre immaterielle rettigheter til resultatet av Oppdraget. Når honoraret er betalt i sin helhet, får Oppdragsgiver en varig, ikke-eksklusiv rett til å bruke, kopiere og endre resultatet i sin egen virksomhet, uten ekstra vederlag. Oppdragsgiver kan ikke selge eller lisensiere resultatet videre uten Oppdragstakers skriftlige samtykke."
            : "Når honoraret er betalt i sin helhet, overtar Oppdragsgiver opphavsretten og andre immaterielle rettigheter til resultatet som er laget særskilt for Oppdragsgiver under Avtalen, med rett til å endre resultatet og overdra rettighetene videre. Oppdragstaker beholder rettighetene til verktøy, maler, kode og kunnskap som Oppdragstaker hadde fra før, eller som ikke er laget særskilt for Oppdragsgiver, og gir Oppdragsgiver en varig rett til å bruke dette som en del av resultatet.",
          "Oppdragstakers ideelle rettigheter etter åndsverkloven, som retten til å bli navngitt, påvirkes ikke av Avtalen.",
          c.is("portfolio", "nei")
            ? "Oppdragstaker kan ikke vise frem resultatet i portefølje eller markedsføring uten Oppdragsgivers skriftlige samtykke."
            : "Oppdragstaker kan vise frem resultatet i sin portefølje og markedsføring, med mindre resultatet inneholder konfidensiell informasjon eller Oppdragsgiver skriftlig har bedt om noe annet.",
        ],
      },
      {
        type: "clause",
        title: "Taushetsplikt",
        paragraphs: [
          "Partene skal holde hemmelig all informasjon om den andre partens virksomhet som ikke er offentlig kjent, og som de får tilgang til gjennom Oppdraget, og bare bruke den for å oppfylle Avtalen. Taushetsplikten gjelder også i to år etter at Avtalen er avsluttet, og for forretningshemmeligheter så lenge de er hemmelige. Taushetsplikten begrenser ikke retten til å varsle om kritikkverdige forhold eller til å gi opplysninger til offentlige myndigheter når loven gir rett eller plikt til det.",
        ],
      },
      {
        type: "clause",
        title: "Mangler",
        paragraphs: [
          "Er resultatet ikke i samsvar med Avtalen, skal Oppdragsgiver gi Oppdragstaker skriftlig beskjed innen rimelig tid etter at mangelen ble oppdaget eller burde ha blitt oppdaget. Oppdragstaker skal da rette mangelen innen rimelig tid uten ekstra kostnad. Blir mangelen ikke rettet, kan Oppdragsgiver kreve et forholdsmessig prisavslag.",
        ],
      },
      {
        type: "clause",
        title: "Ansvar",
        paragraphs: [
          `Oppdragstakers samlede ansvar etter Avtalen er begrenset til ${liabilityCap}. Ingen av partene er ansvarlig for indirekte tap, som tapt fortjeneste, tapte data eller krav fra tredjeperson. Begrensningene gjelder ikke dersom tapet er voldt ved grov uaktsomhet eller forsett, og de begrenser ikke Oppdragsgivers plikt til å betale avtalt honorar.`,
        ],
      },
      {
        type: "clause",
        title: "Oppsigelse og heving",
        paragraphs: [
          `Hver av partene kan si opp Avtalen skriftlig med ${c.v("noticeDays", "antall")} dagers varsel. Oppdragsgiver skal betale for arbeid som er utført, og for godkjente utlegg, frem til Avtalen opphører.${fee === "fastpris" ? " Ved fastpris betales en forholdsmessig del av honoraret for det arbeidet som er utført." : ""}`,
          "Dersom en part vesentlig misligholder Avtalen, kan den andre parten heve Avtalen med umiddelbar virkning ved skriftlig melding.",
        ],
      },
      {
        type: "clause",
        title: "Øvrige bestemmelser",
        paragraphs: [
          "Endringer i Avtalen skal avtales skriftlig. Meldinger etter Avtalen kan sendes på e-post til adressene partene har oppgitt. Ingen av partene kan overdra Avtalen til andre uten skriftlig samtykke fra den andre parten. Avtalen kan signeres elektronisk.",
        ],
      },
      { type: "clause", title: "Lovvalg og tvister", paragraphs: [NORWEGIAN_LAW] },
      {
        type: "signatures",
        intro: "Avtalen er utstedt i to eksemplarer, ett til hver part.",
        parties: [sigParty(c, "og", "OPPDRAGSGIVER", "oppdragsgiver"), sigParty(c, "ot", "OPPDRAGSTAKER", "oppdragstaker")],
      },
    ];
    return blocks;
  },
  warnings(a) {
    const out: Warning[] = [];
    if (looksLikeEmployment(a))
      out.push({
        level: "info",
        text: "Ligner oppdraget en vanlig jobb, med én oppdragsgiver, faste arbeidstider og lang varighet, kan det bli regnet som et arbeidsforhold etter arbeidsmiljøloven, uansett hva avtalen kalles. Denne malen er for reelt selvstendige oppdragstakere.",
        fields: ["feeType", "amount", "durationType", "endDate", "startDate"],
      });
    if ((a.ogType ?? "individual") !== "company")
      out.push({
        level: "info",
        text: `Er oppdragsgiver en privatperson, kan forbrukerlovgivningen gi rettigheter som ikke kan avtales bort, og ansvarsbegrensningen gjelder da ikke alltid fullt ut.${a.vat === "nei" ? "" : " Overfor privatpersoner bør prisene også oppgis med mva inkludert."}`,
        fields: ["ogType", "vat"],
      });
    return out;
  },
};
