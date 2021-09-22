import { getAllFolderIdsLoadedInEventsCache } from '../../selectors/eventsCacheSelectors';
import { reloadCalendarEventsCache } from './reloadCalendarEventsCache';
import { getCalendarEntryByFolderId } from 'owa-calendar-cache';
import { isOldModelSharedCalendar } from 'owa-calendar-properties';

export function reloadLinkedCalendarEventsCache() {
    const folderIds = getAllFolderIdsLoadedInEventsCache();
    folderIds.map(folderId => {
        if (isOldModelSharedCalendar(getCalendarEntryByFolderId(folderId))) {
            reloadCalendarEventsCache(folderId, true /** forceReplace */);
        }
    });
}
