import { Offer } from "models";
import { OfferProvider } from ".";

export default class NullOfferProvider implements OfferProvider {

    public async getOffers(sku: string): Promise<Offer[]> {
        return [];
    }
}
