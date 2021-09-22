import {searchActionType} from "../../actions";
import {SearchState, ProductSort, SponsoredProduct} from "../../models";
import {buildAggregateSponsoredProductsSearchResult} from "./utils";

export const initialSearchState: SearchState = {
    availabilities: {},
    brand: null,
    category: null,
    recommendations: {
        topSellers: [],
    },
    loadingMore: false,
    page: 1,
    path: "",
    query: "",
    searchResult: null,
    searching: false,
    sort: ProductSort.bestMatch,
    sscId: null,
    wasFacetFilterSelected: false,
    isSponsoredProductsLoaded: false,
    minPrice: "",
    maxPrice: "",
    appliedRangeQuery: false,
};

export const search = (state = initialSearchState, action) => {
    switch (action.type) {
        case searchActionType.changeQuery:
            return Object.assign({}, state, {
                brand: initialSearchState.brand,
                category: initialSearchState.category,
                path: action.path || initialSearchState.path,
                query: action.query,
                searching: true,
                sort: initialSearchState.sort,
                sscId: initialSearchState.sscId,
                searchResult: null,
                recommendations: initialSearchState.recommendations,
            });
        case searchActionType.loadMore:
            return Object.assign({}, state, {loadingMore: true});
        case searchActionType.resetWasFacetFilterSelected:
            return {
                ...state,
                minPrice: "",
                maxPrice: "",
                appliedRangeQuery: false,
                wasFacetFilterSelected: false,
            };
        case searchActionType.selectFilterRpu:
        case searchActionType.selectFilter:
            const selectedFacet = state.searchResult.facets.find(
                (facet) => facet.systemName === action.facetSystemName,
            );
            if (!selectedFacet) {
                return state;
            }
            const selectedFilter = selectedFacet.filters.find((filter) => filter.name === action.filterName);
            if (!selectedFilter) {
                return state;
            }

            const filters = [...selectedFacet.filters];

            if (!selectedFacet.isMultiSelect) {
                if (selectedFilter.isSelected) {
                    return state;
                }
                const prevSelectedFilterIndex = filters.findIndex((filter) => filter.isSelected);
                filters.splice(
                    prevSelectedFilterIndex,
                    1,
                    Object.assign({}, filters[prevSelectedFilterIndex], {isSelected: false}),
                );
            }

            const filterIndex = filters.indexOf(selectedFilter);
            filters.splice(filterIndex, 1, Object.assign({}, selectedFilter, {isSelected: !selectedFilter.isSelected}));

            const facets = [...state.searchResult.facets];
            const facetIndex = facets.indexOf(selectedFacet);
            facets.splice(facetIndex, 1, Object.assign({}, selectedFacet, {filters}));

            return Object.assign({}, state, {
                path: selectedFilter.path,
                searchResult: Object.assign({}, state.searchResult, {
                    facets,
                }),
                searching: true,
                wasFacetFilterSelected: true,
            });
        case searchActionType.removeAllFilters:
            return {
                ...state,
                path: "",
                searchResult: {
                    ...state.searchResult,
                    selectedFacets: [],
                },
                minPrice: "",
                maxPrice: "",
                appliedRangeQuery: false,
                searching: true,
            };
        case searchActionType.sort:
            return Object.assign({}, state, {
                searching: true,
                sort: action.sort,
            });
        case searchActionType.updateSearchResults:
            return Object.assign({}, state, {
                loadingMore: false,
                page: action.page,
                searchResult: action.searchResult,
            });
        case searchActionType.addSponsoredProducts:
            const {products} = state.searchResult;
            const {sponsoredProducts}: {sponsoredProducts: SponsoredProduct[]} = action;

            if (products && sponsoredProducts && state.searchResult.pageSize) {
                const organicAndSponsoredProducts = buildAggregateSponsoredProductsSearchResult(
                    sponsoredProducts,
                    products,
                );

                return {
                    ...state,
                    isSponsoredProductsLoaded: true,
                    searchResult: {
                        ...state.searchResult,
                        products: organicAndSponsoredProducts,
                        organicAndSponsoredProducts,
                    },
                };
            }

            return state;
        case searchActionType.setState:
            return Object.assign({}, state, action.state);

        case searchActionType.updateCategory:
            return Object.assign({}, initialSearchState, {
                category: action.category,
                searching: true,
            });
        case searchActionType.updateAvailabilities:
            return Object.assign({}, state, {
                availabilities: action.append
                    ? Object.assign({}, state.availabilities, action.availabilities)
                    : action.availabilities,
            });
        case searchActionType.getSiblingCategoriesFailure:
            return Object.assign({}, state, {searching: false});
        case searchActionType.addDynamicContent:
            return {
                ...state,
                dynamicContent: action.dynamicContent,
            };
        case searchActionType.clearDynamicContent:
            return {
                ...state,
                dynamicContent: null,
            };
        case searchActionType.clearRecommendations:
            return {
                ...state,
                recommendations: initialSearchState.recommendations,
            };
        case searchActionType.searchingDone:
            return {
                ...state,
                searching: false,
            };
        case searchActionType.setInitialSearchState:
            return {
                ...initialSearchState,
            };
        case searchActionType.updateCategoryDynamicContent:
            return {
                ...state,
                category: {
                    ...state.category,
                    dynamicContent: action.dynamicContent,
                },
            };
        case searchActionType.updateMinMaxPrice:
            return {
                ...state,
                minPrice: action.minPrice,
                maxPrice: action.maxPrice,
                // appliedRangeQuery: false,
            };
        case searchActionType.applyRangeQuery:
            return {
                ...state,
                path: action.path,
                pathBeforeRangeQuery: action.pathBeforeRangeQuery,
                searching: true,
                wasFacetFilterSelected: true,
                minPrice: action.minPrice,
                maxPrice: action.maxPrice,
            };
        case searchActionType.clearRangeQuery:
            return {
                ...state,
                path: action.path,
                minPrice: "",
                maxPrice: "",
                appliedRangeQuery: false,
                searching: true,
                wasFacetFilterSelected: true,
            };
        case searchActionType.applyRangeQueryResult:
            return {
                ...state,
                rangeQueryHasResults: action.rangeQueryHasResults,
                path: action.path,
                pathBeforeRangeQuery: undefined,
                appliedRangeQuery: true,
            };
        case searchActionType.updatePriceFacet:
            return {
                ...state,
                searchResult: action.searchResult,
                rangeQueryHasResults: action.rangeQueryHasResults,
            };
        case searchActionType.clearAppliedRangeFlag:
            return {
                ...state,
                appliedRangeQuery: false,
            };
        case searchActionType.clearMinMaxPrice:
            return {
                ...state,
                minPrice: "",
                maxPrice: "",
            };
        default:
            return state;
    }
};

export default search;
