import markConversationsAsReadBasedOnConversationIds from '../../helpers/markConversationsAsReadBasedOnConversationIds';
import { getRowIdsFromRowKeys, TableView } from 'owa-mail-list-store';
import type { ActionSource } from 'owa-analytics-types';
import { action } from 'satcheljs/lib/legacy';
import getInstrumentationContextsFromTableView from 'owa-mail-list-store/lib/utils/getInstrumentationContextsFromTableView';

/**
 * Mark the specified conversations as read or unread based on the isReadValue
 * @param rowKeys the rowKeys for conversations
 * @param tableView the tableView
 * @param isReadValue the isRead value to set
 * @param actionSource to trigger the action
 */
export default action('markConversationsAsReadFromTable')(function markConversationsAsReadFromTable(
    rowKeys: string[],
    tableView: TableView,
    isReadValue: boolean,
    actionSource: ActionSource
) {
    const conversationIds = getRowIdsFromRowKeys(rowKeys, tableView.id);
    const instrumentationContexts = getInstrumentationContextsFromTableView(rowKeys, tableView);
    return markConversationsAsReadBasedOnConversationIds(
        conversationIds,
        tableView,
        isReadValue,
        true /* isExplicit */,
        actionSource,
        instrumentationContexts,
        rowKeys
    );
});
