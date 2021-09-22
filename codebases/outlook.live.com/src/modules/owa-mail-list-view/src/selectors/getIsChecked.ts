import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import { isBefore, userDate } from 'owa-datetime';

export default function getIsChecked(
    tableView: TableView,
    rowKey: string,
    lastDeliveryTimestamp: string
): boolean {
    if (!tableView) {
        return false;
    }

    if (tableView.isInVirtualSelectAllMode) {
        if (tableView.virtualSelectAllExclusionList.indexOf(rowKey) > -1) {
            return false;
        }

        // We use this timestamp to determine whether we are in virtual select all mode. So if we get a new item, it should not be a part of the selection, which is what the return below is checking
        if (tableView.selectAllModeTimeStamp) {
            return isBefore(userDate(lastDeliveryTimestamp), tableView.selectAllModeTimeStamp);
        }

        return true;
    }

    return tableView.isInCheckedMode && tableView.selectedRowKeys.has(rowKey);
}
