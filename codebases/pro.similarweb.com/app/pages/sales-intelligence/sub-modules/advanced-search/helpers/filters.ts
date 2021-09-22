import { SupportedFilterKey, SupportedFilterType } from "../types/filters";
import {
    WithSecondaryName,
    WithNamesMatchType,
    TechnologiesBaseListItem,
    TechnologiesConditionEntry,
    TechnologiesConditionTypeEnum,
} from "../filters/technology/types";
import {
    FiltersDto,
    NewSearchDto,
    SavedSearchDto,
    SearchFiltersDto,
    SearchResultsRequestDto,
    SearchTableFiltersType,
    WebsiteTypeVariant,
} from "../types/common";
import { objectKeys } from "pages/workspace/sales/helpers";

export const stringMatchesSearchTerm = (string: string, searchTerm: string) => {
    return string.trim().toLowerCase().includes(searchTerm.trim().toLowerCase());
};

export const compareNamesAsc = <T extends { name: string }>(a: T, b: T) => {
    return a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase());
};

export const compareByPrimaryNameMatch = <
    T extends TechnologiesBaseListItem & Pick<WithNamesMatchType, "nameMatch">
>(
    a: T,
    b: T,
) => {
    if (a.nameMatch && !b.nameMatch) {
        return -1;
    }

    return compareNamesAsc(a, b);
};

export const getMatchedSubString = (searchTerm: string, string?: string): string | undefined => {
    if (typeof string === "undefined" || string.length === 0) {
        return undefined;
    }

    const match = string.match(RegExp(searchTerm, "gi"));

    if (match === null || !Array.isArray(match)) {
        return undefined;
    }

    return match[0];
};

export const nameMatchesSearchTerm = (searchTerm: string) => <
    T extends TechnologiesBaseListItem & Partial<WithSecondaryName>
>(
    hasName: T,
) => {
    if (searchTerm.length === 0) {
        return true;
    }

    const nameMatches = stringMatchesSearchTerm(hasName.name, searchTerm);
    let secondaryNameMatches = false;

    if (typeof hasName.secondaryName !== "undefined") {
        secondaryNameMatches = stringMatchesSearchTerm(hasName.secondaryName, searchTerm);
    }

    return nameMatches || secondaryNameMatches;
};

export const toItemWithMatchedSubStrings = (searchTerm: string) => <
    T extends TechnologiesBaseListItem & Partial<WithSecondaryName>
>(
    hasName: T,
): T & WithNamesMatchType & { isSelected?: boolean } => {
    if (searchTerm.length === 0) {
        return hasName;
    }

    const nameMatch = getMatchedSubString(searchTerm, hasName.name);
    const secondaryNameMatch = getMatchedSubString(searchTerm, hasName.secondaryName);

    return {
        ...hasName,
        nameMatch,
        secondaryNameMatch,
    };
};

export const getOrderedWebsiteTypes = (types: WebsiteTypeVariant[]): WebsiteTypeVariant[] => {
    const DESIRED_ORDER: WebsiteTypeVariant[] = [
        WebsiteTypeVariant.ecommerce,
        WebsiteTypeVariant.publisher,
        WebsiteTypeVariant.advertiser,
    ];

    return DESIRED_ORDER.concat(types.filter((t) => !DESIRED_ORDER.includes(t)));
};

export const getFilterMatchesKeyPredicate = (key: SupportedFilterKey) => (
    instance: SupportedFilterType,
) => {
    return key === instance.key;
};

export const getFilterDoesNotMatchKeyPredicate = (key: SupportedFilterKey) => (
    instance: SupportedFilterType,
) => {
    return key !== instance.key;
};

export const conditionMatchesGivenType = (type: TechnologiesConditionTypeEnum) => (
    entry: TechnologiesConditionEntry,
) => {
    return entry.type === type;
};

export const doesNotMatchGivenConditionEntry = (given: TechnologiesConditionEntry) => (
    entry: TechnologiesConditionEntry,
) => {
    return given.name !== entry.name || given.type !== entry.type;
};

export const toEntryNameWithType = (entry: TechnologiesConditionEntry) => {
    return `${entry.name}-${entry.type}`;
};

export const toEntryName = (entry: TechnologiesConditionEntry) => {
    return entry.name;
};

export const isOfTypeCategory = (entry: TechnologiesConditionEntry) => {
    return entry.type === TechnologiesConditionTypeEnum.Category;
};

export const isOfTypeSubCategory = (entry: TechnologiesConditionEntry) => {
    return entry.type === TechnologiesConditionTypeEnum.SubCategory;
};

export const isOfTypeTechnology = (entry: TechnologiesConditionEntry) => {
    return entry.type === TechnologiesConditionTypeEnum.Technology;
};

export const toTechnologyFilterEntry = (type: TechnologiesConditionTypeEnum) => (
    name: TechnologiesConditionEntry["name"],
): TechnologiesConditionEntry => {
    return { name, type };
};

export const toCategoryEntry = toTechnologyFilterEntry(TechnologiesConditionTypeEnum.Category);
export const toTechnologyEntry = toTechnologyFilterEntry(TechnologiesConditionTypeEnum.Technology);
export const toSubCategoryEntry = toTechnologyFilterEntry(
    TechnologiesConditionTypeEnum.SubCategory,
);

export const createFiltersDto = (filters: SupportedFilterType[]): SearchFiltersDto => {
    const { device, isNewOnly, excludeUserLeads, ...rest } = filters.reduce<
        SearchResultsRequestDto["filters"]
    >((dto, filter) => {
        return { ...dto, ...filter.toDto() };
    }, {});

    return {
        filters: rest,
        device: device as string,
        isNewOnly: Boolean(isNewOnly),
        excludeUserLeads: Boolean(excludeUserLeads),
    };
};

export const createSearchResultsRequestDto = (
    filters: SupportedFilterType[],
    tableFilters: SearchTableFiltersType,
): SearchResultsRequestDto => {
    const dto = createFiltersDto(filters);

    return {
        ...tableFilters,
        page: tableFilters.page - 1,
        ...dto,
    };
};

export const createSearchDto = (
    name: string,
    filters: SupportedFilterType[],
    tableFilters: SearchTableFiltersType,
): NewSearchDto => {
    const searchResultsDto = createSearchResultsRequestDto(filters, tableFilters);

    return {
        name,
        ...searchResultsDto,
    };
};

export const extractFiltersFromDto = (dto: SavedSearchDto): FiltersDto => {
    const { isNewOnly, excludeUserLeads, filters } = dto;
    const mainFilters = { ...filters };

    if (typeof isNewOnly !== "undefined") {
        mainFilters.isNewOnly = isNewOnly;
    }

    if (typeof excludeUserLeads !== "undefined") {
        mainFilters.excludeUserLeads = excludeUserLeads;
    }

    return mainFilters;
};

export const areCurrentValuesDifferentFromDto = (
    filtersKeyToInstanceMap: { [key in SupportedFilterKey]: SupportedFilterType },
    filtersInReadyState: SupportedFilterType[],
    dto: SearchFiltersDto,
) => {
    const { isNewOnly, excludeUserLeads, filters: restFilters } = dto;
    const objectToCompare = { isNewOnly, excludeUserLeads, ...restFilters };

    for (const filterInReadyState of filtersInReadyState) {
        const fromDto = objectToCompare[filterInReadyState.key];

        if (!fromDto) {
            return true;
        }

        const theSame = filterInReadyState.compareValueWithDto(fromDto);

        if (!theSame) {
            return true;
        }

        delete objectToCompare[filterInReadyState.key];
    }

    return objectKeys(objectToCompare).some((keyFromDto) => {
        const filter = filtersKeyToInstanceMap[keyFromDto];

        return !filter || !filter.compareValueWithDto(objectToCompare[keyFromDto]);
    });
};
