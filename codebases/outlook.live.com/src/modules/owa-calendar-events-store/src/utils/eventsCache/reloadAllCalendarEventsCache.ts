import { getAllFolderIdsLoadedInEventsCache } from '../../selectors/eventsCacheSelectors';
import { reloadCalendarEventsCache } from './reloadCalendarEventsCache';

export async function reloadAllCalendarEventsCache() {
    const folderIds = getAllFolderIdsLoadedInEventsCache();

    await Promise.all(
        folderIds.map(folderId => reloadCalendarEventsCache(folderId, true /** forceReplace */))
    );
}
