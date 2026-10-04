// Which market this deployment sells to. Set at build time with NEXT_PUBLIC_MARKET.
// "no" (Norway, the default) shows the Norwegian templates and a Norwegian site;
// "us" shows the US templates and the English site.
export type Market = "no" | "us";
export type Lang = "nb-NO" | "en-US";

export const MARKET: Market = process.env.NEXT_PUBLIC_MARKET === "us" ? "us" : "no";
export const LANG: Lang = MARKET === "no" ? "nb-NO" : "en-US";
export const HTML_LANG = MARKET === "no" ? "nb" : "en";
export const CURRENCY = MARKET === "no" ? "nok" : "usd";
