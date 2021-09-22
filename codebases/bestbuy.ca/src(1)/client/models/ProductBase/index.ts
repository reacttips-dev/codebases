import * as moment from "moment";

export interface ProductBaseProps {
    saleEndDate: string | number;
    customerRatingCount: number;
    customerRating: number;
    sku: string;
    name: string;
    salePrice: number;
    regularPrice: number;
    hideSaving: boolean;
    ehf: number;
    isMarketplace: boolean;
    isAdvertised: boolean;
    isOnlineOnly: boolean;
    isSponsored: boolean;
    externalUrl: string;
}

export class ProductBase {
    public readonly ehf: number;
    public readonly saleEndDate?: string;
    public readonly customerRatingCount: number;
    public readonly customerRating: number;
    public readonly sku: string;
    public readonly name: string;
    public readonly isOnSale: boolean;
    public readonly saving: number;
    public readonly priceWithoutEhf: number;
    public readonly priceWithEhf: number;
    public readonly isMarketplace: boolean;
    public readonly isSponsored: boolean;
    public readonly externalUrl: string;
    public isAdvertised: boolean;
    public isOnlineOnly: boolean;
    public readonly regularPrice: number;

    constructor(props: ProductBaseProps) {
        this.ehf = props.ehf;
        this.saleEndDate = this.getSaleEndDate(props.saleEndDate);
        this.customerRating = props.customerRating;
        this.customerRatingCount = props.customerRatingCount;
        this.sku = props.sku;
        this.name = props.name;
        this.isOnSale = props.regularPrice !== props.salePrice;
        this.saving = this.isOnSale && !props.hideSaving ? props.regularPrice - props.salePrice : 0;
        this.priceWithoutEhf = this.isOnSale ? props.salePrice : props.regularPrice;
        this.priceWithEhf = this.priceWithoutEhf + props.ehf;
        this.isMarketplace = props.isMarketplace;
        this.isAdvertised = props.isAdvertised;
        this.isOnlineOnly = props.isOnlineOnly;
        this.externalUrl = props.externalUrl;
        this.isSponsored = props.isSponsored;
        this.regularPrice = props.regularPrice;
    }

    /**
     *  Currently we retrieve dates as Epoch time or as a Long Date Pattern
     *  The date is stored on our servers as CST/CDT (Central Standard Time) UTC -6/-5
     *  All the dates should be displayed in PST/PDT (Pacific Standard Time) UTC -8/-7 regardless of the local time
     *
     *  Example inputs:
     *      EPOCH:      1488506340000
     *      En:         2017-03-03 1:59:00 AM
     *      Fr:         2017-03-03 01:59:00
     *
     *  Date in PST should be in this case "March 2, 2017 11:59 PM"
     *  Expected display:
     *      En:         March 2, 2017
     *      Fr:         2 mars 2017
     *
     * @private
     * @param {(string | number)} saleEndDate
     * @returns {string} ISO 8601 fomratted date string
     * @memberof ProductBase
     */
    private getSaleEndDate(saleEndDate: undefined | string | number): string | undefined {
        if (!saleEndDate) {
            return undefined;
        }

        const englishApiDateFormat = "YYYY-MM-DD h:mm:ss A Z";
        const frenchApiDateFormat = "YYYY-MM-DD HH:mm:ss Z";
        const cstOffset = " -06:00";
        let saleEndDateMoment: moment.Moment;

        if (isNaN(Number(saleEndDate))) {
            // PDP logic
            // Add CST/CDT timezone offset from UTC
            saleEndDate += cstOffset;
            saleEndDateMoment = moment.parseZone(saleEndDate, englishApiDateFormat, true);

            if (!saleEndDateMoment.isValid()) {
                saleEndDateMoment = moment.parseZone(saleEndDate, frenchApiDateFormat, true);
            }
        } else {
            // PLP logic
            const saleEndDateNum = typeof saleEndDate === "string" ? Number(saleEndDate) : saleEndDate;
            saleEndDateMoment = moment.utc(saleEndDateNum);
        }

        return saleEndDateMoment.format();
    }
}
