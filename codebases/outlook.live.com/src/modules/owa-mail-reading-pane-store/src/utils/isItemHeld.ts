import readingPaneStore from '../store/Store';
import { RemoveItemSource } from 'owa-mail-actions/lib/triage/tryRemoveFromMailStoreItems';
import store from 'owa-mail-store/lib/store/Store';

export function isItemHeldByConversationItemParts(
    parentConversationId: string,
    removeItemSource: RemoveItemSource
): boolean {
    // There is a server-side issue where FindItem is not sending conversationId for certain items
    // that are part of long conversations that have more than 100 messages.
    // If we did not have conversationId stamped, it means this item was never loaded in RP or getItem was not performed on it
    // as getItem gets the conversationId back. If this is the case then we can safely assume ItemParts are not holding this item
    if (!parentConversationId) {
        return false;
    }

    if (removeItemSource === RemoveItemSource.ConversationItemParts) {
        // Don't count the ref held by conversation item parts if this is coming from conversation item parts delete
        // as it will clean up the ref when the operation fully finishes
        return false;
    }

    // Return true if the item's parent conversation is held in the conversations cache. Because if it is,
    // we can't just delete one of its items even if the RP is not currently displaying it. We want that conversation to
    // remain in a good state if we switch to a prefetched conversation from the cache.
    return !!store.conversations.get(parentConversationId);
}

export function isItemHeldByItemReadingPane(
    itemId: string,
    removeItemSource: RemoveItemSource
): boolean {
    if (removeItemSource == RemoveItemSource.ItemCleanUp) {
        // Don't count the ref held by item reading pane if this is coming from item cleanup operation,
        // as it will clean up the ref when the operation fully finishes
        return false;
    }

    return readingPaneStore.loadedItemReadingPaneViewStates.has(itemId);
}
