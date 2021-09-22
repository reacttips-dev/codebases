import getStore from '../store/store';
import { getAccountIdentifier } from '../utils/getAccountIdentifier';
import type { CalendarEndpointType } from '../store/schema/CalendarEndpointType';
import { getSupportedEndpoints } from '../utils/getSupportedEndpoints';

/**
 * Gets whether the cache is loaded for a particular userId/calendarEndpointType
 * **Important Note:** After the calendar cache is loaded, certain types of calendars have invalid
 * calendar folder id values which need to be updated if the actual calendar folder id property is needed
 * to look up a calendar in the cache (i.e. to find the calendar an event is associated with)
 * See `getAndUpdateActualFolderId` for details.
 * @param calendarEndpointType the calendars endpoint
 * @param userId user id
 */
export function isLoaded(calendarEndpointType: CalendarEndpointType, userId?: string): boolean {
    const accountId = getAccountIdentifier(calendarEndpointType, userId);
    return getStore().loadedCalendarAccounts.some(account => account === accountId);
}

/**
 * Gets whether all calendar cache endpoints are loaded for a particular userId
 * @param userId user id
 */
export function areAllEndpointsLoaded(userId?: string): boolean {
    const supportedEndPoints = getSupportedEndpoints(userId);
    return supportedEndPoints.every(endpoint => isLoaded(endpoint, userId));
}
