import markRowsPinnedInListViewStore from '../actions/markRowsPinnedInListViewStore';
import { createLazyOrchestrator } from 'owa-bundling';
import markConversationsAsPinnedStoreUpdate from 'owa-mail-actions/lib/triage/markConversationsAsPinnedStoreUpdate';
import getTableConversationRelation from 'owa-mail-list-store/lib/utils/getTableConversationRelation';
import { getLocalPinnedTimeStamp } from 'owa-mail-list-store/lib/utils/pinningUtils';
import { mutatorAction } from 'satcheljs';

export default createLazyOrchestrator(
    markConversationsAsPinnedStoreUpdate,
    'clone_markConversationsAsPinnedStoreUpdate',
    actionMessage => {
        const { rowKeys, tableViewId, shouldMarkAsPinned } = actionMessage;
        markRowsPinnedInListViewStore(
            rowKeys,
            tableViewId,
            shouldMarkAsPinned,
            updateRenewTimeOnConversation
        );
    }
);

const updateRenewTimeOnConversation = mutatorAction(
    'updateRenewTimeOnConversation',
    (rowKey: string, tableViewId: string, shouldMarkAsPinned: boolean) => {
        const tableConversationRelation = getTableConversationRelation(rowKey, tableViewId);

        if (!tableConversationRelation) {
            return;
        }

        // If this is unpin action set the lastDeliveryOrRenewTime to lastDeliveryTime
        if (!shouldMarkAsPinned) {
            tableConversationRelation.lastDeliveryOrRenewTimeStamp =
                tableConversationRelation.lastDeliveryTimeStamp;
            return;
        }

        // If this is pin action, we need to convert the utc pinned time to local time,
        // as server always returns the local time.
        const localPinnedTimeStamp = getLocalPinnedTimeStamp();
        if (localPinnedTimeStamp) {
            tableConversationRelation.lastDeliveryOrRenewTimeStamp = localPinnedTimeStamp;
        }
    }
);
