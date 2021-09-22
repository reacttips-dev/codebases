import swLog from "@similarweb/sw-log";
import { objectKeys } from "pages/workspace/sales/helpers";
import { objectCreate } from "pages/sales-intelligence/helpers/common";
import { getFilterMatchesKeyPredicate } from "../helpers/filters";
import createAudienceFilter from "../filters/audience/factory";
import createCheckboxFilter from "../filters/checkbox/factory";
import createTextSearchFilter from "../filters/text-search/factory";
import createVisitsFromFilter from "../filters/visits-from/factory";
import createTechnologiesFilter from "../filters/technology/factory";
import createWebsiteTypeFilter from "../filters/website-type/factory";
import createHeadquartersFilter from "../filters/headquarters/factory";
import createRangeNumbersFilter from "../filters/range-numbers/factory";
import createRangePercentsFilter from "../filters/range-percents/factory";
import createRangeDurationsFilter from "../filters/range-duration/factory";
import createTrafficChangesFilter from "../filters/traffic-changes/factory";
import createWebsiteIndustryFilter from "../filters/website-industry/factory";
import createTopLevelDomainsFilter from "../filters/top-level-domains/factory";
import { FiltersManager, FiltersManagerDepsType } from "../types/services";
import { SupportedFilterType, SupportedFilterKey } from "../types/filters";
import { FiltersInBothStates } from "../types/common";
import {
    RANGE_PERCENTS_FILTERS_KEYS,
    RANGE_DURATION_FILTERS_CONFIG,
    RANGE_NUMBERS_FILTERS_CONFIG,
} from "../configuration/filters";

const createFiltersManager = (deps: FiltersManagerDepsType): FiltersManager => {
    const { translate, settingsService } = deps;
    const { employeeCount, annualRevenue, ...restNumbersFilters } = RANGE_NUMBERS_FILTERS_CONFIG;
    /** This object holds all instances of all filters available by their keys */
    const KEY_TO_INSTANCE: { [key in SupportedFilterKey]: SupportedFilterType } = objectCreate(
        null,
    );

    KEY_TO_INSTANCE["excludeUserLeads"] = createCheckboxFilter(translate, "excludeUserLeads");

    KEY_TO_INSTANCE["isNewOnly"] = createCheckboxFilter(translate, "isNewOnly");

    KEY_TO_INSTANCE["searchText"] = createTextSearchFilter(translate, "searchText");

    KEY_TO_INSTANCE["employeeCount"] = createRangeNumbersFilter(
        translate,
        "employeeCount",
        RANGE_NUMBERS_FILTERS_CONFIG["employeeCount"],
        false,
    );

    KEY_TO_INSTANCE["annualRevenue"] = createRangeNumbersFilter(
        translate,
        "annualRevenue",
        RANGE_NUMBERS_FILTERS_CONFIG["annualRevenue"],
        false,
    );

    RANGE_PERCENTS_FILTERS_KEYS.forEach((key) => {
        KEY_TO_INSTANCE[key] = createRangePercentsFilter(translate, key);
    });

    objectKeys(RANGE_DURATION_FILTERS_CONFIG).forEach((key) => {
        KEY_TO_INSTANCE[key] = createRangeDurationsFilter(translate, key);
    });

    objectKeys(restNumbersFilters).forEach((key) => {
        KEY_TO_INSTANCE[key] = createRangeNumbersFilter(
            translate,
            key,
            RANGE_NUMBERS_FILTERS_CONFIG[key],
        );
    });
    /**
     * Reduces given array of filters instances to a single object containing two arrays by filters state
     * @param filters
     */
    const reduceToFiltersInBothStatesGroup = (filters: SupportedFilterType[]) => {
        return filters.reduce<FiltersInBothStates>(
            (result, filter) => {
                if (filter.inDirtyState()) {
                    result.filtersInDirtyState.push(filter);
                }

                if (filter.inReadyState()) {
                    result.filtersInReadyState.push(filter);
                }

                return result;
            },
            {
                filtersInReadyState: [],
                filtersInDirtyState: [],
            },
        );
    };
    /**
     * Returns all filters instances
     */
    const getAll = () => {
        return objectKeys(KEY_TO_INSTANCE).map((k) => KEY_TO_INSTANCE[k]);
    };
    /**
     * Resets all the filters and returns those that remain in its "ready" state
     */
    const resetAll = () => {
        const filters = getAll();

        return filters.reduce<SupportedFilterType[]>((filtersInReadyState, instance) => {
            const resetInstance = instance.reset();

            if (resetInstance.inReadyState()) {
                filtersInReadyState.push(resetInstance);
            }

            return filtersInReadyState;
        }, []);
    };
    /**
     * Looks for filter instance by its key and returns it
     * If not found - returns null
     * @param key
     */
    const getFilterInstance = (key: SupportedFilterKey): SupportedFilterType | null => {
        const filter = KEY_TO_INSTANCE[key];

        if (!filter) {
            swLog.error(`Filter with "${key}" key was not found.`);
            return null;
        }

        return filter;
    };
    /**
     * Returns a group of filters instances with populated values from given dto
     * @param dto
     */
    const getFiltersInBothStatesAsGroupFromDto = (
        dto: Partial<{ [key in SupportedFilterKey]: unknown }>,
    ) => {
        return reduceToFiltersInBothStatesGroup(
            objectKeys(dto)
                .map(getFilterInstance)
                .filter((instance) => instance !== null)
                .map((instance) => instance.fromDto(dto[instance.key])),
        );
    };

    return {
        resetAll,
        getFilterInstance,
        getKeyToInstanceMap() {
            return KEY_TO_INSTANCE;
        },
        applyValuesFromDto(dto) {
            const filtersInitiallyInReadyState = resetAll();
            const group = getFiltersInBothStatesAsGroupFromDto(dto);

            // Make sure that all filters that initially were in "ready" state are included in the result
            filtersInitiallyInReadyState.forEach((filter) => {
                const foundInApplied = group.filtersInReadyState.find(
                    getFilterMatchesKeyPredicate(filter.key),
                );

                if (typeof foundInApplied === "undefined") {
                    group.filtersInReadyState.push(filter);
                }
            });

            return group;
        },
        initFiltersFromConfig(config) {
            try {
                KEY_TO_INSTANCE["countries"] = createVisitsFromFilter(
                    translate,
                    "countries",
                    settingsService,
                );
                KEY_TO_INSTANCE["categories"] = createWebsiteIndustryFilter(
                    translate,
                    "categories",
                    settingsService,
                );
                KEY_TO_INSTANCE["companyHeadquarter"] = createHeadquartersFilter(
                    translate,
                    "companyHeadquarter",
                    settingsService,
                );
                KEY_TO_INSTANCE["trafficChanges"] = createTrafficChangesFilter(
                    translate,
                    "trafficChanges",
                    config.trafficChanges,
                );
                KEY_TO_INSTANCE["topLevelDomain"] = createTopLevelDomainsFilter(
                    translate,
                    "topLevelDomain",
                    config["topLevelDomain"].options.slice().reverse(),
                );
                KEY_TO_INSTANCE["websiteType"] = createWebsiteTypeFilter(
                    translate,
                    "websiteType",
                    config["websiteType"],
                );
                KEY_TO_INSTANCE["audienceAgeGroups"] = createAudienceFilter(
                    translate,
                    "audienceAgeGroups",
                    config["audienceAgeGroups"],
                );
                KEY_TO_INSTANCE["audienceGenderSplits"] = createAudienceFilter(
                    translate,
                    "audienceGenderSplits",
                    config["audienceGenderSplits"],
                );
                KEY_TO_INSTANCE["technologies"] = createTechnologiesFilter(
                    translate,
                    "technologies",
                    config.technologies,
                );

                return reduceToFiltersInBothStatesGroup(getAll());
            } catch (e) {
                swLog.error(`"initFiltersViaConfig" failed with: ${e}`);
                return {
                    filtersInReadyState: [],
                    filtersInDirtyState: [],
                };
            }
        },
    };
};

export default createFiltersManager;
