import getStore from '../store/store';
import type { ObservableMap } from 'mobx';
import type FolderTreeData from '../store/schema/FolderTreeData';
import { getDefaultLogonEmailAddress } from 'owa-session-store';

/**
 * Selector for folder tree table for given mailbox smtp identity
 */
export default function getMailboxFolderTreeDataTable(
    userIdentity?: string
): ObservableMap<string, FolderTreeData> {
    return getMailboxFolderTreeData(userIdentity).folderTreeTable;
}

export function getMailboxFolderTreeData(userIdentity: string) {
    if (!userIdentity) {
        userIdentity = getDefaultLogonEmailAddress();
    }

    return getStore().mailboxFolderTreeData.get(userIdentity);
}
