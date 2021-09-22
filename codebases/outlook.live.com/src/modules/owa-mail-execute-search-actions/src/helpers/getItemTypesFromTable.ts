import type { TableView } from 'owa-mail-list-store';
import type ItemTypesFilter from 'owa-service/lib/contract/ItemTypesFilter';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';

/**
 * Get the itemType from search table view
 *
 * @param tableView the search table view
 */
export default function getItemTypesFromTable(tableView: TableView): ItemTypesFilter {
    switch (tableView.tableQuery.listViewType) {
        case ReactListViewType.Conversation:
            return 'MailConversations';

        case ReactListViewType.Message:
            return 'MailItems';

        default:
            // Not support other list view type
            return null;
    }
}
