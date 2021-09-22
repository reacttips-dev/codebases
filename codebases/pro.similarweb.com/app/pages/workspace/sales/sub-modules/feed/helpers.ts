import dayjs from "dayjs";
import { Feed, FeedFeedbackType, FeedsByDate } from "./types/feed";
import { AdNetwork } from "./types/adNetwork";
import { SignalSubFilter } from "pages/workspace/sales/sub-modules/signals/types";
import { AD_NETWORKS_MOST_USED_COUNT } from "pages/workspace/sales/sub-modules/feed/constants";
import { DropdownItemType } from "pages/workspace/sales/components/custom-dropdown/types";
import {
    sortSubFiltersByCountDesc,
    transformSubFiltersToDropdownItems,
} from "pages/workspace/sales/sub-modules/signals/helpers";
import { compose } from "redux";
import {
    addDropDownItemGroup,
    keepItemsThatMatchSearch,
    sortItemsByLabelsAsc,
} from "pages/workspace/sales/helpers";
import {
    DROPDOWN_ALL_GROUP,
    DROPDOWN_FREQUENTLY_USED_GROUP,
    DROPDOWN_MORE_GROUP,
} from "pages/workspace/sales/components/custom-dropdown/constants";

/**
 * Groups given array of feeds by date string shortened to month
 * @param feeds
 */
export const groupByMonth = (feeds: Feed[]) => {
    return groupByDate(feeds, ignoreDayFromDateString);
};

/**
 * Groups given array of feeds by the date string received from the dateStringTransformer
 * @param feeds
 * @param dateStringTransformer
 */
export const groupByDate = (
    feeds: Feed[],
    dateStringTransformer: (d: string) => string,
): FeedsByDate => {
    return feeds.reduce((group, next) => {
        const date = dateStringTransformer(next.dataDate);

        if (!group[date]) {
            return {
                ...group,
                [date]: [next],
            };
        }

        return {
            ...group,
            [date]: [...group[date], next],
        };
    }, {} as FeedsByDate);
};

/**
 * Removes "day" part from the date
 * @param date
 * @param format
 * @returns {string} - Date string without "day" part or given string if it's not a valid date
 */
export const ignoreDayFromDateString = (date: string, format = "y-m") => {
    if (isNaN(Date.parse(date))) {
        return date;
    }

    const dateObject = new Date(date);

    return format
        .replace("y", dateObject.getFullYear().toString())
        .replace("m", (dateObject.getMonth() + 1).toString());
};

/**
 * Checks if given Feed does not have negative feedback
 * @param f
 */
export const doesNotHaveNegativeFeedback = (f: Feed) => {
    return f.feedbackItemFeedback?.Type !== FeedFeedbackType.NEGATIVE;
};

/**
 * Filters out feeds with "negative" feedback type
 * @param feeds
 */
export const removeWithNegativeFeedback = (feeds: Feed[]): Feed[] => {
    return feeds.filter(doesNotHaveNegativeFeedback);
};

/**
 * Compare given strings as dates descending
 * @param a
 * @param b
 */
export const compareAsDatesDescending = (a: string, b: string) => {
    const aDate = Date.parse(a);
    const bDate = Date.parse(b);

    if (aDate > bDate) {
        return -1;
    }

    if (aDate < bDate) {
        return 1;
    }

    return 0;
};

/**
 * Compare given ad networks by visits descending
 * @param a
 * @param b
 */
export const compareVisitsDescending = (a: AdNetwork, b: AdNetwork) => {
    if (a.visits > b.visits) {
        return -1;
    }

    if (a.visits < b.visits) {
        return 1;
    }

    return 0;
};

/**
 * Formats given date string with given format.
 * @param date
 * @param format
 */
export const formatFeedDate = (date: string, format = "MMMM YYYY") => {
    return date && dayjs(date).format(format);
};

/**
 * Filters out networks with countries other than 999 (Worldwide)
 * @param adNetworks
 */
export const getWorldwideAdNetworks = (adNetworks: AdNetwork[]) => {
    return adNetworks.filter((an) => an.country === 999);
};

/**
 * Filters out networks with country 999 (Worldwide)
 * @param adNetworks
 */
export const getAllButWorldwideAdNetworks = (adNetworks: AdNetwork[]) => {
    return adNetworks.filter((an) => an.country !== 999);
};

/**
 * Filters out ad networks that don't match given id
 * @param adNetworks
 */
export const getAdNetworksMatchingId = (adNetworks: AdNetwork[]) => (id: AdNetwork["id"]) => {
    return adNetworks.filter((an) => an.id === id);
};

/**
 * Sorts given ad networks by visits descending
 * @param adNetworks
 */
export const sortAdNetworksByVisits = (adNetworks: AdNetwork[]) => {
    return adNetworks.slice().sort(compareVisitsDescending);
};

export const formatAdNetworkSharePercentage = (share: number) => {
    const percentage = share * 100;

    if (percentage < 0.01) {
        return "< 0.01%";
    }

    return `${percentage.toFixed(2)}%`;
};

export const safeGetMostUsedAdNetworkFilters = (
    mostUsedIds: string[],
    adNetworkSubFilters: SignalSubFilter[],
) => {
    return mostUsedIds
        .map((key) => adNetworkSubFilters.find((s) => s.code === key))
        .filter((s) => typeof s !== "undefined");
};

export const filterMostUsedFromAllAdNetworks = (
    adNetworkSubFilters: SignalSubFilter[],
    mostUsedIds: string[],
) => {
    if (mostUsedIds.length === 0 || adNetworkSubFilters.length < AD_NETWORKS_MOST_USED_COUNT) {
        return adNetworkSubFilters;
    }

    return adNetworkSubFilters.filter((s) => !mostUsedIds.includes(s.code));
};

export const buildGroupedAdNetworks = (
    search: string,
    mostUsedIds: string[],
    adNetworkSubFilters: SignalSubFilter[],
) => {
    const otherFilters = compose(
        keepItemsThatMatchSearch(search),
        transformSubFiltersToDropdownItems,
        sortSubFiltersByCountDesc,
    )(filterMostUsedFromAllAdNetworks(adNetworkSubFilters, mostUsedIds));
    const group: { [title: string]: DropdownItemType[] } = {};

    if (mostUsedIds.length === 0 || adNetworkSubFilters.length <= AD_NETWORKS_MOST_USED_COUNT) {
        group[DROPDOWN_ALL_GROUP] = addDropDownItemGroup(DROPDOWN_ALL_GROUP)(otherFilters);
    } else {
        group[DROPDOWN_MORE_GROUP] = addDropDownItemGroup(DROPDOWN_MORE_GROUP)(otherFilters);
    }

    if (mostUsedIds.length > 0 && adNetworkSubFilters.length > AD_NETWORKS_MOST_USED_COUNT) {
        group[DROPDOWN_FREQUENTLY_USED_GROUP] = compose(
            addDropDownItemGroup(DROPDOWN_FREQUENTLY_USED_GROUP),
            sortItemsByLabelsAsc,
            keepItemsThatMatchSearch(search),
            transformSubFiltersToDropdownItems,
        )(safeGetMostUsedAdNetworkFilters(mostUsedIds, adNetworkSubFilters)) as DropdownItemType[];
    }

    return group;
};

export const replaceUnderscores = (word: string): string => word && word.replace(/_/g, " ");

export const groupByName = (allItems: AdNetwork[]) =>
    allItems.reduce((acc, item) => {
        (acc[item.name] = [...(acc[item.name] || [])]).push(item);
        return acc;
    }, {});

export const deleteWorldWide = (adItemsArray: AdNetwork[]) =>
    adItemsArray.filter((adItem) => !(adItem.country === 999));
