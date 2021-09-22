import {Offer, Region} from "models";
import ApiOfferProvider from "providers/OfferProvider/ApiOfferProvider";
import MockOfferProvider from "./MockOfferProvider";
import NullOfferProvider from "./NullOfferProvider";

export interface OfferProvider {
    getOffers(sku: string, region: Region, futureDatePricingValue: string | null): Promise<Offer[]>;
}

export const getOfferProvider = (url: string, isFutureDatePricingEnabled: boolean): OfferProvider => {
    if (url === "mock") {
        return new MockOfferProvider();
    } else if (url) {
        return new ApiOfferProvider(url, isFutureDatePricingEnabled);
    }

    return new NullOfferProvider();
};
