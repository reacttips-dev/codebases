import {
    MailListRowDataType,
    MailRowDataPropertyGetter,
    TableView,
    isItemOfMessageType,
    canTableBeOutOfSyncWithServer,
    isConversationView,
} from 'owa-mail-list-store';
import { TombstoneReasonType } from 'owa-mail-list-tombstone';
import type { ConversationType, ItemRow } from 'owa-graph-schema';
import type Message from 'owa-service/lib/contract/Message';

import arrayEquals from 'array-equal';

/**
 * Property sync map that stores the tombstone reason type to sync functions
 */
let clientToServerPropertySyncMap = new Map<
    TombstoneReasonType,
    (serverRow: MailListRowDataType, tableView: TableView) => boolean
>();

clientToServerPropertySyncMap[TombstoneReasonType.Pin] = syncClientPinPropertyToServerRow;
clientToServerPropertySyncMap[TombstoneReasonType.Category] = syncClientCategoryPropertyToServerRow;
clientToServerPropertySyncMap[TombstoneReasonType.Read] = syncClientReadPropertyToServerRow;

// No/Op for Meeting removes. This is just a way to signal the LV to not load info for same meeting events in the same conversation
clientToServerPropertySyncMap[TombstoneReasonType.MeetingRemove] = function () {};

/**
 * Syncs the client (local) PIN property by stamping it on the server row payload
 * @param serverRow row payload from server
 * @param tableView tableView to which the row belongs
 * @returns flag indicating whether the pin operation property value was already in sync
 */
function syncClientPinPropertyToServerRow(
    serverRow: MailListRowDataType,
    tableView: TableView
): boolean {
    let serverPinPropertyValue;
    const isConversationListViewType = isConversationView(tableView);

    if (isConversationListViewType) {
        serverPinPropertyValue = (serverRow as ConversationType).LastDeliveryOrRenewTime;
    } else {
        serverPinPropertyValue = (serverRow as ItemRow).ReceivedOrRenewTime;
    }

    const clientPinPropertyValue = MailRowDataPropertyGetter.getLastDeliveryOrRenewTimeStamp(
        serverRow.InstanceKey,
        tableView
    );

    const isPinPropertyInSync =
        new Date(serverPinPropertyValue).toString() === new Date(clientPinPropertyValue).toString();

    if (!isPinPropertyInSync) {
        if (isConversationListViewType) {
            (serverRow as ConversationType).LastDeliveryOrRenewTime = clientPinPropertyValue;
        } else {
            (serverRow as ItemRow).ReceivedOrRenewTime = clientPinPropertyValue;
        }
    }

    return isPinPropertyInSync;
}

/**
 * Syncs the client (local) ReceivedTime property by stamping it on the server row payload
 * only for conversation type rows. This is used for a special scenario to sync the time property
 * for update notifications happening in out-of-sync tables
 * @param serverRow row payload from server
 * @param tableView tableView to which the row belongs
 */
function syncClientReceivedTimeToServerConversationRow(
    serverRow: MailListRowDataType,
    tableView: TableView
) {
    const conversationRow = serverRow as ConversationType;
    const serverReceivedTime = conversationRow.LastDeliveryTime;
    const clientReceivedTime = MailRowDataPropertyGetter.getLastDeliveryTimeStamp(
        serverRow.InstanceKey,
        tableView
    );

    const isReceivedTimeInSync =
        new Date(serverReceivedTime).toString() === new Date(clientReceivedTime).toString();

    if (!isReceivedTimeInSync) {
        conversationRow.LastDeliveryTime = clientReceivedTime;
    }
}

/**
 * Syncs the client (local) CATEGORY property by stamping it on the server row payload
 * @param serverRow row payload from server
 * @param tableView tableView to which the row belongs
 * @returns flag indicating whether the category property value was already in sync
 */
function syncClientCategoryPropertyToServerRow(
    serverRow: MailListRowDataType,
    tableView: TableView
): boolean {
    const clientCategories = MailRowDataPropertyGetter.getCategories(
        serverRow.InstanceKey,
        tableView
    );
    const clientCategoriesSorted = clientCategories ? clientCategories.slice().sort() : [];
    const serverCategoriesSorted = serverRow.Categories ? serverRow.Categories.slice().sort() : [];
    const isCategoryPropertyInSync = arrayEquals(clientCategoriesSorted, serverCategoriesSorted);

    if (!isCategoryPropertyInSync) {
        serverRow.Categories = clientCategories;
    }

    return isCategoryPropertyInSync;
}

/**
 * Syncs the client (local) READ property by stamping it on the server row payload
 * @param serverRow row payload from server
 * @param tableView tableView to which the row belongs
 * @returns flag indicating whether the read property value was already in sync
 */
function syncClientReadPropertyToServerRow(
    serverRow: MailListRowDataType,
    tableView: TableView
): boolean {
    let payloadRow;
    let payloadUnreadCount;
    let isReadPropertyInSync;

    const clientUnreadCount = MailRowDataPropertyGetter.getUnreadCount(
        serverRow.InstanceKey,
        tableView
    );

    const isConversationListViewType = isConversationView(tableView);

    if (isConversationListViewType) {
        payloadRow = serverRow as ConversationType;
        payloadUnreadCount = payloadRow.UnreadCount;
        isReadPropertyInSync = clientUnreadCount == payloadUnreadCount;
        if (!isReadPropertyInSync) {
            payloadRow.UnreadCount = clientUnreadCount;
        }

        /**
         * If this is a table that can be out of sync with the server
         * (currently only the unread filter table can be out of sync when server setting
         * for keep read item in unread view is enabled) we could get update notifications
         * for large conversations as unread count is gradually decreasing. In this case
         * only syncing the Read value is not enough as the row can move in the view
         * as the new local timestamp property will be that of the latest unread item in the conversation
         * which is changing with each notification. So we would also sync the time based properties
         * that matter for the sorting. For non date sorted tables, this is still required as other wise
         * the timestamps shall flip which also can cause flickers.
         */
        if (canTableBeOutOfSyncWithServer(tableView)) {
            syncClientReceivedTimeToServerConversationRow(serverRow, tableView);
            syncClientPinPropertyToServerRow(serverRow, tableView);
        }
    } else {
        // For non-message types we shall not sync anything
        if (isItemOfMessageType(serverRow)) {
            payloadRow = serverRow as Message;
            payloadUnreadCount = payloadRow.IsRead ? 0 : 1;
            isReadPropertyInSync = clientUnreadCount == payloadUnreadCount;

            if (!isReadPropertyInSync) {
                payloadRow.IsRead = clientUnreadCount == 0;
            }
        } else {
            isReadPropertyInSync = true;
        }
    }

    return isReadPropertyInSync;
}

/**
 * Syncs client triage property for the given triage operation in the server row payload
 * @param serverRow row payload from server
 * @param tableView tableView to which the row belongs
 * @param tombstoneReason type of tombstone reason used to determine which property to sync
 * @returns flag indicating whether the triage property for given tombstone reason is in sync
 */
export default function syncClientPropertyToServerRow(
    serverRow: MailListRowDataType,
    tableView: TableView,
    tombstoneReason: TombstoneReasonType
): boolean {
    const syncFunctionForTombstoneReason = clientToServerPropertySyncMap[tombstoneReason];
    return syncFunctionForTombstoneReason(serverRow, tableView);
}
