import { getEwsRequestString } from 'owa-datetime';
import { isFolderPaused, listViewStore } from 'owa-mail-list-store';

export function getInboxPausedDateTimeAsString(folderId) {
    if (isFolderPaused(folderId)) {
        return getEwsRequestString(listViewStore.inboxPausedDateTime);
    }

    return null;
}
