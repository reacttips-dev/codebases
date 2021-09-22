import type ConversationNode from 'owa-service/lib/contract/ConversationNode';
import type ConversationSortOrder from 'owa-service/lib/contract/ConversationSortOrder2';

const CHRONOLOGICAL_NEWEST_ON_BOTTOM_SORT_ORDER_NAME = 'ChronologicalNewestOnBottom';

export default function getConversationFromNodes(
    conversationNodes: ConversationNode[],
    conversationSortOrder: ConversationSortOrder
): ConversationNode {
    const isNewestOnBottom =
        conversationSortOrder == CHRONOLOGICAL_NEWEST_ON_BOTTOM_SORT_ORDER_NAME;
    const indexOfFirstNode = isNewestOnBottom ? 0 : conversationNodes.length - 1;
    return conversationNodes[indexOfFirstNode];
}
