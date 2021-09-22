import type Message from 'owa-service/lib/contract/Message';
import type TableViewConversationRelation from 'owa-mail-list-store/lib/store/schema/TableViewConversationRelation';
import mailStore from 'owa-mail-store/lib/store/Store';
import { LocalLieState } from 'owa-mail-store/lib/store/schema/LocalLieState';

export default function doesConversationHaveDrafts(
    tableConversationRelation: TableViewConversationRelation
) {
    for (const draftItemId of tableConversationRelation.draftItemIds) {
        const draftMessage: Message = mailStore.items.get(draftItemId);
        const nodeId = draftMessage ? draftMessage.InternetMessageId : null;
        const node = mailStore.conversationNodes.get(nodeId);
        if (!node || node.localLieState == LocalLieState.None) {
            // If the draft item is new enough to not yet be in the store or belong to a node, the node will be null and this is a genuine draft.
            // If the draft item does belong to a node, and the node's local lie state is None, this is a genuine draft.
            // In either case, return true and stop checking draftItemIds.
            return true;
        }
    }

    // If none of the draft items met the above criteria, return false.
    return false;
}
