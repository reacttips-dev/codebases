import { getCountBucket } from '../datapoints';
import { getItemsCountInCollapsedItemsRollUp } from '../utils/rollUp/collapsedItemsRollUpUtils';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import type ItemPartViewState from '../store/schema/ItemPartViewState';
import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';
import { logUsage } from 'owa-analytics';
import { action } from 'satcheljs/lib/legacy';
import mailStore from 'owa-mail-store/lib/store/Store';
import { isMeetingMessage } from 'owa-meeting-message';
import type MeetingMessage from 'owa-service/lib/contract/MeetingMessage';
import { hasExtendedCard } from '../utils/extendedCardUtils';
import { ExtendedCardType } from '../store/schema/ExtendedCardViewState';

const MIN_CONVERSATION_LENGTH = 5;
const MIN_CONSECUTIVE_ITEMS = 3;

export default action('markConversationCollapsedItemsRollUp')(
    function markConversationCollapsedItemsRollUp(
        conversationReadingPaneViewState: ConversationReadingPaneViewState,
        loadedConversationItemParts: ItemPartViewState[],
        includeFirstNode: boolean
    ) {
        if (hasExtendedCard(conversationReadingPaneViewState, ExtendedCardType.CalendarCard)) {
            populateRollUpForMeetingFeed(
                conversationReadingPaneViewState,
                loadedConversationItemParts
            );
        } else {
            populateRollUp(
                conversationReadingPaneViewState,
                loadedConversationItemParts,
                includeFirstNode
            );
        }
    }
);

function populateRollUp(
    conversationReadingPaneViewState: ConversationReadingPaneViewState,
    loadedConversationItemParts: ItemPartViewState[],
    includeFirstNode: boolean
) {
    const { length } = loadedConversationItemParts;

    // If there are less than 5 items in the conversation, there should be no collapsed items roll up, skip.
    if (length < MIN_CONVERSATION_LENGTH) {
        return;
    }

    const continuousCollapsedItemNodeIds: string[] = [];
    let startIndex = isNewestOnBottom() ? 1 : length - 2;
    const indexIncrement = isNewestOnBottom() ? 1 : -1;

    if (includeFirstNode) {
        startIndex -= indexIncrement;
    }

    for (let index = startIndex; index <= length - 1 && index >= 0; index += indexIncrement) {
        if (loadedConversationItemParts[index].isExpanded) {
            break;
        } else {
            continuousCollapsedItemNodeIds.push(
                loadedConversationItemParts[index].conversationNodeId
            );
        }
    }

    // If the continuous collapsed items are more than or equal to 3, marked as collapsed items roll up.
    if (continuousCollapsedItemNodeIds.length >= MIN_CONSECUTIVE_ITEMS) {
        // We don't add the last collapsed item in the collapsed items roll up.
        continuousCollapsedItemNodeIds.pop();
        conversationReadingPaneViewState.conversationNodeIdsInCollapsedItemsRollUp = continuousCollapsedItemNodeIds;

        // If the first node is not included, the first node is rendered before the see more button
        if (!includeFirstNode) {
            const firstNodeIndex = isNewestOnBottom() ? 0 : length - 1;
            conversationReadingPaneViewState.nodeIdBundledWithSeeMoreMessages =
                loadedConversationItemParts[firstNodeIndex].conversationNodeId;
        }

        // Log the render count of collapsed items roll up.
        logUsage('RPCountRenderCollItemsRollUp', [
            getCountBucket(getItemsCountInCollapsedItemsRollUp(conversationReadingPaneViewState)),
        ]);
    }
}

function populateRollUpForMeetingFeed(
    conversationReadingPaneViewState: ConversationReadingPaneViewState,
    loadedConversationItemParts: ItemPartViewState[]
) {
    const { length } = loadedConversationItemParts;

    const continuousCollapsedItemNodeIds: string[] = [];
    const startIndex = isNewestOnBottom() ? 0 : length - 1;
    const indexIncrement = isNewestOnBottom() ? 1 : -1;

    for (let index = startIndex; index <= length - 1 && index >= 0; index += indexIncrement) {
        if (loadedConversationItemParts[index].isExpanded) {
            break;
        } else if (shouldCollapseItemPartForMeetingFeed(loadedConversationItemParts[index])) {
            continuousCollapsedItemNodeIds.push(
                loadedConversationItemParts[index].conversationNodeId
            );
        }
    }

    if (continuousCollapsedItemNodeIds.length > 1) {
        conversationReadingPaneViewState.conversationNodeIdsInCollapsedItemsRollUp = continuousCollapsedItemNodeIds;
    }
}

function shouldCollapseItemPartForMeetingFeed(viewState: ItemPartViewState): boolean {
    let item = mailStore.items.get(viewState.itemId);

    if (item && isMeetingMessage(item)) {
        return (item as MeetingMessage).IsOutOfDate;
    }

    return false;
}
