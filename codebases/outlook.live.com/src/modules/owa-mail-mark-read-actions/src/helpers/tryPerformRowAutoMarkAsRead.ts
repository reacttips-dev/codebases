import autoMarkConversationAsRead from './autoMarkConversationAsRead';
import autoMarkItemAsRead from './autoMarkItemAsRead';
import { MailRowDataPropertyGetter } from 'owa-mail-list-store';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';

/**
 * Auto mark row as read
 * @param rowKey the key of the row to be marked as read
 * @param tableView the table that row belongs to
 */
export default async function tryPerformRowAutoMarkAsRead(rowKey: string, tableView: TableView) {
    if (getUserConfiguration().UserOptions.PreviewMarkAsRead !== 'OnSelectionChange') {
        return;
    }

    //TODO use ClientItemId here: 23338
    const rowId = MailRowDataPropertyGetter.getRowIdString(rowKey, tableView);
    switch (tableView.tableQuery.listViewType) {
        case ReactListViewType.Conversation:
            if (shouldShowUnstackedReadingPane()) {
                const itemId = MailRowDataPropertyGetter.getRowIdToShowInReadingPane(
                    rowKey,
                    tableView
                )?.Id;
                await autoMarkItemAsRead(itemId, tableView, rowKey);
            } else {
                await autoMarkConversationAsRead(rowId, tableView);
            }
            break;
        case ReactListViewType.Message:
            await autoMarkItemAsRead(rowId, tableView);
            break;
    }
}
