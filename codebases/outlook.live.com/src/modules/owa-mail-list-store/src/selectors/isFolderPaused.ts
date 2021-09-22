import listViewStore from '../store/Store';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';

export default function isFolderPaused(folderId: string): boolean {
    return listViewStore.inboxPausedDateTime && folderId && folderIdToName(folderId) === 'inbox';
}
