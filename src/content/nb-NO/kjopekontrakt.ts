import { makeCtx, parseAmount, type Answers, type Block, type Template, type Warning } from "@/lib/doc";
import { NORWEGIAN_LAW, partyFields, partyIntro, sigParty } from "./shared";

const isVehicle = (a: Answers) => (a.itemKind ?? "vehicle") === "vehicle";
const paidAtHandover = (a: Answers) => (a.paidInFull ?? "yes") === "yes";

// "84200" / "84 200" -> "84 200"
const groupKm = (v?: string) => {
  const digits = (v ?? "").replace(/[^0-9]/g, "");
  return digits ? Number(digits).toLocaleString("nb-NO").replace(/[  ]/g, " ") : (v ?? "");
};

const PAYMENT: Record<string, string> = {
  transfer: "bankoverføring",
  cash: "kontanter",
  vipps: "Vipps",
};

export const kjopekontrakt: Template = {
  slug: "kjopekontrakt",
  locale: "nb-NO",
  name: "Kjøpekontrakt",
  shortName: "Kjøpekontrakt",
  tagline: "Selg en brukt bil eller en annen gjenstand mellom privatpersoner, med alt viktig skrevet ned.",
  category: "Personal",
  price: 9900,
  minutes: 5,
  icon: "receipt",
  seo: {
    title: "Kjøpekontrakt for bruktbil og privat salg – lag kontrakten på nett",
    description:
      "Lag en kjøpekontrakt for bil, MC, tilhenger eller en annen gjenstand mellom privatpersoner etter kjøpsloven. Forhåndsvis gratis, betal 99 kr én gang for PDF-en.",
    intro:
      "En kjøpekontrakt viser hva som er solgt, til hvem, for hvilken pris og i hvilken stand. Ved privat salg gjelder kjøpsloven, og en skriftlig kontrakt gjør det mye enklere å vite hva dere faktisk avtalte hvis det senere oppstår uenighet om feil eller mangler.",
    whenToUse: [
      "Du selger eller kjøper en brukt bil, motorsykkel, moped eller tilhenger privat",
      "Du selger en båt, et møbel, en sykkel eller elektronikk til en annen privatperson",
      "Du vil ha dokumentert kilometerstand, kjente feil og hva som følger med",
      "Du vil ha klare avtaler om betaling, overtakelse og eierskifte",
    ],
    includes: [
      "Kjøretøyopplysninger (registreringsnummer, merke, modell, km-stand, EU-kontroll) eller beskrivelse av gjenstanden",
      "Kjøpesum, betalingsmåte og når pengene skal betales",
      "Overtakelse og når risikoen går over til kjøper",
      "Salg «som den er» etter kjøpsloven § 19, med kjente feil skrevet inn",
      "Selgers bekreftelse på eierskap og heftelser, og kjøpers bekreftelse på at gjenstanden er undersøkt",
      "Eierskifte, omregistreringsavgift og forsikring for kjøretøy",
    ],
    faq: [
      {
        q: "Hva betyr «som den er»?",
        a: "At kjøperen godtar gjenstanden i den stand den er i ved salget. Men selgeren er ikke fritatt for alt ansvar: Etter kjøpsloven § 19 har gjenstanden likevel en mangel hvis den ikke svarer til opplysninger selgeren har gitt, hvis selgeren har holdt tilbake opplysninger kjøperen med god grunn kunne regne med å få, eller hvis den er i vesentlig dårligere stand enn kjøperen hadde grunn til å regne med ut fra pris og forholdene ellers. Kjøperen kan heller ikke klage på feil hun eller han kjente til eller burde ha oppdaget ved en undersøkelse før kjøpet.",
      },
      {
        q: "Hvem betaler omregistreringsavgiften?",
        a: "Det er den nye eieren, altså kjøperen, som betaler omregistreringsavgiften når et kjøretøy skifter eier. Beløpet avhenger av kjøretøytype, vekt og alder, og du kan sjekke satsene hos Skatteetaten eller Statens vegvesen. Eierskiftet meldes normalt digitalt hos Statens vegvesen, der både selger og kjøper bekrefter.",
      },
      {
        q: "Må kjøpekontrakten signeres av begge?",
        a: "Ja, det er sterkt anbefalt. En muntlig avtale er også bindende, men når både selger og kjøper har signert, er det mye lettere å bevise hva dere avtalte. Lag to eksemplarer, ett til hver, eller signer begge og ta et bilde eller en skanning av kontrakten.",
      },
    ],
  },
  steps: [
    {
      id: "item",
      label: "Gjenstand",
      title: "Hva skal selges?",
      description: "Malen er laget for salg mellom privatpersoner.",
      fields: [
        {
          id: "itemKind",
          label: "Hva selger du?",
          type: "choice",
          defaultValue: "vehicle",
          options: [
            { value: "vehicle", label: "Et kjøretøy", description: "Bil, motorsykkel, moped, tilhenger, campingvogn …" },
            { value: "other", label: "En annen gjenstand", description: "Båt uten registrering, møbler, sykkel, elektronikk …" },
          ],
        },
        {
          id: "sellerPrivate",
          label: "Selger du som privatperson?",
          type: "choice",
          defaultValue: "yes",
          options: [
            { value: "yes", label: "Ja", description: "Du selger noe du eier privat." },
            { value: "no", label: "Nei", description: "Du selger som del av en næringsvirksomhet (f.eks. ENK eller AS)." },
          ],
        },
        {
          id: "buyerConsumer",
          label: "Er kjøperen en privatperson (forbruker)?",
          type: "choice",
          defaultValue: "yes",
          options: [
            { value: "yes", label: "Ja" },
            { value: "no", label: "Nei, en næringsdrivende" },
          ],
          showIf: (a) => a.sellerPrivate === "no",
        },
      ],
    },
    {
      id: "details",
      label: "Detaljer",
      title: (a) => (isVehicle(a) ? "Opplysninger om kjøretøyet" : "Beskriv gjenstanden"),
      description: (a) =>
        isVehicle(a)
          ? "Du finner det meste i vognkortet eller ved å søke opp registreringsnummeret hos Statens vegvesen."
          : "Jo mer presis beskrivelse, jo mindre rom for misforståelser.",
      fields: [
        { id: "regNr", label: "Registreringsnummer", type: "text", half: true, required: true, placeholder: "AB 12345", showIf: isVehicle },
        { id: "makeModel", label: "Merke og modell", type: "text", half: true, required: true, placeholder: "Toyota Corolla", showIf: isVehicle },
        { id: "modelYear", label: "Årsmodell", type: "text", half: true, placeholder: "2017", showIf: isVehicle },
        { id: "km", label: "Kilometerstand", type: "number", half: true, required: true, placeholder: "142 000", showIf: isVehicle },
        { id: "vin", label: "Understellsnummer (VIN) (valgfritt)", type: "text", placeholder: "17 tegn", showIf: isVehicle },
        { id: "pkk", label: "Dato for siste EU-kontroll (PKK) (valgfritt)", type: "date", half: true, showIf: isVehicle },
        {
          id: "description",
          label: "Beskrivelse",
          type: "textarea",
          required: true,
          placeholder: "f.eks. Spisebord i eik, 180 x 90 cm, med seks stoler",
          help: "Ta med merke, modell, størrelse og alder hvis det er relevant.",
          showIf: (a) => !isVehicle(a),
        },
        { id: "serial", label: "Serienummer (valgfritt)", type: "text", placeholder: "f.eks. SN 12345678", showIf: (a) => !isVehicle(a) },
        {
          id: "included",
          label: "Hva følger med? (valgfritt)",
          type: "textarea",
          placeholder: "f.eks. vinterhjul på felg, to nøkler, servicehefte",
        },
        {
          id: "defects",
          label: "Kjente feil og mangler",
          type: "textarea",
          placeholder: "f.eks. Rust på bakre hjulbue. Klimaanlegget virker ikke.",
          help: "Skriv alt du vet om. Det beskytter deg: kjøperen kan normalt ikke klage på feil som er opplyst før kjøpet.",
        },
        {
          id: "encumbrance",
          label: "Er det lån eller pant (heftelser) i gjenstanden?",
          type: "choice",
          defaultValue: "no",
          options: [
            { value: "no", label: "Nei", description: "Gjenstanden er fri for heftelser." },
            { value: "yes", label: "Ja", description: "Det er pant som skal innfris eller overtas." },
          ],
        },
        {
          id: "encumbranceText",
          label: "Beskriv heftelsen og hvordan den skal ordnes",
          type: "textarea",
          required: true,
          placeholder: "f.eks. Billån i Eksempel Bank. Selger innfrir lånet med kjøpesummen, og pantet slettes før eierskiftet.",
          showIf: (a) => a.encumbrance === "yes",
        },
      ],
    },
    { id: "seller", label: "Selger", title: "Hvem er selger?", fields: partyFields("s", "selger", { allowCompany: false }) },
    { id: "buyer", label: "Kjøper", title: "Hvem er kjøper?", fields: partyFields("b", "kjøper", { allowCompany: false }) },
    {
      id: "price",
      label: "Pris og betaling",
      title: "Pris og betaling",
      fields: [
        { id: "price", label: "Kjøpesum", type: "money", required: true, half: true, placeholder: "85 000" },
        {
          id: "paymentMethod",
          label: "Betalingsmåte",
          type: "select",
          half: true,
          defaultValue: "transfer",
          options: [
            { value: "transfer", label: "Bankoverføring" },
            { value: "cash", label: "Kontant" },
            { value: "vipps", label: "Vipps" },
          ],
        },
        {
          id: "account",
          label: "Selgers kontonummer (valgfritt)",
          type: "text",
          placeholder: "1234 56 78901",
          showIf: (a) => (a.paymentMethod ?? "transfer") === "transfer",
        },
        {
          id: "paidInFull",
          label: "Betales hele kjøpesummen senest ved overtakelse?",
          type: "choice",
          defaultValue: "yes",
          options: [
            { value: "yes", label: "Ja", description: "Vanligst. Pengene er på plass før kjøper tar med seg gjenstanden." },
            { value: "no", label: "Nei", description: "Noe betales senere." },
          ],
        },
        {
          id: "paymentTerms",
          label: "Hvordan og når skal resten betales?",
          type: "textarea",
          required: true,
          placeholder: "f.eks. kr 20 000 betales ved overtakelse, og resten (kr 65 000) betales innen 1. desember 2026.",
          showIf: (a) => !paidAtHandover(a),
        },
      ],
    },
    {
      id: "handover",
      label: "Overtakelse",
      title: "Når overtar kjøper?",
      description: "Risikoen går over til kjøper når gjenstanden er overtatt.",
      fields: [
        { id: "handoverDate", label: "Dato for overtakelse", type: "date", required: true, half: true },
        { id: "handoverTime", label: "Klokkeslett (valgfritt)", type: "text", half: true, placeholder: "kl. 18.00" },
        { id: "handoverPlace", label: "Sted for overtakelse (valgfritt)", type: "text", placeholder: "f.eks. selgers adresse" },
      ],
    },
  ],
  render(input) {
    const a: Answers = { ...input, km: groupKm(input.km) };
    const c = makeCtx(a, "nb-NO");
    const vehicle = isVehicle(a);
    const thing = vehicle ? "Kjøretøyet" : "Gjenstanden";
    const Thing = vehicle ? "Kjøretøyet" : "Gjenstanden";
    // Adds a full stop after a free-text answer unless the person wrote one.
    const dot = (id: string) => (/[.!?]$/.test(c.raw(id)) ? "" : ".");

    const blocks: Block[] = [
      { type: "title", text: vehicle ? "Kjøpekontrakt for kjøretøy" : "Kjøpekontrakt" },
      { type: "subtitle", text: "Salg mellom privatpersoner" },
      { type: "heading", text: "Partene" },
      { type: "paragraph", text: `**Selger:** ${partyIntro(c, "s", "selgers navn")} («Selger»)` },
      { type: "paragraph", text: `**Kjøper:** ${partyIntro(c, "b", "kjøpers navn")} («Kjøper»)` },
    ];

    // 1. Hva som selges
    const itemList: string[] = vehicle
      ? [
          `Registreringsnummer: ${c.v("regNr", "registreringsnummer")}`,
          `Merke og modell: ${c.v("makeModel", "merke og modell")}`,
          ...(c.has("modelYear") ? [`Årsmodell: ${c.v("modelYear", "årsmodell")}`] : []),
          `Kilometerstand ved salg: ${c.v("km", "kilometerstand")} km`,
          ...(c.has("vin") ? [`Understellsnummer (VIN): ${c.v("vin", "understellsnummer")}`] : []),
          ...(c.has("pkk") ? [`Siste godkjente EU-kontroll (PKK): ${c.date("pkk", "dato")}`] : []),
        ]
      : c.has("serial")
        ? [`Serienummer: ${c.v("serial", "serienummer")}`]
        : [];
    blocks.push({
      type: "clause",
      title: vehicle ? "Kjøretøyet" : "Gjenstanden",
      paragraphs: [
        vehicle
          ? "Selger selger, og Kjøper kjøper, følgende kjøretøy («Kjøretøyet»):"
          : `Selger selger, og Kjøper kjøper, følgende gjenstand («Gjenstanden»): ${c.v("description", "beskrivelse av gjenstanden")}${dot("description")}`,
      ],
      list: itemList.length ? itemList : undefined,
    });
    if (c.has("included")) blocks.push({ type: "paragraph", text: `Følgende følger med i handelen: ${c.v("included", "tilbehør")}${dot("included")}` });

    // 2. Kjøpesum og betaling
    const method = c.opt("paymentMethod", PAYMENT, "betalingsmåte");
    const account =
      c.is("paymentMethod", "transfer") && c.has("account") ? ` til Selgers konto ${c.v("account", "kontonummer")}` : "";
    blocks.push({
      type: "clause",
      title: "Kjøpesum og betaling",
      paragraphs: [
        `Kjøpesummen er ${c.money("price", "kjøpesum")}. Kjøpesummen betales med ${method}${account}.`,
        paidAtHandover(a)
          ? `Hele kjøpesummen skal være betalt senest ved overtakelse. Selger skal ikke levere ${thing} før beløpet er mottatt, og bekrefter mottatt betaling ved å signere denne kontrakten eller gi en egen kvittering.`
          : `Betalingen skjer slik: ${c.v("paymentTerms", "betalingsplan")}${dot("paymentTerms")} Betaler ikke Kjøper til avtalt tid, gjelder kjøpslovens regler om kjøpers mislighold, og Selger kan blant annet kreve forsinkelsesrente etter forsinkelsesrenteloven.`,
      ],
    });

    // 3. Overtakelse og risiko
    const when = `${c.date("handoverDate", "dato for overtakelse")}${c.has("handoverTime") ? ` ${c.v("handoverTime", "klokkeslett")}` : ""}`;
    const where = c.has("handoverPlace") ? ` på ${c.v("handoverPlace", "sted")}` : "";
    blocks.push({
      type: "clause",
      title: "Overtakelse og risiko",
      paragraphs: [
        `Kjøper overtar ${thing} ${when}${where}.`,
        `Risikoen for ${thing} går over fra Selger til Kjøper ved overtakelse. Blir ${thing} skadet, ødelagt eller stjålet etter overtakelse, må Kjøper likevel betale kjøpesummen.`,
      ],
    });

    // 4. Stand og «som den er»
    const defects = c.has("defects")
      ? `Selger har opplyst om følgende feil og mangler: ${c.v("defects", "kjente feil")}${dot("defects")}`
      : "Selger kjenner ikke til feil eller mangler ut over det som følger av alder og normal bruk.";
    blocks.push({
      type: "clause",
      title: `${Thing}s stand – solgt «som den er»`,
      paragraphs: [
        `${Thing} selges «som den er», jf. kjøpsloven § 19. ${defects}`,
        `Selv om ${thing} er solgt «som den er», har Selger etter kjøpsloven § 19 likevel ansvar hvis ${thing}:`,
      ],
      list: [
        "ikke svarer til opplysninger Selger har gitt,",
        "har vesentlige feil Selger kjente til eller måtte kjenne til, og som Kjøper med god grunn kunne regne med å få vite om, eller",
        "er i vesentlig dårligere stand enn Kjøper hadde grunn til å regne med ut fra kjøpesummen og forholdene ellers.",
      ],
    });
    blocks.push({
      type: "paragraph",
      text: `Mener Kjøper at det er en mangel, må Kjøper si fra til Selger innen rimelig tid etter at mangelen ble eller burde ha blitt oppdaget. Etter kjøpsloven kan det ikke klages senere enn to år etter at Kjøper overtok ${thing}.`,
    });

    // 5. Selgers og kjøpers bekreftelser
    blocks.push({
      type: "clause",
      title: "Eierskap, heftelser og undersøkelse",
      paragraphs: [
        c.is("encumbrance", "yes")
          ? `Selger bekrefter å eie ${thing} og ha rett til å selge ${vehicle ? "det" : "den"}. ${Thing} har følgende heftelser, som skal ordnes slik: ${c.v("encumbranceText", "heftelser")}${dot("encumbranceText")} Ut over dette er ${thing} fri for pant og andre heftelser.`
          : `Selger bekrefter å eie ${thing}, å ha rett til å selge ${vehicle ? "det" : "den"}, og at ${thing} er fri for pant og andre heftelser.`,
        vehicle
          ? "Kjøper bekrefter å ha undersøkt og prøvekjørt Kjøretøyet før kjøpet, og å ha hatt anledning til å få det kontrollert av et verksted eller en annen fagperson. Kjøper kan ikke gjøre gjeldende feil som Kjøper kjente til, eller burde ha oppdaget ved denne undersøkelsen."
          : "Kjøper bekrefter å ha undersøkt Gjenstanden før kjøpet og å ha hatt anledning til å få den kontrollert. Kjøper kan ikke gjøre gjeldende feil som Kjøper kjente til, eller burde ha oppdaget ved denne undersøkelsen.",
      ],
    });

    if (vehicle)
      blocks.push({
        type: "clause",
        title: "Eierskifte, avgift og forsikring",
        paragraphs: [
          paidAtHandover(a)
            ? "Partene melder eierskiftet til Statens vegvesen, normalt digitalt, ved overtakelse og når kjøpesummen er betalt."
            : "Partene melder eierskiftet til Statens vegvesen, normalt digitalt. Hvis ikke annet er avtalt over, meldes eierskiftet først når hele kjøpesummen er betalt.",
          "Kjøper betaler omregistreringsavgiften og andre kostnader ved omregistreringen.",
          "Kjøper skal ha forsikret Kjøretøyet fra overtakelse. Det er ulovlig å kjøre et kjøretøy som ikke har trafikkforsikring. Selger avslutter sin forsikring når eierskiftet er registrert.",
          "Selger er ansvarlig for bompenger, parkeringsavgifter og lignende krav knyttet til bruk av Kjøretøyet frem til overtakelse, og Kjøper for slike krav etter overtakelse.",
        ],
      });

    blocks.push(
      {
        type: "clause",
        title: "Lovvalg og tvister",
        paragraphs: [`For det som ikke er regulert i denne kontrakten, gjelder kjøpsloven. ${NORWEGIAN_LAW}`],
      },
      {
        type: "signatures",
        intro: "Kontrakten er utstedt i to eksemplarer, ett til hver part.",
        parties: [sigParty(c, "s", "SELGER", "selgers navn"), sigParty(c, "b", "KJØPER", "kjøpers navn")],
      },
    );
    return blocks;
  },
  warnings(a) {
    const out: Warning[] = [];
    if (a.sellerPrivate === "no" && (a.buyerConsumer ?? "yes") === "yes")
      out.push({
        level: "block",
        text: "Når en næringsdrivende selger til en forbruker, gjelder forbrukerkjøpsloven. Den gir kjøperen rettigheter som ikke kan avtales bort, så denne malen for privat salg passer ikke.",
        fields: ["sellerPrivate", "buyerConsumer"],
      });
    if (a.sellerPrivate === "no" && a.buyerConsumer === "no")
      out.push({
        level: "info",
        text: "Salg mellom to næringsdrivende reguleres også av kjøpsloven, men malen er skrevet for privat salg. Vurder om dere trenger flere vilkår, f.eks. om merverdiavgift og reklamasjon.",
        fields: ["sellerPrivate", "buyerConsumer"],
      });
    if (isVehicle(a))
      out.push({
        level: "info",
        text: "Før kjøpet bør kjøper sjekke at selger er registrert eier hos Statens vegvesen, og om det er tinglyst pant i kjøretøyet i Løsøreregisteret i Brønnøysundregistrene. Kjøretøyhistorikk og EU-kontroll kan sjekkes på registreringsnummeret.",
        fields: ["regNr", "encumbrance"],
      });
    if (!paidAtHandover(a))
      out.push({
        level: "info",
        text: "Leverer du før alt er betalt, tar du en risiko som selger. Vent gjerne med å melde eierskifte til hele kjøpesummen er betalt.",
        fields: ["paidInFull", "paymentTerms"],
      });
    if ((a.paymentMethod ?? "") === "cash" && parseAmount(a.price ?? "", "nb-NO") >= 40000)
      out.push({
        level: "info",
        text: "Ved større kontantbeløp er bankoverføring tryggere for begge: det gir sporbar dokumentasjon og ingen risiko for falske sedler.",
        fields: ["paymentMethod", "price"],
      });
    return out;
  },
};
