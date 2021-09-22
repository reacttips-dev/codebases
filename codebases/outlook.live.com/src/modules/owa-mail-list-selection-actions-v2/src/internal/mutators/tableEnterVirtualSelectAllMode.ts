import type { TableView } from 'owa-mail-list-store';
import { mutatorAction } from 'satcheljs';
import { now } from 'owa-datetime';

export default mutatorAction(
    'tableEnterVirtualSelectAllMode',
    function tableEnterVirtualSelectAllMode(tableView: TableView) {
        tableView.selectAllModeTimeStamp = now();
        tableView.isInVirtualSelectAllMode = true;
    }
);
