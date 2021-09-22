import type { ClientItemId } from 'owa-client-ids';
import { shouldShowAttachmentPreviewsForConversation } from 'owa-mail-attachment-previews';
import { getValidCouponIndexesForConversation } from 'owa-mail-coupon-peek';
import type { TableView } from 'owa-mail-list-store';
import type ConversationItem from 'owa-mail-list-store/lib/store/schema/ConversationItem';
import { getMailboxInfo } from 'owa-mail-mailboxinfo';
import type { ConversationType } from 'owa-graph-schema';
import type BaseItemId from 'owa-service/lib/contract/BaseItemId';
import type ItemId from 'owa-service/lib/contract/ItemId';
import { getUserConfiguration } from 'owa-session-store';
import getShouldShowTxpForRowAndPrepareTxpItem from 'owa-listview-txp/lib/utils/getShouldShowTxpForRowAndPrepareTxpItem';

function mapBaseItemIdsToItemIds(baseItemIds: BaseItemId[]): string[] {
    const itemIds: string[] = [];
    for (const baseItemId of baseItemIds) {
        const itemId: ItemId = <ItemId>{ ...baseItemId };
        itemIds.push(itemId.Id);
    }
    return itemIds;
}

//TODO: 22724 itemId should be ClientItemId so we don't need this function to get mailboxInfo
function getConversationClientId(
    conversationType: ConversationType,
    tableView: TableView
): ClientItemId {
    return { Id: conversationType.ConversationId.Id, mailboxInfo: getMailboxInfo(tableView) };
}

export default function mapConversationTypeToConversationItem(
    conversationType: ConversationType,
    tableView: TableView
): ConversationItem {
    const itemIds = mapBaseItemIdsToItemIds(conversationType.GlobalItemIds);
    const latestItemId = (conversationType.ItemIds[0] as ItemId).Id;
    const conversationItem: ConversationItem = {
        id: conversationType.ConversationId.Id,
        subject: conversationType.ConversationTopic,
        globalItemIds: itemIds,
        shouldShowAttachmentPreviews:
            getUserConfiguration().UserOptions.ShowInlinePreviews &&
            shouldShowAttachmentPreviewsForConversation(conversationType, tableView.tableQuery),
        validCouponIndexes: getValidCouponIndexesForConversation(
            conversationType,
            tableView.tableQuery
        ),
        globalUnreadCount: conversationType.GlobalUnreadCount,
        size: conversationType.Size,
        clientId: getConversationClientId(conversationType, tableView),
        globalMessageCount: conversationType.GlobalMessageCount,
        shouldShowTxpButton: getShouldShowTxpForRowAndPrepareTxpItem(
            conversationType.EntityNamesMap,
            conversationType.InstanceKey,
            latestItemId,
            tableView
        ),
        hasExternalEmails: conversationType.HasExternalEmails,
        hasSharepointLink: conversationType.HasProcessedSharepointLink,
    };

    return conversationItem;
}
