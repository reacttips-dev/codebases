import type CollectionChange from 'owa-mail-store/lib/store/schema/CollectionChange';
import type ConversationItemParts from 'owa-mail-store/lib/store/schema/ConversationItemParts';
import type ConversationReadingPaneNode from 'owa-mail-store/lib/store/schema/ConversationReadingPaneNode';
import type FlagType from 'owa-service/lib/contract/FlagType';
import type Item from 'owa-service/lib/contract/Item';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type Message from 'owa-service/lib/contract/Message';
import getSelectedTableView from 'owa-mail-list-store/lib/utils/getSelectedTableView';
import mailStore from 'owa-mail-store/lib/store/Store';
import updateLoadedConversation from './updateLoadedConversation';
import type { ObservableMap } from 'mobx';
import {
    PLACEHOLDER_NODE_INTERNET_MESSAGE_ID,
    PLACEHOLDER_NODE_ITEM_ID,
} from '../store/schema/PlaceholderNodeIds';
import { action } from 'satcheljs/lib/legacy';

export interface UpdatePendingNodeInternetMessageIdIfNeededState {
    conversations: ObservableMap<string, ConversationItemParts>;
    conversationNodes: ObservableMap<string, ConversationReadingPaneNode>;
    items: ObservableMap<string, Item>;
}

export default action('updatePendingNodeInternetMessageIdIfNeeded')(
    function updatePendingNodeInternetMessageIdIfNeeded(
        conversationId: string,
        itemId: string,
        internetMessageId: string,
        state: UpdatePendingNodeInternetMessageIdIfNeededState = {
            conversations: mailStore.conversations,
            conversationNodes: mailStore.conversationNodes,
            items: mailStore.items,
        }
    ) {
        const hasRealNodeForPlaceholder = state.conversationNodes.has(internetMessageId);
        if (state.conversationNodes.has(PLACEHOLDER_NODE_INTERNET_MESSAGE_ID)) {
            // If we made a placeholder node, update its IMI.
            const placeholderConversationNode = state.conversationNodes.get(
                PLACEHOLDER_NODE_INTERNET_MESSAGE_ID
            );
            placeholderConversationNode.internetMessageId = internetMessageId;
            const conversationItemParts = state.conversations.get(conversationId);
            const currentIndex = conversationItemParts.conversationNodeIds.indexOf(
                PLACEHOLDER_NODE_INTERNET_MESSAGE_ID
            );
            let nodeIdCollectionChange: CollectionChange<string>;
            if (hasRealNodeForPlaceholder) {
                // If this IMI is already existed, just remove the placeholder id.
                conversationItemParts.conversationNodeIds.splice(currentIndex, 1);
                // Mark the placeholder node as removed.
                nodeIdCollectionChange = {
                    added: [],
                    removed: [PLACEHOLDER_NODE_INTERNET_MESSAGE_ID],
                    modified: [],
                };
            } else {
                // If this IMI is not existed, replace the placeholder node with the new IMI.
                conversationItemParts.conversationNodeIds.splice(
                    currentIndex,
                    1,
                    internetMessageId
                );
                state.conversationNodes.set(internetMessageId, placeholderConversationNode);
                // Mark the placeholder node as removed and the new node as added.
                nodeIdCollectionChange = {
                    added: [internetMessageId],
                    removed: [PLACEHOLDER_NODE_INTERNET_MESSAGE_ID],
                    modified: [],
                };
            }
            state.conversationNodes.delete(PLACEHOLDER_NODE_INTERNET_MESSAGE_ID);
            // Update the loaded conversation.
            updateLoadedConversation(conversationId, nodeIdCollectionChange);
        } else if (!hasRealNodeForPlaceholder) {
            // If we don't have a node with the real IMI, and there's no placeholder node, this means previous saves have failed and this is synchronous send.
            // So we successfully sent before even trying to create a pending node. Create an item here for the pending node logic to use.
            const tableView = getSelectedTableView();
            const draftItem = {
                ConversationId: { Id: conversationId },
                ItemId: { Id: PLACEHOLDER_NODE_ITEM_ID },
                IsDraft: true,
                InternetMessageId: internetMessageId,
                ParentFolderId: tableView
                    ? ({ Id: tableView.tableQuery.folderId } as ItemId)
                    : null,
                Flag: { FlagStatus: 'NotFlagged' } as FlagType,
                ItemClass: '',
            } as Message;
            state.items.set(PLACEHOLDER_NODE_ITEM_ID, draftItem);
        }
    }
);
