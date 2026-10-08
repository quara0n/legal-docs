@AGENTS.md

# Rettfram

Norsk dokumentbygger («Avtaler, rett fram.») på https://rettframavtaler.no, drevet av Rune Finne (ENK). Les `HANDOFF.md` først: den har status, hva som gjenstår, konti, regler fra eieren og hva Claude ikke kan gjøre for ham.

- Norge først: `NEXT_PUBLIC_MARKET` er «no» som standard. Norsk tekst ligger i `src/i18n/nb.tsx`, og `Dict`-typen følger `en.tsx`.
- Jobb selvstendig og still ikke spørsmål der en fornuftig standard finnes. Se etter i kontoer, minne og repo før du ber Rune om noe.
- Kjøp ingenting uten at Rune sier det. Aldri be ham lime hemmeligheter inn i chatten.
- Ikke kall malene advokatgodkjent eller juridisk rådgivning.
- Kjør `npm test`, lint og `npx next typegen && npx tsc --noEmit` før du pusher til `main`.
