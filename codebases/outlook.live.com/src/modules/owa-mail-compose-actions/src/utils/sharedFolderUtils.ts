import { getUserPermissionForFolderId } from 'owa-mail-store';
import { getStore } from 'owa-mail-store/lib/store/Store';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type { Permission } from 'owa-graph-schema';
import { getUserEmailAddress } from 'owa-session-store';
import { getFolderTable, isFolderInMailboxType } from 'owa-folders';

export function getIsInSharedFolder(itemId: ItemId): boolean {
    const folderId = getFolderIdFromItemId(itemId);

    if (!folderId) {
        return false;
    }

    return isFolderInMailboxType(folderId, 'SharedMailbox');
}

export function getFolderOwnerEmailAddress(itemId: ItemId): string {
    const folderId = getFolderIdFromItemId(itemId);

    if (!folderId) {
        return null;
    }

    const folder = getFolderTable().get(folderId);
    return folder ? folder.mailboxInfo.mailboxSmtpAddress : null;
}

export function getFolderPermission(itemId: ItemId): Permission {
    const folderId = getFolderIdFromItemId(itemId);

    if (!folderId) {
        return null;
    }

    const userEmail = getUserEmailAddress();
    const folderPermission = getUserPermissionForFolderId(folderId, userEmail);

    return folderPermission;
}

function getFolderIdFromItemId(itemId: ItemId) {
    if (!itemId) {
        return null;
    }

    const item = getStore().items.get(itemId.Id);
    return item?.ParentFolderId?.Id;
}
