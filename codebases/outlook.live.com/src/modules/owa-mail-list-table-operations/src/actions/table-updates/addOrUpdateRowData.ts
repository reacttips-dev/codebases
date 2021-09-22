import addOrUpdateConversationData from './helpers/addOrUpdateConversationData';
import addOrUpdateItemData from './helpers/addOrUpdateItemData';
import type { MailListRowDataType, TableView } from 'owa-mail-list-store';
import type { ConversationType, ItemRow } from 'owa-graph-schema';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { action } from 'satcheljs/lib/legacy';

/**
 * Adds or updates the row in the tableView
 * This is called whenever a data is fetched from the server and is being stored. This is also called when
 * a rowAdd or rowModified notificaiton occurs
 * @param row to add or update
 * @param tableView to be loaded
 * @param doNotOverwriteData determines if updates should be written (default is false)
 * @param state the AddOrUpdateRowDataState
 */
export default action('addOrUpdateRowData')(function addOrUpdateRowData(
    row: MailListRowDataType,
    tableView: TableView,
    doNotOverwriteData: boolean = false
) {
    switch (tableView.tableQuery.listViewType) {
        case ReactListViewType.Conversation:
            addOrUpdateConversationData(row as ConversationType, tableView, doNotOverwriteData);
            break;

        case ReactListViewType.Message:
            addOrUpdateItemData(row as ItemRow, tableView);
            break;
    }
});
