import expandItemPartOnIsReadChanged from './expandItemPartOnIsReadChanged';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import isConversationReadingPaneViewStateLoaded from '../utils/isConversationReadingPaneViewStateLoaded';
import type { ObservableMap } from 'mobx';
import type { ClientItemId } from 'owa-client-ids';
import type ConversationItemParts from 'owa-mail-store/lib/store/schema/ConversationItemParts';
import type ConversationReadingPaneNode from 'owa-mail-store/lib/store/schema/ConversationReadingPaneNode';
import store from 'owa-mail-store/lib/store/Store';
import type Item from 'owa-service/lib/contract/Item';
import type Message from 'owa-service/lib/contract/Message';
import { action } from 'satcheljs/lib/legacy';

export interface MarkConversationsReadInReadingPaneStoreState {
    conversations: ObservableMap<string, ConversationItemParts>;
    conversationNodes: ObservableMap<string, ConversationReadingPaneNode>;
    items: ObservableMap<string, Item>;
    currentRenderedConversationId: ClientItemId;
}

export default action('markConversationsReadInReadingPane')(
    function markConversationsReadInReadingPaneStore(
        conversationIds: string[],
        shouldMarkAsRead: boolean,
        folderId: string,
        state: MarkConversationsReadInReadingPaneStoreState = {
            conversations: store.conversations,
            conversationNodes: store.conversationNodes,
            items: store.items,
            currentRenderedConversationId: getConversationReadingPaneViewState()?.conversationId,
        }
    ) {
        const nodeIdCollectionHasItemChangedToUnread: string[] = [];
        conversationIds.forEach(conversationId => {
            if (state.conversations.has(conversationId)) {
                const conversationItemParts: ConversationItemParts = state.conversations.get(
                    conversationId
                );
                for (const conversationNodeId of conversationItemParts.conversationNodeIds) {
                    const conversationNode = state.conversationNodes.get(conversationNodeId);
                    // Skip if the conversation node is not existed.
                    if (!conversationNode) {
                        continue;
                    }
                    let hasItemChangedToUnread = false;
                    for (const itemId of conversationNode.itemIds) {
                        const message = state.items.get(itemId) as Message;
                        if (
                            message &&
                            message.ConversationId?.Id == conversationId &&
                            (folderId == null || message.ParentFolderId.Id == folderId)
                        ) {
                            if (
                                state.currentRenderedConversationId?.Id == conversationId ||
                                isConversationReadingPaneViewStateLoaded(conversationId)
                            ) {
                                // For the current rendered conversation or any persisted conversations, check if node has item changed from read to unread.
                                hasItemChangedToUnread =
                                    hasItemChangedToUnread || (message.IsRead && !shouldMarkAsRead);
                            }
                            message.IsRead = shouldMarkAsRead;
                        }
                    }
                    if (hasItemChangedToUnread) {
                        nodeIdCollectionHasItemChangedToUnread.push(conversationNodeId);
                    }
                }
            }
        });
        if (nodeIdCollectionHasItemChangedToUnread.length > 0) {
            expandItemPartOnIsReadChanged(
                conversationIds[0],
                nodeIdCollectionHasItemChangedToUnread
            );
        }
    }
);
