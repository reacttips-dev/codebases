import {SponsoredProductList, SponsoredProductPageId} from "../../models";

export interface SponsoredProductsApiProps {
    url: string;
    accountId: string;
    pageId: SponsoredProductPageId;
    retailerVisitorId: string;
    environment: string;
    customerId?: string;
    keywords?: string;
    pageNumber?: number;
    category?: string;
    filters?: SponsoredProductsFilter[];
    item?: string;
}

export interface SponsoredProductProps {
    pageId: string;
    keywords?: string;
    category?: string;
    filters?: SponsoredProductsFilter[];
}

export interface SponsoredProductsFilter {
    filterName: SponsoredProductsFilterName;
    operator: SponsoredProductsFilterOperator;
    value: string[];
}

export enum SponsoredProductsFilterName {
    brand = "brand",
    price = "price",
    rating = "rating",
    lowerenvironment = "lowerenvironment",
    vendortype = "vendortype",
    onsale = "onsale",
}

export enum SponsoredProductsVendorType {
    bestBuy = "BestBuy",
    marketplace = "Marketplace",
}

/**
 * Sponsored Product Filter Operators
 * eq - Equal to
 * gt - Greater than
 * lt - Less than
 * ge - Greater than OR equal to
 * le - Less than than OR equal to
 * in - Membership in a than OR equal to
 */
export type SponsoredProductsFilterOperator = "eq" | "gt" | "lt" | "ge" | "le" | "in";

export interface SponsoredProductsProvider {
    getSponsoredProducts(props: SponsoredProductsApiProps): Promise<SponsoredProductList | null>;
}
