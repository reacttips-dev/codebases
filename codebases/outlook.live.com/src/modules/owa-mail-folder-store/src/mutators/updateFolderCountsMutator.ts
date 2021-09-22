import folderStore from 'owa-folders';
import updateFolderCounts from 'owa-mail-actions/lib/updateFolderCounts';
import { onUpdateFolderNotification } from 'owa-mail-actions/lib/folderNotificationActions';
import { getFolderIdForSelectedNode } from 'owa-mail-folder-forest-store';
import { mutator } from 'satcheljs';

// TODO - Eventually these mutators should be removed with scenarios that depend on the folder counts
// start reading it from the cache
export default mutator(updateFolderCounts, actionMessage => {
    updateFolderCountsInternal(
        actionMessage.unreadCount,
        actionMessage.totalCount,
        actionMessage.folderId,
        actionMessage.isDeltaChange
    );
});

export const updateFolderCountsUponHierarchyPayload = mutator(
    onUpdateFolderNotification,
    actionMessage => {
        updateFolderCountsInternal(
            actionMessage.unreadCount,
            actionMessage.totalCount,
            actionMessage.folderId,
            false /* isDeltaChange */
        );
    }
);

function updateFolderCountsInternal(
    unreadCount: number,
    totalCount: number,
    folderId: string,
    isDeltaChange: boolean
) {
    const folderTable = folderStore.folderTable;
    const folder = folderTable.get(folderId);

    if (folder) {
        if (isDeltaChange) {
            folder.UnreadCount += unreadCount;
            folder.TotalCount += totalCount;
        } else {
            folder.UnreadCount = unreadCount;
            folder.TotalCount = totalCount;
        }

        // If user is currently in a favorite persona folder and folder count changes, update cached
        // total count value so we don't show new message count badge.
        if (folder.pausedTotalCount && getFolderIdForSelectedNode() === folderId) {
            folder.pausedTotalCount = folder.TotalCount;
        }

        // Do not let counts fall below 0 in the store. This state could happen due to the timing of when
        // folder tree is loaded versus listview.
        folder.UnreadCount = Math.max(folder.UnreadCount, 0);
        folder.TotalCount = Math.max(folder.TotalCount, 0);
    }
}
