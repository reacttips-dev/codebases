import {LocationDescriptor} from "react-router";
import {errorActionCreators, routingActionCreators, userActionCreators} from "../../actions";
import {routerActions} from "react-router-redux";
import {handleRedirectError, HttpRequestError, HttpRequestType, StatusCode} from "../../errors";
import {
    Availabilities,
    Brand,
    CustomContentType,
    DynamicContentModel,
    Facet,
    getSearchResultProductsLastPage,
    getSearchResultProductsLength,
    ProductSort,
    SearchPathTypes,
    SearchResult,
    SearchState,
} from "models";
import {Key} from "@bbyca/apex-components";
import {
    ApiAvailabilityProvider,
    ApiSearchProvider,
    createBrandPageContentProvider,
    createCategoryContentProvider,
    createCategoryProvider,
    createCollectionContentProvider,
    createSearchContentProvider,
} from "../../providers";
import {initialSearchState} from "../../reducers";
import State from "../../store";
import routeManager from "../../utils/routeManager";
import {ActionCreatorsMapObject} from "redux";
import {CriteoAdsPage, maybeAddCriteoAds} from "./sponsoredProducts";
import {FacetFilterRemovePayload} from "models/Analytics";
import {facetSystemNames, facetSimpleNames} from "../../constants";
import {getSearchResult, getUserShippingLocationIds, getUserShippingLocationPostalCode, getContentApiUrl, getIntlLocale, getRegionCode, getSearchQuery} from "store/selectors";
import {isAvailableStockSelected} from "../../utils/search";

export const searchActionType = {
    changeQuery: "SEARCH_CHANGE_QUERY",
    getSiblingCategoriesFailure: "GET_SIBLING_CATEGORIES_FAILURE",
    loadMore: "SEARCH_LOAD_MORE",
    resetWasFacetFilterSelected: "RESET_WAS_FACET_FILTER_SELECTED",
    selectFilterRpu: "SEARCH_SELECT_FILTER_RPU",
    selectFilter: "SEARCH_SELECT_FILTER",
    removeAllFilters: "REMOVE_ALL_FILTERS",
    setState: "SEARCH_SET_STATE",
    sort: "SEARCH_SORT",
    updateAvailabilities: "SEARCH_UPDATE_AVAILABILITIES",
    updateCategory: "SEARCH_CATEGORY_UPDATE",
    updateSearchResults: "SEARCH_RESULTS_UPDATE",
    searchRedirect: "SEARCH_REDIRECT",
    trackBrandPageLoad: "BRAND_PAGE_LOAD",
    trackCollectionPageLoad: "COLLECTION_PAGE_LOAD",
    trackSearchPageLoad: "SEARCH_PAGE_LOAD",
    trackCategoryPageLoad: "CATEGORY_PAGE_LOAD",
    trackProductListPageLoad: "PLP_LOAD",
    updateCategoryDynamicContent: "UPDATE_CATEGORY_DYNAMIC_CONTENT",
    addDynamicContent: "ADD_DYNAMIC_CONTENT",
    clearDynamicContent: "CLEAR_DYNAMIC_CONTENT",
    addSponsoredProducts: "SEARCH_ADD_SPONSORED_PRODUCTS",
    searchingDone: "SEARCHING_DONE",
    setInitialSearchState: "SET_INITIAL_SEARCH_STATE",
    clearRecommendations: "CLEAR_RECOMMENDATIONS",
    updateMinMaxPrice: "UPDATE_MIN_MAX_PRICE",
    applyRangeQuery: "APPLY_RANGE_QUERY",
    clearRangeQuery: "CLEAR_RANGE_QUERY",
    applyRangeQueryResult: "APPLY_RANGE_QUERY_RESULT",
    updatePriceFacet: "UPDATE_PRICE_FACET",
    clearAppliedRangeFlag: "CLEAR_APPLIED_RANGE_FLAG",
    clearMinMaxPrice: "CLEAR_MIN_MAX_PRICE",
};
export interface SearchActionCreators extends ActionCreatorsMapObject {
    trackProductListPageLoad(pageType: Key): void;
    changeQuery(query: string, path?: string): void;
    sort(sort: ProductSort, payload: {}, pageSize?: number): void;
    selectFilter(
        facetSystemName: string,
        filterName: string,
        payload: FacetFilterRemovePayload,
        pageSize?: number,
        isRpuToggled?: boolean,
    ): void;
    removeAllFilters(): void;
    resetWasFacetFilterSelected(): void;
    search(
        page?: number,
        appendResults?: boolean,
        pageSize?: number,
        applyRangeQuery?: boolean,
        getAvailableStock?: boolean,
    ): void;
    searchByCategory(categoryId: string): void;
    searchCategory(categoryId: string): void;
    searchWithAvailabilities(
        page?: number,
        appendResults?: boolean,
        pageSize?: number,
        applyRangeQuery?: boolean,
        getAvailableStock?: boolean,
    ): void;
    loadMore(pageSize?: number): void;
    updateSearchResult(searchResult: SearchResult, page: number): void;
    route(): void;
    getAvailabilities(inputPageSize?: number): void;
    updateAvailabilities(availabilities: Availabilities, append?: boolean): void;
    syncStateWithLocation(location: LocationDescriptor, forceSearch?: boolean): void;
    syncCategoryStateWithLocation(location: LocationDescriptor): void;
    syncCollectionStateWithLocation(location: LocationDescriptor): void;
    syncSearchStateWithLocation(location: LocationDescriptor, forceSearch?: boolean): void;
    syncBrandStateWithLocation(location: LocationDescriptor): void;
    addDynamicContent(dynamicContent: DynamicContentModel): void;
    clearDynamicContent(): void;
    updateSearchDynamicContent(query: string): void;
    trackSearchRedirect(query: string): void;
    setInitialSearchState(): void;
    updateMinMaxPrice(minPrice: string, maxPrice: string): void;
    applyPriceRangeQuery(min: string, max: string, isClearRange?: boolean, isFromPill?: boolean): void;
    clearAppliedRangeFlag(): void;
    clearMinMaxPrice(): void;
    updatePriceFacet(): void;
    updateMinMaxPriceFromPath(): void;
    updateAvailabilityFacet(searchResult: SearchResult): void;
}

export const pageSizeAvailableStock = 96;
export const availabilityApiSkuLimit = 96;

export const isFullUrlValid = (url: string) => {
    const exp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}bestbuy\.ca\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(exp);
    return !!url.match(regex);
};

export const hasDynamicTopSellersContent = (categoryContent: DynamicContentModel) => {
    // Refactor to only return on adobeTopSellers once CMS has phased out adobe content type
    return (
        categoryContent &&
        categoryContent.sections &&
        categoryContent.sections.some((section) => {
            return (
                section.items[0].customContentType === CustomContentType.adobe ||
                section.items[0].customContentType === CustomContentType.adobeTopSellers
            );
        })
    );
};

export const searchActionCreators: SearchActionCreators = (() => {
    async function _buildSubCategories(dispatch, category, categoryProvider) {
        let subCategories = category.subCategories;
        const parentCategoryId = category.categoryBreadcrumb[category.categoryBreadcrumb.length - 2].categoryId;
        const hasSiblingsOrSubCategories = category.subCategories.length > 0;

        if (!hasSiblingsOrSubCategories && parentCategoryId) {
            let parentCategory = null;
            try {
                parentCategory = await categoryProvider.getCategory(parentCategoryId);
            } catch (error) {
                dispatch({
                    type: searchActionType.getSiblingCategoriesFailure,
                    error,
                });
            }
            const newSubCategoryList = parentCategory.subCategories.map((subCategory) => {
                if (subCategory.categoryId === category.id) {
                    subCategory.isSelected = true;
                }
                return subCategory;
            });
            subCategories = newSubCategoryList;
        }

        return subCategories;
    }

    function _handleSearchBeforeAdobeExperience(state, dispatch) {
        const solrFeatureToggleSet = state.config.features.solrLabelsEnabled;
        if (solrFeatureToggleSet === null) {
            dispatch({type: "SEARCHED_WITHOUT_TARGET_EXPERIENCE"});
        }
    }

    function trackProductListPageLoad(pageType: Key) {
        const trackTypes = {
            brand: searchActionType.trackBrandPageLoad,
            category: searchActionType.trackCategoryPageLoad,
            search: searchActionType.trackSearchPageLoad,
            collection: searchActionType.trackCollectionPageLoad,
        };

        return trackTypes[pageType]
            ? {
                  type: trackTypes[pageType],
              }
            : undefined;
    }

    function changeQuery(query: string, path?: string) {
        return async (dispatch, getState) => {
            const {searching} = getState().search;
            if (!searching) {
                await dispatch({
                    type: searchActionType.changeQuery,
                    query,
                    path,
                });
                dispatch(route());
            }
        };
    }

    function sort(sortBy: ProductSort, payload: any, pageSize?: number) {
        return async (dispatch, getState) => {
            const state: State = getState();

            if (sortBy === state.search.sort) {
                return;
            }

            dispatch({
                sort: sortBy,
                payload,
                type: searchActionType.sort,
            });

            try {
                dispatch(route());
                await dispatch(searchWithAvailabilities(undefined, undefined, pageSize));
            } catch (error) {
                await dispatch(errorActionCreators.error(error, () => sort(sortBy, payload)));
                dispatch(_setState(state.search));
            }
        };
    }

    function trackSearchRedirect(query: string) {
        return {
            type: searchActionType.searchRedirect,
            payload: {
                query,
            },
        };
    }

    function selectFilter(
        facetSystemName: string,
        filterName: string,
        payload: any,
        pageSize?: number,
        isRpuToggled?: boolean,
    ) {
        return async (dispatch, getState) => {
            const state: State = getState();

            if (!!isRpuToggled) {
                dispatch({
                    facetSystemName,
                    filterName,
                    payload,
                    type: searchActionType.selectFilterRpu,
                });
            } else {
                dispatch({
                    facetSystemName,
                    filterName,
                    payload,
                    type: searchActionType.selectFilter,
                });
            }

            const getAvailableStock =
                facetSystemName === facetSystemNames.availability
                    ? payload.action.toLowerCase() === "add"
                        ? true
                        : false
                    : isAvailableStockSelected(state?.search?.searchResult?.facets);

            try {
                dispatch(clearAdobeRecommmendations());
                dispatch(route());
                await dispatch(searchWithAvailabilities(undefined, undefined, pageSize, undefined, getAvailableStock));
            } catch (error) {
                await dispatch(
                    errorActionCreators.error(error, () =>
                        selectFilter(facetSystemName, filterName, payload, undefined, getAvailableStock),
                    ),
                );
                dispatch(_setState(state.search));
            }
        };
    }

    function removeAllFilters() {
        return async (dispatch, getState) => {
            const state: State = getState();

            dispatch({
                type: searchActionType.removeAllFilters,
            });

            try {
                dispatch(clearAdobeRecommmendations());
                dispatch(route());
                await dispatch(searchWithAvailabilities());
            } catch (error) {
                dispatch(_setState(state.search));
            }
        };
    }

    function resetWasFacetFilterSelected() {
        return async (dispatch, getState) => {
            dispatch({type: searchActionType.resetWasFacetFilterSelected});
        };
    }

    function search(
        page?: number,
        appendResults?: boolean,
        pageSize?: number,
        applyRangeQuery?: boolean,
        getAvailableStock?: boolean,
    ) {
        return async (dispatch, getState) => {
            await dispatch(userActionCreators.locate(true));
            const currentPage = page || 1;
            const state: State = getState();
            const apiUrl = state.search.sscId
                ? state.config.dataSources.skuCollectionUrl
                : state.config.dataSources.searchApiUrl;
            const searchProvider = new ApiSearchProvider(apiUrl, state.intl.locale, state.app.location.regionCode);
            let searchResult: SearchResult = null;
            const solrLabelsEnabled = state.config.features.solrLabelsEnabled ? "labels" : "";
            _handleSearchBeforeAdobeExperience(state, dispatch);
            try {
                searchResult = await searchProvider.search({
                    brandName: state.search.brand && state.search.brand.name,
                    categoryId: state.search.category && state.search.category.id,
                    page: currentPage,
                    pageSize: pageSize ? pageSize : state.config.search.pageSize,
                    path: state.search.path,
                    query: state.search.query,
                    sort: state.search.sort,
                    sscId: state.search.sscId,
                    exp: solrLabelsEnabled,
                });
                if (state.config.features.minMaxPriceFacetEnabled && applyRangeQuery) {
                    if (searchResult.products.length === 0) {
                        searchResult = await searchProvider.search({
                            brandName: state.search.brand && state.search.brand.name,
                            categoryId: state.search.category && state.search.category.id,
                            page: currentPage,
                            pageSize: pageSize ? pageSize : state.config.search.pageSize,
                            path: state.search.pathBeforeRangeQuery,
                            query: state.search.query,
                            sort: state.search.sort,
                            sscId: state.search.sscId,
                            exp: solrLabelsEnabled,
                        });
                        await dispatch({
                            type: searchActionType.applyRangeQueryResult,
                            rangeQueryHasResults: false,
                            path: state.search.pathBeforeRangeQuery,
                        });
                        await dispatch(route());
                    } else {
                        await dispatch({
                            type: searchActionType.applyRangeQueryResult,
                            rangeQueryHasResults: true,
                            path: state.search.path,
                        });
                    }
                }
                if (searchResult.facets && searchResult.paths && searchResult.facets.length) {
                    if (getAvailableStock) {
                        updateAvailabilityFacet(searchResult);
                    }

                    const hasCategoryFilters = searchResult.facets[0].filters.length > 0;
                    const parentCategories = searchResult.paths.filter(
                        (path) => path.type === SearchPathTypes.Category,
                    );
                    if (!hasCategoryFilters && parentCategories.length > 0) {
                        const parentSearchResult = await searchProvider.search({
                            brandName: state.search.brand && state.search.brand.name,
                            categoryId: state.search.category && state.search.category.id,
                            page: currentPage,
                            pageSize: state.config.search.pageSize,
                            path: parentCategories[parentCategories.length - 1].unselectPath,
                            query: state.search.query,
                            sort: state.search.sort,
                            sscId: state.search.sscId,
                            exp: solrLabelsEnabled,
                        });

                        const categoryFacetFilters = parentSearchResult.facets[0].filters.map((filter) => {
                            if (parentCategories[parentCategories.length - 1].name === filter.name) {
                                filter.isSelected = true;
                            }
                            return filter;
                        });

                        searchResult.facets[0].filters = categoryFacetFilters;
                    }
                }
            } catch (error) {
                await dispatch(errorActionCreators.error(error, () => search()));
                return;
            }
            if (appendResults) {
                searchResult.products = [
                    ...(state.search.searchResult.organicAndSponsoredProducts || state.search.searchResult.products),
                    ...searchResult.products,
                ];
                // TODO: hack until new Search API is defined. Currently
                // assigns ssc with previous page's ssc
                searchResult.ssc = searchResult.ssc || state.search.searchResult.ssc;
            }

            if (searchResult.ssc) {
                const collectionContentProvider = createCollectionContentProvider(
                    state.config.dataSources.contentApiUrl,
                    state.intl.locale,
                    state.app.location.regionCode,
                    state.search.sscId,
                );
                try {
                    const collectionContent = await collectionContentProvider.getContent();

                    dispatch(addDynamicContent({...collectionContent, h1: searchResult.ssc.title}));
                } catch (error) {
                    // This try catch block is meant to resolve the issue with MarketingContentProvider catching an HTTP error.
                    // It prevents 404 page if a collection page has skus returned from SOLR but has NO collection entry published in CMS.
                }
            }

            await dispatch(updateSearchResult(searchResult, currentPage));
            await dispatch({type: searchActionType.searchingDone});
        };
    }

    function addDynamicContent(dynamicContent) {
        return {
            type: searchActionType.addDynamicContent,
            dynamicContent,
        };
    }

    function clearDynamicContent() {
        return {
            type: searchActionType.clearDynamicContent,
        };
    }

    function clearAdobeRecommmendations() {
        return {
            type: searchActionType.clearRecommendations,
        };
    }

    function setInitialSearchState() {
        return {
            type: searchActionType.setInitialSearchState,
        };
    }

    function updateMinMaxPrice(minPrice: string, maxPrice: string) {
        return {
            type: searchActionType.updateMinMaxPrice,
            minPrice,
            maxPrice,
        };
    }

    function clearAppliedRangeFlag() {
        return {
            type: searchActionType.clearAppliedRangeFlag,
        };
    }

    function clearMinMaxPrice() {
        return {
            type: searchActionType.clearMinMaxPrice,
        };
    }

    function applyPriceRangeQuery(min: string, max: string, isClearRange?: boolean, isFromPill?: boolean) {
        return async (dispatch, getState) => {
            const state: State = getState();
            const path = state.search.path;
            let newPath = path;
            let pathBeforeRangeQuery = path;
            let posEnd: number;
            let pos = path.indexOf(facetSystemNames.currentPrice);
            if (pos < 0) {
                pos = path.indexOf(facetSystemNames.priceFacet);
            }
            if (pos >= 0) {
                posEnd = path.indexOf("%3B", pos);
                if (posEnd < 0) {
                    newPath = path.slice(0, pos < 3 ? pos : pos - 3);
                } else {
                    newPath = path.slice(0, pos) + path.slice(posEnd + 3, path.length);
                }
            }
            if (!isClearRange) {
                pathBeforeRangeQuery = newPath;
                const addPath = `${newPath ? "%3B" : ""}${facetSystemNames.currentPrice}%3A[${min ||
                    "*"}%20TO%20${max || "*"}]`;
                newPath += addPath;
                await dispatch({
                    type: searchActionType.applyRangeQuery,
                    path: newPath,
                    minPrice: min,
                    maxPrice: max,
                    pathBeforeRangeQuery,
                });
            } else {
                await dispatch({
                    type: searchActionType.clearRangeQuery,
                    path: newPath,
                    payload: {
                        minPrice: state.search.minPrice,
                        maxPrice: state.search.maxPrice,
                        facetType: isFromPill ? "pill" : "facet",
                    },
                });
            }

            try {
                dispatch(clearAdobeRecommmendations());
                dispatch(route());
                await dispatch(
                    searchWithAvailabilities(
                        undefined,
                        undefined,
                        undefined,
                        !isClearRange,
                        isAvailableStockSelected(state?.search?.searchResult?.facets),
                    ),
                );
            } catch (error) {
                await dispatch(errorActionCreators.error(error, () => applyPriceRangeQuery(min, max)));
                dispatch(_setState(state.search));
            }
        };
    }

    function updatePriceFacet() {
        return async (dispatch, getState) => {
            const state: State = getState();
            if (!state.config.features.minMaxPriceFacetEnabled) {
                return;
            }
            if (!state.search?.searchResult?.facets) {
                return;
            }

            let newFacets: Facet[] = [...state.search.searchResult.facets];
            const newSelectedFacets: Facet[] = [...(state.search.searchResult.selectedFacets || [])];

            const idxCurrentOffer = newFacets.findIndex((f) => f.systemName.startsWith(facetSystemNames.currentOffer));
            const idxPrice = newFacets.findIndex((f) => f.systemName.startsWith(facetSystemNames.priceFacet));
            if (idxCurrentOffer < 0 && idxPrice < 0) {
                dispatch(clearAppliedRangeFlag());
                return;
            }

            let rangeQueryHasResults = false;
            let totalSelectedFilterCount = state.search.searchResult.totalSelectedFilterCount
                ? state.search.searchResult.totalSelectedFilterCount
                : 0;

            if (idxPrice < 0) {
                const priceFacet: Facet = {
                    name: facetSimpleNames.price[state.intl.language],
                    systemName: facetSystemNames.priceFacet,
                    filters: [],
                    order: newFacets[idxCurrentOffer].order + 1,
                    isMultiSelect: false,
                };
                newFacets = newFacets.map((facet, index) => {
                    if (index > idxCurrentOffer) {
                        facet.order = facet.order + 1;
                    }
                    return facet;
                });
                newFacets = [
                    ...newFacets.slice(0, idxCurrentOffer + 1),
                    priceFacet,
                    ...newFacets.slice(idxCurrentOffer + 1, newFacets.length),
                ];
                if (state.search.path && state.search.path.indexOf(facetSystemNames.currentPrice) >= 0) {
                    priceFacet.selectedFilterCount = 1;
                    totalSelectedFilterCount += 1;
                    newSelectedFacets.push(priceFacet);
                    rangeQueryHasResults = true;
                }
            } else {
                newFacets = newFacets.map((facet) => {
                    if (
                        facet.name === facetSimpleNames.price[state.intl.language] &&
                        state.search.path &&
                        state.search.path.indexOf(facetSystemNames.currentPrice) >= 0
                    ) {
                        facet.filters = [];
                        if (
                            newSelectedFacets.findIndex((f) => f.name === facetSimpleNames.price[state.intl.language]) <
                            0
                        ) {
                            facet.selectedFilterCount = 1;
                            totalSelectedFilterCount += 1;
                            newSelectedFacets.push(facet);
                        }
                        rangeQueryHasResults = true;
                    }
                    return facet;
                });
            }

            dispatch({
                type: searchActionType.updatePriceFacet,
                searchResult: {
                    ...state.search.searchResult,
                    totalSelectedFilterCount,
                    facets: newFacets,
                    selectedFacets: newSelectedFacets,
                },
                rangeQueryHasResults,
            });
        };
    }

    function updateMinMaxPriceFromPath() {
        return (dispatch, getState) => {
            const state: State = getState();
            if (!state.config.features.minMaxPriceFacetEnabled) {
                return;
            }

            let minPrice = "";
            let maxPrice = "";
            if (state.search.path && state.search.path.indexOf(facetSystemNames.currentPrice) >= 0) {
                let pos = state.search.path.indexOf(facetSystemNames.currentPrice);
                let posEnd = state.search.path.indexOf("%3B", pos);
                posEnd = posEnd < 0 ? state.search.path.length : posEnd;
                const path = state.search.path
                    .slice(pos, posEnd)
                    .replace(/%5B/gim, "[")
                    .replace(/%5D/gim, "]")
                    .replace(/%20|%2B/gim, "+");
                pos = path.indexOf("[");
                minPrice = path.slice(pos + 1, path.indexOf("+"));
                minPrice = minPrice === "*" ? "" : minPrice;
                pos = path.indexOf("TO", pos + 1);
                maxPrice = path.slice(pos + 3, path.indexOf("]"));
                maxPrice = maxPrice === "*" ? "" : maxPrice;

                dispatch({
                    type: searchActionType.updateMinMaxPrice,
                    minPrice,
                    maxPrice,
                });
            }
        };
    }

    function updateAvailabilityFacet(searchResult: SearchResult) {
        const availabilityFacet = searchResult.facets.find(
            (facet) => facet.systemName === facetSystemNames.availability,
        );
        if (availabilityFacet) {
            availabilityFacet.selectedFilterCount = 1;
            // We injected Availability facet with only one entry
            availabilityFacet.filters[0].isSelected = true;
            searchResult.totalSelectedFilterCount = searchResult.totalSelectedFilterCount
                ? searchResult.totalSelectedFilterCount + 1
                : 1;
            if (searchResult.selectedFacets === undefined) {
                searchResult.selectedFacets = [];
            }
            searchResult.selectedFacets.push(availabilityFacet);
        }
    }

    function searchWithAvailabilities(
        page?: number,
        appendResults?: boolean,
        pageSize?: number,
        applyRangeQuery?: boolean,
        getAvailableStock?: boolean,
    ) {
        return async (dispatch, getState) => {
            if (getState().config.features.minMaxPriceFacetEnabled) {
                dispatch(clearAppliedRangeFlag());
            }
            await dispatch(
                search(
                    page,
                    appendResults,
                    getAvailableStock ? pageSizeAvailableStock : pageSize,
                    applyRangeQuery,
                    getAvailableStock,
                ),
            );
            const state: State = getState();

            if (page === 1 || !page) {
                await maybeAddCriteoAds(state, dispatch, CriteoAdsPage.search, state.search?.query);
                await maybeAddCriteoAds(state, dispatch, CriteoAdsPage.category, state.search?.category?.id);
                await maybeAddCriteoAds(state, dispatch, CriteoAdsPage.collection, state.search?.sscId);
            }

            await dispatch(updatePriceFacet());
            await dispatch(getAvailabilities(getAvailableStock ? pageSizeAvailableStock : pageSize));
        };
    }

    function searchByCategory(categoryId: string) {
        return async (dispatch, getState) => {
            const state: State = getState();
            const categoryProvider = createCategoryProvider(state.config.dataSources.categoryApiUrl, state.intl.locale);
            const categoryContentProvider = createCategoryContentProvider(
                state.config.dataSources.contentApiUrl,
                state.intl.locale,
                state.app.location.regionCode,
                categoryId,
            );
            let categoryContent;
            try {
                categoryContent = await categoryContentProvider.getContent();
            } catch (err) {
                // Let it fail silently. Content API is not required.
            }
            try {
                dispatch(clearAdobeRecommmendations());
                const category = await categoryProvider.getCategory(categoryId);
                if (category.subCategories) {
                    category.subCategories = await _buildSubCategories(dispatch, category, categoryProvider);
                }
                category.dynamicContent = categoryContent;
                category.dynamicContent.hasDynamicTopSellers = hasDynamicTopSellersContent(categoryContent);
                dispatch({type: searchActionType.updateCategory, category});

                await dispatch(searchWithAvailabilities());
                dispatch(route());
            } catch (error) {
                await dispatch(errorActionCreators.error(error, () => searchByCategory(categoryId)));
                dispatch(_setState(state.search));
            }
        };
    }

    function searchCategory(categoryId: string) {
        return async (dispatch, getState) => {
            const state: State = getState();
            const categoryProvider = createCategoryProvider(state.config.dataSources.categoryApiUrl, state.intl.locale);
            const categoryContentProvider = createCategoryContentProvider(
                state.config.dataSources.contentApiUrl,
                state.intl.locale,
                state.app.location.regionCode,
                categoryId,
            );
            let categoryContent;
            try {
                categoryContent = await categoryContentProvider.getContent();
            } catch (error) {
                // Let it fail silently. Content API is not required.
            }
            try {
                dispatch(clearAdobeRecommmendations());
                const category = await categoryProvider.getCategory(categoryId);
                category.dynamicContent = categoryContent;
                category.dynamicContent.hasDynamicTopSellers = hasDynamicTopSellersContent(categoryContent);
                await dispatch({type: searchActionType.updateCategory, category});
            } catch (error) {
                await dispatch(errorActionCreators.error(error, () => searchCategory(categoryId)));
                dispatch(_setState(state.search));
            }
        };
    }

    function loadMore(pageSize?: number) {
        return async (dispatch, getState) => {
            dispatch({type: searchActionType.loadMore});
            const state: State = getState();
            const page = state.search.page + 1;
            const getAvailableStock = isAvailableStockSelected(state?.search?.searchResult?.facets);
            await dispatch(searchWithAvailabilities(page, true, pageSize, undefined, getAvailableStock));
        };
    }

    function updateSearchResult(searchResult: SearchResult, page: number) {
        return {
            type: searchActionType.updateSearchResults,
            page,
            searchResult,
        };
    }

    function getAvailabilities(inputPageSize?: number) {
        return async (dispatch, getState) => {
            let state: State = getState();
            const config = state.config;
            const remoteConfig = config.remoteConfig;
            const isBrowseMode =
                remoteConfig && remoteConfig.isAddToCartEnabled === false && remoteConfig.isRpuEnabled === false;

            const shouldReturn =
                (remoteConfig && !remoteConfig.isPlpAvailabilityEnabled) ||
                isBrowseMode ||
                !config.dataSources.availabilityApiUrl ||
                !getSearchResultProductsLength(state.search.searchResult);

            if (shouldReturn) {
                return;
            }

            await dispatch(userActionCreators.locate(true));
            state = getState();

            const availabilityProvider = new ApiAvailabilityProvider(
                state.config.dataSources.availabilityApiUrl,
                state.intl.locale,
            );

            try {
                const skus = getSearchResultProductsLastPage(
                    getSearchResult(state),
                    inputPageSize !== undefined ? inputPageSize : state.config.search.pageSize,
                    state.search.page,
                ).map((p) => p.sku);
                let subSkus: string[] = [];
                if (skus?.length > availabilityApiSkuLimit) {
                    subSkus = skus.splice(availabilityApiSkuLimit);
                }
                let availabilities = await availabilityProvider.getAvailabilitiesIndexedBySku({
                    excludePickup: remoteConfig && !remoteConfig.isRpuEnabled,
                    postalCode: getUserShippingLocationPostalCode(state),
                    skus,
                    storeLocations: getUserShippingLocationIds(state),
                });
                if (subSkus.length > 0) {
                    const extraAvailabilities = await availabilityProvider.getAvailabilitiesIndexedBySku({
                        excludePickup: remoteConfig && !remoteConfig.isRpuEnabled,
                        postalCode: getUserShippingLocationPostalCode(state),
                        skus: subSkus,
                        storeLocations: getUserShippingLocationIds(state),
                    });
                    availabilities = {...availabilities, ...extraAvailabilities};
                }

                dispatch(
                    updateAvailabilities(
                        availabilities,
                        getSearchResultProductsLength(state.search.searchResult) > Object.keys(availabilities).length,
                    ),
                );
            } catch (error) {
                dispatch(errorActionCreators.error(error, () => getAvailabilities()));
            }
        };
    }

    function updateAvailabilities(availabilities: Availabilities, append?: boolean) {
        return {
            type: searchActionType.updateAvailabilities,
            availabilities,
            append,
        };
    }

    function updateSearchDynamicContent(query: string) {
        return async (dispatch, getState) => {
            const state: State = getState();
            const contentApiUrl = getContentApiUrl(state) || "";
            const locale = getIntlLocale(state);
            const regionCode = getRegionCode(state) || "";
            const existingQuery = getSearchQuery(state) || "";
            const searchContentProvider = createSearchContentProvider(
                contentApiUrl,
                locale,
                regionCode,
                query || existingQuery,
            );
            try {
                const searchContent = await searchContentProvider.getContent();
                dispatch(addDynamicContent(searchContent));
            } catch (err) {
                // Let it fail silently. Content API is not required.
            }
        };
    }

    function route() {
        return (dispatch, getState) => {
            const state: State = getState();
            const searchState: SearchState = state.search;
            const language = state.intl.language;
            let pathname;
            const query: any = {};

            if (searchState.category) {
                pathname = routeManager.getPathByKey(
                    language,
                    "category",
                    searchState.category.seoText,
                    searchState.category.id,
                );
            } else if (searchState.sscId) {
                pathname = routeManager.getPathByKey(
                    language,
                    "collection",
                    searchState.searchResult.ssc.seoUrlText,
                    searchState.searchResult.ssc.id,
                );
            } else if (searchState.brand) {
                pathname = routeManager.getPathByKey(language, "brand", searchState.brand.name.toLowerCase());
            } else {
                pathname = routeManager.getPathByKey(language, "search");
            }

            if (searchState.sort !== initialSearchState.sort) {
                query.sort = searchState.sort;
            }
            if (searchState.path !== initialSearchState.path) {
                query.path = searchState.path;
            }
            if (searchState.query !== initialSearchState.query) {
                query.search = searchState.query;
            }

            dispatch(routingActionCreators.push({pathname, query}));
        };
    }

    function syncStateWithLocation(location: LocationDescriptor, forceSearch?: boolean) {
        return async (dispatch, getState) => {
            const state: State = getState();
            const key = routeManager.getKeyByPath(state.intl.language, location.pathname);
            switch (key) {
                case "brand":
                    await dispatch(syncBrandStateWithLocation(location));
                    break;

                case "collection":
                    await dispatch(syncCollectionStateWithLocation(location));
                    break;

                case "search":
                    await dispatch(syncSearchStateWithLocation(location, forceSearch));
                    break;

                default:
                    break;
            }
        };
    }

    function syncSearchStateWithLocation(location: LocationDescriptor, forceSearch?: boolean) {
        return async (dispatch, getState) => {
            const query = location.query.search || initialSearchState.query;
            const sortBy = location.query.sort || initialSearchState.sort;
            const path = location.query.path || initialSearchState.path;
            let state: State = getState();
            const language = state.intl.language;
            const searchState = state.search;
            const nextState: SearchState = {} as any;

            if (searchState.query !== query) {
                nextState.query = query;
            }
            if (searchState.sort !== sortBy) {
                nextState.sort = sortBy;
            }
            if (searchState.path !== path) {
                nextState.path = path;
            }
            if (searchState.sscId) {
                nextState.sscId = initialSearchState.sscId;
            }
            if (searchState.category) {
                nextState.category = initialSearchState.category;
            }

            dispatch(
                routingActionCreators.setAltLangHrefs({
                    altLangUrl: routeManager.getAltLangPathByKey(language, "search"),
                    curLangUrl: routeManager.getCurrLang(location.pathname),
                }),
            );

            try {
                if (Object.keys(nextState).length || forceSearch) {
                    if (state.config.features.minMaxPriceFacetEnabled) {
                        dispatch(clearAppliedRangeFlag());
                    }
                    await dispatch(userActionCreators.locate(true));
                    const searchProvider = new ApiSearchProvider(
                        state.config.dataSources.searchApiUrl,
                        state.intl.locale,
                        state.app.location.regionCode,
                    );
                    let searchResult = null;
                    const solrLabelsEnabled = state.config.features.solrLabelsEnabled ? "labels" : "";
                    _handleSearchBeforeAdobeExperience(state, dispatch);
                    try {
                        if (!!Object.keys(nextState).length) {
                            nextState.searching = true;
                            dispatch(_setState(nextState));
                        }

                        searchResult = await searchProvider.search({
                            page: 1,
                            pageSize: state.config.search.pageSize,
                            path: nextState.hasOwnProperty("path") ? nextState.path : state.search.path,
                            query: nextState.hasOwnProperty("query") ? nextState.query : state.search.query,
                            sort: nextState.hasOwnProperty("sort") ? nextState.sort : state.search.sort,
                            exp: solrLabelsEnabled,
                        });
                    } catch (error) {
                        await dispatch(errorActionCreators.error(error, () => changeQuery(query)));
                        return;
                    }
                    if (searchResult.redirectUrl) {
                        try {
                            dispatch(trackSearchRedirect(state.search.query));
                            await dispatch({type: searchActionType.searchingDone});
                            if (isFullUrlValid(searchResult.redirectUrl)) {
                                window.location.href = searchResult.redirectUrl;
                            } else {
                                dispatch(routerActions.replace(searchResult.redirectUrl));
                            }
                        } catch (error) {
                            await dispatch(
                                errorActionCreators.error(
                                    new HttpRequestError(
                                        HttpRequestType.SearchApi,
                                        searchResult.redirectUrl,
                                        undefined,
                                        undefined,
                                        StatusCode.NotFound,
                                    ),
                                ),
                            );
                            return;
                        }
                    } else {
                        await dispatch(updateSearchResult(searchResult, 1));
                        state = getState();
                        await maybeAddCriteoAds(state, dispatch, CriteoAdsPage.search, query);
                        await dispatch(updateSearchDynamicContent(nextState.query));
                        await dispatch({type: searchActionType.searchingDone});
                    }
                }
                await dispatch(updatePriceFacet());
                dispatch(updateMinMaxPriceFromPath());
            } catch (error) {
                await dispatch(errorActionCreators.error(error));
                dispatch(_setState(state.search));
            }
        };
    }

    function syncBrandStateWithLocation(location: LocationDescriptor) {
        return async (dispatch, getState) => {
            const state: State = getState();
            const language = state.intl.language;
            const params = routeManager.getParams(language, location.pathname) as {brand: string};
            if (
                state.config.features.minMaxPriceFacetEnabled &&
                state.search.brand &&
                state.search.brand.name !== params.brand
            ) {
                dispatch(clearMinMaxPrice());
                dispatch(clearAppliedRangeFlag());
            }
            const path = location.query.path || encodeURIComponent(`brandName:${params.brand.toUpperCase()}`);
            const sortBy = location.query.sort || initialSearchState.sort;
            const searchState = state.search;
            const page = Number(location.query.page);
            let brand = searchState.brand;
            const nextState = {} as SearchState;

            if (searchState.sort !== sortBy) {
                nextState.sort = sortBy;
            }
            if (searchState.path !== path) {
                nextState.path = path;
            }

            try {
                if (Object.keys(nextState).length) {
                    nextState.searching = true;

                    if (!brand || brand.name !== params.brand) {
                        brand = {
                            name: params.brand,
                        } as Brand;
                        dispatch(_setState(nextState));
                        const brandsDynamicContentProvider = createBrandPageContentProvider(
                            state.config.dataSources.contentApiUrl,
                            state.intl.locale,
                            state.user.shippingLocation.regionCode,
                            params.brand,
                        );
                        try {
                            const dynamicContent = await brandsDynamicContentProvider.getContent();
                            nextState.dynamicContent = dynamicContent;
                        } catch {
                            /** no need to do anything for dynamic content */
                        }
                    }

                    nextState.sscId = initialSearchState.sscId;
                    nextState.category = initialSearchState.category;
                    nextState.query = initialSearchState.query;
                    nextState.brand = brand;

                    dispatch(_setState(nextState));
                    await dispatch(search(page, false));
                }
                if (!state.config.features.minMaxPriceFacetEnabled) {
                    await dispatch({type: searchActionType.setState});
                }
                await dispatch(updatePriceFacet());
                dispatch(updateMinMaxPriceFromPath());
            } catch (error) {
                await dispatch(errorActionCreators.error(error));
                dispatch(_setState(state.search));
            }

            if (brand) {
                dispatch(
                    routingActionCreators.setAltLangHrefs({
                        altLangUrl: routeManager.getAltLangPathByKey(language, "brand", brand.name),
                        curLangUrl: routeManager.getCurrLang(location.pathname),
                    }),
                );
            }
        };
    }

    function syncCategoryStateWithLocation(location: LocationDescriptor) {
        return async (dispatch, getState) => {
            const state: State = getState();
            const language = state.intl.language;
            const params = routeManager.getParams(language, location.pathname) as {id: string; seoName: string};
            const searchState = state.search;
            let category = searchState.category;
            if (
                state.config.features.minMaxPriceFacetEnabled &&
                (!category || (category && category.id && params.id !== searchState.category.id))
            ) {
                dispatch(clearMinMaxPrice());
                dispatch(clearAppliedRangeFlag());
            }
            const path = location.query.path || initialSearchState.path;
            const sortBy = location.query.sort || initialSearchState.sort;
            const page = Number(location.query.page);
            const nextState: SearchState = {} as any;

            if (searchState.path !== path) {
                nextState.path = path;
            }
            if (searchState.sort !== sortBy) {
                nextState.sort = sortBy;
            }

            if (Object.keys(nextState).length || !category || category.id !== params.id) {
                dispatch(clearAdobeRecommmendations());
                const categoryProvider = createCategoryProvider(
                    state.config.dataSources.categoryApiUrl,
                    state.intl.locale,
                );
                const categoryContentProvider = createCategoryContentProvider(
                    state.config.dataSources.contentApiUrl,
                    state.intl.locale.toLowerCase() as Locale,
                    state.app.location.regionCode,
                    params.id,
                );
                let categoryContent;
                try {
                    categoryContent = await categoryContentProvider.getContent();
                } catch (error) {
                    // Let it fail silently. Content API is not required.
                }
                try {
                    category = await categoryProvider.getCategory(params.id);
                    category.subCategories = await _buildSubCategories(dispatch, category, categoryProvider);
                    nextState.category = category;
                    nextState.category.dynamicContent = categoryContent;
                    nextState.category.dynamicContent.hasDynamicTopSellers = hasDynamicTopSellersContent(
                        categoryContent,
                    );
                    nextState.searching = true;
                    nextState.query = initialSearchState.query;
                    nextState.sscId = initialSearchState.sscId;
                    nextState.brand = initialSearchState.brand;
                    dispatch(_setState(nextState));
                    await dispatch(search(page, false));
                    const newStateAfterSearch = getState();
                    await maybeAddCriteoAds(newStateAfterSearch, dispatch, CriteoAdsPage.category, category.id);
                } catch (error) {
                    await dispatch(errorActionCreators.error(error));
                    dispatch(_setState(state.search));
                }
            } else if (!state.search.isSponsoredProductsLoaded) {
                await maybeAddCriteoAds(state, dispatch, CriteoAdsPage.category, category.id);
            }
            await dispatch(updatePriceFacet());
            dispatch(updateMinMaxPriceFromPath());

            if (category) {
                if (category.seoText !== params.seoName) {
                    handleRedirectError(
                        routeManager.getPathByKey(state.intl.language, "category", category.seoText, category.id),
                    );
                }
                dispatch(
                    routingActionCreators.setAltLangHrefs({
                        altLangUrl: routeManager.getAltLangPathByKey(
                            language,
                            "category",
                            category.altLangSeoText,
                            category.id,
                        ),
                        curLangUrl: routeManager.getCurrLang(location.pathname),
                    }),
                );
            }
        };
    }

    function syncCollectionStateWithLocation(location: LocationDescriptor) {
        return async (dispatch, getState) => {
            const sortBy = location.query.sort || initialSearchState.sort;
            const path = location.query.path || initialSearchState.path;
            let state: State = getState();
            const params: any = routeManager.getParams(state.intl.language, location.pathname);
            const nextState: SearchState = {} as any;
            if (state.search.sort !== sortBy) {
                nextState.sort = sortBy;
            }
            if (state.search.path !== path) {
                nextState.path = path;
            }

            const page = Number(location.query.page);

            try {
                if (Object.keys(nextState).length || state.search.sscId !== params.id) {
                    nextState.sscId = params.id;
                    nextState.searching = true;
                    nextState.query = initialSearchState.query;
                    nextState.category = initialSearchState.category;
                    nextState.brand = initialSearchState.brand;
                    dispatch(_setState(nextState));
                    await dispatch(search(page, false));
                    const newStateAfterSearch = getState();
                    await maybeAddCriteoAds(newStateAfterSearch, dispatch, CriteoAdsPage.collection, nextState.sscId);
                } else if (!state.search.isSponsoredProductsLoaded) {
                    await maybeAddCriteoAds(state, dispatch, CriteoAdsPage.collection, params.id);
                }
                await dispatch(updatePriceFacet());
                dispatch(updateMinMaxPriceFromPath());
            } catch (error) {
                await dispatch(errorActionCreators.error(error));
                dispatch(_setState(state.search));
            }
            state = getState();
            const ssc = state.search.searchResult ? state.search.searchResult.ssc : null;

            if (ssc) {
                if (ssc.seoUrlText !== params.seoName) {
                    handleRedirectError(
                        routeManager.getPathByKey(state.intl.language, "collection", ssc.seoUrlText, ssc.id),
                    );
                }
                dispatch(
                    routingActionCreators.setAltLangHrefs({
                        altLangUrl: routeManager.getAltLangPathByKey(
                            state.intl.language,
                            "collection",
                            ssc.altLangSeoUrlText,
                            ssc.id,
                        ),
                        curLangUrl: routeManager.getCurrLang(location.pathname),
                    }),
                );
            }
        };
    }

    function _setState(state: SearchState) {
        return {
            type: searchActionType.setState,
            state,
        };
    }

    return {
        trackProductListPageLoad,
        changeQuery,
        sort,
        trackSearchRedirect,
        selectFilter,
        removeAllFilters,
        resetWasFacetFilterSelected,
        search,
        addDynamicContent,
        clearDynamicContent,
        searchWithAvailabilities,
        searchByCategory,
        searchCategory,
        loadMore,
        updateSearchResult,
        getAvailabilities,
        updateAvailabilities,
        route,
        syncStateWithLocation,
        syncSearchStateWithLocation,
        syncBrandStateWithLocation,
        syncCategoryStateWithLocation,
        syncCollectionStateWithLocation,
        setInitialSearchState,
        updateMinMaxPrice,
        applyPriceRangeQuery,
        clearAppliedRangeFlag,
        clearMinMaxPrice,
        updatePriceFacet,
        updateMinMaxPriceFromPath,
        updateAvailabilityFacet,
    };
})();

export default searchActionCreators;
