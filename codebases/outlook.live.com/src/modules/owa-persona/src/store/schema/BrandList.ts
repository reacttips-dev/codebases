interface BrandList {
    /**
     * Brands that have not been verified
     */
    smtps: string[];
    /**
     * Brands that have been verified
     */
    tier3Smtps: string[];
}

export enum BrandListLoadState {
    unloaded,
    loading,
    loadSucceeded,
    loadFailed,
}

export default BrandList;
