import { TableView, MailRowDataPropertyGetter, isConversationView } from 'owa-mail-list-store';
import { isItemRepliedOrForwarded } from './isItemRepliedOrForwarded';
import { logNudgeDiscarded } from './logNudgeDiscarded';
import type Item from 'owa-service/lib/contract/Item';
import { getStore as getMailStore } from 'owa-mail-store/lib/store/Store';
import { NudgedReason } from 'owa-mail-nudge-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

/**
 * Determines whether the nudge is erroneous nudge, i.e. if it has already been replied to or forwarded.
 * @param nudgeItemId Nudge item id
 * @param tableView tableView
 * @param nudgedRowKey rowKey of the nudge row
 * @returns Invalid nudge reason. null means nudge is valid
 */
export function validateExistingRowAsNudge(
    nudgeItemId: string,
    nudgeConversationId: string,
    correlationId: string,
    tableView: TableView,
    isInboxTable: boolean,
    nudgedRowKey: string,
    source: string,
    shouldLogDatapoint: boolean = true,
    nudgeItemTime: string,
    reason: NudgedReason
): string {
    let nudgeDiscardReason;
    let latestGlobalItemId;

    if (MailRowDataPropertyGetter.getIsPinned(nudgedRowKey, tableView)) {
        nudgeDiscardReason = 'RowPinned';
    }

    // For conversations, the nudge is valid, if the nudge item id is not the latest item id and
    // the latest item id is not the draft
    const isConversationListViewType = isConversationView(tableView);
    const lastDeliveryTime = MailRowDataPropertyGetter.getLastDeliveryOrRenewTimeStamp(
        nudgedRowKey,
        tableView
    );

    if (!nudgeDiscardReason && isConversationListViewType) {
        latestGlobalItemId = MailRowDataPropertyGetter.getLatestGlobalItemId(
            nudgedRowKey,
            tableView
        );
        const draftItemIds = MailRowDataPropertyGetter.getDraftItemIds(nudgedRowKey, tableView);
        if (
            nudgedRowKey &&
            draftItemIds.indexOf(latestGlobalItemId) == -1 &&
            latestGlobalItemId != nudgeItemId
        ) {
            const conversationLastDeliveryTime = new Date(lastDeliveryTime);
            const nudgeItemLastDeliveryTime = new Date(nudgeItemTime);
            const isNudgeFromSameTable = isInboxTable
                ? reason == NudgedReason.ReceivedDaysAgo
                : reason == NudgedReason.ReceivedDaysAgo;
            if (
                isNudgeFromSameTable &&
                conversationLastDeliveryTime.getTime() < nudgeItemLastDeliveryTime.getTime()
            ) {
                nudgeDiscardReason = 'ItemNotUpToDate';
            } else if (
                !isFeatureEnabled('fwk-immutable-ids') ||
                isHostAppFeatureEnabled('nativeResolvers')
            ) {
                // Currently there is an outstanding bug being fixed. The bug is that when the immutableId flight is turned ON, the
                // web notifications are still returning entry ids in the globalItemIds and itemIds collections
                // in the conversation. Till that bug is fixed we shall not remove the nudge row upon notifications.
                // In native, we will not have this issue
                nudgeDiscardReason = 'NotLatestItemInRow';
            }
        }
    } else {
        // For items we check item properties
        const cachedItem = getMailStore().items.get(nudgeItemId);
        if (cachedItem && isItemRepliedOrForwarded(cachedItem as Item)) {
            nudgeDiscardReason = 'NotLatestItemInRow';
        }
    }

    if (nudgeDiscardReason) {
        if (shouldLogDatapoint) {
            logNudgeDiscarded(
                nudgeDiscardReason,
                nudgeItemId,
                nudgeConversationId,
                correlationId,
                isConversationListViewType,
                false, // isNudgeFromOtherTable,
                isInboxTable,
                lastDeliveryTime,
                source,
                latestGlobalItemId,
                nudgeItemTime
            );
        }
        return nudgeDiscardReason;
    }

    return null;
}
