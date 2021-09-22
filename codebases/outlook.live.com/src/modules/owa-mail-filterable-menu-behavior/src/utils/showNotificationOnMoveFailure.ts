import folderStore, { getEffectiveFolderDisplayName } from 'owa-folders';
import loc, { format } from 'owa-localize';
import { lazyShowNotification } from 'owa-notification-bar';
import { moveItemFailedNotification } from './showNotificationOnMoveFailure.locstring.json';

/**
 * This method shows notification when shared folder move action fails
 * @param destinationFolderId - destination folderId for which move items action failed
 */
export default function showNotificationOnMoveFailure(destinationFolderId: string) {
    const destinationFolderName = getEffectiveFolderDisplayName(
        folderStore.folderTable.get(destinationFolderId)
    );
    lazyShowNotification.importAndExecute(
        'moveSharedFolderItems',
        'MailModuleNotificationBarHost',
        format(loc(moveItemFailedNotification), destinationFolderName)
    );
}
