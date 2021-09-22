import { logUsage } from 'owa-analytics';
import { getConversationFromNodes } from 'owa-mail-store';
import type ConversationNode from 'owa-service/lib/contract/ConversationNode';
import type ConversationSortOrder from 'owa-service/lib/contract/ConversationSortOrder';
import type Item from 'owa-service/lib/contract/Item';
import { lazyBootstrapYammer } from 'owa-yammer-bootstrap';

export function preloadYammerIfConversationContainsYammerNotification(
    conversationNodes: ConversationNode[],
    conversationSortOrder: ConversationSortOrder
): void {
    const node = getConversationFromNodes(conversationNodes, conversationSortOrder);
    node.Items.some(newItem => {
        // If any of the items have YammerNotification property, begin the bootstrap process
        return preloadYammerIfitemIsYammerNotification(newItem);
    });
}

export function preloadYammerIfitemIsYammerNotification(item: Item): boolean {
    if (item.YammerNotification || item.ExtensibleContentData) {
        logUsage('Yammer_PrefetchHit');
        lazyBootstrapYammer.import().then(bootstrapYammer => bootstrapYammer());
        return true;
    }

    return false;
}
