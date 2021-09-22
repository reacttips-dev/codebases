import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import type { ObservableMap } from 'mobx';
import type { ClientItem } from 'owa-mail-store';
import canConversationLoadMoreFromServer from './canConversationLoadMoreFromServer';
import selectConversationId from 'owa-mail-list-store/lib/selectors/selectConversationById';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function shouldInitializeConversationAttachmentWell(
    conversationState: ConversationReadingPaneViewState,
    mailStoreItems: ObservableMap<string, ClientItem>
): boolean {
    const conversationItem = selectConversationId(conversationState.conversationId.Id);
    if (conversationItem?.hasSharepointLink) {
        return true;
    }
    if (conversationState.itemPartsMap.size > 0) {
        // If there are more items on server, this conversation may have attachments.
        if (canConversationLoadMoreFromServer(conversationState)) {
            return true;
        }

        // go through loaded item parts and check whether any item has attachments.
        const itemPartsMapKeys = [...conversationState.itemPartsMap.keys()];
        for (let i = 0; i < itemPartsMapKeys.length; i++) {
            const itemPart = conversationState.itemPartsMap.get(itemPartsMapKeys[i]);
            if (!itemPart) {
                continue;
            }

            const item = mailStoreItems.get(itemPart.itemId);

            // if item is no longer in cache (moved or deleted)
            // skip to next item part
            if (!item) {
                continue;
            }

            if (
                item.Attachments ||
                (isFeatureEnabled('doc-linkDiscovery-useNewProperty') &&
                    item.HasProcessedSharepointLink)
            ) {
                return true;
            }
        }
    }

    return false;
}
