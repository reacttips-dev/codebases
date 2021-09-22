import {SpecialOffer, Locale} from "models";
import ApiSpecialOffersProvider from "./ApiSpecialOffersProvider";

export interface SpecialOffersProvider {
    getSpecialOffers(sku: string, locale: Locale, futureDatePricingValue: string | null, postalCode?: string): Promise<SpecialOffer[]>;
}

export const getSpecialOffersProvider = (url: string, isFutureDatePricingEnabled: boolean): SpecialOffersProvider => {
    return new ApiSpecialOffersProvider(url, isFutureDatePricingEnabled);
};
