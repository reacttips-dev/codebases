import FolderTreeLoadStateEnum from '../store/schema/FolderTreeLoadStateEnum';
import getMailboxFolderTreeDataTable from './getMailboxFolderTreeDataTable';

export default function getFolderTreeLoadingState(
    folderTreeIdentifier: string,
    userIdentity?: string
): FolderTreeLoadStateEnum {
    const folderTreeTable = getMailboxFolderTreeDataTable(userIdentity);
    const folderTreeData = folderTreeTable && folderTreeTable.get(folderTreeIdentifier);
    return folderTreeData?.loadingState || FolderTreeLoadStateEnum.Uninitialized;
}
