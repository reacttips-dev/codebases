import ApiBrandStoreSideNavigationProvider from "./ApiBrandStoreNavigationProvider";

export function createBrandStoreNavigationProvider(baseUrl: string, locale: Locale, ...ids: string[]) {
    const brandName = "0"; // hardcoded for now b/c ContentService only accepts 0 for now
    const brandStoreId = ids[1];
    return new ApiBrandStoreSideNavigationProvider(baseUrl, locale, brandName, brandStoreId);
}
