import { folderStore } from '../store/store';
import type { MailFolder } from 'owa-graph-schema';
import type { ObservableMap } from 'mobx';

export interface FolderTableState {
    folderTable: ObservableMap<string, MailFolder>;
}

export let folderTableSelector = {
    folderTable: () => folderStore.folderTable,
};

export function isMessageFolderRoot(folder: MailFolder): boolean {
    return folder.DistinguishedFolderId === 'msgfolderroot';
}

/** Returns true if a folder is specified distinguished folder. */
export function isDistinguishedFolder(folder: MailFolder, distinguishedFolderId: string): boolean {
    // folder is null in search scenario
    return !!folder && folder.DistinguishedFolderId == distinguishedFolderId;
}

/** Returns true if a folder is a subfolder of a specified distinguished folder. */
export function isSubFolderOfDistinguishedFolder(
    folder: MailFolder,
    distinguishedFolderId: string,
    state: FolderTableState = {
        folderTable: folderStore.folderTable,
    }
): boolean {
    // folder is null in search scenario
    const parentFolderId = !!folder && folder.ParentFolderId;

    if (!parentFolderId) {
        // The parentFolderId is null for root folder of the folder trees, which means it's not a subfolder
        return false;
    }

    let parentFolder: MailFolder = state.folderTable.get(parentFolderId.Id);
    while (parentFolder) {
        if (parentFolder.DistinguishedFolderId == distinguishedFolderId) {
            return true;
        } else if (!parentFolder.ParentFolderId) {
            return false;
        }
        parentFolder = state.folderTable.get(parentFolder.ParentFolderId.Id);
    }

    return false;
}

export let isUnderDistinguishedFolder = isSubFolderOfDistinguishedFolder;

/** Returns true if a folder is a specified distinguished folder or is a subfolder of it.*/
export default function isFolderOrSubFolderOfDistinguishedFolder(
    folder: MailFolder,
    distinguishedFolderId: string,
    state: FolderTableState = { folderTable: folderStore.folderTable }
): boolean {
    return (
        isDistinguishedFolder(folder, distinguishedFolderId) ||
        isUnderDistinguishedFolder(folder, distinguishedFolderId, state)
    );
}
