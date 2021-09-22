import markConversationsAsReadFromTable from './markConversationsAsReadFromTable';
import markItemsAsReadFromTable from './markItemsAsReadFromTable';
import { toggleRowReadStateComplete } from 'owa-mail-actions/lib/mailTriageActions';
import { listViewStore, MailRowDataPropertyGetter } from 'owa-mail-list-store';
import type { ActionSource } from 'owa-analytics-types';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { action } from 'satcheljs/lib/legacy';

export default action('toggleRowReadState')(function toggleRowReadState(
    rowKey: string,
    tableViewId: string,
    actionSource: ActionSource
) {
    const tableView = listViewStore.tableViews.get(tableViewId);
    const isUnread = MailRowDataPropertyGetter.getUnreadCount(rowKey, tableView) > 0;

    switch (tableView.tableQuery.listViewType) {
        case ReactListViewType.Conversation:
            markConversationsAsReadFromTable(
                [rowKey],
                tableView,
                isUnread /* shouldMarkAsRead */,
                actionSource
            );
            break;

        case ReactListViewType.Message:
            markItemsAsReadFromTable(
                [rowKey],
                tableView,
                isUnread /* shouldMarkAsRead */,
                true /* isExplicit */,
                actionSource
            );
            break;
    }

    toggleRowReadStateComplete();
});
