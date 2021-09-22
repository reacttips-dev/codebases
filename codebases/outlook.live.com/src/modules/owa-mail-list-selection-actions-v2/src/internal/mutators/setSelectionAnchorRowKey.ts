import type { TableView } from 'owa-mail-list-store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setSelectionAnchorRowKey',
    function setSelectionAnchorRowKey(tableView: TableView, newSelectionAnchorRowKey: string) {
        tableView.selectionAnchorRowKey = newSelectionAnchorRowKey;
    }
);
