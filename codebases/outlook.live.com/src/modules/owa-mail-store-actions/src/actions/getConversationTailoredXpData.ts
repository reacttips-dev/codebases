import { mailStore, getConversationFromNodes } from 'owa-mail-store';
import type ConversationNode from 'owa-service/lib/contract/ConversationNode';
import type ConversationSortOrder from 'owa-service/lib/contract/ConversationSortOrder';
import { action } from 'satcheljs/lib/legacy';
import getItemTailoredXpData, { GetTailoredXpDataState } from './getItemTailoredXpData';

export default action('getConversationTailoredXpData')(function getConversationTailoredXpData(
    conversationNodes: ConversationNode[],
    conversationSortOrder: ConversationSortOrder,
    state: GetTailoredXpDataState = { items: mailStore.items }
) {
    // Check the first node's items for TxP data.
    const node = getConversationFromNodes(conversationNodes, conversationSortOrder);
    node.Items.forEach(newItem => {
        getItemTailoredXpData(newItem, state);
    });
});
