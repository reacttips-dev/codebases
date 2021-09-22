import type { TableView } from 'owa-mail-list-store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'updateVirtualSelectAllExclusionList',
    function updateVirtualSelectAllExclusionList(tableView: TableView, rowKey: string) {
        // Update row exclusion list in select all mode when a user selects/unselects any row.
        const rowIndex = tableView.virtualSelectAllExclusionList.indexOf(rowKey);
        if (rowIndex > -1) {
            tableView.virtualSelectAllExclusionList.splice(rowIndex, 1);
        } else {
            tableView.virtualSelectAllExclusionList.push(rowKey);
        }
    }
);
