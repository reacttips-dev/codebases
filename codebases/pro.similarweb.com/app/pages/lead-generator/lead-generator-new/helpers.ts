import _ from "lodash";
import {
    DESKTOP_DEVICE,
    ZIP_CODE_FILTER,
    MALE_FILTER_NAME,
    FEMALE_FILTER_NAME,
    COUNTRIES_FILTER_NAME,
    DOMAIN_CONTAINS_FILTER,
    DOMAIN_ENDS_WITH_FILTER,
    AGE_GROUP_FILTER_PREFIX,
    COUNTRY_CODE_LIST_FILTER,
    FILTERS_EVENT_TRACK_ACTION,
    COUNTRY_CODE_FUNCTIONALITY_FILTER,
} from "./constants";
import { IBaseFilter } from "pages/lead-generator/LeadGeneratorFilters";
import { IQueryConfig } from "pages/lead-generator/lead-generator-new/leadGeneratorNewConfig";

// TODO: Add tests after migration to jest

/**
 * @param device
 */
export const isDesktopDevice = (device: string): boolean => device === DESKTOP_DEVICE;

/**
 * Helper accessor for "stateName" filter's property
 */
export const getFilterStateName: (filter: IBaseFilter) => IBaseFilter["stateName"] = _.property(
    "stateName",
);

export const filterStateNameIs = _.curry(
    (name: string, filter: IBaseFilter) => getFilterStateName(filter) === name,
);

export const filterStateNameIncludes = _.curry((name: string, filter: IBaseFilter) =>
    getFilterStateName(filter).includes(name),
);

/**
 * filter/find predicates
 */
export const isMaleFilter = filterStateNameIs(MALE_FILTER_NAME);
export const isZipCodeFilter = filterStateNameIs(ZIP_CODE_FILTER);
export const isFemaleFilter = filterStateNameIs(FEMALE_FILTER_NAME);
export const isCountriesFilter = filterStateNameIs(COUNTRIES_FILTER_NAME);
export const isGroupFilter = filterStateNameIncludes(AGE_GROUP_FILTER_PREFIX);
export const isDomainContainsFilter = filterStateNameIs(DOMAIN_CONTAINS_FILTER);
export const isDomainEndsWithFilter = filterStateNameIs(DOMAIN_ENDS_WITH_FILTER);
export const isCountryCodeListFilter = filterStateNameIs(COUNTRY_CODE_LIST_FILTER);
export const isCountryCodeFunctionalityFilter = filterStateNameIncludes(
    COUNTRY_CODE_FUNCTIONALITY_FILTER,
);

/**
 * Event action name helper
 * @param eventName
 * @param filterName
 */
export const buildFiltersEventTrackAction = (eventName: string, filterName: string): string => {
    return FILTERS_EVENT_TRACK_ACTION.replace("{filter-name}", filterName).replace(
        "{event-name}",
        eventName,
    );
};

export const belongsToTrafficGroup = (box: IQueryConfig): boolean => {
    return (
        box.id === "engagementAndTrafficBox" ||
        box.id === "trafficSourcesBox" ||
        box.id === "growthFilterBox" ||
        box.id === "demographicBox" ||
        box.id === "engagementBox"
    );
};

// FIXME: Quick solution. Filters improvements are scheduled.
export const formatDescriptionForAvgVisitDuration = (value: number | string): string => {
    const asNumber = Number(value);

    if (asNumber <= 30) {
        return value + "s";
    }

    return asNumber / 60 + "m";
};
