import type { TableView } from 'owa-mail-list-store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setFocusedRowKey',
    function setFocusedRowKey(tableView: TableView, focusedRowKey: string) {
        tableView.focusedRowKey = focusedRowKey;
    }
);
