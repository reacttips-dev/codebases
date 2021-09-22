import expandCollapsedItemsRollUp from './expandCollapsedItemsRollUp';
import datapoints from '../datapoints';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import { hasCollapsedItemsRollUp } from '../utils/rollUp/collapsedItemsRollUpUtils';
import { returnTopExecutingActionDatapoint, wrapFunctionForDatapoint } from 'owa-analytics';
import type { ClientItemId } from 'owa-client-ids';
import { lazyLoadConversation, LOAD_MORE_INCREMENT } from 'owa-mail-store-actions';
import mailStore from 'owa-mail-store/lib/store/Store';
import truncateCountForDataPointAggregation from 'owa-mail-store/lib/utils/truncateCountForDataPointAggregation';
import { mutatorAction } from 'satcheljs';

export default wrapFunctionForDatapoint(
    datapoints.RPCountLoadMore,
    function loadMore(conversationId: ClientItemId): Promise<void> {
        if (conversationId && mailStore.conversations.has(conversationId.Id)) {
            updateConversationItemParts(conversationId);

            // Calculate how many times the user has clicked "loadMore" for this conversation.
            const dataPoint = returnTopExecutingActionDatapoint();
            if (dataPoint) {
                // Null check for tests.
                dataPoint.addCustomData([
                    getLoadMoreIteration(
                        mailStore.conversations.get(conversationId.Id).maxItemsToReturn
                    ),
                ]);
            }
            // Expand the collapsed items roll up if it's existed.
            // This is the case when user clicks "load more" from the list view expanded item list
            const conversationReadingPaneViewState = getConversationReadingPaneViewState(
                conversationId.Id
            );
            if (hasCollapsedItemsRollUp(conversationReadingPaneViewState)) {
                expandCollapsedItemsRollUp(conversationReadingPaneViewState, true /*isAuto*/);
            }
            return lazyLoadConversation.importAndExecute(conversationId, 'LoadMore');
        }
        return Promise.resolve();
    }
);

const updateConversationItemParts = mutatorAction(
    'updateConversationItemParts',
    (conversationId: ClientItemId) => {
        const conversationItemParts = mailStore.conversations.get(conversationId.Id);
        conversationItemParts.isLoadMoreInProgress = true;
        conversationItemParts.maxItemsToReturn =
            conversationItemParts.maxItemsToReturn + LOAD_MORE_INCREMENT;
        conversationItemParts.syncState = '';
    }
);

function getLoadMoreIteration(maxItemsToReturn: number): number {
    // Ex: maxItemsToReturn = 40. (40-20)/10 = 2. This is the second time the user has clicked load more.
    // The ceil function should be unnecessary. It's a precaution so future changes don't put us over the 24 unique value count mentioned below.
    const iteration = Math.ceil((maxItemsToReturn - 20) / 10);

    // For datapoint aggregation in azure we can only have 24 unique possible values for any custom data key.
    // Accounting for 0, bucket all values >=23 as "23".
    return truncateCountForDataPointAggregation(iteration);
}
