import * as mailListSelectionActionsV2 from 'owa-mail-actions/lib/mailListSelectionActions';
import onItemPartSelected from 'owa-mail-reading-pane-store/lib/actions/onItemPartSelected';
import { ConversationItemParts, mailStore } from 'owa-mail-store';
import { listViewStore } from 'owa-mail-list-store';
import { orchestrator } from 'satcheljs';
import getSelectedTableViewId from 'owa-mail-list-store/lib/utils/getSelectedTableViewId';

/**
 * Called when the user selects an item part in conversation reading pane
 */
export default orchestrator(onItemPartSelected, actionMessage => {
    if (!listViewStore.expandedConversationViewState.expandedRowKey) {
        // don't select the item part if no conversation is expanded
        return;
    }

    const conversationItemParts: ConversationItemParts = mailStore.conversations.get(
        actionMessage.conversationId
    );

    mailListSelectionActionsV2.singleSelectItemPart(
        listViewStore.expandedConversationViewState.expandedRowKey,
        actionMessage.conversationNodeId,
        conversationItemParts.conversationNodeIds,
        getSelectedTableViewId()
    );
});
