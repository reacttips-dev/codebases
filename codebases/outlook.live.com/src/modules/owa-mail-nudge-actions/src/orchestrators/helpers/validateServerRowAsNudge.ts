import { TableView, MailListRowDataType, getIsPinnedTimestamp } from 'owa-mail-list-store';
import { isItemRepliedOrForwarded } from './isItemRepliedOrForwarded';
import type { ConversationType } from 'owa-graph-schema';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type Item from 'owa-service/lib/contract/Item';
import { logNudgeDiscarded } from './logNudgeDiscarded';

/**
 * Determines whether the nudge is erroneous nudge, i.e. if it has already been replied to or forwarded.
 * @param serverRow server row payload
 * @param nudgeItemId Nudge item id
 * @param isConversationListViewType if the row belongs to the conversation view list view
 * @param tableView tableView
 * @param isNudgeFromOtherTable indicates whether the nudge row is from different folder than where the nudge is being shown
 * @returns Invalid nudge reason. null means nudge is valid
 */
export function validateServerRowAsNudge(
    serverRow: MailListRowDataType,
    nudgeItemId: string,
    nudgeConversationId: string,
    correlationId: string,
    isConversationListViewType: boolean,
    tableView: TableView,
    isInboxTable: boolean,
    isNudgeFromOtherTable: boolean,
    source: string,
    nudgeItemTime: string
): string {
    let nudgeDiscardReason;
    let latestGlobalItemId;

    // Discard if we did not find the row.
    // This means that the row has already been moved to a different folder and still received as nudge
    // or this is a nudge from different folder
    if (!serverRow) {
        if (isNudgeFromOtherTable) {
            nudgeDiscardReason = 'ItemFromOtherTable';
        } else {
            nudgeDiscardReason = 'RowNotFound';
        }
    }

    // Discard if the row was pinned
    if (!nudgeDiscardReason) {
        let serverPinPropertyValue;
        if (isConversationListViewType) {
            serverPinPropertyValue = (serverRow as ConversationType).LastDeliveryOrRenewTime;
        } else {
            serverPinPropertyValue = (serverRow as Item).ReceivedOrRenewTime;
        }

        if (getIsPinnedTimestamp(serverPinPropertyValue)) {
            nudgeDiscardReason = 'RowPinned';
        }
    }

    let lastDeliveryTime;

    // Discard if the row was already replied to or forwarded
    if (!nudgeDiscardReason) {
        // Conversation View
        if (isConversationListViewType) {
            // The way this is determined is by comparing the nudge item id with the latest global item id in the conversation.
            const conversation = serverRow as ConversationType;
            lastDeliveryTime = conversation.LastDeliveryOrRenewTime;
            latestGlobalItemId = (conversation.GlobalItemIds[0] as ItemId).Id;
            const draftItemIds = conversation.DraftItemIds || [];
            const latestItemInDrafts = draftItemIds.filter(draftItemId => {
                return (draftItemId as ItemId).Id == latestGlobalItemId;
            });

            if (latestItemInDrafts.length == 0 && latestGlobalItemId != nudgeItemId) {
                const conversationLastDeliveryTime = new Date(lastDeliveryTime);
                const nudgeItemLastDeliveryTime = new Date(nudgeItemTime);

                if (conversationLastDeliveryTime.getTime() < nudgeItemLastDeliveryTime.getTime()) {
                    nudgeDiscardReason = 'ItemNotUpToDate';
                } else {
                    nudgeDiscardReason = 'NotLatestItemInRow';
                }
            }
        } else {
            const item = serverRow as Item;
            lastDeliveryTime = item.ReceivedOrRenewTime;

            // Item View
            if (isItemRepliedOrForwarded(item)) {
                nudgeDiscardReason = 'NotLatestItemInRow';
            } else if (item.ParentFolderId?.Id != tableView.tableQuery.folderId) {
                nudgeDiscardReason = 'ItemFromOtherTable';
            }
        }
    }

    if (nudgeDiscardReason) {
        logNudgeDiscarded(
            nudgeDiscardReason,
            nudgeItemId,
            nudgeConversationId,
            correlationId,
            isConversationListViewType,
            isNudgeFromOtherTable,
            isInboxTable,
            lastDeliveryTime,
            source,
            latestGlobalItemId,
            nudgeItemTime
        );
        return nudgeDiscardReason;
    }

    return null;
}
