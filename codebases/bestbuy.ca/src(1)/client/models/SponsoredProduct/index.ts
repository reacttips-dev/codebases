import {SimpleProduct} from "models/SimpleProduct";

export enum SponsoredProductPageId {
    search = "Search",
    browse = "Browse",
    collection = "Collection",
    pdp = "PDP",
    homepage = "Homepage",
}

export enum SponsoredProductResponseKey {
    homepage = "Homepage-Carousel",
    pdp = "PDP-PDPplacement",
    search = "Search-InGrid",
    browse = "Browse-InGrid",
    collection = "Collection-InGrid",
}

export type SponsoredProductResponse = {
    [key in SponsoredProductResponseKey]?: SponsoredProductAd;
};

export interface SponsoredProductAd {
    ProductAd: SponsoredProductAdDetails[];
}

export interface SponsoredProductAdDetails {
    ProductSKU: string;
    ProductPage: string;
    OnClickBeacon: string;
    ParentSKU: string;
    OnViewBeacon: string;
}

export interface SponsoredProductList extends SponsoredProductResponse {
    OnLoadBeacon: string;
}

export interface SponsoredProduct extends SimpleProduct {
    externalUrl: string;
    criteoData: SponsoredProductAdDetails;
    isSponsored: boolean;
}
