import shouldTableSortByRenewTime from './shouldTableSortByRenewTime';
import {
    listViewStore,
    ListViewStore,
    TableViewConversationRelation,
    SortColumn,
    TableQuery,
    MailFolderTableQuery,
    MailListRowDataType,
    TableQueryType,
    TableView,
} from 'owa-mail-list-store';
import type ConversationType from 'owa-service/lib/contract/ConversationType';
import type Item from 'owa-service/lib/contract/Item';
import * as trace from 'owa-trace';
import type Message from 'owa-service/lib/contract/Message';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import getTableConversationRelation from 'owa-mail-list-store/lib/utils/getTableConversationRelation';
import { mailStore } from 'owa-mail-store';

export interface IsSortKeyEqualState {
    listViewStore: ListViewStore;
}

export default function isSortKeyEqual(row: MailListRowDataType, tableView: TableView) {
    let isSortKeyEqual = false;
    switch (tableView.tableQuery.listViewType) {
        case ReactListViewType.Conversation:
            isSortKeyEqual = isConversationSortKeyEqual(
                tableView.tableQuery,
                getTableConversationRelation(row.InstanceKey, tableView.id),
                row
            );
            break;

        case ReactListViewType.Message:
            isSortKeyEqual = isItemSortKeyEqual(
                tableView.tableQuery,
                row,
                mailStore.items.get((row as Item).ItemId.Id)
            );
            break;
    }

    return isSortKeyEqual;
}

export let isConversationSortKeyEqual = function isConversationSortKeyEqual(
    tableQuery: TableQuery,
    tableConversationRelation: TableViewConversationRelation,
    conversation: ConversationType,
    state: IsSortKeyEqualState = { listViewStore: listViewStore }
): boolean {
    if (!(tableQuery.type === TableQueryType.Folder || tableQuery.type === TableQueryType.Group)) {
        trace.errorThatWillCauseAlert(
            'isConversationSortKeyEqual should not be called on non MailFolderTableQuery type'
        );
        return false;
    }
    const sortBy = (tableQuery as MailFolderTableQuery).sortBy;
    if (!sortBy) {
        throw new Error('SortBy should not be null');
    }
    const isInstanceKeyEqual = tableConversationRelation.instanceKey === conversation.InstanceKey;
    const isDateTimeEqual = areConversationsDateTimeEqual(
        tableQuery,
        tableConversationRelation,
        conversation
    );
    if (!isInstanceKeyEqual || !isDateTimeEqual) {
        // if instanceKey or dateTime are not equal, return false
        return false;
    }
    const conversationItem = state.listViewStore.conversationItems.get(
        tableConversationRelation.id
    );
    switch (sortBy.sortColumn) {
        case SortColumn.Date:
        case SortColumn.From: // From can only change in drafts but drafts will always be in message view
            return true;
        case SortColumn.Importance:
            return conversationItem.subject === conversation.ConversationTopic;
        case SortColumn.Subject:
            return tableConversationRelation.importance === conversation.Importance;
        case SortColumn.Size:
            return conversationItem.size === conversation.Size;
        default:
            trace.trace.warn('isSortKeyEqual: sortColumn not supported ' + sortBy.sortColumn);
            return false;
    }
};

export function isItemSortKeyEqual(tableQuery: TableQuery, itemTarget: Item, itemReference: Item) {
    if (!(tableQuery.type == TableQueryType.Folder || tableQuery.type === TableQueryType.Group)) {
        trace.errorThatWillCauseAlert(
            'isItemSortKeyEqual should not be called on non MailFolderTableQuery type'
        );
        return false;
    }

    const sortBy = (tableQuery as MailFolderTableQuery).sortBy;
    if (!sortBy) {
        throw new Error('SortBy should not be null');
    }

    const isInstanceKeyEqual = itemTarget.InstanceKey === itemReference.InstanceKey;
    const isDateTimeEqual = areItemsDateTimeEqual(tableQuery, itemTarget, itemReference);
    if (!isInstanceKeyEqual || !isDateTimeEqual) {
        // if instanceKey or dateTime are not equal, return false
        return false;
    }
    switch (sortBy.sortColumn) {
        case SortColumn.Date: // Compare date time sortKey
            return true;
        case SortColumn.Importance:
            return itemTarget.Importance === itemReference.Importance;
        case SortColumn.Subject:
            return itemTarget.Subject === itemReference.Subject;
        case SortColumn.From:
            const itemTargetMessage = getItemAsMessage(itemTarget);
            const itemReferenceMessage = getItemAsMessage(itemReference);
            if (itemTargetMessage && itemReferenceMessage) {
                const itemTargetEmailAddress =
                    itemTargetMessage.From && itemTargetMessage.From.Mailbox.EmailAddress;
                const itemReferenceEmailAddress =
                    itemReferenceMessage.From && itemReferenceMessage.From.Mailbox.EmailAddress;
                return itemTargetEmailAddress === itemReferenceEmailAddress;
            } else {
                // it won't be the case that one is a message and other is not as the instance keys have already matched
                // so we return true for other item types
                return true;
            }

        case SortColumn.Size: // Size can change in case of drafts
            return itemTarget.Size === itemReference.Size;

        default:
            trace.trace.warn('isSortKeyEqual: sortColumn not supported ' + sortBy.sortColumn);
            return false;
    }
}

function getItemAsMessage(item: Item): Message {
    if (
        item.ItemClass.indexOf('IPM.Schedule.Meeting') !== -1 ||
        item.ItemClass.indexOf('IPM.Note') !== -1
    ) {
        return item as Message;
    }

    return null;
}

function areItemsDateTimeEqual(
    tableQuery: TableQuery,
    itemTarget: Item,
    itemReference: Item
): boolean {
    // Note: we need to convert the timestamp into date objects for comparison
    // because we've seen issues where the server may return the time in UTC format.
    // We should be resilient on the client against such issues.
    const isDateTimeReceivedEqual =
        new Date(itemTarget.DateTimeReceived).getTime() ===
        new Date(itemReference.DateTimeReceived).getTime();

    if (shouldTableSortByRenewTime(tableQuery)) {
        const isReceivedOrRenewTimeEqual =
            new Date(itemTarget.ReceivedOrRenewTime).getTime() ===
            new Date(itemReference.ReceivedOrRenewTime).getTime();

        // If table supports renew time the date time equality
        // is based on both primary (ReceivedOrRenewTime) and secondary (DateTimeReceived) sorts
        return isReceivedOrRenewTimeEqual && isDateTimeReceivedEqual;
    }

    return isDateTimeReceivedEqual;
}

function areConversationsDateTimeEqual(
    tableQuery: TableQuery,
    tableConversationRelation: TableViewConversationRelation,
    conversation: ConversationType
): boolean {
    // Note: we need to convert the timestamp into date objects for comparison
    // because we've seen issues where the server may return the time in UTC format.
    // We should be resilient on the client against such issues.
    const isDeliveryTimeEqual =
        new Date(tableConversationRelation.lastDeliveryTimeStamp).getTime() ===
        new Date(conversation.LastDeliveryTime).getTime();

    if (shouldTableSortByRenewTime(tableQuery)) {
        const isLastDeliveryOrRenewTimeEqual =
            new Date(tableConversationRelation.lastDeliveryOrRenewTimeStamp).getTime() ===
            new Date(conversation.LastDeliveryOrRenewTime).getTime();

        // If table supports renew time the date time equality
        // is based on both primary (LastDeliveryOrRenewTime) and secondary (LastDeliveryTime) sorts
        return isLastDeliveryOrRenewTimeEqual && isDeliveryTimeEqual;
    }

    return isDeliveryTimeEqual;
}
