import expandCollapseNewestOnBottomFossilizedText from '../actions/expandCollapseNewestOnBottomFossilizedText';
import expandSeeMore from '../actions/expandSeeMore';
import setFocusedItemPart from '../actions/setFocusedItemPart';
import toggleIsOofRollUpExpanded from '../actions/toggleIsOofRollUpExpanded';
import toggleSelectItemPart from '../actions/toggleSelectItemPart';
import { FocusedItemArea } from '../store/schema/FocusedItemPart';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';
import mailStore from 'owa-mail-store/lib/store/Store';

export default function expandCollapseFocusedItemPart(conversationId: string) {
    const focusedItemPart = getConversationReadingPaneViewState(conversationId).focusedItemPart;
    if (!focusedItemPart) {
        return;
    }

    // If the focus area is see more, then expand see more
    if (focusedItemPart.focusedItemArea == FocusedItemArea.SeeMore) {
        expandSeeMore(getConversationReadingPaneViewState(conversationId), true /*fromKeyboard*/);
    }

    if (!focusedItemPart.itemPart) {
        return;
    }

    const itemPart = focusedItemPart.itemPart;

    // Check if the item part is still in the conversation
    if (!mailStore.conversationNodes.get(itemPart.conversationNodeId)) {
        // reset focusedItemPart
        setFocusedItemPart(null);
        return;
    }

    switch (focusedItemPart.focusedItemArea) {
        case FocusedItemArea.Item:
            // expand/collapse the itempart
            toggleSelectItemPart(
                conversationId,
                itemPart,
                true /*toggleExpandedCollapsed*/,
                true /*fromKeyboard*/
            );
            break;
        case FocusedItemArea.Oof:
            // expand/collpase the oof rollup
            toggleIsOofRollUpExpanded(conversationId, itemPart);
            break;
        case FocusedItemArea.FossilizedText:
            if (isNewestOnBottom()) {
                // expand collapse the message history. If it is newest on bottom
                expandCollapseNewestOnBottomFossilizedText(
                    conversationId,
                    itemPart.conversationNodeId,
                    itemPart.isFossilizedTextExpanded
                );
            }
            break;
    }
}
