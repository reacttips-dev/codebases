import getMailboxFolderTreeDataTable from './getMailboxFolderTreeDataTable';

export default function getFolderTreeHasMoreData(folderTreeIdentifier: string): boolean {
    const folderTreeTable = getMailboxFolderTreeDataTable();
    const folderTreeData = folderTreeTable && folderTreeTable.get(folderTreeIdentifier);
    return folderTreeData?.hasMoreData;
}
