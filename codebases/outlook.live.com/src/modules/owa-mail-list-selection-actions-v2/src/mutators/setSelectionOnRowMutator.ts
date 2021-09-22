import { mutator } from 'satcheljs';
import { setSelectionOnRow } from 'owa-mail-actions/lib/setSelectionOnRow';
import { getStore } from 'owa-mail-list-store/lib/store/Store';

export default mutator(setSelectionOnRow, actionMessage => {
    const { rowKey, tableViewId, shouldSelect } = actionMessage;
    const tableView = getStore().tableViews.get(tableViewId);

    if (shouldSelect) {
        tableView.selectedRowKeys.set(rowKey, true);
    } else {
        tableView.selectedRowKeys.delete(rowKey);
    }
});

export type { TableView } from 'owa-mail-list-store';
