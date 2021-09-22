import {HttpRequestType} from "errors";
import {Offer, Region} from "models";
import fetch from "utils/fetch";
import {OfferProvider} from ".";

export default class ApiOfferProvider implements OfferProvider {
    constructor(private url: string, private isFutureDatePricingEnabled: boolean = false) {}

    public async getOffers(sku: string, region: Region, futureDatePricingValue: string | null = ""): Promise<Offer[]> {
        const uri = `${this.url}/${sku}/offers`;
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
                // browser side rendering, use window.fetch API, need set credentials to 'include'.
                // then browser always send user credentials (cookies, basic http auth, etc...), even for cross-orign calls.
                option = {credentials: "include"};
            }
        }
        const response = await fetch(uri, HttpRequestType.OfferApi, option);
        const json = await response.json();

        return json.map((offer) => {
            const savings: number = offer.regularPrice - offer.salePrice;
            const matchedOfferEhf = offer.ehf && offer.ehf.find((offerEhf) => offerEhf.province === region);
            const ehf = matchedOfferEhf ? matchedOfferEhf.amount : 0;

            const result: Offer = {
                isWinner: offer.isWinner,
                offerId: offer.offerId,
                pricing: {
                    ehf,
                    priceWithEhf: offer.salePrice + ehf,
                    priceWithoutEhf: offer.salePrice,
                    saleEndDate: offer.saleEndDate,
                    saving: offer.hideSavings ? 0 : savings,
                },
                sellerId: offer.sellerId,
                warranty: offer.warranty,
            };

            return result;
        });
    }
}
