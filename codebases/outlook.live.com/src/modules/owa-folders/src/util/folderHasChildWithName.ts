import type { MailFolder } from 'owa-graph-schema';
import type FolderStore from '../store/schema/FolderStore';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';

export default function folderHasChildWithName(
    folders: FolderStore,
    folderDisplayName: string,
    parentFolderId: string
): boolean {
    let parentFolder: MailFolder;

    let parentFolderIdToUse = folderNameToId(parentFolderId) || parentFolderId;
    parentFolder = folders.folderTable.get(parentFolderIdToUse);

    if (parentFolder) {
        let childFolderIds: string[] = parentFolder.childFolderIds;
        let folderDisplayNameLowerCase = folderDisplayName.toLowerCase();
        for (let i = 0; i < childFolderIds.length; i++) {
            let childFolderId = childFolderIds[i];
            let childFolder = folders.folderTable.get(childFolderId);
            if (
                childFolder &&
                childFolder.DisplayName.toLowerCase() == folderDisplayNameLowerCase
            ) {
                return true;
            }
        }
    }

    return false;
}
