import type { TableView } from '../index';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';

// Determines whether in conversation view or not.
export default function isConversationView(tableView: TableView): boolean {
    return tableView.tableQuery.listViewType === ReactListViewType.Conversation;
}
