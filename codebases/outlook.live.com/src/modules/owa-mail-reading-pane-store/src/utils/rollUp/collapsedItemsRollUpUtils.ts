import type ConversationReadingPaneViewState from '../../store/schema/ConversationReadingPaneViewState';
import type ItemPartViewState from '../../store/schema/ItemPartViewState';
import mailStore from 'owa-mail-store/lib/store/Store';

export function hasCollapsedItemsRollUp(
    conversationReadingPaneViewState: ConversationReadingPaneViewState
): boolean {
    return (
        conversationReadingPaneViewState?.conversationNodeIdsInCollapsedItemsRollUp &&
        conversationReadingPaneViewState.conversationNodeIdsInCollapsedItemsRollUp.length > 0
    );
}

export function hasSeeMoreButton(
    conversationReadingPaneViewState: ConversationReadingPaneViewState
): boolean {
    const conversationItemParts = mailStore.conversations.get(
        conversationReadingPaneViewState.conversationId.Id
    );

    // If the collapsed items roll up is existed,
    // or the conversation could load more,
    // the see more messages button should be existed.
    return (
        hasCollapsedItemsRollUp(conversationReadingPaneViewState) ||
        conversationItemParts?.canLoadMore
    );
}

export function isItemPartInCollapsedItemsRollUp(
    conversationReadingPaneViewState: ConversationReadingPaneViewState,
    itemPart: ItemPartViewState
): boolean {
    return (
        conversationReadingPaneViewState?.conversationNodeIdsInCollapsedItemsRollUp &&
        itemPart &&
        conversationReadingPaneViewState.conversationNodeIdsInCollapsedItemsRollUp.includes(
            itemPart.conversationNodeId
        )
    );
}

export function getItemsCountInCollapsedItemsRollUp(
    conversationReadingPaneViewState: ConversationReadingPaneViewState
): number {
    if (!hasCollapsedItemsRollUp(conversationReadingPaneViewState)) {
        return 0;
    }

    const {
        conversationNodeIdsInCollapsedItemsRollUp,
        itemPartsMap,
    } = conversationReadingPaneViewState;
    let itemsCount = conversationNodeIdsInCollapsedItemsRollUp.length;

    // Calculate the oof messages in the message count
    conversationNodeIdsInCollapsedItemsRollUp.forEach(nodeId => {
        const itemPartViewState = itemPartsMap.get(nodeId);
        if (itemPartViewState.oofRollUpViewState.oofReplyNodeIds) {
            itemsCount += itemPartViewState.oofRollUpViewState.oofReplyNodeIds.length;
        }
    });

    return itemsCount;
}
