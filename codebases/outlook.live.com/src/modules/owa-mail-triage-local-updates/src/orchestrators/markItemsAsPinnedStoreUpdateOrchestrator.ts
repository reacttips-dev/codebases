import markRowsPinnedInListViewStore from '../actions/markRowsPinnedInListViewStore';
import markItemsAsPinnedStoreUpdate from 'owa-mail-actions/lib/triage/markItemsAsPinnedStoreUpdate';
import { getTableItemRelation } from 'owa-mail-list-store';
import { getLocalPinnedTimeStamp } from 'owa-mail-list-store/lib/utils/pinningUtils';
import { mailStore } from 'owa-mail-store';
import { createLazyOrchestrator } from 'owa-bundling';
import { mutatorAction } from 'satcheljs';

export default createLazyOrchestrator(
    markItemsAsPinnedStoreUpdate,
    'clone_markItemsAsPinnedStoreUpdate',
    actionMessage => {
        const { rowKeys, tableViewId, shouldMarkAsPinned } = actionMessage;
        markRowsPinnedInListViewStore(
            rowKeys,
            tableViewId,
            shouldMarkAsPinned,
            updateRenewTimeOnItem
        );
    }
);

/**
 * Delegate that updates the ReceivedOrRenewTime on the item
 * @param rowKey to pin/unpin
 * @param tableViewId that the row belongs to
 * @param shouldMarkAsPinned the pin value to be set
 */
const updateRenewTimeOnItem = mutatorAction(
    'updateRenewTimeOnItem',
    (rowKey: string, tableViewId: string, shouldMarkAsPinned: boolean) => {
        const itemRelation = getTableItemRelation(rowKey, tableViewId);
        if (!itemRelation) {
            // Item relation might not exist when processing row notifications, i.e. notification that indicates
            // an old item was pinned from other client, and it is not loaded on the current client
            return;
        }

        const item = mailStore.items.get(itemRelation.clientId.Id);

        // If this is unpin action set the ReceivedOrRenewTime to DateTimeReceived
        if (!shouldMarkAsPinned) {
            item.ReceivedOrRenewTime = item.DateTimeReceived;
            return;
        }

        // If this is pin action, we need to convert the utc pinned time to local time,
        // as server always returns the local time.
        const localPinnedTimeStamp = getLocalPinnedTimeStamp();
        if (localPinnedTimeStamp) {
            item.ReceivedOrRenewTime = localPinnedTimeStamp;
        }
    }
);
