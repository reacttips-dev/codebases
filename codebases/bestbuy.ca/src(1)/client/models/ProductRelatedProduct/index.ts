import {SimpleProduct} from "../SimpleProduct";
import {Offer} from "../Offer";
import {Availability} from "../Availability";

export enum ProductRelationshipTypes {
    REQUIRED_PRODUCT = "required",
    SERVICE = "services",
    GSP = "gsp",
}

export interface BasicProductRelatedProducts {
    id: string;
    href: string;
    name: string;
}

export interface BasicProductRelatedProductsResponse {
    items: BasicProductRelatedProducts[];
    type?: ProductRelationshipTypes;
}

export interface ProductRelatedProduct extends BasicProductRelatedProducts {
    relationshipType: ProductRelationshipTypes;
    loading: boolean;
    product: SimpleProduct & {shortDescription: string};
    offer: Offer & {regularPrice: number};
    availability: Availability;
    content?: ProductServiceContent;
    error?: boolean;
}

export interface ProductServiceContext {
    items?: ProductServiceContent[];
}

export interface ProductServiceContent {
    checkboxLabel?: string;
    ctaText?: string;
    description?: string;
    serviceBenefits?: string;
    shortTitle?: string;
    title?: string;
    type?: string;
    icon?: {
        alternateText: string;
        url: string;
    };
}
