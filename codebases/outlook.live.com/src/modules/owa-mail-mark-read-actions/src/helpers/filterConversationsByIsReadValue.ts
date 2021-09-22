import { getTableConversationRelation } from 'owa-mail-list-store';

/**
 * Filter the conversationRowKeys by existence and isRead value
 * @param conversationRowKeys the conversation rowKeys to filter for
 * @param tableViewId the id of table
 * @param isReadValue to set
 * @return the filtered conversation rowKeys
 */
export default function filterConversationsByIsReadValue(
    conversationRowKeys: string[],
    tableViewId: string,
    isReadValue: boolean
): string[] {
    const rowKeysToUpdate: string[] = [];
    conversationRowKeys.forEach(rowKey => {
        const tableViewConversationRelation = getTableConversationRelation(rowKey, tableViewId);
        // Only for the following two scenarios we want to skip the updates:
        // 1. No unread messages, and isReadValue is true, skip because conversation is already read.
        // 2. No message in conversation has been read and isReadValue is false, skip because conversation is already unread.
        if (tableViewConversationRelation) {
            const isFullyRead: boolean = tableViewConversationRelation.unreadCount == 0;
            const localItemIds = tableViewConversationRelation.itemIds;
            const maxPossibleUnreadCount = localItemIds.length;
            const isFullyUnread: boolean =
                tableViewConversationRelation.unreadCount == maxPossibleUnreadCount;
            if (!(isFullyRead && isReadValue) && !(isFullyUnread && !isReadValue)) {
                rowKeysToUpdate.push(rowKey);
            }
        }
    });

    return rowKeysToUpdate;
}
