import closeSecondaryReadingPaneTab from '../utils/closeSecondaryReadingPaneTab';
import setShouldShowEmptyReadingPane from './setShouldShowEmptyReadingPane';
import updateLoadedConversation from './updateLoadedConversation';
import type { ObservableMap } from 'mobx';
import tryRemoveFromMailStoreItems, {
    RemoveItemSource,
} from 'owa-mail-actions/lib/triage/tryRemoveFromMailStoreItems';
import { deleteConversationItemParts } from 'owa-mail-store-actions';
import type CollectionChange from 'owa-mail-store/lib/store/schema/CollectionChange';
import type ConversationItemParts from 'owa-mail-store/lib/store/schema/ConversationItemParts';
import type ConversationReadingPaneNode from 'owa-mail-store/lib/store/schema/ConversationReadingPaneNode';
import mailStore from 'owa-mail-store/lib/store/Store';
import type Item from 'owa-service/lib/contract/Item';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type Message from 'owa-service/lib/contract/Message';
import { action } from 'satcheljs/lib/legacy';

export interface CleanUpItemClientSideState {
    conversations: ObservableMap<string, ConversationItemParts>;
    conversationNodes: ObservableMap<string, ConversationReadingPaneNode>;
    items: ObservableMap<string, Item>;
}

// Delete item from conversationReadingPane/itemReadingPane will trigger this action.
// In this action, we decide how we want to clear cache for this item and properly update view.
export default action('cleanUpItemClientSide')(function cleanUpItemClientSide(
    itemId: ItemId,
    itemConversationId: ItemId,
    state: CleanUpItemClientSideState = {
        conversations: mailStore.conversations,
        conversationNodes: mailStore.conversationNodes,
        items: mailStore.items,
    }
) {
    const item = state.items.get(itemId.Id);
    // Item may not exist if it was already deleted by another scenario. Reading pane won't hold a ref to the item
    // if the item reading pane was never loaded for this item.
    const nodeId = (<Message>item)?.InternetMessageId;
    // The item's IMI may not be present if it was only partially loaded by message listview.
    const conversationId = itemConversationId?.Id;
    if (nodeId && state.conversations.has(conversationId) && state.conversationNodes.has(nodeId)) {
        const conversation = state.conversations.get(conversationId);
        const conversationNode = state.conversationNodes.get(nodeId);
        if (conversation.conversationNodeIds.length == 1 && conversationNode.itemIds.length == 1) {
            deleteConversationItemParts(conversation.conversationId.Id);
            closeSecondaryReadingPaneTab(conversation.conversationId.Id, itemId.Id);
        } else {
            const nodeIdCollectionChange: CollectionChange<string> = {
                added: [],
                removed: [],
                modified: [],
            };
            if (conversationNode.itemIds.length == 1) {
                const nodeIds = conversation.conversationNodeIds;
                nodeIds.splice(nodeIds.indexOf(nodeId), 1);
                state.conversationNodes.delete(nodeId);
                nodeIdCollectionChange.removed.push(nodeId);
            } else {
                const itemIds = conversationNode.itemIds;
                itemIds.splice(itemIds.indexOf(itemId.Id), 1);
                nodeIdCollectionChange.modified.push(nodeId);
            }
            // Try removing the mail item if the ref is not held by other scenarios
            // Note: Since we modified conversation data in mailStore, which means we de-ref the item in conversation data,
            // we need to try remove the item with RemoveItemSource.ConversationItemParts,
            // otherwise, we'll lose track of the item and cause memory leak.
            tryRemoveFromMailStoreItems(itemId.Id, RemoveItemSource.ConversationItemParts);
            // Notify conversation reading pane the collection change to update view
            updateLoadedConversation(conversationId, nodeIdCollectionChange);
            closeSecondaryReadingPaneTab(null /*conversationId*/, itemId.Id);
        }
    }
    setShouldShowEmptyReadingPane(conversationId, itemId.Id);
    // Try removing the mail item if the ref is not held by other scenarios
    tryRemoveFromMailStoreItems(itemId.Id, RemoveItemSource.ItemCleanUp);
});
