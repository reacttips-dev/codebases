import { DateRange, containsDateRange } from 'owa-datetime-utils';

interface EnhancedItemsInfo {
    dateRange: DateRange;
}
/**
 * This map is needed to support cache guarantees for ++ items
 * This map would keep track of the date ranges that are enhanced
 * WI 86974. Cleanup the date ranges in once they are released from a lock.
 */
const enhancedItemsMap: { [folderId: string]: EnhancedItemsInfo[] } = {};

export function addToEnhancedDateRanges(folderId: string, dateRange: DateRange) {
    tryInitializeInfoList(folderId);

    enhancedItemsMap[folderId].push({
        dateRange: dateRange,
    });
}

export function isEnhancedDateRange(folderId: string, dateRange: DateRange) {
    return findEnhancedItemsInfo(folderId, dateRange).index >= 0;
}

function findEnhancedItemsInfo(
    folderId: string,
    dateRange: DateRange
): { index: -1; info: null } | { index: number; info: EnhancedItemsInfo } {
    tryInitializeInfoList(folderId);

    const infoList = enhancedItemsMap[folderId];
    for (let i = 0; i < infoList.length; i++) {
        if (containsDateRange(infoList[i].dateRange, dateRange, true /* inclusive */)) {
            return { index: i, info: infoList[i] };
        }
    }

    return { index: -1, info: null };
}

function tryInitializeInfoList(folderId: string) {
    if (!enhancedItemsMap[folderId]) {
        enhancedItemsMap[folderId] = [];
    }
}
