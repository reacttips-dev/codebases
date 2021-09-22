import removeConversationData from './helpers/removeConversationData';
import removeItemData from './helpers/removeItemData';
import { setSelectionOnRow } from 'owa-mail-actions/lib/setSelectionOnRow';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { action } from 'satcheljs/lib/legacy';

export default action('removeRowData')(function removeRowData(
    rowKey: string,
    tableView: TableView
) {
    // 1. If the row being removed is selected, remove item from selected item ids.
    // This should be done before we delete tableRowRelationKey as this sets
    // isSelected property on it.
    if (tableView.selectedRowKeys.has(rowKey)) {
        setSelectionOnRow(rowKey, tableView.id, false /* shouldSelect */);
    }

    // 2. Remove the row data
    switch (tableView.tableQuery.listViewType) {
        case ReactListViewType.Conversation:
            removeConversationData(rowKey, tableView);
            break;

        case ReactListViewType.Message:
            removeItemData(rowKey, tableView);
            break;
    }
});
