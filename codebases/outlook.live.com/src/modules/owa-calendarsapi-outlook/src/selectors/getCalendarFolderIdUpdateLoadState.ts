import { getStore } from '../store/store';
import type { LoadState } from '../store/schema/LoadState';

// Returns the load state of the request to update the calendar folderId, or undefined if no request was made for that calendar
export function getCalendarFolderIdUpdateLoadState(calendarId: string): LoadState | undefined {
    const loadState = getStore().calendarIdsLoadState.get(calendarId);
    return loadState;
}
