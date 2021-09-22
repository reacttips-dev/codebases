import { getStore as getListViewStore } from '../store/Store';
import { TableQueryType } from '../store/schema/TableQuery';
import type TableView from '../store/schema/TableView';
import getTableConversationRelation from '../utils/getTableConversationRelation';
import getTableItemRelation from '../utils/getTableItemRelation';
import isItemOfMessageType from '../utils/isItemOfMessageType';
import * as pinningUtils from '../utils/pinningUtils';
import { returnTopExecutingActionDatapoint, logUsage } from 'owa-analytics';
import type { ClientItemId } from 'owa-client-ids';
import selectConversationById from './selectConversationById';
import { mailStore, ClientItem } from 'owa-mail-store';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import type BaseItem from 'owa-mail-store/lib/store/schema/BaseItem';
import { isFirstLevelExpanded } from './isConversationExpanded';
import getItemIdForMailList from 'owa-mail-store/lib/selectors/getItemIdForMailList';
import { getItemToShowFromNodeId } from 'owa-mail-store/lib/utils/conversationsUtils';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type ExecuteSearchSortOrder from 'owa-service/lib/contract/ExecuteSearchSortOrder';
import type FlagStatus from 'owa-service/lib/contract/FlagStatus';
import type FlagType from 'owa-service/lib/contract/FlagType';
import type Message from 'owa-service/lib/contract/Message';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import type RetentionTagType from 'owa-service/lib/contract/RetentionTagType';
import { trace } from 'owa-trace';

import {
    getIsTableConversationRelationSnoozed,
    getIsTableItemDataSnoozed,
} from '../utils/snoozeUtils';

export const enum MailRowDataPropertyType {
    ArchiveTag,
    CanDelete,
    Categories,
    ConversationId,
    DraftItemIds,
    EffectiveMentioned,
    ExecuteSearchSortOrder,
    FlagType,
    FlagStatus,
    GlobalItemIds,
    LatestGlobalItemId,
    Importance,
    InstrumentationContext,
    IsDraft,
    IsPinned,
    IsSnoozed,
    IsSubmitted,
    Item,
    ItemIds,
    LastDeliveryOrRenewTimeStamp,
    LastDeliveryTimeStamp,
    LastModifiedTimeStamp,
    LastSenderMailbox,
    LastSenderSMTP,
    ParentFolderId,
    PolicyTag,
    RowClientItemId,
    RowIdToShowInReadingPane,
    RowIdString,
    Size,
    Subject,
    UniqueSenders,
    UnreadCount,
    ValidCouponIndexes,
}

/**
 * Get canDelete for a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return boolean for canDelete
 */
export function getCanDelete(rowKey: string, tableView: TableView): boolean {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.CanDelete) as boolean;
}

/**
 * Get categories for a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return a collection of categories
 */
export function getCategories(rowKey: string, tableView: TableView): string[] {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.Categories) as string[];
}

/**
 * Get conversation id for a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return a collection of categories
 */
export function getConversationId(rowKey: string, tableView: TableView): string {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.ConversationId) as string;
}

/**
 * Get if a row is pinned
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return true if a row is pinned, false otherwise
 */
export function getIsPinned(rowKey: string, tableView: TableView): boolean {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.IsPinned) as boolean;
}

/**
 * Get the Item
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return the item the rowKey is on
 */
export function getItem(rowKey: string, tableView: TableView): ClientItem {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.Item) as ClientItem;
}

/**
 * Get the itemIds
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return itemIds if row is Conversation, or itemId if row is Item
 */
export function getItemIds(rowKey: string, tableView: TableView): string[] {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.ItemIds) as string[];
}

/**
 * Get the LatestGlobalItemId
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return latest global item id
 */
export function getLatestGlobalItemId(rowKey: string, tableView: TableView): string {
    return getRowDataProperty(
        rowKey,
        tableView,
        MailRowDataPropertyType.LatestGlobalItemId
    ) as string;
}

/**
 * Get all the global item ids
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return all global item ids
 */
export function getGlobalItemIds(rowKey: string, tableView: TableView): string[] {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.GlobalItemIds) as string[];
}

/**
 * Gets the draft item ids
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return items ids of all drafts
 */
export function getDraftItemIds(rowKey: string, tableView: TableView): string[] {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.DraftItemIds) as string[];
}

/**
 * Get the executeSearchSortOrder of a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return the executeSearchSortOrder
 */
export function getExecuteSearchSortOrder(
    rowKey: string,
    tableView: TableView
): ExecuteSearchSortOrder {
    return getRowDataProperty(
        rowKey,
        tableView,
        MailRowDataPropertyType.ExecuteSearchSortOrder
    ) as ExecuteSearchSortOrder;
}

/**
 * Get the getUniqueSenders of a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return the getUniqueSenders
 */
export function getUniqueSenders(rowKey: string, tableView: TableView): string[] {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.UniqueSenders) as string[];
}

/**
 * Get the FlagType of a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return the FlagType object
 */
export function getFlagType(rowKey: string, tableView: TableView): FlagType {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.FlagType) as FlagType;
}

/**
 * Get the flag status of a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return the flag status
 */
export function getFlagStatus(rowKey: string, tableView: TableView): FlagStatus {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.FlagStatus) as FlagStatus;
}

/**
 * Get the effective mentioned of a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return whether there is a mention
 */
export function getEffectiveMentioned(rowKey: string, tableView: TableView): boolean {
    return getRowDataProperty(
        rowKey,
        tableView,
        MailRowDataPropertyType.EffectiveMentioned
    ) as boolean;
}

/**
 * Get the lastDeliveryOrRenewTimeStamp of a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return the lastDeliveryOrRenewTimeStamp
 */
export function getLastDeliveryOrRenewTimeStamp(rowKey: string, tableView: TableView): string {
    return getRowDataProperty(
        rowKey,
        tableView,
        MailRowDataPropertyType.LastDeliveryOrRenewTimeStamp
    ) as string;
}

/**
 * Get the lastModifiedTimeStamp of a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return the lastDeliveryOrRenewTimeStamp
 */
export function getLastModifiedTimeStamp(rowKey: string, tableView: TableView): string {
    return getRowDataProperty(
        rowKey,
        tableView,
        MailRowDataPropertyType.LastModifiedTimeStamp
    ) as string;
}

/**
 * Get the lastDeliveryTimeStamp of a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return the lastDeliveryTimeStamp
 */
export function getLastDeliveryTimeStamp(rowKey: string, tableView: TableView): string {
    return getRowDataProperty(
        rowKey,
        tableView,
        MailRowDataPropertyType.LastDeliveryTimeStamp
    ) as string;
}

/**
 * Get the subject of a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return the subject
 */
export function getSubject(rowKey: string, tableView: TableView): string {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.Subject) as string;
}

/**
 * Get the last sender mailbox of a row
 * @param rowKey key of the row data
 * @param tableView the table that contains the row data
 * @return the last sender mailbox of a row
 */
export function getLastSenderMailbox(rowKey: string, tableView: TableView): EmailAddressWrapper {
    return getRowDataProperty(
        rowKey,
        tableView,
        MailRowDataPropertyType.LastSenderMailbox
    ) as EmailAddressWrapper;
}

/**
 * Get the last sender smtp address of a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return the last sender smtp address of a row
 */
export function getLastSenderSMTP(rowKey: string, tableView: TableView): string {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.LastSenderSMTP) as string;
}

/**
 * Get the unread count of a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return the unread count
 */
export function getUnreadCount(rowKey: string, tableView: TableView): number {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.UnreadCount) as number;
}

/**
 * Get the size of a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return the unread count
 */
export function getSize(rowKey: string, tableView: TableView): number {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.Size) as number;
}

/**
 * Get the string type rowId of the row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return the row id string
 */
export function getRowIdString(rowKey: string, tableView: TableView): string {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.RowIdString) as string;
}

/**
 * Get the ClientItemId type rowId of the row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return the row client id
 */
export function getRowClientItemId(rowKey: string, tableView: TableView): ClientItemId {
    return getRowDataProperty(
        rowKey,
        tableView,
        MailRowDataPropertyType.RowClientItemId
    ) as ClientItemId;
}

/**
 * Get the ClientItemId type rowId of the row to be shown in reading pane.
 * For conversation view and message view, this returns the same result as getRowClientItemId.
 * For unstacked conversation, it returns rowId of item corresponding to selected coversation or item part
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return the row client id
 */
export function getRowIdToShowInReadingPane(rowKey: string, tableView: TableView): ClientItemId {
    return getRowDataProperty(
        rowKey,
        tableView,
        MailRowDataPropertyType.RowIdToShowInReadingPane
    ) as ClientItemId;
}

/**
 * Get the source folder id of the row data
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return the source folder id
 */
export function getParentFolderId(rowKey: string, tableView: TableView): string {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.ParentFolderId) as string;
}

/**
 * Get the size of a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return the 3S search result instrumentation context
 */
export function getInstrumentationContext(
    rowKey: string,
    tableView: TableView
): InstrumentationContext {
    return getRowDataProperty(
        rowKey,
        tableView,
        MailRowDataPropertyType.InstrumentationContext
    ) as InstrumentationContext;
}

/**
 * Get if an item is a draft
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return true if an item is a draft, false otherwise
 */
export let getIsDraft = function getIsDraft(rowKey: string, tableView: TableView): boolean {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.IsDraft) as boolean;
};

/**
 * Get if an item is submitted
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return true if an item is submitted, false otherwise
 */
export let getIsSubmitted = function getIsSubmitted(rowKey: string, tableView: TableView): boolean {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.IsSubmitted) as boolean;
};

/**
 * Get if an item is snoozed
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return true if an item is snoozed, false otherwise
 */
export function getIsSnoozed(rowKey: string, tableView: TableView): boolean {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.IsSnoozed) as boolean;
}

/**
 * Get valid coupon indexes for a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return indexes of valid coupons
 */
export function getValidCouponIndexes(rowKey: string, tableView: TableView): number[] {
    return getRowDataProperty(
        rowKey,
        tableView,
        MailRowDataPropertyType.ValidCouponIndexes
    ) as number[];
}

/**
 * Get importance for a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return importance of row
 */
export function getImportance(rowKey: string, tableView: TableView): string {
    return getRowDataProperty(rowKey, tableView, MailRowDataPropertyType.Importance) as string;
}

/**
 * Get archive tag for a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return archive tag of row
 */
export function getArchiveTag(rowKey: string, tableView: TableView): RetentionTagType {
    return getRowDataProperty(
        rowKey,
        tableView,
        MailRowDataPropertyType.ArchiveTag
    ) as RetentionTagType;
}

/**
 * Get policy tag for a row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @return policy tag of row
 */
export function getPolicyTag(rowKey: string, tableView: TableView): RetentionTagType {
    return getRowDataProperty(
        rowKey,
        tableView,
        MailRowDataPropertyType.PolicyTag
    ) as RetentionTagType;
}

/**
 * Get the specified property from the row
 * @param rowKey rowKey of row
 * @param tableView the table that contains the row data
 * @param propertyType to retrieve on the row data
 */
function getRowDataProperty(
    rowKey: string,
    tableView: TableView,
    propertyType: MailRowDataPropertyType
) {
    switch (tableView.tableQuery.listViewType) {
        case ReactListViewType.Conversation:
            return getConversationProperty(rowKey, tableView, propertyType);

        case ReactListViewType.Message:
            return getItemProperty(rowKey, tableView, propertyType);

        default:
            return null;
    }
}

/**
 * Get the specified property on the item
 * @param rowKey the rowKey of the conversation
 *  @param tableView the table that contains the row data
 * @param propertyType the MailRowDataPropertyType
 * @return the specified property on the conversation
 */
export function getConversationProperty(
    rowKey: string,
    tableView: TableView,
    propertyType: MailRowDataPropertyType
) {
    const tableConversationRelation = getTableConversationRelation(rowKey, tableView.id);

    if (!tableConversationRelation) {
        traceErrorString('ConversationNotInCache', propertyType);
        return null;
    }

    const conversationId = tableConversationRelation.id;
    const conversationItem = selectConversationById(conversationId);
    const conversationItemParts = mailStore.conversations.get(conversationId);
    let firstItem = undefined;
    if (
        conversationItemParts?.conversationNodeIds &&
        conversationItemParts.conversationNodeIds.length > 0
    ) {
        firstItem = getItemToShowFromNodeId(conversationItemParts.conversationNodeIds[0]);
    }

    switch (propertyType) {
        case MailRowDataPropertyType.RowIdString:
            return conversationId;

        case MailRowDataPropertyType.RowClientItemId:
            return conversationItem?.clientId;

        case MailRowDataPropertyType.RowIdToShowInReadingPane:
            if (shouldShowUnstackedReadingPane()) {
                const expandedConversationState = getListViewStore().expandedConversationViewState;
                let selectedNodeIds = null;

                // The expanded conversation could be different than the conversation for which the properties are being fetched.
                if (expandedConversationState.expandedRowKey == rowKey) {
                    selectedNodeIds = expandedConversationState.selectedNodeIds;
                }

                if (!selectedNodeIds || selectedNodeIds.length <= 0) {
                    // The conversation is not expanded or has no forks. Return rowId for item corresponding to latest local itempart.
                    return {
                        Id: tableConversationRelation.itemIds[0],
                        mailboxInfo: conversationItem?.clientId.mailboxInfo,
                    };
                }
                // When conversation is fully expanded in mail list and single item part is selected,
                // return rowId for selected itempart.
                if (selectedNodeIds.length == 1) {
                    return {
                        Id: getItemIdForMailList(selectedNodeIds[0], isFirstLevelExpanded(rowKey)),
                        mailboxInfo: conversationItem?.clientId.mailboxInfo,
                    };
                }
            }
            return conversationItem?.clientId;

        case MailRowDataPropertyType.ConversationId:
            return conversationId;

        case MailRowDataPropertyType.FlagType:
            return firstItem?.Flag;

        case MailRowDataPropertyType.FlagStatus:
            return tableConversationRelation.flagStatus;

        case MailRowDataPropertyType.IsPinned:
            return pinningUtils.getIsTableConversationRelationPinned(tableConversationRelation);

        case MailRowDataPropertyType.Item:
            return firstItem;

        case MailRowDataPropertyType.ItemIds:
            return tableConversationRelation.itemIds;

        case MailRowDataPropertyType.LatestGlobalItemId:
            return conversationItem.globalItemIds[0];

        case MailRowDataPropertyType.GlobalItemIds:
            return conversationItem.globalItemIds || [];

        case MailRowDataPropertyType.DraftItemIds:
            return tableConversationRelation.draftItemIds || [];

        case MailRowDataPropertyType.LastDeliveryOrRenewTimeStamp:
            return tableConversationRelation.lastDeliveryOrRenewTimeStamp;

        case MailRowDataPropertyType.LastDeliveryTimeStamp:
            return tableConversationRelation.lastDeliveryTimeStamp;

        case MailRowDataPropertyType.LastModifiedTimeStamp:
            return tableConversationRelation.lastModifiedTimeStamp;

        case MailRowDataPropertyType.UnreadCount:
            return tableConversationRelation.unreadCount;

        case MailRowDataPropertyType.LastSenderMailbox:
            return tableConversationRelation.lastSender?.Mailbox; // lastSender is undefined in rowModified notification payload, if the message is directly POSTed
        // lastSender is undefined in rowModified notification payload, if the message is directly POSTed

        case MailRowDataPropertyType.LastSenderSMTP:
            return (
                tableConversationRelation.lastSender && // lastSender is undefined in rowModified notification payload, if the message is directly POSTed
                tableConversationRelation.lastSender.Mailbox.EmailAddress
            );

        case MailRowDataPropertyType.ExecuteSearchSortOrder:
            return tableConversationRelation.executeSearchSortOrder;

        case MailRowDataPropertyType.ParentFolderId:
            if (tableView.tableQuery.type === TableQueryType.Search) {
                return tableConversationRelation.parentFolderId;
            } else {
                // Use tableView.tableQuery.folderId for non-search scenarios, because parentFolderId is not returned for findConversation
                return tableView.tableQuery.folderId;
            }

        case MailRowDataPropertyType.Subject:
            return (conversationItem as BaseItem).subject;

        case MailRowDataPropertyType.UniqueSenders:
            return tableConversationRelation.uniqueSenders;

        case MailRowDataPropertyType.Size:
            return conversationItem.size;

        case MailRowDataPropertyType.EffectiveMentioned:
            return tableConversationRelation.effectiveMentioned;

        case MailRowDataPropertyType.InstrumentationContext:
            return tableConversationRelation.instrumentationContext;

        case MailRowDataPropertyType.Categories:
            return tableConversationRelation.categories;

        case MailRowDataPropertyType.CanDelete:
            return conversationItemParts?.canDelete;

        case MailRowDataPropertyType.ValidCouponIndexes:
            return conversationItem.validCouponIndexes;

        case MailRowDataPropertyType.Importance:
            return tableConversationRelation.importance;

        case MailRowDataPropertyType.ArchiveTag:
            return firstItem?.ArchiveTag;

        case MailRowDataPropertyType.PolicyTag:
            return firstItem?.PolicyTag;

        case MailRowDataPropertyType.IsSnoozed:
            return getIsTableConversationRelationSnoozed(tableConversationRelation);

        case MailRowDataPropertyType.IsSubmitted:
        case MailRowDataPropertyType.IsDraft:
        default:
            return null;
    }
}

/**
 * Get the specified property on the item
 * @param itemRowKey the rowKey for the item
 * @param tableView the table that contains the row data
 * @param propertyType the MailRowDataPropertyType
 * @return the specified property on the item
 */
function getItemProperty(
    itemRowKey: string,
    tableView: TableView,
    propertyType: MailRowDataPropertyType
) {
    const itemRelation = getTableItemRelation(itemRowKey, tableView.id);
    if (!itemRelation) {
        traceErrorString('ItemNotInRelations', propertyType);
        return null;
    }

    const itemId = itemRelation.clientId;
    const item = mailStore.items.get(itemId.Id);

    if (!item) {
        traceErrorString('ItemNotInCache', propertyType);
        return null;
    }

    const message = isItemOfMessageType(item) ? (item as Message) : null;
    const lastSenderMailBox = message?.From?.Mailbox;

    switch (propertyType) {
        case MailRowDataPropertyType.RowIdString:
            return itemId.Id;

        case MailRowDataPropertyType.RowIdToShowInReadingPane:
        case MailRowDataPropertyType.RowClientItemId:
            //TODO: 22724 we need to use our own item type which has clientItemId instead of retrieving from tableItemRelation
            return itemId;

        case MailRowDataPropertyType.ConversationId:
            return message.ConversationId.Id;

        case MailRowDataPropertyType.FlagType:
            return item.Flag;

        case MailRowDataPropertyType.FlagStatus:
            // item.Flag could be undefined in search results
            return item.Flag ? item.Flag.FlagStatus : null;

        case MailRowDataPropertyType.IsPinned:
            return pinningUtils.getIsTableItemDataPinned(item);

        case MailRowDataPropertyType.Item:
            return item;

        case MailRowDataPropertyType.ItemIds:
            return [itemId.Id];

        case MailRowDataPropertyType.LatestGlobalItemId:
            return itemId.Id;

        case MailRowDataPropertyType.GlobalItemIds:
            return [itemId.Id];

        case MailRowDataPropertyType.LastDeliveryOrRenewTimeStamp:
            return item.ReceivedOrRenewTime;

        case MailRowDataPropertyType.LastDeliveryTimeStamp:
            return item.DateTimeReceived;

        case MailRowDataPropertyType.LastModifiedTimeStamp:
            return item.LastModifiedTime;

        case MailRowDataPropertyType.UnreadCount:
            // returns 1 if message exists and it's unread
            // returns 0 if message is read, or item is not Message type
            return message && !message.IsRead ? 1 : 0;

        case MailRowDataPropertyType.LastSenderMailbox:
            return lastSenderMailBox;

        case MailRowDataPropertyType.LastSenderSMTP:
            return lastSenderMailBox?.EmailAddress;

        case MailRowDataPropertyType.UniqueSenders:
            if (lastSenderMailBox) {
                return [lastSenderMailBox.Name];
            }
            return null;

        case MailRowDataPropertyType.ExecuteSearchSortOrder:
            // The SortOrderSource depends on each search table, so it should be accessed from item relation
            return itemRelation.executeSearchSortOrder;

        case MailRowDataPropertyType.ParentFolderId:
            return item.ParentFolderId.Id;

        case MailRowDataPropertyType.Subject:
            return item.Subject;

        case MailRowDataPropertyType.Size:
            return item.Size;
        case MailRowDataPropertyType.EffectiveMentioned:
            return item.MentionedMe;

        case MailRowDataPropertyType.IsDraft:
            return item.IsDraft;

        case MailRowDataPropertyType.DraftItemIds:
            return item.IsDraft ? [itemId.Id] : [];

        case MailRowDataPropertyType.IsSubmitted:
            return item.IsSubmitted;

        case MailRowDataPropertyType.InstrumentationContext:
            return itemRelation.instrumentationContext;

        case MailRowDataPropertyType.Categories:
            return item.Categories;

        case MailRowDataPropertyType.CanDelete:
            return item.CanDelete;

        case MailRowDataPropertyType.ValidCouponIndexes:
            return item.validCouponIndexes;

        case MailRowDataPropertyType.Importance:
            return item.Importance;

        case MailRowDataPropertyType.ArchiveTag:
            return item.ArchiveTag;

        case MailRowDataPropertyType.PolicyTag:
            return item.PolicyTag;

        case MailRowDataPropertyType.IsSnoozed:
            return getIsTableItemDataSnoozed(item);

        default:
            return null;
    }
}

function traceErrorString(error: string, propertyType: MailRowDataPropertyType) {
    const datapoint = returnTopExecutingActionDatapoint();
    let errorString = error + ' PropertyType:' + propertyType;
    if (datapoint) {
        errorString += ' Scenario:' + datapoint.eventName;
    }

    trace.warn(errorString);
    logUsage(error, { Scenario: datapoint?.eventName, propertyType });
}
export type { default as TableViewItemRelation } from '../store/schema/TableViewItemRelation';
export type { default as TableViewConversationRelation } from '../store/schema/TableViewConversationRelation';
