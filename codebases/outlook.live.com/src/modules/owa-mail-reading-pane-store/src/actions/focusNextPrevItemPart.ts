import toggleSelectItemPart, { unselectItemParts } from './toggleSelectItemPart';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import FocusedItemPart, { FocusedItemArea } from '../store/schema/FocusedItemPart';
import type ItemPartViewState from '../store/schema/ItemPartViewState';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import { hasSeeMoreButton } from '../utils/rollUp/collapsedItemsRollUpUtils';
import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';
import type ConversationItemParts from 'owa-mail-store/lib/store/schema/ConversationItemParts';
import type MailStore from 'owa-mail-store/lib/store/schema/MailStore';
import mailStore from 'owa-mail-store/lib/store/Store';
import { action } from 'satcheljs/lib/legacy';

/*
Newest on bottom            Newest on top
[fossilized text]           [oof rollup]
[root item]                 [item - can contain fossilized text]
[collapsed item rollup]     [collapsed item rollup]
[item]                      [root item - can contain fossilized text]
[oof rollup]
*/

export interface FocusNextPrevItemPartState {
    conversationReadingPaneViewState: ConversationReadingPaneViewState;
    mailStore: MailStore;
    itemParts: ConversationItemParts;
}

const NEWEST_ON_BOTTOM_ITEM_HEIRARCHY = [
    FocusedItemArea.FossilizedText,
    FocusedItemArea.Item,
    FocusedItemArea.Oof,
    FocusedItemArea.SeeMore,
];
const NEWEST_ON_TOP_ITEM_HEIRARCHY = [
    FocusedItemArea.SeeMore,
    FocusedItemArea.Oof,
    FocusedItemArea.Item,
];

export let focusNextPrevItemPartOrArea = action('focusNextPrevItemPartOrArea')(
    function focusNextPrevItemPart(
        conversationId: string,
        change: 1 | -1,
        state: FocusNextPrevItemPartState = {
            conversationReadingPaneViewState: getConversationReadingPaneViewState(conversationId),
            mailStore: mailStore,
            itemParts: mailStore.conversations.get(conversationId),
        }
    ) {
        let focusedItemPart = state.conversationReadingPaneViewState.focusedItemPart;
        if (!focusedItemPart) {
            focusedItemPart = state.conversationReadingPaneViewState.initiallySelectedItemPart;
        }
        const newFocusedNode: FocusedItemPart = tryGetNextPrevNodeToFocus(
            focusedItemPart,
            change,
            state
        );
        if (newFocusedNode) {
            state.conversationReadingPaneViewState.focusedItemPart = newFocusedNode;
            if (newFocusedNode.focusedItemArea == FocusedItemArea.Item) {
                toggleSelectItemPart(
                    conversationId,
                    newFocusedNode.itemPart,
                    false /*toggleExpandedCollapsed*/,
                    true /*fromKeyboard*/
                );
            } else {
                unselectItemParts(conversationId, {
                    conversationReadingPaneState: state.conversationReadingPaneViewState,
                });
            }
        }
    }
);

export default focusNextPrevItemPartOrArea;

export const tryGetNewFocusedNodeOnDelete = function tryGetNewFocusedNodeOnDelete(
    conversationId: string,
    itemPart: ItemPartViewState,
    state: FocusNextPrevItemPartState = {
        conversationReadingPaneViewState: getConversationReadingPaneViewState(conversationId),
        mailStore: mailStore,
        itemParts: mailStore.conversations.get(conversationId),
    }
): FocusedItemPart {
    const prevChange = isNewestOnBottom() ? -1 : 1;
    const nextChange = isNewestOnBottom() ? 1 : -1;
    let focusedItemPart = state.conversationReadingPaneViewState.focusedItemPart;
    // Try to get the previous focusable area
    let newFocusedNode = tryGetNextPrevItemArea(focusedItemPart, prevChange, state);
    // If no prev focusable area, try find prev focusable item
    if (!newFocusedNode) {
        newFocusedNode = tryGetValidNextPrevItemPart(
            itemPart.conversationNodeId,
            prevChange,
            state
        );
    }
    // If no prev focusable area, try to find the next focusable area
    if (!newFocusedNode) {
        newFocusedNode = tryGetNextPrevItemArea(focusedItemPart, nextChange, state);
    }
    // If no next focusable item, try find next focusable item
    if (!newFocusedNode) {
        newFocusedNode = tryGetValidNextPrevItemPart(
            itemPart.conversationNodeId,
            nextChange,
            state
        );
    }
    return newFocusedNode;
};

/**
 * Tries to get the next/prev FocusedItemPart to focus on, whether it is another area of the current focused item part or a different item part
 * Returns null if no valid nodes are found
 */
function tryGetNextPrevNodeToFocus(
    focusedNode: FocusedItemPart,
    change: 1 | -1,
    state?: FocusNextPrevItemPartState
): FocusedItemPart {
    if (!focusedNode.itemPart) {
        // If the focus area is see more and the item part is null, it means that the node bundled with the see more button is hidden,
        // then try to get the next/prev valid item part
        if (focusedNode.focusedItemArea == FocusedItemArea.SeeMore) {
            return tryGetValidNextPrevItemPart(
                state.conversationReadingPaneViewState.nodeIdBundledWithSeeMoreMessages,
                change,
                state
            );
        } else {
            return null;
        }
    }

    // First try to get any adjacent areas to this current item part (ex. oof roll up, see more, fossilized text)
    const newFocusedItemPart = tryGetNextPrevItemArea(focusedNode, change, state);

    // If no adjacent area to focus on was found, try to find the next valid item part
    return newFocusedItemPart
        ? newFocusedItemPart
        : tryGetValidNextPrevItemPart(focusedNode.itemPart.conversationNodeId, change, state);
}

/**
 * Iterates through the item heirarchy (in the direction specified by the change) to try to find a valid item area to focus on
 * Returns null if no valid item areas are found
 */
function tryGetNextPrevItemArea(
    focusedNode: FocusedItemPart,
    change: 1 | -1,
    state?: FocusNextPrevItemPartState
): FocusedItemPart {
    const heirarchy = isNewestOnBottom()
        ? NEWEST_ON_BOTTOM_ITEM_HEIRARCHY
        : NEWEST_ON_TOP_ITEM_HEIRARCHY;
    const index = heirarchy.indexOf(focusedNode.focusedItemArea) + change;

    if (index < 0 || index > heirarchy.length - 1) {
        return null;
    }

    const nextItemArea = heirarchy[index];

    if (nextItemArea == undefined) {
        return null;
    }

    let nextFocusedAreaWithinItem = false;
    switch (nextItemArea) {
        case FocusedItemArea.FossilizedText:
            const conversationNode = state.mailStore.conversationNodes.get(
                focusedNode.itemPart.conversationNodeId
            );
            nextFocusedAreaWithinItem =
                conversationNode?.quotedTextList && conversationNode.quotedTextList.length > 0;
            break;
        case FocusedItemArea.Item:
            nextFocusedAreaWithinItem = true;
            break;
        case FocusedItemArea.Oof:
            nextFocusedAreaWithinItem = itemPartHasOof(focusedNode.itemPart);
            break;
        case FocusedItemArea.SeeMore:
            nextFocusedAreaWithinItem = nodeHasSeeMore(
                focusedNode.itemPart.conversationNodeId,
                state
            );
            break;
        default:
            return null;
    }

    const nextFocusedArea = {
        itemPart: focusedNode.itemPart,
        focusedItemArea: nextItemArea,
    };

    return nextFocusedAreaWithinItem
        ? nextFocusedArea
        : tryGetNextPrevItemArea(nextFocusedArea, change, state);
}

/**
 * Iterates through the conversation item parts to try find a valid FocusedItemPart to focus on
 * Returns null if no valid item part is found
 */
function tryGetValidNextPrevItemPart(
    currentConversationNodeId: string,
    change: 1 | -1,
    state?: FocusNextPrevItemPartState
): FocusedItemPart {
    const newLoopNodeId = getNextLoopNodeId(currentConversationNodeId, change, state);

    if (newLoopNodeId) {
        const newItemPart = state.conversationReadingPaneViewState.itemPartsMap.get(newLoopNodeId);

        if (newItemPart && !newItemPart.isInRollUp) {
            // If this is a valid item part, first check if need to focus on a different part of the item (ex. oof rollup, see more) and return the correct FocusedItemPart
            return checkSpecialCaseForNewFocusedItemPart(newItemPart, change, state);
        } else if (nodeHasSeeMore(newLoopNodeId, state)) {
            // This is special case that the new loop node id is not existed, but it's bundled with the see more button,
            // Then the focus should be in the see more button
            return {
                itemPart: null,
                focusedItemArea: FocusedItemArea.SeeMore,
            };
        } else {
            // If this is not a valid item part, continue looking
            return tryGetValidNextPrevItemPart(newLoopNodeId, change, state);
        }
    }

    return null;
}

/**
 * Check any special cases to denote focusing on a specific item area (ex. oof rollup, see more) rather than the item part itself
 */
function checkSpecialCaseForNewFocusedItemPart(
    newFocusedItem: ItemPartViewState,
    change: 1 | -1,
    state?: FocusNextPrevItemPartState
): FocusedItemPart {
    if ((change == 1 && !isNewestOnBottom()) || (change == -1 && isNewestOnBottom())) {
        if (itemPartHasOof(newFocusedItem)) {
            // Check if should focus on  oof
            return {
                itemPart: newFocusedItem,
                focusedItemArea: FocusedItemArea.Oof,
            };
            // Check if this is a special case and should focus on the see more
        } else if (nodeHasSeeMore(newFocusedItem.conversationNodeId, state)) {
            return {
                itemPart: newFocusedItem,
                focusedItemArea: FocusedItemArea.SeeMore,
            };
        }
    }

    return {
        itemPart: newFocusedItem,
        focusedItemArea: FocusedItemArea.Item,
    };
}

function itemPartHasOof(itemPart: ItemPartViewState) {
    return (
        itemPart.oofRollUpViewState?.oofReplyNodeIds &&
        itemPart.oofRollUpViewState.oofReplyNodeIds.length > 0
    );
}

function nodeHasSeeMore(nodeId: string, state?: FocusNextPrevItemPartState) {
    return (
        nodeId == state.conversationReadingPaneViewState.nodeIdBundledWithSeeMoreMessages &&
        hasSeeMoreButton(state.conversationReadingPaneViewState)
    );
}

/**
 * Finds the next valid conversation node id
 */
function getNextLoopNodeId(
    startConversationNodeId: string,
    change: 1 | -1,
    state?: FocusNextPrevItemPartState
): string {
    if (!state.itemParts) {
        return null;
    }

    let currentConversationNodeId = startConversationNodeId;
    let newLoopNodeId = null;
    let index = state.itemParts.conversationNodeIds.indexOf(currentConversationNodeId) + change;
    for (
        let i = index;
        change == 1 ? i < state.itemParts.conversationNodeIds.length : i >= 0;
        i = i + change
    ) {
        currentConversationNodeId = state.itemParts.conversationNodeIds[i];

        if (currentConversationNodeId) {
            // If conversation node id is not part of the roll up, return this as the next valid node id
            if (
                state.conversationReadingPaneViewState.conversationNodeIdsInCollapsedItemsRollUp.indexOf(
                    currentConversationNodeId
                ) == -1
            ) {
                newLoopNodeId = currentConversationNodeId;
                break;
            }
        } else {
            break;
        }
    }

    return newLoopNodeId;
}
