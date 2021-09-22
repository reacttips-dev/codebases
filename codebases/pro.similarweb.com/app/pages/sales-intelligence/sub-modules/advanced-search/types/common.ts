import { FetchError } from "pages/sales-intelligence/types";
import { AdvancedSearchFilter, SupportedFilterKey, SupportedFilterType } from "./filters";
import { TrafficChangePeriod, TrafficChangeTrend } from "../filters/traffic-changes/types";

export type FiltersPanelContextType = {
    isLoading: boolean;
    isExpanded: boolean;
    isFirstCategoryInitiallyExpanded: boolean;
    onExpandToggle(): void;
};

export type SearchTableFiltersType = {
    asc: boolean;
    page: number;
    orderBy: string;
    pageSize: number;
};

export type AdvancedSearchState = {
    filtersConfigFetched: boolean;
    filtersConfigFetching: boolean;
    filtersPanelExpanded: boolean;
    /** The main filters */
    filtersInDirtyState: SupportedFilterType[];
    filtersInReadyState: SupportedFilterType[];
    /** Search template */
    searchTemplate: PopularSearchTemplate | null;
    /** Table results */
    searchResultsFetching: boolean;
    searchResultsFetchError: FetchError;
    searchResults: SearchResultsResponseDto;
    /** Table related filters */
    tableFilters: SearchTableFiltersType;
    /** All Saved searches */
    savedSearches: SimplifiedSavedSearchDto[];
    /** Save a new search */
    searchCreating: boolean;
    searchCreateError?: string;
    recentlyCreatedSearchId?: string;
    /** Single search object by id */
    searchById: null | SavedSearchDto;
    searchByIdFetching: boolean;
    searchByIdFetchError?: string;
    /** Updating single search object by id */
    searchByIdUpdating: boolean;
    searchByIdUpdateError?: string;
    /** Deleting single search by id */
    searchByIdDeleting: boolean;
    searchByIdDeleteError?: string;
    /** Excel download */
    excelDownloading: boolean;
    excelDownloadError?: string;
    /** Saved searches modal popup */
    isSavedSearchesModalOpened: boolean;
    /** Recommended searches modal popup */
    isRecommendedSearchesModalOpened: boolean;
    /** Save new search modal popup */
    isSaveNewSearchModalOpened: boolean;
    /** Save new search success modal popup */
    isSaveNewSearchSuccessModalOpened: boolean;
    /** Saved search settings modal popup */
    isSavedSearchSettingsModalOpened: boolean;
};

export type WithExpandingProps = {
    isExpanded: boolean;
    isInitiallyExpandedWithTimeout?: boolean;
    onExpandToggle(): void;
};

export type WithCurrentSearchObjectProps = {
    currentSearchObject: SavedSearchDto | null;
};

export type FilterContainerProps<
    F extends AdvancedSearchFilter<ReturnType<F["getValue"]>> = AdvancedSearchFilter<unknown>
> = {
    filter: F;
    onUpdate(filter: F): void;
    onRegister?(key: SupportedFilterKey): void;
};

export type FiltersGroupContainerProps = WithExpandingProps & {
    onFilterRegister(key: SupportedFilterKey): void;
};

export type WithFilterKeyProp = {
    filterKey: SupportedFilterKey;
};

export type WithFiltersKeysProp = {
    filtersKeys: SupportedFilterKey[];
};

export type FiltersInBothStates = {
    filtersInDirtyState: SupportedFilterType[];
    filtersInReadyState: SupportedFilterType[];
};

export const enum WebsiteTypeVariant {
    ecommerce = "ecommerce",
    publisher = "publisher",
    advertiser = "advertiser",
}

export type FiltersConfigResponseDto = {
    topLevelDomain: { options: readonly string[] };
    companyHeadquarter: {
        inclusions: readonly string[];
    };
    websiteType: {
        inclusions: readonly string[];
        types: readonly WebsiteTypeVariant[];
    };
    audienceAgeGroups: readonly string[];
    audienceGenderSplits: readonly string[];
    trafficChanges: {
        metrics: readonly string[];
        trends: readonly TrafficChangeTrend[];
        periods: readonly TrafficChangePeriod[];
    };
    technologies: ReadonlyArray<{
        name: string;
        categories: ReadonlyArray<{
            name: string;
            technologies: ReadonlyArray<{ id: number; name: string }>;
        }>;
    }>;
};

export type FiltersDto = Partial<
    {
        [key in SupportedFilterKey]: unknown;
    }
>;

export type SearchResultsRequestDto = SearchTableFiltersType & {
    device?: string;
    isNewOnly?: boolean;
    excludeUserLeads?: boolean;
    filters: FiltersDto;
};

export type SearchFiltersDto = Omit<SearchResultsRequestDto, keyof SearchTableFiltersType>;

export type SearchResultEntryType = {
    rank: number;
    site: string;
    favicon: string;
    country: number;
    category: string;
    functionality: string;
    // Contains many more
};

export type SearchResultsResponseDto = {
    totalCount: number;
    rows: readonly SearchResultEntryType[];
};

export type NewSearchDto = SearchResultsRequestDto & {
    name: string;
};

export type SavedSearchDto = NewSearchDto & {
    searchId: string;
    createdDate: string;
    numberOfNewWebsites: number;
    totalNumberOfWebsites: number;
};

export type SimplifiedSavedSearchDto = Pick<SavedSearchDto, "name" | "searchId"> & {
    numberOfNewWebsites: number;
    totalNumberOfWebsites: number;
};

export enum CountryRadioEnum {
    specific = "specific",
    worldwide = "worldwide",
}

export enum PopularSearchKey {
    any = "any",
    ecommerce = "ecommerce",
    publishers = "publishers",
    advertisers = "advertisers",
}

export type PopularSearchTemplateIcon = {
    name: string;
    height: number;
    width: number;
};

export type PopularSearchTemplate = {
    icon: PopularSearchTemplateIcon | null;
    filters: FiltersDto;
};

export type PopularSearchTab = {
    order: number;
    key: PopularSearchKey;
    searches: PopularSearchTemplate[];
};
