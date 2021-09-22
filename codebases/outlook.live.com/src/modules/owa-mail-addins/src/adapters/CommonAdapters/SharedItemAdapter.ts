import { isFolderInMailboxType } from 'owa-folders';
import type { ComposeViewState, SharedFolderComposeViewState } from 'owa-mail-compose-store';
import type Item from 'owa-service/lib/contract/Item';

export const isSharedItemForRead = (item: Item) => (): boolean => {
    return isSharedItem(item);
};

export const isSharedItemForCompose = (viewState: ComposeViewState) => (): boolean => {
    const sharedFolderComposeViewState = viewState as SharedFolderComposeViewState;

    if (sharedFolderComposeViewState.isInSharedFolder !== undefined) {
        return sharedFolderComposeViewState.isInSharedFolder;
    }

    return false;
};

export function isSharedItem(item: Item) {
    if (!item || !item.ParentFolderId) {
        return false;
    }

    const folderId = item.ParentFolderId.Id;
    return isFolderInMailboxType(folderId, 'SharedMailbox');
}

/** Only valid for shared items */
export function isRemoteItem(): boolean {
    // Shared mail items are always remote
    return true;
}
