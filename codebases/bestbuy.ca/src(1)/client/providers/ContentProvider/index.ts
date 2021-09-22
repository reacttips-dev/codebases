import {HomePageContent} from "models";
import ApiHomePageContentProvider from "providers/ContentProvider/ApiHomePageContentProvider";
import ApiPersonalizedContentProvider from "providers/ContentProvider/ApiPersonalizedContentProvider";
import ApiHomePageFallbackContentProvider from "providers/ContentProvider/ApiHomePageFallbackContentProvider";
import ApiCollectionContentProvider from "./ApiCollectionContentProvider";
import ApiCategoryContentProvider from "./ApiCategoryContentProvider";
import ApiEventMarketingProvider from "./ApiEventMarketingContentProvider";
import ApiProductContentProvider from "./ApiProductContentProvider";
import ApiBrandStoreContentProvider from "providers/ContentProvider/ApiBrandStoreContentProvider";
import ApiBrandPageContentProvider from "providers/ContentProvider/ApiBrandPageContentProvider";
import {ApiServiceContentProvider} from "providers/ContentProvider/ApiServiceContentProvider";
import ApiCorporateContentProvider from "./ApiCorporateContentProvider";
import ApiCareersContentProvider from "./ApiCareersContentProvider";
import ApiSearchContentProvider from "./ApiSearchContentProvider";

export interface HomePageContentProvider {
    getContent(): Promise<HomePageContent>;
    getEntry?(contentType: string, entryId: string): Promise<any>;
}

export function createHomePageContentProvider(
    baseUrl: string,
    locale: Locale,
    regionCode: string,
    queryParams?: {[key: string]: string},
): ApiHomePageContentProvider {
    return new ApiHomePageContentProvider(baseUrl, locale, regionCode, queryParams);
}

export function createHomePageFallbackContentProvider(baseUrl: string): ApiHomePageFallbackContentProvider {
    return new ApiHomePageFallbackContentProvider(baseUrl);
}

export function createCollectionContentProvider(
    baseUrl: string,
    locale: Locale,
    regionCode: string,
    collectionId: string,
): ApiCollectionContentProvider {
    return new ApiCollectionContentProvider(baseUrl, locale, regionCode, collectionId);
}

export function createCategoryContentProvider(
    baseUrl: string,
    locale: Locale,
    regionCode: string,
    categoryId: string,
): ApiCategoryContentProvider {
    return new ApiCategoryContentProvider(baseUrl, locale, regionCode, categoryId);
}

export function createCareersContentProvider(
    baseUrl: string,
    locale: Locale,
    regionCode: string,
    ...ids: string[]
): ApiCareersContentProvider {
    const id = ids[1] || ids[0];
    return new ApiCareersContentProvider(baseUrl, locale, regionCode, id);
}

export function createEventMarketingContentProvider(
    baseUrl: string,
    locale: Locale,
    regionCode: string,
    ...ids: string[]
): ApiEventMarketingProvider {
    const marketingId = ids[1];
    return new ApiEventMarketingProvider(baseUrl, locale, regionCode, marketingId);
}

export function createProductContentProvider(
    baseUrl: string,
    locale: Locale,
    regionCode: string,
    sku: string,
): ApiProductContentProvider {
    return new ApiProductContentProvider(baseUrl, locale, regionCode, sku);
}

export function createBrandStoreContentProvider(
    baseUrl: string,
    locale: Locale,
    regionCode: string,
    ...ids: string[]
): ApiBrandStoreContentProvider {
    const brandName = ids[0];
    const brandId = ids[1];
    return new ApiBrandStoreContentProvider(baseUrl, locale, regionCode, brandName, brandId);
}

export function createBrandPageContentProvider(
    baseUrl: string,
    locale: Locale,
    regionCode: string,
    brandId: string,
): ApiBrandPageContentProvider {
    return new ApiBrandPageContentProvider(baseUrl, locale, regionCode, brandId);
}

export function createServiceContentProvider(
    baseUrl: string,
    locale: Locale,
    regionCode: string,
    ...ids: string[]
): ApiServiceContentProvider {
    const serviceId = ids[1];
    return new ApiServiceContentProvider(baseUrl, locale, regionCode, serviceId);
}

export function createCorporateContentProvider(
    baseUrl: string,
    locale: Locale,
    regionCode: string,
    ...ids: string[]
): ApiCorporateContentProvider {
    const corporateId = ids[1];
    return new ApiCorporateContentProvider(baseUrl, locale, regionCode, corporateId);
}

export function createPersonalizedContentProvider(
    baseUrl: string,
    locale: Locale,
    regionCode: string,
    contentType: string,
    entryId: string,
): ApiPersonalizedContentProvider {
    return new ApiPersonalizedContentProvider(baseUrl, locale, regionCode, contentType, entryId);
}

export function createSearchContentProvider(
    baseUrl: string,
    locale: Locale,
    regionCode: string,
    query: string,
): ApiSearchContentProvider {
    return new ApiSearchContentProvider(baseUrl, locale, regionCode, query);
}
