import { Offer, Pricing, Region } from "models";
import * as moment from "moment";
import { OfferProvider } from ".";

const sellerIds = ["326096", "331115", "332121", "271246", "332119", "307114", "320114", "seller 7", "seller 8", "seller 9"];

const regionEhf = {
    AB: 0,
    BC: 1,
    MB: 2,
    NB: 3,
    NL: 4,
    NS: 5,
    NT: 6,
    NU: 7,
    ON: 8,
    PE: 9,
    QC: 10,
    SK: 11,
    YT: 12,
};

export default class MockOfferProvider implements OfferProvider {

    public async getOffers(sku: string, region: Region): Promise<Offer[]> {

        const count = await this.getCount(sku);
        const offers: Offer[] = [];

        for (let i = 0; i < 10; i++) {
            offers.push({
                isWinner: i === 0,
                offerId: "offer" + i,
                pricing: this.getPricing(i + 1, region),
                sellerId: sellerIds[i],
            });
        }

        return Promise.resolve(offers.slice(0, count));
    }

    public getCount(sku: string): Promise<number> {

        const char = sku.slice(-1);
        const count = parseInt(char, 10);
        if (isNaN(count)) { return Promise.resolve(1); }
        return new Promise( (resolve) => setTimeout( () => resolve(count), 1000));
    }

    private getPricing(index: number, region: Region): Pricing {

        const ehf = index % 2 !== 0 ? regionEhf[region] : 0;

        return {
            ehf,
            isSubscription: false,
            priceWithEhf: index + ehf,
            priceWithoutEhf: index,
            saleEndDate: index % 2 === 0 ? this.getSalesEndDate(index) : undefined,
            saving: index % 2 === 0 ? index / 2 : 0,
        };
    }

    private getSalesEndDate(index: number): string {
        return moment().add(index, "d").format();
    }
}
