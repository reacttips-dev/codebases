import folderStore, { FolderTableState, isUnderDistinguishedFolder } from 'owa-folders';
import type { MailFolder } from 'owa-graph-schema';

export default function isFolderUnderDeletedItemsFolder(
    folder: MailFolder,
    distinguishedFolderId: string,
    state: FolderTableState = { folderTable: folderStore.folderTable }
): boolean {
    return isUnderDistinguishedFolder(folder, distinguishedFolderId, state);
}
