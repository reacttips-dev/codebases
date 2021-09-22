import { SwNavigator } from "common/services/swNavigator";
import { STATIC_LIST_PAGE_ROUTE } from "../constants/routes";
import { OpportunityListType } from "../sub-modules/opportunities/types";

/**
 * Simple helper that returns all unique values in the given array
 * @param list
 */
export const getUniqueValuesFromPrimitives = <T extends string | number>(list: T[]) => {
    if (list.length <= 1) {
        return list;
    }

    return Array.from(new Set(list));
};
/**
 * @param first
 * @param second
 */
export const arraysHaveSamePrimitiveValues = (
    first: readonly (string | number)[],
    second: readonly (string | number)[],
) => {
    if (first.length !== second.length) {
        return false;
    }

    const difference = [];
    const itemsLeft = second.slice();

    first.forEach((el) => {
        itemsLeft.splice(itemsLeft.indexOf(el), 1);

        if (!second.includes(el)) {
            difference.push(el);
        }
    });

    return difference.length === 0 && itemsLeft.length === 0;
};
/**
 * Sort helper function for "created" date field
 * @param list
 */
export const sortObjectsByCreatedDesc = <OBJ extends { created: string }>(list: OBJ[]) => {
    return list.slice().sort((a, b): number => {
        const dateA = Date.parse(a.created);
        const dateB = Date.parse(b.created);

        return dateB - dateA;
    });
};
/**
 * Translation helper for singular/plural cases
 * @param key
 * @param withPluralSuffix
 */
export const getSingularOrPluralKey = (key: string, withPluralSuffix = false) => (
    numberOfItems: number,
) => {
    if (numberOfItems === 1) {
        return `${key}.singular`;
    }

    if (withPluralSuffix) {
        return `${key}.plural`;
    }

    return key;
};
/**
 * Removes protocol part from the given url string
 * @param urlLike
 * @example
 * `
 *  removeProtocolFromUrl("https://google.com") -> "google.com"
 *  removeProtocolFromUrl("mailto:google.com") -> "google.com"
 * `
 */
export const removeProtocolFromUrl = (urlLike: string) => {
    return urlLike.replace(/^\/\/|^.*?:(\/\/)?/, "");
};
/**
 * A helper for single list page navigation
 * @param navigator
 */
export const goToListPage = (navigator: SwNavigator) => (list: OpportunityListType) => {
    navigator.go(STATIC_LIST_PAGE_ROUTE, { id: list.opportunityListId });
};
/**
 * A helper function for comparing small arrays of strings
 * @param oldItems
 * @param newItems
 */
export const areArraysOfStringsEqual = (oldItems: string[], newItems: string[]) => {
    if (oldItems.length !== newItems.length || (oldItems.length === 0 && newItems.length === 0)) {
        return false;
    }

    return JSON.stringify(oldItems.sort()) === JSON.stringify(newItems.sort());
};

/**
 * Wraps domain name parts with given html tag. Required for email clients.
 * @example
 * `
 * wrapDomainNamePartsWithHTMLTag("nike.com") -> "<span>nike</span>.<span>com</span>"
 * wrapDomainNamePartsWithHTMLTag("sub.nike.com") -> "<span>sub</span>.<span>nike</span>.<span>com</span>"
 * `
 * @param domain
 * @param tag
 */
export const wrapDomainNamePartsWithHTMLTag = (domain: string, tag = "span") => {
    return domain
        .split(".")
        .map((part) => `<${tag}>${part}</${tag}>`)
        .join(".");
};

/**
 * A helper function for delete all with keys value === null or empty
 * @param items
 */
export const clearFromEmpty = <T>(items: T): Partial<T> => {
    return Object.keys(items).reduce((resultObject, key) => {
        if (items[key]) {
            return {
                ...resultObject,
                [key]: items[key],
            };
        }
        return resultObject;
    }, {});
};

export const isSalesIntelligenceAppsState = (swNavigator: SwNavigator) => {
    return swNavigator.current()?.parent.startsWith("salesIntelligence-apps");
};
