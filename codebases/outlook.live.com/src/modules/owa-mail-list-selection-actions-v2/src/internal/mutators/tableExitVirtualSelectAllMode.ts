import type { TableView } from 'owa-mail-list-store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'tableExitVirtualSelectAllMode',
    function tableExitVirtualSelectAllMode(tableView: TableView) {
        tableView.isInVirtualSelectAllMode = false;
        tableView.virtualSelectAllExclusionList = [];
        tableView.selectAllModeTimeStamp = null;
    }
);
