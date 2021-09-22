import { FolderForestNodeType } from 'owa-favorites-types';
import { getFolderIdForSelectedNode, getSelectedNode } from 'owa-mail-folder-forest-store';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import doesFolderIdEqualName from 'owa-session-store/lib/utils/doesFolderIdEqualName';
import type ClientItem from '../store/schema/ClientItem';
import type ConversationReadingPaneNode from '../store/schema/ConversationReadingPaneNode';
import mailStore from '../store/Store';
import isDeletedItemsFolderFromAnyMailbox from '../utils/isDeletedItemsFolderFromAnyMailbox';

function isLocalAvailableForSelectedNode(): boolean {
    const selectedNode = getSelectedNode();
    if (selectedNode.type == FolderForestNodeType.Group) {
        return true;
    }

    return !getFolderIdForSelectedNode();
}

/**
 * @returns [item to load based on selected folder, whether item is local, whether item is deleted].
 */
export function findItemToLoad(
    conversationNode: ConversationReadingPaneNode
): [ClientItem, boolean, boolean] {
    const itemCount = conversationNode?.itemIds ? conversationNode.itemIds.length : 0;
    if (itemCount == 0) {
        return [null, false, false];
    }

    let foundItem: ClientItem = null;
    // If selected folder doesn't exist, treat item as a local item.
    let isLocal = isLocalAvailableForSelectedNode();
    let isDeleted = false;
    if (itemCount == 1) {
        foundItem = mailStore.items.get(conversationNode.itemIds[0]);
        if (!foundItem) {
            return [null, false, false];
        }
        isLocal =
            isLocal ||
            (foundItem.ParentFolderId &&
                foundItem.ParentFolderId.Id == getFolderIdForSelectedNode());
    } else {
        let sentItem: ClientItem = null;
        for (const itemId of conversationNode.itemIds) {
            const item = mailStore.items.get(itemId);
            if (!item) {
                return [null, false, false];
            }
            if (item.ParentFolderId && item.ParentFolderId.Id == getFolderIdForSelectedNode()) {
                foundItem = item;
                isLocal = true;
                break;
            } else if (doesFolderIdEqualName(item.ParentFolderId.Id, 'sentitems')) {
                sentItem = item;
            }
        }

        if (!foundItem) {
            foundItem = sentItem || mailStore.items.get(conversationNode.itemIds[0]);
        }
    }

    isDeleted = isDeletedItemsFolderFromAnyMailbox(foundItem.ParentFolderId.Id);

    return [foundItem, isLocal, isDeleted];
}

export function shouldCreateItemPartViewState(
    item: ClientItem,
    isDeleted: boolean,
    isLocal: boolean
): boolean {
    const userConfiguration = getUserConfiguration();
    const shouldHideDeletedItems = userConfiguration?.UserOptions?.HideDeletedItems;
    // No need to create view state for deleted drafts except for delete folder.
    // No need to create view state for deleted items when user setting has HideDeletedItems except for delete folder.
    return item && !((item.IsDraft || shouldHideDeletedItems) && isDeleted && !isLocal);
}

export function getItemToShowFromNodeId(nodeId: string): ClientItem {
    const conversationNode = mailStore.conversationNodes.get(nodeId);
    const [item, isLocal, isDeleted] = findItemToLoad(conversationNode);
    if (!shouldCreateItemPartViewState(item, isDeleted, isLocal)) {
        return null;
    } else {
        return item;
    }
}
