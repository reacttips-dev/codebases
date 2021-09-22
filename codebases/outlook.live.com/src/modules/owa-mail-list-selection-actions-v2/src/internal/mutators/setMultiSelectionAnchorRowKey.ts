import type { TableView } from 'owa-mail-list-store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setMultiSelectionAnchorRowKey',
    function setMultiSelectionAnchorRowKey(
        tableView: TableView,
        newMultiSelectionAnchorRowKey: string
    ) {
        tableView.multiSelectionAnchorRowKey = newMultiSelectionAnchorRowKey;
    }
);
