import { getDefaultMailboxFolderTreeData } from '../store/getDefaultMailboxFolderTreeData';
import { setMailboxFolderTreeData } from '../mutators/setMailboxFolderTreeData';
import { getMailboxFolderTreeData } from '../selectors/getMailboxFolderTreeDataTable';

export function initializeFolderTreeData(userIdentity: string) {
    if (!getMailboxFolderTreeData(userIdentity)) {
        setMailboxFolderTreeData(userIdentity, getDefaultMailboxFolderTreeData(userIdentity));
    }
}
