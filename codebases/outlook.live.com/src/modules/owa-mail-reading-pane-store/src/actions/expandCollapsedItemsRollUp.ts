import { getCountBucket } from '../datapoints';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import { addDatapointConfig } from 'owa-analytics-actions';
import { action, mutator } from 'satcheljs';
import { getItemsCountInCollapsedItemsRollUp } from '../utils/rollUp/collapsedItemsRollUpUtils';

const expandCollapsedItemsRollUp = action('expandCollapsedItemsRollUp', (
    viewState: ConversationReadingPaneViewState,
    isAuto: boolean = false // This is used to track whether this expand is triggered by users action or auto expand
) =>
    addDatapointConfig(
        {
            name: 'RPCountExpCollItemsRollUp',
            customData: [getCountBucket(getItemsCountInCollapsedItemsRollUp(viewState)), isAuto],
        },
        { viewState }
    )
);

mutator(expandCollapsedItemsRollUp, ({ viewState }) => {
    viewState.conversationNodeIdsInCollapsedItemsRollUp = [];
});

export { expandCollapsedItemsRollUp as default };
