import { memoize } from "lodash";
import { compose } from "redux";
import {
    SIGNAL_NAME_PREFIX,
    SIGNALS_MOST_USED_COUNT,
    SIGNALS_CHANGE_DROPDOWN_DEFAULT_ITEM_CODE,
} from "./constants";
import * as t from "./types";
import { SignalSubFilter, SignalWithLabel } from "./types";
import {
    addValueInParentheses,
    compareNumericPropDesc,
    keepItemsThatMatchSearch,
    sortItemsByLabelsAsc,
} from "../../helpers";
import { DropdownItemType } from "pages/workspace/sales/components/custom-dropdown/types";
import {
    DROPDOWN_ALL_GROUP,
    DROPDOWN_FREQUENTLY_USED_GROUP,
    DROPDOWN_GROUP_CORRECTLY_ORDERED_KEYS,
    DROPDOWN_MORE_GROUP,
} from "pages/workspace/sales/components/custom-dropdown/constants";

/**
 * Maps SignalWithId to SignalWithLabel with translated label
 * @param translator
 */
export const getToSignalWithLabelMapper = (translator: (s: string) => string) => (
    signal: t.SignalWithId,
): t.SignalWithLabel => ({
    id: signal.id,
    total: signal.total,
    label: translator(`${SIGNAL_NAME_PREFIX}.${signal.id}`),
});

/**
 * Changes given signal's label to include its total value in parentheses
 * @param s
 */
export const addTotalToLabel = (s: SignalWithLabel) => {
    return {
        ...s,
        label: addValueInParentheses(s.label, s.total),
    };
};

export const getToSignalWithIdMapper = memoize(
    /**
     * Maps Signal to SignalWithId
     * @param signals
     */
    (signals: t.SignalsByName) => (key: string): t.SignalWithId => ({
        id: key,
        ...signals[key],
    }),
);

/**
 * Sort helper for sub filter's "count" property descending
 */
export const compareSubFilterCountDesc = compareNumericPropDesc<t.SignalSubFilter>("count");

/**
 * Predicate for Signal's "total" property
 * @param s
 */
export const hasNonZeroTotal = (s: t.Signal): boolean => s.total > 0;

/**
 * Predicate for SubFilter's "count" property
 * @param f
 */
export const hasNonZeroCount = (f: t.SignalSubFilter): boolean => f.count > 0;
/**
 * Reduce callback to count sum of signal totals
 * @param acc
 * @param signal
 */
export const reduceBySignalTotal = (acc: number, signal: t.SignalWithId): number =>
    acc + signal.total;

/**
 * Filters out most used keys from given array of signals
 * @param signals
 * @param mostUsedKeys
 */
export const filterMostUsedFromAllSignals = (
    signals: t.SignalWithLabel[],
    mostUsedKeys: string[],
): t.SignalWithLabel[] => {
    // Return given signals if no most used keys or there are too few of signals available
    if (mostUsedKeys.length === 0 || signals.length <= SIGNALS_MOST_USED_COUNT) {
        return signals;
    }

    return signals.filter((s) => !mostUsedKeys.includes(s.id));
};

/**
 * Sub filter selection helper
 * @param code
 * @param value
 */
export const isSubFilterItemSelected = (
    code: t.SignalSubFilter["code"],
    value: t.SignalSubFilter["code"] | null,
): boolean => {
    if (value === null && code === SIGNALS_CHANGE_DROPDOWN_DEFAULT_ITEM_CODE) {
        return true;
    }

    return code === value;
};

/**
 * Transforms signals object to array with objects
 * @param signalsByName
 */
export const transformToArrayOfSignals = (signalsByName: t.SignalsByName): t.SignalWithId[] =>
    Object.keys(signalsByName).map(getToSignalWithIdMapper(signalsByName));

/**
 * Filters out signals objects with total = 0
 * @param signals
 */
export const filterOutZeroTotal = <T extends t.Signal>(signals: T[]): T[] =>
    signals.filter(hasNonZeroTotal);

/**
 * Produces ready-to-use signals array
 */
export const signalsByNameToArrayOfSignals = compose(filterOutZeroTotal, transformToArrayOfSignals);

/**
 * Request params helper function
 * @param initialParams
 * @param countryCode
 * @param hasSingleCountry
 */
export const buildSignalsRequestParamsForAllOrInverse = (
    initialParams: t.SignalsRequestParams,
    countryCode: number,
    hasSingleCountry: boolean,
): t.SignalsRequestParams => {
    if (hasSingleCountry) {
        return {
            ...initialParams,
            countryCode,
            inverse: true,
        };
    }

    return initialParams;
};

/**
 * Returns mostly used signals as objects. Filters out possible undefined values.
 * @param mostUsedKeys
 * @param signals
 */
export const safeGetMostUsedSignals = <T extends t.SignalWithId>(
    mostUsedKeys: string[],
    signals: T[],
): T[] => {
    return mostUsedKeys
        .map((key) => signals.find((s) => s.id === key))
        .filter((s) => typeof s !== "undefined");
};

/**
 * Crates grouped by mostly used drop down items
 * @param mostUsedKeys
 * @param signals
 */
export const getItemsGroupsByMostUsed = (
    mostUsedKeys: string[],
    signals: t.SignalWithLabel[],
): t.SignalsDropDownGroup => {
    const otherSignals = filterMostUsedFromAllSignals(signals, mostUsedKeys);
    const group: t.SignalsDropDownGroup = {};

    // Use different title (for translations)
    if (signals.length <= SIGNALS_MOST_USED_COUNT) {
        group[DROPDOWN_ALL_GROUP] = otherSignals;
    } else {
        group[DROPDOWN_MORE_GROUP] = otherSignals;
    }

    if (mostUsedKeys.length > 0 && signals.length > SIGNALS_MOST_USED_COUNT) {
        group[DROPDOWN_FREQUENTLY_USED_GROUP] = safeGetMostUsedSignals(mostUsedKeys, signals);
    }

    return group;
};

/**
 * Returns sorted by label signals, respects given search string
 * @param mapper
 * @param search
 * @param signals
 */
export const getTranslatedSortedSignals = (
    mapper: (s: t.SignalWithId) => t.SignalWithLabel,
    search: string,
    signals: t.SignalWithId[],
): t.SignalWithLabel[] => {
    return compose(sortItemsByLabelsAsc, keepItemsThatMatchSearch(search))(signals.map(mapper));
};

/**
 * Ensures correct order of keys
 * @param group
 */
export const getSignalGroupKeysInCorrectOrder = (group: t.SignalsDropDownGroup): string[] => {
    const keys = Object.keys(group);

    if (keys.length === 1) {
        return keys;
    }

    return DROPDOWN_GROUP_CORRECTLY_ORDERED_KEYS.filter((key) => keys.includes(key));
};

/**
 * Transforms given sub filter object to the dropdown item one
 * @param s
 */
export const subFilterToDropdownItem = (s: SignalSubFilter): DropdownItemType => {
    return {
        id: s.code,
        label: addValueInParentheses(s.title, s.count),
    };
};

/**
 * Transforms given sub filters to dropdown items
 * @param subFilters
 */
export const transformSubFiltersToDropdownItems = (
    subFilters: SignalSubFilter[],
): DropdownItemType[] => {
    return subFilters.map(subFilterToDropdownItem);
};

/**
 * Sorts given sub filters by their "count" descending
 * @param subFilters
 */
export const sortSubFiltersByCountDesc = (subFilters: SignalSubFilter[]): SignalSubFilter[] => {
    return subFilters.slice().sort(compareSubFilterCountDesc);
};

/**
 * Get the "count" fields sum for given sub filters
 * @param sfs
 */
export const summarizeSubFiltersCounts = (sfs: SignalSubFilter[]) => {
    return sfs.reduce((sum, sf) => sum + sf.count, 0);
};
