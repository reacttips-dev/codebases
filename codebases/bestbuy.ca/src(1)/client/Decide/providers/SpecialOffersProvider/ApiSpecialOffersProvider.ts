import { HttpRequestType } from "errors";
import { SpecialOffer, Locale } from "models";
import fetch from "utils/fetch";
import { SpecialOffersProvider } from ".";

export default class ApiSpecialOffersProvider implements SpecialOffersProvider {
  constructor(private url: string, private isFutureDatePricingEnabled: boolean = false) {}

  public async getSpecialOffers(
    sku: string,
    locale: Locale = "en-CA",
    futureDatePricingValue: string | null = "",
    postalCode?: string
  ): Promise<SpecialOffer[]> {
    const uri = `${this.url}/${sku}/special-offers?lang=${locale.toLocaleLowerCase()}&postalcode=${postalCode}`;
    let option: RequestInit = {};

    if (this.isFutureDatePricingEnabled) {
      if (typeof window === "undefined") {
        if (typeof futureDatePricingValue === "string" && futureDatePricingValue.length > 0) {
          // server side rendering, use nodeFetch API, need explicit pass cookie header.
          option = {
            headers: {
              cookie: futureDatePricingValue,
              "Cache-Control": "no-cache",
            },
          };
        }
      } else {
        option = { credentials: "include" };
      }
    }
    const response = await fetch(uri, HttpRequestType.SpecialOffersApi, option);
    const json = await response.json();
    const specialOffers: SpecialOffer[] = json?.specialOffers || [];

    return specialOffers;
  }
}
