import type { TableView } from 'owa-mail-list-store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setTableIsInCheckedMode',
    function setTableIsInCheckedMode(tableView: TableView, isInCheckedMode: boolean) {
        tableView.isInCheckedMode = isInCheckedMode;
    }
);
