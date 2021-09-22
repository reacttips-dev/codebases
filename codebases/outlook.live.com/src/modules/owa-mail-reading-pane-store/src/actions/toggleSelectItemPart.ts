import initializeExtendedStateForItemViewState from './initializeExtendedStateForItemViewState';
import OnItemPartSelected from './onItemPartSelected';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import { FocusedItemArea } from '../store/schema/FocusedItemPart';
import type ItemPartViewState from '../store/schema/ItemPartViewState';
import { getFocusedItemPart, isItemPartSelected } from '../utils/focusedItemPartUtils';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import { addDatapointConfig } from 'owa-analytics-actions';
import { onItemPartDeselected } from 'owa-mail-actions/lib/readingPaneActions';
import findInlineComposeViewState from 'owa-mail-compose-actions/lib/utils/findInlineComposeViewState';
import getSelectedTableView from 'owa-mail-list-store/lib/utils/getSelectedTableView';
import { action as legacyAction } from 'satcheljs/lib/legacy';
import { action, mutator } from 'satcheljs';
import {
    getReadHostItemIndex,
    lazyOnHostItemChanged,
    OnHostItemChangedStatus,
} from 'owa-addins-core';

export interface ToggleSelectItemPartState {
    conversationReadingPaneState: ConversationReadingPaneViewState;
}

export default legacyAction('toggleSelectItemPart')(function toggleSelectItemPart(
    conversationId: string,
    itemPart: ItemPartViewState,
    toggleExpandedCollapsed: boolean,
    fromKeyboard?: boolean,
    shouldNotGrabFocus?: boolean,
    state: ToggleSelectItemPartState = {
        conversationReadingPaneState: getConversationReadingPaneViewState(conversationId),
    }
) {
    if (!toggleExpandedCollapsed && isItemPartSelected(itemPart, state)) {
        // If only update selection and the item part is already selected, no-op
        return;
    }
    const canFocus = !findInlineComposeViewState(conversationId);
    // Update the expanded/collapsed state
    if (toggleExpandedCollapsed) {
        expandCollapseItemPart(itemPart, fromKeyboard, canFocus, state);
    }
    // If the item part is expanded initialize the extended state
    if (itemPart.isExpanded) {
        initializeExtendedStateForItemViewState(itemPart);
    }
    // Unselect all itemParts
    unselectItemParts(conversationId, state);
    onItemChanged(itemPart, conversationId, true /*isFocused*/);
    // If this is not from the keyboard & can focus, update the focused item part
    if (!fromKeyboard && itemPart && canFocus) {
        state.conversationReadingPaneState.focusedItemPart = {
            focusedItemArea: FocusedItemArea.Item,
            itemPart,
            shouldNotGrabFocus,
        };
    }
});

export let unselectItemParts = legacyAction('unselectItemParts')(function unselectItemParts(
    conversationId: string,
    state: ToggleSelectItemPartState = {
        conversationReadingPaneState: getConversationReadingPaneViewState(conversationId),
    }
) {
    const selectedItemPart = getFocusedItemPart({
        conversationReadingPaneState: state.conversationReadingPaneState,
    });
    if (selectedItemPart) {
        onItemChanged(selectedItemPart, conversationId, false /*isFocused*/);
    }
});

// Count the number of times user expand/collapse item part
// CustomData: 1 - itemPartStateChange:
//                      "SC" - select to collapse,
//                      "ES" - expand to select,
//                      "CS" - collapse to select
//                      "EC" - expand to collapse
//                      "CE" - collapse to expand
// CustomData: 2 - fromKeyboard
const expandCollapseItemPart = action(
    'expandCollapseItemPart',
    (
        itemPart: ItemPartViewState,
        fromKeyboard: boolean,
        canFocus: boolean,
        state: ToggleSelectItemPartState
    ) => {
        let firstCustomData: string;
        if (fromKeyboard || canFocus) {
            if (itemPart.isExpanded) {
                firstCustomData = 'EC';
            } else {
                firstCustomData = 'CE';
            }
        } else {
            if (itemPart == getFocusedItemPart()) {
                firstCustomData = 'SC';
            } else if (itemPart.isExpanded) {
                firstCustomData = 'ES';
            } else {
                firstCustomData = 'CS';
            }
        }
        return addDatapointConfig(
            {
                name: 'RPCountExpCollItemPart',
                customData: [firstCustomData, fromKeyboard],
            },
            { itemPart, fromKeyboard, canFocus, state }
        );
    }
);

mutator(expandCollapseItemPart, ({ itemPart, fromKeyboard, canFocus, state }) => {
    if (fromKeyboard || !canFocus) {
        // If it is from the keyboard, toggle the current state
        itemPart.isExpanded = !itemPart.isExpanded;
    } else {
        // If it is from a mouse click, if the current item part is selected and expanded, collapse otherwise expand
        itemPart.isExpanded =
            isItemPartSelected(itemPart, state) && itemPart.isExpanded ? false : true;
    }
});

async function onItemChanged(
    itemPart: ItemPartViewState,
    conversationId: string,
    isFocused: boolean
) {
    if (!isFocused) {
        onItemPartDeselected(itemPart.itemId, getSelectedTableView());
    } else {
        OnItemPartSelected(itemPart.conversationNodeId, conversationId);
    }

    (await lazyOnHostItemChanged.import())(
        getReadHostItemIndex(itemPart.itemId),
        isFocused ? OnHostItemChangedStatus.Selected : OnHostItemChangedStatus.Deselected
    );
}
