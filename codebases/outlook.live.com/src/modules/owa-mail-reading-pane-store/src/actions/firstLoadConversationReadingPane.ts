import initializeAttachmentsForConversationWell from './initializeAttachmentsForConversationWell';
import initializeExtendedCardForConversationReadingPane from './initializeExtendedCardForConversationReadingPane';
import initializeExtendedStateForItemViewState from './initializeExtendedStateForItemViewState';
import { createItemPartViewState } from './loadConversationReadingPane';
import markConversationCollapsedItemsRollUp from './markConversationCollapsedItemsRollUp';
import tryAddOofNodesInRollUp from './rollUp/tryAddOofNodesInRollUp';
import tryInitializeShouldShowCLPLabel from './tryInitializeShouldShowCLPLabel';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import { ExtendedCardType } from '../store/schema/ExtendedCardViewState';
import FocusedItemPart, { FocusedItemArea } from '../store/schema/FocusedItemPart';
import type ItemPartViewState from '../store/schema/ItemPartViewState';
import { hasExtendedCard } from '../utils/extendedCardUtils';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import itemHasHighlightTerms from '../utils/itemHasHighlightTerms';
import setMeetingMessageItemPartExpandedState from '../utils/setMeetingMessageItemPartExpandedState';
import { getUnsupportedItemIdFromConversation } from '../utils/unsupportedItemUtils';
import type { ObservableMap } from 'mobx';
import findInlineComposeViewState from 'owa-mail-compose-actions/lib/utils/findInlineComposeViewState';
import isCLPEnabled from 'owa-mail-protection/lib/utils/clp/isCLPEnabled';
import type { ConversationReadingPaneNode } from 'owa-mail-store';
import type ConversationItemParts from 'owa-mail-store/lib/store/schema/ConversationItemParts';
import mailStore from 'owa-mail-store/lib/store/Store';
import { findItemToLoad } from 'owa-mail-store/lib/utils/conversationsUtils';
import type Item from 'owa-service/lib/contract/Item';
import { action } from 'satcheljs/lib/legacy';

function setItemPartExpandedState(
    isNewestOnBottom: boolean,
    hasExpandedNonDraftItem: boolean,
    loadedConversationItemParts: ItemPartViewState[],
    conversationNodes: ObservableMap<string, ConversationReadingPaneNode>
) {
    const itemPartCount = loadedConversationItemParts.length;

    if (itemPartCount == 0 || hasExpandedNonDraftItem) {
        return;
    }
    /*
     ** Expand the latest local one if no item is expanded.
     ** The latest local message can also be an OOF message, for which ItemPartViewState does not exist
     ** In that case, we expand the trigger message for the OOF message
     */
    // We traverse the array from end to start if newest on bottom;
    // from start to end otherwise.
    let itemPartToExpand: ItemPartViewState = null;
    const latestItemIndex = isNewestOnBottom ? itemPartCount - 1 : 0;
    let itemIndex = latestItemIndex;
    const indexIncrement = isNewestOnBottom ? -1 : 1;
    const nodeHasLocalItem = (nodeId: string): boolean => {
        const node = conversationNodes.get(nodeId);
        return findItemToLoad(node)[1];
    };
    while (itemIndex >= 0 && itemIndex < itemPartCount) {
        const itemPartViewState = loadedConversationItemParts[itemIndex];
        const shouldExpandOOFRollupTrigger = itemPartViewState.oofRollUpViewState.oofReplyNodeIds.some(
            nodeHasLocalItem
        );
        // Expand the latest local item. If the latest item is an OOF item, expand its trigger message
        if (
            !itemPartViewState.isExpanded &&
            (itemPartViewState.isLocal || shouldExpandOOFRollupTrigger)
        ) {
            itemPartToExpand = itemPartViewState;
            break;
        }
        itemIndex += indexIncrement;
    }
    // If no item part is found to be expanded after for loop, blindly expand the latest one
    if (!itemPartToExpand) {
        itemPartToExpand = loadedConversationItemParts[latestItemIndex];
    }
    itemPartToExpand.isExpanded = true;
    itemPartToExpand.isFossilizedTextExpanded = true;
}

function setItemPartSelectedState(
    loadedConversationItemParts: ItemPartViewState[],
    itemIdToScrollTo?: string
): FocusedItemPart {
    // Select the first expanded item
    const itemPartCount = loadedConversationItemParts.length;
    for (let i = 0; i < itemPartCount; i++) {
        const itemPartViewState = loadedConversationItemParts[i];
        const itemViewStateId = itemPartViewState.itemId;
        if (itemIdToScrollTo) {
            // If we have an itemId to scroll to, look for the corresponding item part.
            if (itemViewStateId == itemIdToScrollTo) {
                // When we find it, make sure it's expanded and selected
                itemPartViewState.isExpanded = true;
                return {
                    itemPart: itemPartViewState,
                    focusedItemArea: FocusedItemArea.Item,
                };
            }
        } else if (itemPartViewState.isExpanded) {
            // Or look for the first expanded item.
            return {
                itemPart: itemPartViewState,
                focusedItemArea: FocusedItemArea.Item,
            };
        } else if (itemPartViewState.oofRollUpViewState.isOofRollUpExpanded) {
            // Or look for the first item with expanded oof rollup
            return {
                itemPart: itemPartViewState,
                focusedItemArea: FocusedItemArea.Oof,
            };
        }
    }

    // return null if itemPartCount is 0.
    // itemPartCount could be 0 when all conversationNodes return from GCI response are deleted drafts
    // and we're not in delete folder
    return null;
}

/**
 * @returns current selected item id.
 */
function loadItemPartStates(
    loadedConversation: ConversationItemParts,
    loadedConversationViewState: ConversationReadingPaneViewState,
    conversationNodes: ObservableMap<string, ConversationReadingPaneNode>,
    items: ObservableMap<string, Item>
): FocusedItemPart {
    const loadedConversationItemParts: ItemPartViewState[] = [];
    const { itemPartsMap, itemIdToScrollTo } = loadedConversationViewState;
    let currentSelectedItemPart: FocusedItemPart = null;
    if (loadedConversation.conversationNodeIds) {
        loadedConversation.conversationNodeIds.forEach(nodeId => {
            let [itemPartViewState] = createItemPartViewState({
                mailboxInfo: loadedConversation.conversationId.mailboxInfo,
                Id: nodeId,
            });
            if (itemPartViewState) {
                itemPartsMap.set(nodeId, itemPartViewState);
            }
        });

        isCLPEnabled() && tryInitializeShouldShowCLPLabel(loadedConversationViewState);

        tryAddOofNodesInRollUp(
            itemPartsMap,
            conversationNodes,
            loadedConversation.conversationNodeIds,
            false /*shouldCleanUpChildrenNodes*/
        );

        // After the calculation for oof roll up and calendar roll up, some nodes may not be existed in itemPartsMap
        // So we need to loop the conversation node ids again to find out all the normal item parts from itemPartsMap
        // for the further calcuation(Expanded state)
        let hasExpandedNonDraftItem = false;

        loadedConversation.conversationNodeIds.forEach(nodeId => {
            const itemPartViewState = itemPartsMap.get(nodeId);
            if (itemPartViewState && !itemPartViewState.isInRollUp) {
                loadedConversationItemParts.push(itemPartViewState);
                const item = items.get(itemPartViewState.itemId);

                if (itemHasHighlightTerms(item)) {
                    itemPartViewState.isExpanded = true;
                }

                hasExpandedNonDraftItem =
                    hasExpandedNonDraftItem || (itemPartViewState.isExpanded && !item.IsDraft);
            }
        });

        const isNewestOnBottom =
            loadedConversation.conversationSortOrder == 'ChronologicalNewestOnBottom';

        setItemPartExpandedState(
            isNewestOnBottom,
            hasExpandedNonDraftItem,
            loadedConversationItemParts,
            conversationNodes
        );

        currentSelectedItemPart = setItemPartSelectedState(
            loadedConversationItemParts,
            itemIdToScrollTo
        );

        loadedConversationItemParts.forEach((itemPart: ItemPartViewState) => {
            if (itemPart.isExpanded) {
                initializeExtendedStateForItemViewState(itemPart);
            }
        });

        initializeExtendedCardForConversationReadingPane(
            loadedConversationViewState,
            loadedConversationItemParts
        );

        if (hasExtendedCard(loadedConversationViewState, ExtendedCardType.CalendarCard)) {
            setMeetingMessageItemPartExpandedState(loadedConversationItemParts);
        }

        if (loadedConversationItemParts.length) {
            const rootNodeIndex = isNewestOnBottom
                ? 0
                : loadedConversation.conversationNodeIds.length - 1;
            const rootNodeId = loadedConversation.conversationNodeIds[rootNodeIndex];
            const hasRootNode = itemPartsMap.has(rootNodeId);

            if (loadedConversation.canLoadMore) {
                // If the conversation could load more, the see more button should be
                // bundled with the root node.
                loadedConversationViewState.nodeIdBundledWithSeeMoreMessages = rootNodeId;
            }

            // If there is a inline compose, dont show rollup as reply to rollup item comes top/bottom if item is rolled up
            if (!findInlineComposeViewState(loadedConversationViewState.conversationId.Id)) {
                markConversationCollapsedItemsRollUp(
                    loadedConversationViewState,
                    loadedConversationItemParts,
                    // If the conversation can load more, but the root item part is not rendered,
                    // The first visible item should be included in the collapsed items roll up
                    loadedConversation.canLoadMore && !hasRootNode
                );
            }
        }
    }
    return currentSelectedItemPart;
}

export interface FirstLoadConversationReadingPaneState {
    loadedConversation: ConversationItemParts;
    conversationReadingPaneState: ConversationReadingPaneViewState;
    conversationNodes: ObservableMap<string, ConversationReadingPaneNode>;
    items: ObservableMap<string, Item>;
}

export default action('firstLoadConversationReadingPane')(function firstLoadConversationReadingPane(
    conversationId: string,
    state: FirstLoadConversationReadingPaneState = {
        loadedConversation: mailStore.conversations.get(conversationId),
        conversationNodes: mailStore.conversationNodes,
        conversationReadingPaneState: getConversationReadingPaneViewState(conversationId),
        items: mailStore.items,
    }
) {
    if (state.conversationReadingPaneState.conversationId.Id != conversationId) {
        // If a different conversation has been loaded before this action is called, skip.
        return;
    }
    const loadedConversationState = state.conversationReadingPaneState;
    loadedConversationState.loadingState.isLoading = false;
    loadedConversationState.loadingState.hasLoadFailed =
        state.loadedConversation.loadingState.hasLoadFailed;
    if (!loadedConversationState.loadingState.hasLoadFailed) {
        const unsupportedItemId = getUnsupportedItemIdFromConversation(conversationId);
        loadedConversationState.unsupportedItemId = unsupportedItemId;
        if (!unsupportedItemId) {
            const currentSelectedItemPart = loadItemPartStates(
                state.loadedConversation,
                loadedConversationState,
                state.conversationNodes,
                state.items
            );
            loadedConversationState.initiallySelectedItemPart = loadedConversationState.focusedItemPart = currentSelectedItemPart;
            initializeAttachmentsForConversationWell(
                loadedConversationState,
                true /* forceAttachmentInitialize */
            );
        }
    }
});
