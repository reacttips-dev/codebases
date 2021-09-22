import expandCollapsedItemsRollUp from './expandCollapsedItemsRollUp';
import toggleSelectItemPart from './toggleSelectItemPart';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import { FocusedItemArea } from '../store/schema/FocusedItemPart';
import type ItemPartViewState from '../store/schema/ItemPartViewState';
import { getFocusedItemPart } from '../utils/focusedItemPartUtils';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import { isItemPartInCollapsedItemsRollUp } from '../utils/rollUp/collapsedItemsRollUpUtils';
import { getParentItemPart } from '../utils/rollUp/rollUpUtils';
import type { ObservableMap } from 'mobx';
import type { ConversationReadingPaneNode } from 'owa-mail-store';
import mailStore from 'owa-mail-store/lib/store/Store';
import { OOF_ITEM_CLASS_REGEX } from 'owa-mail-store/lib/utils/constants';
import type Item from 'owa-service/lib/contract/Item';
import type Message from 'owa-service/lib/contract/Message';
import { action } from 'satcheljs/lib/legacy';

export interface SetItemIdToScrollToState {
    conversationNodes: ObservableMap<string, ConversationReadingPaneNode>;
    conversationReadingPaneState: ConversationReadingPaneViewState;
    items: ObservableMap<string, Item>;
}

/**
 * @param item
 * @param parentNode
 * @param parentItemPart
 * @return true if the item is an OOF message and its trigger message exists in allNodeIds
 */
const shouldScrollToParentNode = (
    item: Item,
    nodeId: string,
    parentItemPart: ItemPartViewState,
    conversationNodes
): boolean => {
    const node = conversationNodes.get(nodeId);
    const parentNode = node ? conversationNodes.get(node.parentInternetMessageId) : null;
    return item && parentItemPart && parentNode && OOF_ITEM_CLASS_REGEX.test(item.ItemClass);
};

export default action('setItemIdToScrollTo')(function setItemIdToScrollTo(
    conversationId: string,
    itemId: string,
    shouldNotGrabFocus?: boolean,
    state: SetItemIdToScrollToState = {
        conversationNodes: mailStore.conversationNodes,
        conversationReadingPaneState: getConversationReadingPaneViewState(conversationId),
        items: mailStore.items,
    }
) {
    // In case there is no ReadingPaneState, dont do anything.
    // SxS is an example where the consumer might be in compose or reading mode
    if (!state.conversationReadingPaneState) {
        return;
    }
    state.conversationReadingPaneState.itemIdToScrollTo = itemId;
    const item = state.items.get(itemId);
    if (item) {
        const nodeId = (<Message>item).InternetMessageId;
        const itemPart = state.conversationReadingPaneState.itemPartsMap.get(nodeId);
        const focusedItemPart = getFocusedItemPart({
            conversationReadingPaneState: state.conversationReadingPaneState,
        });
        const parentItemPart = getParentItemPart(
            nodeId,
            state.conversationReadingPaneState.itemPartsMap,
            state.conversationNodes
        );
        if (shouldScrollToParentNode(item, nodeId, parentItemPart, state.conversationNodes)) {
            if (focusedItemPart != parentItemPart) {
                setItemToScrollTo(parentItemPart, state.conversationReadingPaneState);
                state.conversationReadingPaneState.focusedItemPart = {
                    focusedItemArea: FocusedItemArea.Oof,
                    itemPart: itemPart,
                };
            }
            parentItemPart.oofRollUpViewState.isOofRollUpExpanded = true;
            return;
        }
        // If the itemPart exists in the conversation that's in view and is not selected, select it.
        // This will expand collapsed itemParts and select already expanded itemParts.
        if (itemPart && focusedItemPart != itemPart) {
            setItemToScrollTo(itemPart, state.conversationReadingPaneState);
            toggleSelectItemPart(
                conversationId,
                itemPart,
                true /*toggleExpandedCollapsed*/,
                undefined /* fromKeyboard */,
                shouldNotGrabFocus
            );
        }
    }
});

const setItemToScrollTo = (itemPart, conversationReadingPaneState) => {
    // Set the itemIdToScrollTo now. This will trigger the autorun on the itemParts to check if the itemId matches its own.
    // It also has logic to only call back to the reading pane to scroll if it's already expanded.
    conversationReadingPaneState.itemIdToScrollTo = itemPart.itemId;

    // If this itemPart is in collapsed items roll up, then expand the roll up first.
    if (isItemPartInCollapsedItemsRollUp(conversationReadingPaneState, itemPart)) {
        expandCollapsedItemsRollUp(conversationReadingPaneState, true /*isAuto*/);
    }
};
