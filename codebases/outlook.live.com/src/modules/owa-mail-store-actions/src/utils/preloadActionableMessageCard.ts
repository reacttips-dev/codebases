import type ConversationNode from 'owa-service/lib/contract/ConversationNode';
import type { ClientItem } from 'owa-mail-store';
import type Item from 'owa-service/lib/contract/Item';
import {
    lazyPrefetchActionableMessageForItems,
    doesItemContainActionableMessage,
    doesItemContainCardPayload,
} from 'owa-mail-actionable-message-actions';
import { CardFetchStatus } from 'owa-actionable-message-v2';
import { isFeatureEnabled } from 'owa-feature-flags';

const shouldUpdateCardFetchToLoading = (item: Item): boolean => {
    return (
        doesItemContainCardPayload(item) ||
        (doesItemContainActionableMessage(item) &&
            isFeatureEnabled('rp-actionableMessagesPrefetch'))
    );
};

const shouldLoadPrefetchModule = (): boolean => {
    return (
        isFeatureEnabled('rp-actionableMessagesGciFetch') ||
        isFeatureEnabled('rp-actionableMessagesPrefetch')
    );
};

export function preloadActionableMessageCardForConversationView(
    conversationNodes: ConversationNode[]
): void {
    let itemListHavingActionableMessage = [];
    conversationNodes.forEach(node => {
        node.Items.forEach(function (item) {
            if (shouldUpdateCardFetchToLoading(item)) {
                item['AdaptiveCardData'] = {
                    cardDetails: null,
                    cardFetchStatus: CardFetchStatus.Loading,
                };
                itemListHavingActionableMessage.push(item);
            }
        });
    });

    if (shouldLoadPrefetchModule()) {
        lazyPrefetchActionableMessageForItems
            .import()
            .then(prefetchActionableMessageForItems =>
                prefetchActionableMessageForItems(itemListHavingActionableMessage)
            );
    }
}

export function preloadActionableMessageCardForItemView(item: ClientItem): void {
    let itemListHavingActionableMessage = [];
    if (shouldUpdateCardFetchToLoading(item)) {
        item.AdaptiveCardData = {
            cardDetails: null,
            cardFetchStatus: CardFetchStatus.Loading,
        };
        itemListHavingActionableMessage = [item];
    }

    if (shouldLoadPrefetchModule()) {
        lazyPrefetchActionableMessageForItems
            .import()
            .then(prefetchActionableMessageForItems =>
                prefetchActionableMessageForItems(itemListHavingActionableMessage)
            );
    }
}
