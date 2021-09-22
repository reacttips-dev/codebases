import findIndexByInstanceKey from 'owa-mail-triage-table-utils/lib/findIndexByInstanceKey';
import onAddOrUpdateRow from './helpers/onAddOrUpdateRow';
import reloadTable from 'owa-mail-triage-table-load-extra/lib/actions/reloadTable';
import removeRowsFromListViewStore from 'owa-mail-actions/lib/triage/removeRowsFromListViewStore';
import tryRemoveItemNormalizedBody from 'owa-mail-actions/lib/table-loading/tryRemoveItemNormalizedBody';
import {
    MailRowDataPropertyGetter,
    MailListRowDataType,
    RowOperation,
    TableView,
    isFolderPaused,
    setRowOperation,
} from 'owa-mail-list-store';
import tombstoneOperations from 'owa-mail-list-tombstone';
import { lazyPrefetchRowInCache } from 'owa-mail-prefetch';
import { mailStore } from 'owa-mail-store';
import conversationCache from 'owa-mail-store/lib//store/conversationCache';
import type ConversationItemParts from 'owa-mail-store/lib/store/schema/ConversationItemParts';
import type { ObservableMap } from 'mobx';
import type { MruCache } from 'owa-mru-cache';
import type Item from 'owa-service/lib/contract/Item';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { action } from 'satcheljs/lib/legacy';
import { preProcessServerRowDeleteNotification } from 'owa-mail-list-response-processor';
import { mutator } from 'satcheljs';
import { RemoveItemSource } from 'owa-mail-actions/lib/triage/tryRemoveFromMailStoreItems';
import {
    isItemHeldByConversationItemParts,
    isItemHeldByItemReadingPane,
} from 'owa-mail-reading-pane-store';
import type * as Schema from 'owa-graph-schema';
import listViewStore from 'owa-mail-list-store/lib/store/Store';
import * as trace from 'owa-trace';

export interface HandleRowNotificationState {
    tableView: TableView;
}

export let handleRowNotification = action('handleRowNotification')(function handleRowNotifications(
    notification: Schema.RowNotificationPayload,
    state: HandleRowNotificationState = { tableView: listViewStore.tableViews.get(notification.id) }
): void {
    const tableView: TableView = state.tableView;
    if (!tableView) {
        // if folder is deleted and we receive a notification, which can happen when
        // there are pending notifications for this folder, we don't handle them and just return
        trace.trace.info('Received row notification for a deleted folder');
        return;
    }
    if (!tableView.isInitialLoadComplete) {
        // Do not process the notifications until the initial table load is complete.
        // We do this because we subscribe to the table notifications first and then
        // issue a findConversation call.
        trace.trace.info('Ignore row notifications as table has not loaded');
        return;
    }
    let rowData: MailListRowDataType;
    switch (notification.EventType) {
        case 'RowAdded':
            rowData = getRowDataFromRowNotification(notification, tableView);
            onAddRow(rowData, tableView);
            break;
        case 'RowModified':
            rowData = getRowDataFromRowNotification(notification, tableView);
            onUpdateRow(rowData, tableView);
            break;
        case 'RowDeleted':
            rowData = getRowDataFromRowNotification(notification, tableView);
            onDeleteRow(rowData, tableView);
            break;
        case 'QueryResultChanged':
        case 'Reload':
            onReload(tableView);
            break;
        default:
            // Ignore other type of notifications
            return;
    }
});

function getRowDataFromRowNotification(
    notification: Schema.RowNotificationPayload,
    tableView: TableView
): MailListRowDataType {
    // Make sure the notification payload has the correct data type
    switch (tableView.tableQuery.listViewType) {
        case ReactListViewType.Conversation:
            if (notification.Conversation) {
                return notification.Conversation as Schema.ConversationType;
            } else {
                trace.errorThatWillCauseAlert(
                    'Conversation should not be undefined or empty in notification payload.' +
                        notification.EventType +
                        ', ' +
                        notification.id
                );
                return null;
            }

        case ReactListViewType.Message:
            if (notification.Item) {
                return notification.Item as Schema.ItemRow;
            } else {
                trace.errorThatWillCauseAlert(
                    'Item should not be undefined or empty in notification payload.' +
                        notification.EventType +
                        ', ' +
                        notification.id
                );
                return null;
            }

        default:
            trace.errorThatWillCauseAlert(
                'rowNotificationStrategy: unsupported listViewType: ' +
                    tableView.tableQuery.listViewType
            );
            return null;
    }
}

/**
 * This class is responsible for handling the notifications.
 * onAddOrUpdateNotification for RowAdd and RowModify notification types
 * onDeleteNotification for RowDelete notification types
 * onReloadNotification for Reload notification type
 */

/**
 * This function handles rowAdd notifications.
 * @param row present in the notification payload
 * @param tableView for which notification has arrived
 * which we will insert the new conversation payload
 */
export let onAddRow = action('rowNotificationHandler.onAddRow')(function onAddRow(
    row: MailListRowDataType,
    tableView: TableView
) {
    // If folder is paused, we are not going to be adding the row so do not increment totalRowsInView count
    // NOTE: if we allow messages to go through (messages from 'VIPs', moving rows from different folders, etc.),
    // this logic will change.
    if (!isFolderPaused(tableView.tableQuery.folderId)) {
        // Increment table size
        tableView.totalRowsInView++;
    }

    // Handle adding the row to store
    onAddOrUpdateRow(row, tableView);
});

/**
 * This function handles rowModified notifications.
 * @param row present in the notification payload
 * @param tableView for which notification has arrived
 * which we will insert the new conversation payload
 */
export let onUpdateRow = action('rowNotificationHandler.onUpdateRow')(function onUpdateRow(
    row: MailListRowDataType,
    tableView: TableView
) {
    // Handle adding the row to store
    onAddOrUpdateRow(row, tableView);
});

/**
 * This function handles RowDeleted notification.
 * @param row present in the notification payload
 * @param tableView for which notification has arrived
 */
export let onDeleteRow = action('rowNotificationHandler.onDeleteRow')(function onDeleteRow(
    row: MailListRowDataType,
    tableView: TableView
) {
    const instanceKey = row.InstanceKey;
    if (!instanceKey) {
        // row being deleted should not have a null instance key
        throw new Error('onDeleteNotification: Row instanceKey should not be null');
    }

    // Decrement total rows in view so we are in sync with the server state
    // This is the total rows that the server has for this table/tablequery
    tableView.totalRowsInView--;

    // Pre-process server row and determine whether to consume it further
    const shouldProcessDelete = preProcessServerRowDeleteNotification(row, tableView);
    if (!shouldProcessDelete) {
        return;
    }

    // Remove the row
    const indexOfElement = findIndexByInstanceKey(instanceKey, tableView);
    if (indexOfElement >= 0) {
        removeRowsFromListViewStore([instanceKey], tableView, 'DeleteNotification');
        setRowOperation(tableView, RowOperation.RowDelete);
    }
});

export interface OnReloadState {
    conversations: MruCache<ConversationItemParts>;
    items: ObservableMap<string, Item>;
}

/**
 * This function handles the reload notifications
 * @param tableView for which the notification has arrived
 * TBD - Revisit the reload table logic - https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/11800
 */
export let onReload = action('rowNotificationHandler.onReload')(function onReload(
    tableView: TableView,
    state: OnReloadState = { conversations: conversationCache, items: mailStore.items }
) {
    clearRowDataUsedByReadingPane(tableView, state);
    // Reload the table
    reloadTable(tableView);
    // Clear all tombstone entries for folder when we get a reload notification. Reload notification generally
    // signals a disconnect between server and client, so we can no longer count on getting the delete notifications
    // to clear the tombstone list
    tombstoneOperations.clearMapForFolder(tableView.serverFolderId);
});

mutator(tryRemoveItemNormalizedBody, actionMessage => {
    const item: Item = actionMessage.item;

    if (
        isItemHeldByConversationItemParts(item.ConversationId.Id, RemoveItemSource.ListViewTable) ||
        isItemHeldByItemReadingPane(item.ItemId.Id, RemoveItemSource.ListViewTable)
    ) {
        // The item reference is currently held, we cannot remove normalized body at this time
        // We don’t need to check listview reference because this is only a listview scenario, i.e reload
        // where we need to remove the NormalizedBody from item
        return;
    }

    // Delete the normalizedBody of the item
    item.NormalizedBody = undefined;
});

function clearRowDataUsedByReadingPane(tableView: TableView, state: OnReloadState) {
    const listViewType = tableView.tableQuery.listViewType;
    switch (listViewType) {
        case ReactListViewType.Conversation:
            // On reloads our cached conversations in the MRU cache would be in a stale state.
            // As we do not keep all the conversations in sync on reloads there are chances
            // that reading pane would show the stale conversation from the MRU cache.
            // We should therefore clear the MRU conversation cache whenever a reload happens.
            state.conversations.clear();

            // The cache might still hold on to the conversations that are being referenced.
            // In that case we should try to prefetch them.
            // E.g: If user was viewing an item in reading pane when this happened,
            // that item will not be purged (cleared) and we would want to prefetch it.
            const remainingItemsInMRUCache = state.conversations.getItemIds();
            for (let i = 0, len = remainingItemsInMRUCache.length; i < len; i++) {
                const conversationId = remainingItemsInMRUCache[i];
                // when reload happens in the middle of a user delete action, the item may have already been deleted
                // from the mail store before reading pane has updated its view state, which holds a ref to the item in cache.
                // the repro we've seen is when deleting the one and only email in a folder
                if (state.conversations.has(conversationId)) {
                    const conversationItemParts = state.conversations.get(conversationId);
                    lazyPrefetchRowInCache.importAndExecute(
                        conversationItemParts.conversationId,
                        tableView
                    );
                }
            }
            break;

        case ReactListViewType.Message:
            for (const rowKey of tableView.rowKeys) {
                const rowId = MailRowDataPropertyGetter.getRowClientItemId(rowKey, tableView);
                const item = state.items.get(rowId.Id);
                tryRemoveItemNormalizedBody(item);

                // After we tried to remove normalized body, it might still exist in the cache because it’s held by RP,
                // we need to refresh the item to get refresh data
                if (state.items.get(rowId.Id).NormalizedBody) {
                    lazyPrefetchRowInCache.importAndExecute(rowId, tableView);
                }
            }
            break;
    }
}
