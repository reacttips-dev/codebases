import folderStore, { FolderTableState } from 'owa-folders';

/**
 * Function checking if the given folder id is valid or not. Currently this is used
 * when trying to select a folder from the id that is received in the mail route
 * @param folderId the id of the folder for which we are validating in the mail folder
 * @returns true if the id is present in the folder table and folder can be displayed in the folder tree
 */
export default function isValidMailFolder(
    folderId: string,
    state: FolderTableState = { folderTable: folderStore.folderTable }
): boolean {
    const folder = state.folderTable.get(folderId);
    return !!folder;
}
