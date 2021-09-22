import {
    Dispatch,
    GlobalCMSContexts,
    Region,
    SearchResult,
    SimpleProduct,
    SponsoredProduct,
    SponsoredProductAdDetails,
    SponsoredProductPageId,
    SponsoredProductResponseKey,
} from "models";
import {ApiSearchProvider, ApiSponsoredProductsProvider} from "providers";
import {SponsoredProductProps, SponsoredProductsApiProps} from "providers/SponsoredProductsProvider";
import {State} from "store";
import {
    addPageSourceTrackingToCriteoUrl,
    buildBrandFilter,
    buildPriceFilter,
    buildVendorTypeFilter,
    buildOnSaleFilter,
    getCriteoCustomerId,
    getCriteoVisitorId,
    hasCompatibleFilters,
    isCriteoEnabled,
} from "utils/criteo";
import routeManager from "utils/routeManager";
import {searchActionType} from "actions/searchActions";
import {maxSearchResultSponsoredProducts} from "../../constants";
import {Key} from "@bbyca/apex-components/dist/models";

export const fetchSponsoredProductAds = async (
    props: Partial<SponsoredProductsApiProps>,
    responseObjName: SponsoredProductResponseKey,
): Promise<SponsoredProductAdDetails[]> => {
    const customerId = getCriteoCustomerId();
    const retailerVisitorId = getCriteoVisitorId();

    const sponsoredProductsApiProps: SponsoredProductsApiProps = {
        ...props,
        customerId,
        retailerVisitorId,
    };

    const sponsoredProductsProvider = new ApiSponsoredProductsProvider();
    const response = await sponsoredProductsProvider.getSponsoredProducts(sponsoredProductsApiProps);

    return response[responseObjName]?.ProductAd || [];
};

export const getSponsoredProductDetails = async (
    sponsoredProductsProps: SponsoredProductProps,
    responseObjectName: SponsoredProductResponseKey,
    state: State,
): Promise<SponsoredProduct[]> => {
    const props = {
        ...sponsoredProductsProps,
        url: state.config.criteo.criteoUrl,
        accountId: state.config.criteo.accountId,
        environment: state.config.environment,
        pageNumber: 1,
    };
    const sponsoredProducts = await fetchSponsoredProductAds(props, responseObjectName);

    if (sponsoredProducts.length) {
        const numSponsoredProductsToAdd = Math.min(sponsoredProducts.length, maxSearchResultSponsoredProducts);
        const sponsoredProductsToAdd = sponsoredProducts.slice(0, numSponsoredProductsToAdd);

        // before we can add the sponsored products to the list of results, we need to ping our own server to get
        // additional information about them (identified by SKU)
        const searchResult: SearchResult = await callSearchForProductDetails(
            {
                apiUrl: state.config.dataSources.searchApiUrl,
                locale: state.intl.locale,
                regionCode: state.app.location.regionCode,
                path: state.search.path,
            },
            sponsoredProductsToAdd,
        );

        if (searchResult?.products.length > 0) {
            return combineSponsoredProductsAndSearchDetails(
                searchResult,
                sponsoredProductsToAdd,
                state.intl.language,
                state.routing.pageKey,
            );
        }
    }
    return [];
};

interface SearchProps {
    apiUrl: string;
    locale: Locale;
    path: string;
    regionCode: Region;
}

export const callSearchForProductDetails = async (
    {apiUrl, locale, path, regionCode}: SearchProps,
    sponsoredProducts: SponsoredProductAdDetails[],
): Promise<SearchResult> => {
    const searchProvider = new ApiSearchProvider(apiUrl, locale, regionCode);
    const query = sponsoredProducts.map(({ProductSKU}) => ProductSKU).join(" ");

    return await searchProvider.search({query, path});
};

export const combineSponsoredProductsAndSearchDetails = (
    searchResult: SearchResult,
    sponsoredProducts: SponsoredProductAdDetails[],
    language: Language,
    pageKey: Key,
): SponsoredProduct[] => {
    const productSkuMap: {[sku: string]: SimpleProduct} = {};
    searchResult.products.forEach((product) => {
        productSkuMap[product.sku] = product;
    });

    return sponsoredProducts.map((sponsoredProduct, index) => {
        const sponsoredProductSearchDetails = productSkuMap[sponsoredProduct.ProductSKU];
        const criteoPDPUrl = sponsoredProduct && sponsoredProduct.ProductPage;
        const clientPDPUrl = routeManager.getPathByKey(
            language,
            "product",
            sponsoredProductSearchDetails ? sponsoredProductSearchDetails.seoName : "",
            sponsoredProductSearchDetails ? sponsoredProductSearchDetails.sku : "",
        );

        const externalUrl = addPageSourceTrackingToCriteoUrl(clientPDPUrl, criteoPDPUrl, pageKey, index + 1);

        return {
            ...sponsoredProductSearchDetails,
            externalUrl,
            criteoData: {
                ...sponsoredProduct,
            },
            isSponsored: true,
        } as SponsoredProduct;
    });
};

export const addSponsoredProductsToSearch = async (
    sponsoredProductsProps: SponsoredProductProps,
    responseObjKey: SponsoredProductResponseKey,
    dispatch: Dispatch,
    state: State,
) => {
    const sponsoredProductsToAdd = await getSponsoredProductDetails(sponsoredProductsProps, responseObjKey, state);

    if (sponsoredProductsToAdd && sponsoredProductsToAdd.length) {
        dispatch({
            type: searchActionType.addSponsoredProducts,
            sponsoredProducts: sponsoredProductsToAdd,
        });
    }
};

export enum CriteoAdsPage {
    category = "category",
    search = "search",
    collection = "collection",
}

export const maybeAddCriteoAds = async (state: State, dispatch: Dispatch, page: CriteoAdsPage, payload: any) => {
    let sponsoredProductProps: SponsoredProductProps;
    let responseObjKey: SponsoredProductResponseKey;
    let globalCMSContext: GlobalCMSContexts = GlobalCMSContexts.category;

    if (page === CriteoAdsPage.category) {
        sponsoredProductProps = {pageId: SponsoredProductPageId.browse, category: payload};
        responseObjKey = SponsoredProductResponseKey.browse;
    } else if (page === CriteoAdsPage.collection) {
        responseObjKey = SponsoredProductResponseKey.collection;
        sponsoredProductProps = {pageId: SponsoredProductPageId.collection, category: payload};
    } else {
        sponsoredProductProps = {pageId: SponsoredProductPageId.search, keywords: payload};
        responseObjKey = SponsoredProductResponseKey.search;
        globalCMSContext = GlobalCMSContexts.search;
    }

    if (
        payload &&
        typeof window !== "undefined" &&
        isCriteoEnabled(state, globalCMSContext) &&
        state.search.searchResult &&
        hasCompatibleFilters(globalCMSContext, state.search.searchResult.paths)
    ) {
        sponsoredProductProps.filters = [
            ...buildBrandFilter(state.search.searchResult.paths),
            ...buildPriceFilter(state.search.searchResult.paths),
            ...buildVendorTypeFilter(state.search.searchResult.paths),
            ...buildOnSaleFilter(state.search.searchResult.paths),
        ];

        try {
            await addSponsoredProductsToSearch(sponsoredProductProps, responseObjKey, dispatch, state);
        } catch {
            return;
        }
    }
};
