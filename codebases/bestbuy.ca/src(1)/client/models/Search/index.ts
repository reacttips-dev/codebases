import {Availabilities} from "../Availability";
import {Brand} from "../Brands";
import {Category, ShopByCategory} from "../Category";
import {SimpleProduct as Product} from "../SimpleProduct";
import {PromoBanner} from "components/PromoBanner";
import {DynamicContentModel} from "models";

export enum SearchPathTypes {
    Query = "Query",
    Category = "Category",
}

export enum SearchPathNames {
    Brands = "Brands",
    Marque = "Marque",
    Price = "Price",
    Prix = "Prix",
    SoldAndShippedBy = "Sold & Shipped By",
    VenduEtExpediePar = "Vendu et expédié par",
    CurrentOffers = "Current Offers",
    OffresCourantes = "Offres courantes",
}

export const BestBuyOnlyValue = "Best Buy";
export enum OnSaleFilterValue {
    En = "On Sale",
    Fr = "En solde",
}

export interface SearchPath {
    name: SearchPathNames;
    selectPath: string;
    type: SearchPathTypes;
    unselectPath: string;
    value: string;
}

export interface SearchState {
    availabilities: Availabilities;
    loadingMore: boolean;
    path: string;
    query: string;
    searchResult: SearchResult;
    criteoProducts: Product[];
    searching: boolean;
    sort: ProductSort;
    category: Category;
    sscId: string;
    brand: Brand;
    page: number;
    recommendations: {
        topSellers: any;
    };
    wasFacetFilterSelected: boolean;
    dynamicContent?: DynamicContentModel;
    isSponsoredProductsLoaded?: boolean;
    minPrice: string;
    maxPrice: string;
    appliedRangeQuery: boolean;
    rangeQueryHasResults: boolean;
    pathBeforeRangeQuery: string;
}

export interface Ssc {
    id: string;
    title: string;
    seoUrlText: string;
    altLangSeoUrlText: string;
    name: string;
    endDate?: number;
    promoBanner?: PromoBanner;
    shopByCategory?: ShopByCategory;
    lifestyleBanner?: PromoBanner;
}

export enum ProductSort {
    bestMatch = "bestMatch",
    highestRated = "highestRated",
    priceHighToLow = "priceHighToLow",
    priceLowToHigh = "priceLowToHigh",
}

export interface SearchResult {
    facets: Facet[];
    paths: SearchPath[];
    products: Product[];
    organicAndSponsoredProducts?: Product[];
    total: number;
    totalPages: number;
    ssc?: Ssc;
    redirectUrl?: string;
    totalSelectedFilterCount?: number;
    pageSize?: number;
    selectedFacets?: Facet[];
}

export function getSearchResultProductsLength(searchResult: SearchResult) {
    if (!searchResult) {
        return 0;
    }
    if (!searchResult.products) {
        return 0;
    }
    return searchResult.products.length;
}

export function getSearchResultProductsLastPage(searchResult: SearchResult, pageSize: number, page: number) {
    const numberOfProducts = getSearchResultProductsLength(searchResult);
    if (numberOfProducts <= pageSize) {
        return searchResult.products;
    }
    const numberOfProductsBeforeLastPage = pageSize * (page - 1);
    const numberOfProductsLastPage = numberOfProducts - numberOfProductsBeforeLastPage;
    return searchResult.products.slice(-numberOfProductsLastPage);
}

export interface Facet {
    name: string;
    systemName: string;
    filters: FacetFilter[];
    order: number;
    isMultiSelect: boolean;
    selectedFilterCount?: number;
}

export interface FacetFilter {
    isSelected: boolean;
    name: string;
    path: string;
    count?: number;
    depth?: number;
}
