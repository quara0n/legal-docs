import { makeCtx, joinList, type Answers, type Block, type Template, type Warning } from "@/lib/doc";
import { NORWEGIAN_LAW, partyFields, partyIntro, sigParty, sigPerson } from "./shared";

const TYPE: Record<string, string> = { leilighet: "en leilighet", hybel: "en hybel", rom: "et rom", hus: "et hus" };

const INCLUDED: Record<string, string> = {
  strom: "strøm",
  vann: "vann og avløp",
  varme: "oppvarming",
  internett: "internett",
  tv: "TV",
};

const list = (a: Answers, id: string) =>
  (a[id] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

// Minimum period in years under husleieloven § 9-3 that applies to this lease.
function minYears(a: Answers) {
  if (a.houseType === "tomannsbolig" || (a.shortReason ?? "").trim()) return 1;
  return 3;
}

function addYears(iso: string, years: number) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCFullYear(d.getUTCFullYear() + years);
  d.setUTCDate(d.getUTCDate() - 1);
  return d;
}

const isIso = (s?: string) => /^\d{4}-\d{2}-\d{2}$/.test(s ?? "");

export const husleiekontrakt: Template = {
  slug: "husleiekontrakt",
  locale: "nb-NO",
  name: "Husleiekontrakt",
  shortName: "Husleiekontrakt",
  tagline: "Lei ut leilighet, hus, hybel eller rom etter husleieloven.",
  category: "Real estate",
  price: 19900,
  minutes: 8,
  icon: "home",
  seo: {
    title: "Husleiekontrakt mal: lag leiekontrakt for bolig etter husleieloven",
    description:
      "Lag husleiekontrakt for leilighet, hus, hybel eller rom: leietid, depositum, KPI-regulering og mer. Forhåndsvis gratis, betal 199 kr én gang for PDF-en.",
    intro:
      "En husleiekontrakt avtaler vilkårene mellom utleier og leietaker: leie, depositum, hvor lenge leieforholdet varer og hvem som har ansvar for hva. Husleieloven gir leietakere av bolig et vern som ikke kan avtales bort, og malen er bygget rundt disse reglene. En skriftlig kontrakt med riktige klausuler gjør det også enklere å få hjelp fra namsmannen hvis leien ikke betales.",
    whenToUse: [
      "Du leier ut en leilighet, et hus eller en sekundærleilighet",
      "Du leier ut en hybel eller et rom i egen bolig",
      "Du skal inngå ny kontrakt med en leietaker som allerede bor der",
      "Du vil gå fra en muntlig avtale til en skriftlig kontrakt",
    ],
    includes: [
      "Tidsbestemt eller tidsubestemt leie, med kontroll av minstetiden i husleieloven",
      "Husleie, forfall, kontonummer og hva som er inkludert",
      "Depositum (maks seks måneders leie) eller garanti",
      "Indeksregulering etter konsumprisindeksen",
      "Klausuler om tvangsfravikelse ved manglende betaling og ved leietidens slutt",
      "Husdyr, røyking, vedlikehold, fremleie, overtakelse og fraflytting",
    ],
    faq: [
      {
        q: "Hvor stort depositum kan jeg kreve?",
        a: "Husleieloven § 3-5 setter taket for sikkerhet (depositum eller garanti) til et beløp som tilsvarer seks måneders leie. Depositumet skal stå på en egen depositumskonto i leietakers navn, og utleier betaler kostnadene ved å opprette kontoen. Ingen av partene kan disponere pengene alene mens leieforholdet varer.",
      },
      {
        q: "Hvor lenge må en tidsbestemt leiekontrakt vare?",
        a: "Hovedregelen i husleieloven § 9-3 er minst tre år. Minstetiden er ett år hvis boligen ligger i en tomannsbolig der utleier selv bor i den andre boligen, eller hvis utleier har en saklig grunn som er opplyst skriftlig. Er det avtalt kortere tid, kan leietaker kreve at leieforholdet varer minstetiden. Det kan gjelde egne regler for rom i utleiers egen bolig, så sjekk loven hvis det gjelder deg.",
      },
      {
        q: "Kan utleier øke husleien?",
        a: "Ja, innenfor rammene i husleieloven. Leien kan justeres i takt med konsumprisindeksen én gang i året, med minst én måneds skriftlig varsel (§ 4-2). Etter at leieforholdet har vart en stund, kan hver av partene i tillegg kreve leien endret til gjengs leie etter egne regler i loven. Andre økninger må leietaker være enig i.",
      },
    ],
  },
  steps: [
    {
      id: "utleier",
      label: "Utleier",
      title: "Hvem er utleier?",
      description: "Eieren av boligen, eller selskapet som leier den ut.",
      fields: partyFields("ut", "utleier", { email: true }),
    },
    {
      id: "leietaker",
      label: "Leietaker",
      title: "Hvem skal leie?",
      description: "Er dere to som leier sammen, kan du legge til en leietaker til. Dere blir da solidarisk ansvarlige.",
      fields: [
        ...partyFields("lt", "leietaker", { allowCompany: false, email: true }),
        { id: "lt2Name", label: "Leietaker nr. 2 (valgfritt)", type: "text", half: true, placeholder: "Fullt navn" },
        { id: "lt2Birth", label: "Fødselsdato, leietaker nr. 2", type: "date", half: true, showIf: (a) => !!(a.lt2Name ?? "").trim() },
      ],
    },
    {
      id: "bolig",
      label: "Boligen",
      title: "Hvilken bolig leies ut?",
      fields: [
        { id: "address", label: "Adresse", type: "text", required: true, placeholder: "Storgata 1 H0201, 0155 Oslo" },
        {
          id: "propType",
          label: "Type bolig",
          type: "select",
          defaultValue: "leilighet",
          half: true,
          options: [
            { value: "leilighet", label: "Leilighet" },
            { value: "hybel", label: "Hybel" },
            { value: "rom", label: "Rom" },
            { value: "hus", label: "Enebolig/hus" },
          ],
        },
        {
          id: "houseType",
          label: "Bor utleier i samme hus?",
          type: "select",
          defaultValue: "nei",
          half: true,
          options: [
            { value: "nei", label: "Nei" },
            { value: "tomannsbolig", label: "Ja, i den andre boligen i en tomannsbolig" },
            { value: "egen", label: "Ja, boligen er en del av utleiers egen bolig" },
          ],
          help: "Påvirker minstetiden for tidsbestemte kontrakter.",
        },
        {
          id: "extras",
          label: "Hva følger med?",
          type: "multi",
          options: [
            { value: "mobler", label: "Møblert" },
            { value: "bod", label: "Bod" },
            { value: "parkering", label: "Parkering" },
          ],
        },
        { id: "extrasNote", label: "Beskrivelse (valgfritt)", type: "text", placeholder: "f.eks. bod nr. 12 i kjelleren, parkeringsplass nr. 4" },
        {
          id: "shared",
          label: "Fellesarealer leietaker kan bruke (valgfritt)",
          type: "text",
          placeholder: "f.eks. vaskerom, hage, kjøkken",
          showIf: (a) => a.propType === "rom" || a.propType === "hybel",
        },
      ],
    },
    {
      id: "periode",
      label: "Leieperiode",
      title: "Hvor lenge skal leieforholdet vare?",
      fields: [
        {
          id: "term",
          label: "Type kontrakt",
          type: "choice",
          defaultValue: "tidsubestemt",
          options: [
            { value: "tidsubestemt", label: "Tidsubestemt", description: "Løper til en av partene sier opp." },
            { value: "tidsbestemt", label: "Tidsbestemt", description: "Slutter på en avtalt dato, som hovedregel tidligst etter tre år." },
          ],
        },
        { id: "start", label: "Startdato", type: "date", required: true, half: true },
        { id: "end", label: "Sluttdato", type: "date", required: true, half: true, showIf: (a) => a.term === "tidsbestemt" },
        {
          id: "noticeMonths",
          label: "Oppsigelsestid (måneder)",
          type: "number",
          defaultValue: "3",
          half: true,
          help: "Lovens utgangspunkt for bolig er tre måneder, regnet fra utløpet av kalendermåneden.",
          showIf: (a) => a.term !== "tidsbestemt",
        },
        {
          id: "shortReason",
          label: "Saklig grunn for kortere leietid (valgfritt)",
          type: "text",
          placeholder: "f.eks. Utleier skal selv flytte inn i boligen etter leieperioden.",
          help: "Med en saklig grunn som står i kontrakten, er minstetiden ett år i stedet for tre.",
          showIf: (a) => a.term === "tidsbestemt",
        },
        {
          id: "tbNotice",
          label: "Kan kontrakten sies opp i leieperioden?",
          type: "select",
          defaultValue: "begge",
          showIf: (a) => a.term === "tidsbestemt",
          options: [
            { value: "begge", label: "Ja, begge parter kan si opp" },
            { value: "leietaker", label: "Ja, men bare leietaker" },
            { value: "nei", label: "Nei, ingen kan si opp" },
          ],
          help: "En tidsbestemt kontrakt kan bare sies opp underveis hvis det er avtalt.",
        },
        {
          id: "tbNoticeMonths",
          label: "Oppsigelsestid (måneder)",
          type: "number",
          defaultValue: "3",
          half: true,
          showIf: (a) => a.term === "tidsbestemt" && a.tbNotice !== "nei",
        },
      ],
    },
    {
      id: "leie",
      label: "Husleie",
      title: "Husleie og betaling",
      fields: [
        { id: "rent", label: "Månedlig leie", type: "money", required: true, half: true, placeholder: "12 000" },
        { id: "dueDay", label: "Forfaller den", type: "number", defaultValue: "1", half: true, help: "Dag i måneden" },
        { id: "account", label: "Kontonummer for leie", type: "text", half: true, placeholder: "1234 56 78903" },
        {
          id: "included",
          label: "Inkludert i leien",
          type: "multi",
          options: [
            { value: "strom", label: "Strøm" },
            { value: "vann", label: "Vann og avløp" },
            { value: "varme", label: "Oppvarming" },
            { value: "internett", label: "Internett" },
            { value: "tv", label: "TV" },
          ],
          help: "Det som ikke er krysset av, betaler leietaker selv.",
        },
      ],
    },
    {
      id: "sikkerhet",
      label: "Depositum",
      title: "Depositum eller garanti",
      fields: [
        {
          id: "security",
          label: "Sikkerhet",
          type: "choice",
          defaultValue: "depositum",
          options: [
            { value: "depositum", label: "Depositum", description: "På egen depositumskonto i leietakers navn." },
            { value: "garanti", label: "Garanti", description: "F.eks. husleiegaranti fra bank, forsikringsselskap eller NAV." },
            { value: "ingen", label: "Ingen sikkerhet" },
          ],
        },
        { id: "deposit", label: "Beløp", type: "money", required: true, half: true, placeholder: "36 000", showIf: (a) => a.security !== "ingen", help: "Maks seks måneders leie." },
      ],
    },
    {
      id: "regler",
      label: "Husregler",
      title: "Husdyr, røyking og andre regler",
      fields: [
        {
          id: "pets",
          label: "Husdyr",
          type: "select",
          defaultValue: "avtale",
          half: true,
          options: [
            { value: "forbudt", label: "Ikke tillatt" },
            { value: "tillatt", label: "Tillatt" },
            { value: "avtale", label: "Etter skriftlig avtale" },
          ],
        },
        {
          id: "smoking",
          label: "Røyking",
          type: "select",
          defaultValue: "forbudt",
          half: true,
          options: [
            { value: "forbudt", label: "Ikke tillatt innendørs" },
            { value: "tillatt", label: "Tillatt" },
          ],
        },
        { id: "houseRules", label: "Husordensregler eller andre avtaler (valgfritt)", type: "textarea", placeholder: "f.eks. Leietaker måker snø foran inngangen. Ro i huset etter kl. 23." },
      ],
    },
  ],
  render(a) {
    const c = makeCtx(a, "nb-NO");
    const tb = c.is("term", "tidsbestemt");
    const two = c.has("lt2Name");
    const extras = c.multi("extras");
    const included = list(a, "included").map((k) => INCLUDED[k]).filter(Boolean);
    const notIncluded = Object.keys(INCLUDED).filter((k) => !list(a, "included").includes(k)).map((k) => INCLUDED[k]);

    let ltIntro = partyIntro(c, "lt", "leietakers navn");
    if (two) ltIntro += ` og **${c.v("lt2Name", "navn")}**${c.has("lt2Birth") ? ` (f. ${c.date("lt2Birth", "fødselsdato")})` : ""}`;

    const extraParts: string[] = [];
    if (extras.includes("mobler")) extraParts.push("møbler og inventar som er i boligen ved overtakelse");
    if (extras.includes("bod")) extraParts.push("bod");
    if (extras.includes("parkering")) extraParts.push("parkeringsplass");

    const blocks: Block[] = [
      { type: "title", text: "Husleiekontrakt" },
      { type: "subtitle", text: "Leieavtale for bolig etter husleieloven" },
      {
        type: "paragraph",
        text: `Denne avtalen er inngått mellom ${partyIntro(c, "ut", "utleiers navn")} («Utleier») og ${ltIntro} (${two ? "sammen kalt «Leietaker»" : "«Leietaker»"}).${two ? " Leietakerne er solidarisk ansvarlige for alle forpliktelser etter avtalen, også for hele leien." : ""}`,
      },
      {
        type: "clause",
        title: "Boligen",
        paragraphs: [
          `Utleier leier ut ${c.opt("propType", TYPE, "bolig")} i ${c.v("address", "adresse")} («Boligen»)${extraParts.length ? `, sammen med ${joinList(extraParts, "og")}` : ""}.${c.has("extrasNote") ? ` ${c.v("extrasNote", "")}` : ""}`,
          c.has("shared") ? `Leietaker har rett til å bruke disse fellesarealene sammen med andre: ${c.v("shared", "")}.` : "",
          c.is("houseType", "tomannsbolig")
            ? "Boligen ligger i en tomannsbolig der Utleier selv bor i den andre boligen."
            : c.is("houseType", "egen")
              ? "Boligen er en del av Utleiers egen bolig."
              : "",
          "Boligen skal bare brukes som bolig for Leietaker og Leietakers husstand.",
        ].filter(Boolean),
      },
      {
        type: "clause",
        title: "Leieperiode",
        paragraphs: tb
          ? [
              `Leieforholdet er tidsbestemt. Det starter ${c.date("start", "startdato")} og slutter uten oppsigelse ${c.date("end", "sluttdato")}.${c.has("shortReason") ? ` Leietiden er kortere enn tre år av denne grunnen: ${c.v("shortReason", "")}` : ""}`,
              c.is("tbNotice", "nei")
                ? "Ingen av partene kan si opp avtalen i leieperioden."
                : c.is("tbNotice", "leietaker")
                  ? `Leietaker kan si opp avtalen i leieperioden med ${c.v("tbNoticeMonths", "antall")} måneders frist, regnet fra utløpet av kalendermåneden. Utleier kan ikke si opp avtalen i leieperioden.`
                  : `Hver av partene kan si opp avtalen i leieperioden med ${c.v("tbNoticeMonths", "antall")} måneders frist, regnet fra utløpet av kalendermåneden. Utleiers oppsigelse må følge reglene om oppsigelse nedenfor.`,
            ]
          : [
              `Leieforholdet er tidsubestemt og starter ${c.date("start", "startdato")}. Det løper til en av partene sier det opp med ${c.v("noticeMonths", "antall")} måneders frist, regnet fra utløpet av kalendermåneden oppsigelsen er mottatt.`,
            ],
      },
      {
        type: "clause",
        title: "Husleie",
        paragraphs: [
          `Leien er ${c.money("rent", "månedlig leie")} per måned. Leien betales forskuddsvis innen den ${c.v("dueDay", "forfallsdag")}. i hver måned til konto ${c.v("account", "kontonummer")}.`,
          [
            included.length ? `Leien inkluderer ${joinList(included, "og")}.` : "",
            notIncluded.length ? `Leietaker betaler selv for ${joinList(notIncluded, "og")}, i den grad dette er aktuelt for Boligen.` : "",
          ]
            .filter(Boolean)
            .join(" "),
        ],
      },
      {
        type: "clause",
        title: "Regulering av leien",
        paragraphs: [
          "Hver av partene kan kreve leien justert i samsvar med endringen i konsumprisindeksen (KPI) fra Statistisk sentralbyrå. Justering kan tidligst kreves ett år etter at leien sist ble fastsatt, og krever minst én måneds skriftlig varsel, jf. husleieloven § 4-2. Partene kan også kreve leien endret til gjengs leie etter reglene i husleieloven.",
        ],
      },
      {
        type: "clause",
        title: c.is("security", "garanti") ? "Garanti" : "Depositum",
        paragraphs: [
          c.is("security", "ingen")
            ? "Leietaker skal ikke stille depositum eller annen sikkerhet."
            : c.is("security", "garanti")
              ? `Før overtakelse skal Leietaker stille en garanti på ${c.money("deposit", "beløp")} som sikkerhet for leie, erstatning for skader på Boligen, utgifter ved fraflytting og andre krav etter avtalen. Garantien må være godkjent av Utleier og gjelde for hele leieperioden og en rimelig tid etter fraflytting.`
              : `Før overtakelse skal Leietaker betale et depositum på ${c.money("deposit", "beløp")} som sikkerhet for leie, erstatning for skader på Boligen, utgifter ved fraflytting og andre krav etter avtalen. Depositumet settes inn på en egen depositumskonto i Leietakers navn, jf. husleieloven § 3-5. Utleier betaler kostnadene ved å opprette kontoen. Ingen av partene kan disponere kontoen alene i leieperioden.`,
        ],
      },
      {
        type: "clause",
        title: "Mislighold og tvangsfravikelse",
        paragraphs: [
          "Betaler ikke Leietaker leien, eller misligholder Leietaker avtalen vesentlig på annen måte, kan Utleier heve avtalen etter reglene i husleieloven.",
          "Leietaker vedtar at tvangsfravikelse kan kreves dersom leien ikke betales innen 14 dager etter at skriftlig varsel er sendt etter tvangsfullbyrdelsesloven § 4-18.",
          tb ? "Leietaker vedtar også at tvangsfravikelse kan kreves når leietiden er ute, jf. tvangsfullbyrdelsesloven § 13-2 tredje ledd bokstav c." : "",
        ].filter(Boolean),
      },
      {
        type: "clause",
        title: "Husdyr og røyking",
        paragraphs: [
          `${c.is("pets", "tillatt") ? "Leietaker kan holde husdyr i Boligen, så lenge dyreholdet ikke er til ulempe for Utleier eller andre brukere av eiendommen. Leietaker er ansvarlig for skader dyrene gjør." : c.is("pets", "forbudt") ? "Husdyr er ikke tillatt i Boligen, med de unntakene som følger av husleieloven § 5-7." : "Leietaker kan bare holde husdyr etter skriftlig avtale med Utleier, med de unntakene som følger av husleieloven § 5-7."} ${c.is("smoking", "tillatt") ? "Røyking er tillatt, men Leietaker er ansvarlig for lukt og skader som går utover vanlig slit." : "Røyking er ikke tillatt innendørs i Boligen."}`,
        ],
      },
      {
        type: "clause",
        title: "Vedlikehold og skader",
        paragraphs: [
          "Utleier skal holde Boligen i den stand den var i ved overtakelse, og sørge for nødvendig vedlikehold og reparasjoner.",
          "Leietaker skal behandle Boligen med tilbørlig aktsomhet og ta seg av enkelt vedlikehold, som å bytte lyspærer og sikringer, rense sluk og vannlåser, og skifte batteri i røykvarslere. Leietaker skal straks melde fra til Utleier om skader eller feil som må utbedres. Leietaker er ansvarlig for skader som Leietaker, husstanden eller gjester forårsaker, utover vanlig slit og elde.",
          "Leietaker kan ikke gjøre endringer i Boligen uten Utleiers skriftlige samtykke.",
        ],
      },
      {
        type: "clause",
        title: "Fremleie",
        paragraphs: [
          "Leietaker kan ikke fremleie hele eller deler av Boligen uten Utleiers skriftlige samtykke, med de unntakene som følger av husleieloven.",
        ],
      },
      {
        type: "clause",
        title: "Utleiers adgang",
        paragraphs: [
          "Utleier har rett til adgang til Boligen for tilsyn og nødvendig vedlikehold etter varsel i rimelig tid på forhånd, og til et tidspunkt som passer for Leietaker. Ved akutte skader eller fare for skade kan Utleier gå inn uten forhåndsvarsel.",
        ],
      },
    ];
    if (c.has("houseRules")) blocks.push({ type: "clause", title: "Husordensregler og andre avtaler", paragraphs: [c.v("houseRules", "")] });
    blocks.push(
      {
        type: "clause",
        title: `Overtakelse`,
        paragraphs: [
          `Leietaker overtar Boligen ${c.date("start", "startdato")}. Partene går sammen gjennom Boligen ved overtakelse og fører en protokoll over tilstanden og antall nøkler. Protokollen signeres av begge og legges ved avtalen. Leietaker kan ikke lage flere nøkler uten Utleiers samtykke.`,
        ],
      },
      {
        type: "clause",
        title: `Fraflytting`,
        paragraphs: [
          "Når leieforholdet slutter, skal Leietaker levere tilbake Boligen ryddet, rengjort og i samme stand som ved overtakelse, bortsett fra vanlig slit og elde. Alle nøkler skal leveres tilbake. Partene går sammen gjennom Boligen ved fraflytting.",
        ],
      },
      {
        type: "clause",
        title: `Oppsigelse`,
        paragraphs: [
          "Oppsigelse fra Leietaker skal være skriftlig.",
          "Oppsigelse fra Utleier skal være skriftlig, begrunnet og med opplysning om Leietakers rett til å protestere, jf. husleieloven. Utleier kan bare si opp når det er saklig grunn etter husleieloven.",
        ],
      },
      {
        type: "clause",
        title: "Lovvalg og tvister",
        paragraphs: [
          `Husleieloven gjelder for leieforholdet. Bestemmelser i denne avtalen som gir Leietaker dårligere vilkår enn loven, gjelder ikke. ${NORWEGIAN_LAW} Tvister om leieforholdet kan også bringes inn for Husleietvistutvalget der det har myndighet.`,
        ],
      },
      {
        type: "signatures",
        intro: "Avtalen er utstedt i to eksemplarer, ett til hver part.",
        parties: [
          sigParty(c, "ut", "UTLEIER", "utleiers navn"),
          sigParty(c, "lt", two ? "LEIETAKER 1" : "LEIETAKER", "leietakers navn"),
          ...(two ? [sigPerson("LEIETAKER 2", c.v("lt2Name", "navn"))] : []),
        ],
      },
    );
    if (two)
      (blocks[blocks.length - 1] as Extract<Block, { type: "signatures" }>).intro =
        "Avtalen er utstedt i tre eksemplarer, ett til hver part.";
    return blocks;
  },
  warnings(a) {
    const out: Warning[] = [];
    const c = makeCtx(a, "nb-NO");
    const rent = c.num("rent");
    const dep = c.num("deposit");
    if (a.security !== "ingen" && rent > 0 && dep > rent * 6)
      out.push({
        level: "block",
        text: "Depositum eller garanti kan ikke være mer enn seks måneders leie (husleieloven § 3-5). Senk beløpet for å fortsette.",
        fields: ["deposit", "rent"],
      });
    if (a.term === "tidsbestemt" && isIso(a.start) && isIso(a.end)) {
      if (a.end <= a.start)
        out.push({ level: "info", text: "Sluttdatoen er før startdatoen. Sjekk datoene.", fields: ["start", "end"] });
      else if (a.houseType === "egen")
        out.push({
          level: "info",
          text: "For rom eller hybel i utleiers egen bolig kan det gjelde egne regler om minstetid. Sjekk husleieloven § 9-3 og særreglene for husrom i utleiers egen bolig.",
          fields: ["end", "houseType"],
        });
      else {
        const y = minYears(a);
        if (new Date(a.end + "T00:00:00Z") < addYears(a.start, y))
          out.push({
            level: "info",
            text: `Leieperioden er kortere enn minstetiden på ${y === 1 ? "ett år" : "tre år"} som gjelder her (husleieloven § 9-3). Leietaker kan da kreve å bli boende i hele minstetiden.${y === 3 ? " Minstetiden er ett år hvis du oppgir en saklig grunn, eller hvis boligen er i en tomannsbolig der du bor i den andre boligen." : ""}`,
            fields: ["end", "shortReason", "houseType"],
          });
      }
    }
    const nm = c.num(a.term === "tidsbestemt" ? "tbNoticeMonths" : "noticeMonths");
    if (!(a.term === "tidsbestemt" && a.tbNotice === "nei") && nm > 0 && nm < 3)
      out.push({
        level: "info",
        text: "Lovens utgangspunkt er tre måneders oppsigelsestid for bolig, og det er grenser for hvor kort frist som kan avtales. Behold tre måneder med mindre du har sjekket at kortere frist er lovlig for din bolig.",
        fields: ["noticeMonths", "tbNoticeMonths"],
      });
    return out;
  },
};
