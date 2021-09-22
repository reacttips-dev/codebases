import { convertToCalendarCacheStoreData } from './convertToCalendarCacheStoreData';
import { getCalendarsService } from '../services/getCalendarsService';
import { isConnectedAccount } from 'owa-accounts-store';
import { logUsage } from 'owa-analytics';
import { initializeCalendarsCacheInStore } from 'owa-calendar-cache';
import { errorThatWillCauseAlert } from 'owa-trace';

export async function initializeOutlookAccountCalendarsInCache(userId: string): Promise<void> {
    try {
        const responseCalendarGroups = await getCalendarsService(userId);
        const cacheData = convertToCalendarCacheStoreData(responseCalendarGroups);

        let calendarGroupCountBucket = toCalendarGroupCountBucket(responseCalendarGroups.length);

        logUsage('CalendarGroupsPerAccount', {
            connectedAccount_1: isConnectedAccount(userId),
            // standard logging
            calendarGroupCount: responseCalendarGroups.length,
            // long term logging
            calendarGroupCount_2: `${calendarGroupCountBucket.lowerBoundResultSize} - ${calendarGroupCountBucket.upperBoundResultSize}`,
        });

        initializeCalendarsCacheInStore(
            cacheData.defaultCalendar,
            cacheData.calendarEntryMapping,
            cacheData.calendarGroupMapping,
            cacheData.folderIdMapping
        );
    } catch (error) {
        errorThatWillCauseAlert(error);
        throw error;
    }
}

function toCalendarGroupCountBucket(
    numResults: number
): { lowerBoundResultSize: number | null; upperBoundResultSize: number | null } {
    if (numResults < 1) {
        // Should not be possible
        return { lowerBoundResultSize: null, upperBoundResultSize: 0 };
    } else if (numResults <= 3) {
        return { lowerBoundResultSize: 1, upperBoundResultSize: 3 };
    } else if (numResults <= 6) {
        return { lowerBoundResultSize: 4, upperBoundResultSize: 6 };
    } else {
        return { lowerBoundResultSize: 7, upperBoundResultSize: null };
    }
}
