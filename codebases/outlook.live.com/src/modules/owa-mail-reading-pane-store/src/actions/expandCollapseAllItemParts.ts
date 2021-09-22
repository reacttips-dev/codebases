import expandCollapsedItemsRollUp from './expandCollapsedItemsRollUp';
import initializeExtendedStateForItemViewState from './initializeExtendedStateForItemViewState';
import loadMore from './loadMore';
import datapoints from '../datapoints';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import { hasCollapsedItemsRollUp } from '../utils/rollUp/collapsedItemsRollUpUtils';
import { wrapFunctionForDatapoint } from 'owa-analytics';
import setCoverOriginalContent from './setCoverOriginalContent';
import { isExtendedCardCoveringOriginalContent } from '../utils/extendedCardUtils';
import canConversationLoadMore from 'owa-mail-store/lib/utils/canConversationLoadMore';
import { mutatorAction } from 'satcheljs';
import ItemPartViewState from '../store/schema/ItemPartViewState';

export default wrapFunctionForDatapoint(
    datapoints.RPCountExpCollAllItemParts,
    function expandCollapseAllItemParts(
        conversationId: string,
        shouldExpand: boolean,
        isFromShortcut: boolean
    ): Promise<void> {
        const conversationReadingPaneViewState = getConversationReadingPaneViewState(
            conversationId
        );
        const itemPartsMap = conversationReadingPaneViewState?.itemPartsMap;
        let promiseToReturn = Promise.resolve();

        // If the extended card is covering the original content, collapse it before expanding/collapsing all
        if (isExtendedCardCoveringOriginalContent(conversationReadingPaneViewState)) {
            setCoverOriginalContent(conversationReadingPaneViewState.extendedCardViewState, false);
        }

        // Expand the collapsed items roll up if it's existed.
        if (shouldExpand && hasCollapsedItemsRollUp(conversationReadingPaneViewState)) {
            expandCollapsedItemsRollUp(conversationReadingPaneViewState, true /*isAuto*/);
        }

        // Load more items from server if the conversation can load more
        if (shouldExpand && canConversationLoadMore(conversationId)) {
            promiseToReturn = loadMore(conversationReadingPaneViewState.conversationId);
        }

        return promiseToReturn.then(() => {
            itemPartsMap?.forEach(itemPart => {
                // Initialize the extended state for item viewstate if expand a collapsed item.
                if (shouldExpand && !itemPart.isExpanded) {
                    initializeExtendedStateForItemViewState(itemPart);
                }

                setItemPartExpand(itemPart, shouldExpand);
            });
        });
    }
);

const setItemPartExpand = mutatorAction(
    'setItemPartExpand',
    (itemPart: ItemPartViewState, shouldExpand: boolean) => {
        itemPart.isExpanded = shouldExpand;
        itemPart.isFossilizedTextExpanded = shouldExpand;
        itemPart.oofRollUpViewState.isOofRollUpExpanded = shouldExpand;
    }
);
