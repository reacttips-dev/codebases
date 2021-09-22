import {
    UseStatisticsMap,
    UseStatisticsItem,
    UseStatisticsMapByListId,
    UseStatisticsUpdatePayload,
} from "./types";
import { compareNumericPropDesc } from "pages/workspace/sales/helpers";

/**
 * Comparator helper for UseStatisticsItem's "used" property
 */
export const compareUsedDesc = compareNumericPropDesc<UseStatisticsItem>("used");

/**
 * Returns an array of most used ids with length {mostUsedIdsCount}
 * @param mostUsedIdsCount
 */
export const getUseStatisticsToMostUsedIdsTransformer = (mostUsedIdsCount: number) => (
    listUseStatistics: UseStatisticsMap,
) => {
    return Object.keys(listUseStatistics)
        .map((key) => ({
            id: key,
            used: listUseStatistics[key],
        }))
        .sort(compareUsedDesc)
        .slice(0, mostUsedIdsCount)
        .map((s) => s.id);
};

/**
 * Reducer helper. Immutably updates given use statistics object
 * @param useStatistics
 * @param payload
 */
export const updateUseStatisticsByList = (
    useStatistics: UseStatisticsMapByListId,
    payload: UseStatisticsUpdatePayload,
): UseStatisticsMapByListId => {
    const updated = { ...useStatistics };
    const listUseStatistics = updated[payload.listId] ? { ...updated[payload.listId] } : {};

    listUseStatistics[payload.itemId] = listUseStatistics[payload.itemId]
        ? listUseStatistics[payload.itemId] + 1
        : 1;

    updated[payload.listId] = listUseStatistics;

    return updated;
};
