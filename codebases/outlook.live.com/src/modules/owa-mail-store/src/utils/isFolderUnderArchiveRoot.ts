import folderStore, { FolderTableState, isUnderDistinguishedFolder } from 'owa-folders';
import type { MailFolder } from 'owa-graph-schema';
import {
    ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID,
    ARCHIVE_DUMPSTER_DISTINGUISHED_ID,
} from 'owa-folders-constants';

/**
 * @param folderId - Id of folder for which we are checking
 * @param state - state of folder table if passed from the caller(optional)
 * @returns boolean - true if folder is found under archive mailbox root
 */
export default function isFolderUnderArchiveRoot(
    folderId: string,
    state?: FolderTableState
): boolean {
    const folder: MailFolder = folderStore.folderTable.get(folderId);
    return folder
        ? isUnderDistinguishedFolder(folder, ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID, state) ||
              folder.DistinguishedFolderId === ARCHIVE_DUMPSTER_DISTINGUISHED_ID
        : false;
}

/**
 * @param folderId - Id of folder for which we are checking
 * @returns boolean - true if folder is archive mailbox root
 */
export function isArchiveRootFolder(folderId: string): boolean {
    const folder: MailFolder = folderStore.folderTable.get(folderId);
    return folder && folder.DistinguishedFolderId === ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID;
}

/**
 * @param folderId - Id of folder for which we are checking
 * @returns boolean - true if folder is archive root or a subfolder of archive root
 */
export function isFolderOrSubFolderOfArchiveRoot(folderId: string): boolean {
    return isFolderUnderArchiveRoot(folderId) || isArchiveRootFolder(folderId);
}
