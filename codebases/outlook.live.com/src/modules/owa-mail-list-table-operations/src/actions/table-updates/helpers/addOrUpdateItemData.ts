import mapItemTypeToItemRelation from '../../store-factory/mapItemTypeToItemRelation';
import type { ObservableMap } from 'mobx';
import { shouldShowAttachmentPreviewsForItem } from 'owa-mail-attachment-previews';
import { getValidCouponIndexesForItem } from 'owa-mail-coupon-peek';
import {
    TableQueryType,
    TableView,
    listViewStore,
    MailFolderTableQuery,
} from 'owa-mail-list-store';
import type TableViewItemRelation from 'owa-mail-list-store/lib/store/schema/TableViewItemRelation';
import getTableToRowRelationKey from 'owa-mail-list-store/lib/utils/getTableToRowRelationKey';
import { getMailboxInfo } from 'owa-mail-mailboxinfo';
import { ClientItem, mailStore } from 'owa-mail-store';
import getShouldShowRSVPForItemAndPrepareItem from 'owa-listview-rsvp/lib/utils/getShouldShowRSVPForItemAndPrepareItem';
import type { ItemRow } from 'owa-graph-schema';
import type Message from 'owa-service/lib/contract/Message';
import { getUserConfiguration } from 'owa-session-store';
import * as trace from 'owa-trace';
import { action } from 'satcheljs/lib/legacy';
import getShouldShowTxpForRowAndPrepareTxpItem from 'owa-listview-txp/lib/utils/getShouldShowTxpForRowAndPrepareTxpItem';

export interface AddOrUpdateItemDataState {
    items: ObservableMap<string, ClientItem>;
    tableViewItemRelations: ObservableMap<string, TableViewItemRelation>;
}

function partialUpdateItem(itemToUpdate: ClientItem, item: ClientItem, tableView: TableView) {
    const isImportantFilter =
        (tableView?.tableQuery as MailFolderTableQuery)?.scenarioType == 'spotlight';

    /**
     * Skip property updates in this block if table is a search table or
     * represents the "Important" filter view because these items are fetched
     * from 3S APIs and do not include these properties in the response.
     */
    if (tableView.tableQuery.type !== TableQueryType.Search && !isImportantFilter) {
        itemToUpdate.ReceivedOrRenewTime = item.ReceivedOrRenewTime;
        itemToUpdate.validCouponIndexes = item.validCouponIndexes;
        itemToUpdate.shouldShowRSVP = item.shouldShowRSVP;
        itemToUpdate.shouldShowTxpButton = item.shouldShowTxpButton;
    }

    // Common partial update
    itemToUpdate.Subject = item.Subject;
    itemToUpdate.Importance = item.Importance;
    itemToUpdate.Sensitivity = item.Sensitivity;
    itemToUpdate.HasAttachments = item.HasAttachments;
    itemToUpdate.ItemClass = item.ItemClass;
    itemToUpdate.Flag = item.Flag;
    itemToUpdate.Categories = item.Categories;
    itemToUpdate.SystemCategories = item.SystemCategories;
    itemToUpdate.SpotlightIsVisible = item.SpotlightIsVisible;

    // Mail folder specific updates
    itemToUpdate.ParentFolderId = item.ParentFolderId;
    itemToUpdate.ConversationId = item.ConversationId;
    itemToUpdate.DateTimeReceived = item.DateTimeReceived;
    itemToUpdate.IsDraft = item.IsDraft;
    itemToUpdate.Size = item.Size;
    itemToUpdate.Preview = item.Preview;
    itemToUpdate.DisplayTo = item.DisplayTo;
    itemToUpdate.IconIndex = item.IconIndex;
    itemToUpdate.shouldShowAttachmentPreviews = item.shouldShowAttachmentPreviews;

    // Only update return time if item provides value
    if (!!item.ReturnTime) {
        itemToUpdate.ReturnTime = item.ReturnTime;
    }

    if (!!item.HasProcessedSharepointLink) {
        itemToUpdate.HasProcessedSharepointLink = item.HasProcessedSharepointLink;
    }

    // Message specific updates
    if (
        !itemToUpdate?.ItemClass || // server treats undefined or null ItemClass as a Message type by default
        itemToUpdate.ItemClass.indexOf('IPM.Schedule.Meeting') !== -1 || // Meeting request messages
        itemToUpdate.ItemClass.indexOf('IPM.Note') !== -1 // Normal messages
    ) {
        const messageToUpdate = itemToUpdate as Message;
        const message = item as Message;

        messageToUpdate.IsRead = message.IsRead;

        if (tableView.tableQuery.type !== TableQueryType.Search) {
            // Skip updating the following properties in search as they're not returned
            messageToUpdate.IsReadReceiptRequested = message.IsReadReceiptRequested;
            messageToUpdate.IsDeliveryReceiptRequested = message.IsDeliveryReceiptRequested;
        }
    }
}

/**
 * Adds or updates the item in the mail store
 * This is called whenever a data is fetched from the server and is being stored. This is also called when
 * a rowAdd or rowModified notification occurs
 * @param item to add or update
 * @param tableView where to add or update the item
 * @param state for unit testing
 */
export default action('addOrUpdateItemData')(function addOrUpdateItemData(
    serviceItem: ItemRow,
    tableView: TableView,
    state: AddOrUpdateItemDataState = {
        items: mailStore.items,
        tableViewItemRelations: listViewStore.tableViewItemRelations,
    }
) {
    const itemId = serviceItem.ItemId.Id;
    const clientItemToMerge = <ClientItem>{
        ...serviceItem,
        MailboxInfo: getMailboxInfo(tableView),
        validCouponIndexes: getValidCouponIndexesForItem(serviceItem, tableView.tableQuery),
        shouldShowAttachmentPreviews:
            getUserConfiguration().UserOptions.ShowInlinePreviews &&
            shouldShowAttachmentPreviewsForItem(serviceItem, tableView.tableQuery),
        shouldShowRSVP: getShouldShowRSVPForItemAndPrepareItem(serviceItem, tableView),
        shouldShowTxpButton: getShouldShowTxpForRowAndPrepareTxpItem(
            serviceItem.EntityNamesMap,
            serviceItem.InstanceKey,
            serviceItem.ItemId.Id,
            tableView
        ),
    };
    if (state.items.has(itemId)) {
        // If the item is in the cache, partial update it with the new properties
        const itemInCache = state.items.get(itemId);
        partialUpdateItem(itemInCache, clientItemToMerge, tableView);
    } else {
        // Otherwise add it to the item cache
        state.items.set(itemId, clientItemToMerge);
        // There is a server-side issue where FindItem is not sending conversationId for certain items
        // that are part of long conversations that have more than 100 messages.
        if (!clientItemToMerge.ConversationId) {
            trace.errorThatWillCauseAlert('addOrUpdateItemData: item.ConversationId is null.');
        }
    }
    const tableItemRelationKey = getTableToRowRelationKey(serviceItem.InstanceKey, tableView.id);
    // Create or update the relation object
    const newRelation = mapItemTypeToItemRelation(serviceItem, tableView);
    state.tableViewItemRelations.set(tableItemRelationKey, newRelation);
});
