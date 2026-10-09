# Rettfram: overlevering

Sist oppdatert 8. oktober 2026. Eier: Rune Finne (ENK, org.nr. 915553346), GitHub `quara0n`. Skriver norsk eller engelsk. Vil at Claude jobber selvstendig, uten unødvendige spørsmål, og bare gir ham de stegene som krever ham (passord, godkjenne vilkår, betaling).

## Hva dette er
Rettfram er en norsk dokumentbygger («Avtaler, rett fram.»). 7 maler til 99–199 kr, engangsbetaling via Stripe, ingen konto. Live på **https://rettframavtaler.no**. Next.js 16, Tailwind 4, pdf-lib, Stripe. Koden pushes til `main`. Les `AGENTS.md` før du skriver Next.js-kode.

## Status
**Virker og er live**
- Nettsted med SSL, ekte Stripe-betaling (kjøp og refusjon testet 5. okt.).
- E-post: `kundeservice@rettframavtaler.no` videresendes via ImprovMX (gratis) til `runefinne1989@gmail.com`. MX og SPF ligger hos Domeneshop.
- Måling bak samtykkebanner: GA4 `G-VZ24H0JQWX`, Microsoft Clarity `yunhwt7mn9`. Search Console er bekreftet (domeneeiendom) og sitemap er sendt inn.
- 7 SEO-guider på `/guide`.
- Google Ads-søkekampanje «Søk – Rettfram dokumenter» publisert 8. okt. i konto **752-112-1519** (NOK): 14 kr/dag (ca. 100 kr i uka), Norge, norsk, kun Google Søk, maks 8 kr per klikk, 11 søkeord.
- Reklamevideo (20–23 s, norsk ElevenLabs-stemme «Haldor») ligger på Runes PC: `C:\Users\runef\Claude folder\rettfram-video\RETTFRAM-REEL-FINAL.mp4`.
- Markedsplan og annonseoppsett: `/mnt/project-files/rettfram/marketing/markedsplan.md` og `google-ads-sokekampanje.md`.

## Gjenstår
1. **Betalingskort i Google Ads** (Fakturering). Uten det vises ikke annonsene. Rune må sjekke.
2. ~~Kjøpssporing i Google Ads~~ **Ferdig 9. okt.:** GA4 er koblet til Google Ads (752-112-1519), og «purchase» er importert som primær kjøpskonvertering. Ingen kodeendring trengs (ikke bruk konverteringsetikett i tillegg, det gir dobbelttelling). `finne89@gmail.com` er administrator i Rettfram-Analytics. Første kjøp vises i Ads 1–2 døgn etter at det skjer.
3. **Sjekk annonsene:** ingen overskrift skal si at fremleiekontrakt koster 99 kr (den koster 129 kr), og negative søkeord (advokat, jobb, kjøpekontrakt bolig m.fl., se `google-ads-sokekampanje.md`) skal være lagt inn.
4. **Om en uke (ca. 15. okt.):** se på søkeord, klikk og kjøp i Google Ads, Search Console og GA4. Juster bud og budsjett.
5. **Gmail «send som» `kundeservice@`** (smtp.gmail.com og app-passord, Rune gjør selv) og legg `include:_spf.google.com` til i SPF-posten hos Domeneshop.
6. **Vipps:** be om tilgang i Stripe (privat forhåndsvisning). Når det er godkjent, sett `NEXT_PUBLIC_VIPPS=1`.
7. **ElevenLabs:** gratisplanen tillater ikke kommersiell bruk. Oppgrader til Starter før videoen brukes i betalte annonser.
8. **Stripe:** legg til NOK-utbetalingskonto (saldoen står i EUR).

## Viktige fakta
- **Konti:** Google Ads for Rettfram er `752-112-1519`. Kontoen `143-420-6814` er **CV Hapi** (AUD), ikke bruk den. Google-verktøy er knyttet til `finne89@gmail.com`, og verifiseringskoder for både `finne89` og `runefinne1989` ligger i DNS.
- **Domene:** Domeneshop, administrert i **portal.domene.shop** (ikke vanlig domene.shop-innlogging). Navneservere kunne ikke byttes, så A-postene (`@` og `www` → 76.76.21.21) peker til Vercel.
- **Hosting:** Vercel-prosjektet `legal-docs` er koblet til GitHub (`quara0n/legal-docs`, koblet 4. okt.): push til `main` publiserer automatisk. Rune trenger ikke skrive «deploy». Miljøvariabler endres i Vercel og får effekt ved neste bygg. Live Stripe-nøkkel ligger kun i Production, Preview bruker sandbox. Miljøvariabler for sporing: `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`.
- **Stripe:** `managed_payments: { enabled: false }` i checkout-ruten er nødvendig på nye kontoer.
- **Marked:** `NEXT_PUBLIC_MARKET` er «no» som standard. USA-malene er skjult, ikke slettet.
- **Ingen advokatgjennomgang** (Rune har valgt bort det). Dokumentene markedsføres aldri som advokatgodkjent eller juridisk rådgivning. Se `LEGAL-CHECKLIST.md`.

## Regler fra Rune
- **Kjøp ingenting** uten at han sier det. Foretrekk gratisløsninger.
- **Hemmeligheter** (API-nøkler, passord) skal aldri limes inn i chatten. De skrives inn i et lokalt PowerShell-vindu på hans PC.
- **Se etter før du spør:** sjekk kontoer, nettleserpanelet, minnet og repoet før du ber ham om noe.
- **Hold instruksjoner til ham korte og ikke-tekniske.**

## Hva Claude ikke kan gjøre for Rune
Godta vilkår (Google, Microsoft, Stripe), lage kontoer, skrive passord eller bankkort, trykke «Publiser» på annonser. Alt annet kan gjøres uten å spørre.

## Praktisk
- Test: `npm test` (vitest, 161 tester), e2e med Playwright. Kjør `npx next typegen` før `tsc`.
- Lokal skjermbildekjøring: `npx next start -p 3123`. Stopp med `fuser -k 3123/tcp`, aldri `pkill -f "next start"`.
- Nettleserpanelet i Claude-appen har innebygd annonseblokkering, og Google Ads' søke-editor krasjer ofte i det mens kontoen står i «første kampanje»-veiviseren.
- Fra skyen kommer man ikke til Vercel, Stripe, registrar eller Brreg. Det går via Runes PC (Remote Control).
