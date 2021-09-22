import {ProductBase, ProductBaseProps} from "../ProductBase";
import {SponsoredProductAdDetails} from "models/SponsoredProduct";

const seoNameExpression = /product\/(.*)\//;

export interface SimpleProductProps extends ProductBaseProps {
    productUrl: string;
    thumbnailImage: string;
    isAvailable?: boolean;
    isAvailabilityLoaded?: boolean;
    isOpenBox?: boolean;
    isPreOrder?: boolean;
    modelNumber?: string;
    categoryIds: string[];
    query?: any;
    isDynamicContent?: boolean;
}

export class SimpleProduct extends ProductBase {
    public seoName: string;
    public thumbnailImage150: string;
    public thumbnailImage250: string;
    public thumbnailImage500: string;
    public productUrl?: string;
    public criteoData?: SponsoredProductAdDetails;
    public modelNumber?: string;
    public isOpenBox?: boolean;
    public categoryIds: string[];
    public isDynamicContent?: boolean;

    constructor(props: SimpleProductProps) {
        super(props);

        // TODO: hack to build seoName until search API is fixed
        this.seoName = this.getSeoName(props.productUrl);

        const thumbnailImage = props.thumbnailImage || "";

        this.categoryIds = props.categoryIds;
        this.thumbnailImage150 = thumbnailImage;
        this.thumbnailImage250 = thumbnailImage.replace(/150x150/, "250x250");
        this.thumbnailImage500 = thumbnailImage.replace(/150x150/, "500x500");
        this.isOpenBox = props.isOpenBox;
        this.modelNumber = props.modelNumber;
        this.isDynamicContent = props.isDynamicContent;
    }

    private getSeoName(productUrl: string) {
        const regexResults = seoNameExpression.exec(productUrl);
        if (!regexResults || regexResults.length < 2) {
            return;
        }
        return regexResults[1];
    }
}
