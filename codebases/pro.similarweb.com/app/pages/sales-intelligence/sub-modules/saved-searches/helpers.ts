import {
    NotSavedSearchType,
    QueryDefinition,
    ReportResult,
    SavedSearchType,
    SearchTableExcelDownloadParams,
} from "./types";
import { MIN_SEARCH_NAME_LENGTH } from "./constants/validation";
import { SEARCH_CREATED_THIS_MONTH, SEARCH_CREATED_MONTHS_AGO } from "./constants/translation-keys";

/**
 * Extracts search object's queryDefinition.id property
 * @param searchObject
 */
export const getSearchId = (searchObject: SavedSearchType | NotSavedSearchType) => {
    return searchObject?.queryDefinition?.id;
};

/**
 * Extracts search object's queryDefinition.name property
 * @param savedSearch
 */
export const getSearchName = (savedSearch: SavedSearchType) => {
    return savedSearch?.queryDefinition?.name;
};

/**
 * Extracts search object's queryDefinition.create_date property
 * @param savedSearch
 */
export const getSearchCreatedDate = (savedSearch: SavedSearchType) => {
    return savedSearch?.queryDefinition?.created_date;
};

/**
 * Extracts search object's queryDefinition.used_result_count property
 * @param savedSearch
 */
export const getSearchUsedResultCount = (savedSearch: SavedSearchType) => {
    return savedSearch?.queryDefinition?.used_result_count;
};

/**
 * Extracts search object's queryDefinition.autoRerunActivated property
 * @param savedSearch
 */
export const getSearchAutoRerunEnabled = (savedSearch: SavedSearchType) => {
    return savedSearch?.queryDefinition?.auto_rerun_activated;
};

/**
 * Extracts search object's lastRun.resultCount property
 * @param savedSearch
 */
export const getSearchResultCount = (savedSearch: Readonly<SavedSearchType>) => {
    return savedSearch?.lastRun?.resultCount;
};

/**
 * Extract query device
 * @param queryDefinition
 */
export const getQueryDevice = <Q extends Pick<QueryDefinition, "filters">>(queryDefinition: Q) => {
    return queryDefinition?.filters?.device;
};

/**
 * Checks whether the queryDefinition filter "device" is "Desktop"
 * @param queryDefinition
 */
export const isDesktopQuery = <Q extends Pick<QueryDefinition, "filters">>(queryDefinition: Q) => {
    return getQueryDevice(queryDefinition) === "Desktop";
};

/**
 * Checks whether given object has given id
 * @param id
 */
export const searchHasQueryId = (id: QueryDefinition["id"]) => (search: SavedSearchType) => {
    return getSearchId(search) === id;
};

/**
 * Checks whether given object does not have given id
 * @param id
 */
export const searchDoesNotHaveQueryId = (id: QueryDefinition["id"]) => (
    search: SavedSearchType | NotSavedSearchType,
) => {
    return getSearchId(search) !== id;
};

/**
 * Checks whether given search has auto rerun activated
 * @param search
 */
export const searchHasRerunActivated = (search: SavedSearchType) => {
    return Boolean(getSearchAutoRerunEnabled(search));
};

/**
 * A helper function to determine if the given search object belongs to saved-searches
 * Determination is pretty naive by "created_date" property
 * @param search
 */
export const isSearchASavedSearch = (
    search: NotSavedSearchType | SavedSearchType,
): search is SavedSearchType => {
    return typeof getSearchCreatedDate(search as SavedSearchType) !== "undefined";
};

/**
 * Leaves only searches with auto rerun activated
 * @param savedSearches
 */
export const getSearchesWithAutoRerunEnabled = (
    savedSearches: SavedSearchType[],
): SavedSearchType[] => {
    return savedSearches.filter(searchHasRerunActivated);
};

/**
 * Checks whether given report result has queryId and runId fields
 * @param reportResult
 */
export const isReportResultValid = (reportResult: ReportResult) => {
    return typeof reportResult.runId !== "undefined" && typeof reportResult.queryId !== "undefined";
};

/**
 * Checks whether given search object has all required id fileds
 * @param searchObject
 */
export const doesSearchObjectHaveIds = (searchObject: SavedSearchType | NotSavedSearchType) => {
    return (
        typeof searchObject?.queryDefinition?.id !== "undefined" &&
        typeof searchObject?.lastRun?.id !== "undefined"
    );
};

/**
 * A handy factory function for "NotSavedSearch" object that includes only ids and filters
 * @param reportResult
 */
export const createNotSavedSearch = (reportResult: ReportResult): NotSavedSearchType => {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const { queryId, runId, filters, order_by } = reportResult;

    return {
        queryDefinition: {
            id: queryId,
            filters,
            // eslint-disable-next-line @typescript-eslint/camelcase
            order_by,
        },
        lastRun: {
            id: runId,
        },
    };
};

/**
 * Sorts given saved searches list alphabetically
 * @param savedSearches
 */
export const sortByQueryDefinitionName = (savedSearches: ReadonlyArray<SavedSearchType>) => {
    return savedSearches.slice().sort((a, b) => {
        return getSearchName(a).localeCompare(getSearchName(b));
    });
};

/**
 * A translation helper for auto rerun toast
 * @param savedSearch
 */
export const getSearchRerunSuccessKey = (savedSearch: SavedSearchType) => {
    if (searchHasRerunActivated(savedSearch)) {
        return "si.pages.search_result.rerun.success.enabled";
    }

    return "si.pages.search_result.rerun.success.disabled";
};

/**
 * A translation helper for saved search created text
 * @param numberOfMonths
 * @param translate
 */
export const getSearchCreatedTimeText = (
    numberOfMonths: number,
    // TODO: Haven't found any existing type for translate function
    translate: (key: string, replacements?: object) => string,
) => {
    if (numberOfMonths === 0) {
        return translate(SEARCH_CREATED_THIS_MONTH);
    }

    return translate(SEARCH_CREATED_MONTHS_AGO, { numberOfMonths });
};

/**
 * Checks whether given name satisfies its length condition
 * @param name
 */
export const isSearchNameLongEnough = (name: string) => {
    return name.trim().length >= MIN_SEARCH_NAME_LENGTH;
};

/**
 * Immutably updates object's queryDefinition.name property
 * @param name
 * @param savedSearch
 */
export const updateSavedSearchName = (
    name: string,
    savedSearch: SavedSearchType,
): SavedSearchType => {
    return {
        ...savedSearch,
        queryDefinition: {
            ...savedSearch.queryDefinition,
            name,
        },
    };
};

/**
 * Replaces an existing object with given replacer if their ids match
 * @param replacer
 * @param searches
 */
export const findAndReplaceSavedSearch = (
    replacer: SavedSearchType,
    searches: SavedSearchType[],
): SavedSearchType[] => {
    return searches.map((search) => {
        const matchesReplacerId = searchHasQueryId(getSearchId(replacer))(search);

        if (matchesReplacerId) {
            return replacer;
        }

        return search;
    });
};

export function getUrlDownloadExcelLeadGeneration(params: SearchTableExcelDownloadParams): string {
    const {
        runId,
        queryId,
        search = "",
        newLeadsOnly = false,
        excludeUserLeads = true,
        top,
        sort,
        asc,
        orderBy,
    } = params;

    let url = `/api/sales-leads-generator/report/query/${queryId}/run/${runId}/excel?search=${search}&excludeUserLeads=${excludeUserLeads}&newLeadsOnly=${newLeadsOnly}&top=${top}`;

    if (typeof sort !== "undefined") {
        url += `&sort=${sort}`;
    }

    if (typeof asc !== "undefined") {
        url += `&asc=${asc}`;
    }

    if (typeof orderBy !== "undefined") {
        url += `&orderBy=${orderBy}`;
    }

    return url;
}

/**
 * FIXME: Copied from old code. Consider refactoring.
 * Transforms some of the properties of the inner "filters" object
 * @param savedSearch
 */
export const legacyTransformTechnologiesFilters = (
    savedSearch: SavedSearchType,
): SavedSearchType => {
    const MODE_CATEGORIES = "categories";
    const MODE_TECHNOLOGIES = "technologies";
    const FUNCTIONALITY_EXCLUDE = "exclude";
    const FUNCTIONALITY_INCLUDE = "include";

    const { filters } = savedSearch.queryDefinition;

    if (!filters["technographics_excluded"] && !filters["technographics_included"]) {
        return savedSearch;
    }

    const newFilters = { ...filters };

    if (filters["technographics_excluded"]) {
        let mode;
        let values = [];

        if (filters["technographics_excluded"]["technographics_technology"]) {
            values = filters["technographics_excluded"][
                "technographics_technology"
            ].map((item) => ({ text: item }));
        }

        if (filters["technographics_excluded"]["technographics_parent_category"]) {
            values = filters["technographics_excluded"][
                "technographics_parent_category"
            ].map((text) => ({ text }));
            mode = MODE_CATEGORIES;
        }

        if (filters["technographics_excluded"]["technographics_technology"]) {
            values = filters["technographics_excluded"][
                "technographics_technology"
            ].map((text) => ({ text }));
            mode = MODE_TECHNOLOGIES;
        }

        newFilters["technographics_excluded"] = {
            functionality: FUNCTIONALITY_EXCLUDE,
            mode,
            values,
        };
    }

    if (filters["technographics_included"]) {
        let mode;
        let values = [];

        if (filters["technographics_included"]["technographics_technology"]) {
            values = filters["technographics_included"][
                "technographics_technology"
            ].map((item) => ({ text: item }));
        }

        if (filters["technographics_included"]["technographics_parent_category"]) {
            values = filters["technographics_included"][
                "technographics_parent_category"
            ].map((item) => ({ text: item }));
            mode = MODE_CATEGORIES;
        }

        if (filters["technographics_included"]["technographics_technology"]) {
            values = filters["technographics_included"][
                "technographics_technology"
            ].map((item) => ({ text: item }));
            mode = MODE_TECHNOLOGIES;
        }

        newFilters["technographics_included"] = {
            functionality: FUNCTIONALITY_INCLUDE,
            mode,
            values,
        };
    }

    return {
        ...savedSearch,
        queryDefinition: {
            ...savedSearch.queryDefinition,
            filters: newFilters,
        },
    };
};
