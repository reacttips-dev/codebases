import dateTimeService from "services/date-time/dateTimeService";
import { compose } from "redux";
import { swNumberFilter } from "filters/ngFilters";
import { RootState } from "single-spa/store/types";
import { WithLabel } from "./types";
import { DropdownItemType } from "pages/workspace/sales/components/custom-dropdown/types";
import { DROPDOWN_GROUP_CORRECTLY_ORDERED_KEYS } from "pages/workspace/sales/components/custom-dropdown/constants";
import { i18nFilter } from "filters/ngFilters";
import { TOPICS_TRANSLATION_KEY } from "./sub-modules/benchmarks/constants";
/**
 * @param stateSliceSelector - function that should return desired state slice
 * @returns - helper typed selector builder function for top level state properties
 */
export const createStatePropertySelector = <SLICE extends {}>(
    stateSliceSelector: (state: RootState) => SLICE,
) => <PROPERTY extends keyof SLICE>(p: PROPERTY) => (state: RootState) =>
    stateSliceSelector(state)[p];

/**
 * Creates a function that extracts given property from given object
 * @param property
 */
export const prop = <T extends {}>(property: keyof T) => (object: T) => {
    return object[property];
};

/**
 * Retrieves properly typed object keys
 * @param obj
 */
export const objectKeys = <T extends {}>(obj: T) => {
    return Object.keys(obj).map((key) => key as keyof T);
};

/**
 * Retrieves properly typed object values
 * @param obj
 */
export const objectValues = <T extends {}>(obj: T) => {
    return Object.keys(obj).map((key) => obj[key as keyof T]);
};

/**
 * @param previous
 * @param current
 * @param shouldBe
 */
export const flagHasChanged = (previous: boolean, current: boolean, shouldBe = false) => {
    return typeof previous !== "undefined" && previous !== current && current === shouldBe;
};

/**
 * Sort helper for labels ascending
 * @param a
 * @param b
 */
export const compareLabelsAsc = <T extends WithLabel>(a: T, b: T) => {
    return a.label.localeCompare(b.label);
};

/**
 * Is given object has label that matches given string
 * @param s - search string
 */
export const labelMatchesSearchPredicate = (s: string) => <T extends WithLabel>(o: T) => {
    return o.label.toLowerCase().includes(s.toLowerCase());
};

/**
 * Filters out items whose labels don't match given string
 * @param s
 */
export const keepItemsThatMatchSearch = (s: string) => <T extends WithLabel>(items: T[]) => {
    return items.filter(labelMatchesSearchPredicate(s));
};

/**
 * Sorts items by their label ascending
 * @param items
 */
export const sortItemsByLabelsAsc = <T extends WithLabel>(items: T[]) => {
    return items.slice().sort(compareLabelsAsc);
};

/**
 * Returns a string that contains given one and some given value in parentheses
 * @param s
 * @param v
 */
export const addValueInParentheses = (s: string, v: string | number) => {
    return `${s} (${v})`;
};

/**
 * Comparator helper for given object's numeric "prop". Descending.
 * @param prop
 */
export const compareNumericPropDesc = <T>(prop: keyof T) => (a: T, b: T) => {
    if (a[prop] < b[prop]) {
        return 1;
    }

    if (a[prop] > b[prop]) {
        return -1;
    }

    return 0;
};

/**
 * Comparator helper for given object's numeric "prop". Ascending.
 * @param prop
 */
export const compareNumericPropAsc = <T>(prop: keyof T) => (a: T, b: T) => {
    if (a[prop] < b[prop]) {
        return -1;
    }

    if (a[prop] > b[prop]) {
        return 1;
    }

    return 0;
};

export const getDropdownGroupKeysInCorrectOrder = (group: {
    [name: string]: DropdownItemType[];
}) => {
    const keys = Object.keys(group);

    if (keys.length === 1) {
        return keys;
    }

    return DROPDOWN_GROUP_CORRECTLY_ORDERED_KEYS.filter((key) => keys.includes(key));
};

export const addDropDownItemGroup = (group: string) => (items: DropdownItemType[]) => {
    return items.map((item) => ({
        ...item,
        group,
    }));
};

export const appendTimePart = (value: number, suffix: string) => (result: string) => {
    if (value === 0) {
        return result;
    }

    return (value + suffix).concat(" " + result);
};

/**
 * Converts given number of seconds to a duration string
 * @example
 * `
 *  getTimeDurationString(110) -> "1m 50s"
 * `
 * @param s - number of seconds
 */
export const getTimeDurationString = (s: number) => {
    if (typeof s !== "number" || s <= 0) {
        return `${s}s`;
    }

    if (s < 1) {
        return `${swNumberFilter()(s, 3)}s`;
    }

    const { hours, minutes, seconds } = dateTimeService.splitDurationIntoParts(s);

    return compose(
        appendTimePart(hours, "h"),
        appendTimePart(minutes, "m"),
        appendTimePart(seconds, "s"),
    )("");
};

/**
 * TODO: Can be moved somewhere to project commons
 * @param given
 */
export function createCancelable<ARGS extends unknown[], R extends Promise<unknown>>(
    given: (signal: AbortSignal, ...args: ARGS) => R,
) {
    let abortController = new AbortController();

    return function cancelableWrapper(...args: ARGS): R {
        abortController.abort();
        abortController = new AbortController();

        return given.apply(null, [abortController.signal, ...args]);
    };
}

export const makeObjectBaseOnKey = <T extends { [key: string]: any }>(
    source: T[],
    key: keyof T,
) => {
    return source.reduce((obj, item) => {
        obj[item[key]] = item;
        return obj;
    }, {} as { [key: string]: T });
};

export const getFormattedLastSnapshotDate = (lastSnapshotDate) =>
    dateTimeService.formatWithMoment(lastSnapshotDate, "MMMM YYYY");

export const prepareDateTopCountriesLastSnapshotDate = (lastSnapshotDate) => {
    const format = "MMM YYYY";
    const startDate = dateTimeService
        .getMoment(lastSnapshotDate)
        .subtract(2, "months")
        .format(format);
    const endDate = dateTimeService.formatWithMoment(lastSnapshotDate, format);

    return [startDate, endDate];
};
/**
 * Creates a list of topics prepared for use in SingleDropdown component
 * @param groupedTopics: { code: string; isPopular: boolean }[]
 * @returns: { id: string; text: string; isPopular: boolean }[]
 */

export const createFormattedTopicsList = (
    groupedTopics: { code: string; isPopular: boolean }[],
): { id: string; text: string; isPopular: boolean }[] =>
    groupedTopics.map(({ code, isPopular }) => {
        return {
            id: code,
            text: i18nFilter()(`${TOPICS_TRANSLATION_KEY}.${code}`),
            isPopular: isPopular,
        };
    });
