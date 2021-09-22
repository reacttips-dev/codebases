import { mutatorAction } from 'satcheljs';
import { getFolderTable } from 'owa-folders';
import type { MailFolder } from 'owa-graph-schema';
import type ReadingPanePopoutItemFolderInfo from 'owa-popout-utils/lib/schema/ReadingPanePopoutItemFolderInfo';

/**
 * Mutator to add folder in folder table for the deeplink view
 */
const loadPopoutDataToFolderStore = mutatorAction(
    'loadPopoutDataToFolderStore',
    (popoutData: ReadingPanePopoutItemFolderInfo) => {
        const { folderId, mailboxInfo, permission, principalSMTPAddress } = popoutData;
        const folderTable = getFolderTable();
        if (!folderTable.get(folderId)) {
            const folder = {
                FolderId: { Id: folderId },
                mailboxInfo: mailboxInfo,
                PermissionSet: { Permissions: [permission] },
                principalSMTPAddress: principalSMTPAddress,
            } as MailFolder;
            folderTable.set(folderId, folder);
        }
    }
);

export default loadPopoutDataToFolderStore;
