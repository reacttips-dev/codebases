import getMailboxFolderTreeDataTable from './getMailboxFolderTreeDataTable';

export default function getFolderTreeCurrentLoadedIndex(
    folderTreeIdentifier: string,
    userIdentity?: string
): number {
    const folderTreeTable = getMailboxFolderTreeDataTable(userIdentity);
    const folderTable = folderTreeTable && folderTreeTable.get(folderTreeIdentifier);
    return folderTable?.currentLoadedIndex || 0;
}
