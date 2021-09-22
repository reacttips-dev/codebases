import getFolderData from 'owa-mail-actions/lib/getFolderData';
import updateFolderCounts from 'owa-mail-actions/lib/updateFolderCounts';
import { getFolderAdditionalProperties } from 'owa-folders/lib/services/getFolder';
import { getFolderTable, lazyUpdateFolderPermissionsInFolderStore } from 'owa-folders';
import { getMailboxInfoFromFolderId } from 'owa-mail-mailboxinfo/lib/getMailboxInfo';
import { createLazyOrchestrator } from 'owa-bundling';
import { trace } from 'owa-trace';

export const getFolderDataOrchestrator = createLazyOrchestrator(
    getFolderData,
    'getFolderDataClone',
    actionMessage => {
        getFolderDataInternal(actionMessage.folderId);
    }
);

export function getFolderDataInternal(folderId: string) {
    const sourceFolder = getFolderTable().get(folderId);
    const isSharedFolder = sourceFolder?.mailboxInfo.type === 'SharedMailbox';
    const mailboxInfo = getMailboxInfoFromFolderId(folderId);
    const folderPropertySet = isSharedFolder ? 'CountsAndPermissions' : 'Counts';

    return getFolderAdditionalProperties(folderId, folderPropertySet, mailboxInfo)
        .then(folder => {
            // Folder could be null if it's been deleted on the server
            if (folder) {
                // TODO - this should be removed eventually as apollo would update the counts returned by Folder query automatically
                updateFolderCounts(
                    folder.UnreadCount,
                    folder.TotalCount,
                    folderId,
                    false /* isDeltaChange */
                );

                if (isSharedFolder) {
                    // Populate the folder permissions in folder table
                    lazyUpdateFolderPermissionsInFolderStore
                        .import()
                        .then(updateFolderPermissionsInFolderStore => {
                            updateFolderPermissionsInFolderStore(
                                folderId,
                                folder.PermissionSet.Permissions
                            );
                        });
                }
            }
        })
        .catch(error => {
            // no-op if refresh folder count fails
            // hierarchy notificaiton remains the primary channel to update folder counts
            trace.warn(`GetFolderDataOrchestrator: ${error}`);
        });
}
