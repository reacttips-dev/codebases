import expandCollapsedItemsRollUp from '../actions/expandCollapsedItemsRollUp';
import loadMore from '../actions/loadMore';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import { FocusedItemArea } from '../store/schema/FocusedItemPart';
import type ItemPartViewState from '../store/schema/ItemPartViewState';
import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';
import mailStore from 'owa-mail-store/lib/store/Store';
import { action } from 'satcheljs/lib/legacy';
import {
    hasCollapsedItemsRollUp,
    hasSeeMoreButton,
} from '../utils/rollUp/collapsedItemsRollUpUtils';

export default action('expandSeeMore')(function expandSeeMore(
    conversationReadingPaneViewState: ConversationReadingPaneViewState,
    fromKeyboard?: boolean
) {
    // If not from keyboard focus on the see more button
    if (!fromKeyboard) {
        conversationReadingPaneViewState.focusedItemPart = {
            itemPart: null,
            focusedItemArea: FocusedItemArea.SeeMore,
        };
    }

    // Expand the items
    let promiseToReturn = Promise.resolve();
    if (hasCollapsedItemsRollUp(conversationReadingPaneViewState)) {
        expandCollapsedItemsRollUp(conversationReadingPaneViewState);
    } else {
        promiseToReturn = loadMore(conversationReadingPaneViewState.conversationId);
    }

    promiseToReturn.then(() => {
        // Update focus if needed:
        // If there is no see more button, focus on the first visible item part
        if (!hasSeeMoreButton(conversationReadingPaneViewState)) {
            conversationReadingPaneViewState.focusedItemPart = {
                itemPart: getFirstVisibleNode(conversationReadingPaneViewState),
                focusedItemArea: FocusedItemArea.Item,
            };
        }
    });
});

function getFirstVisibleNode(
    conversationReadingPaneViewState: ConversationReadingPaneViewState
): ItemPartViewState {
    const conversationItemParts = mailStore.conversations.get(
        conversationReadingPaneViewState.conversationId.Id
    );
    const { conversationNodeIds } = conversationItemParts;

    let startIndex = isNewestOnBottom() ? 0 : length - 1;
    const indexIncrement = isNewestOnBottom() ? 1 : -1;

    for (
        let index = startIndex;
        index <= conversationNodeIds.length - 1 && index >= 0;
        index += indexIncrement
    ) {
        const nodeId = conversationNodeIds[index];
        const itemPart = conversationReadingPaneViewState.itemPartsMap.get(nodeId);
        if (itemPart) {
            return itemPart;
        }
    }

    return null;
}
