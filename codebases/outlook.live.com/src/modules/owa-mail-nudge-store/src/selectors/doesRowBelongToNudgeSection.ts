import { default as isNudgedRow } from './isNudgedRow';
import { getIsPinnedTimestamp } from 'owa-mail-list-store';
import { isNudgeSupportedInTable } from '../utils/isNudgeSupported';

/**
 * Determines if the row should be shown in nudge section (not necessarily should be shown as nudged)
 * @param rowKey instanceKey for this row
 * @param tableViewId id of the tableView
 * @param lastDeliveryOrRenewTimeStamp last delivery or renew timestamp for this row
 */
export function doesRowBelongToNudgeSection(
    rowKey: string,
    tableViewId: string,
    lastDeliveryOrRenewTimeStamp: string
): boolean {
    // If row is not nudged return false;
    if (!isNudgedRow(rowKey, tableViewId)) {
        return false;
    }

    // If nudge is not supported in current table, return false
    if (!isNudgeSupportedInTable(tableViewId)) {
        return false;
    }

    // If row is nudged but pinned, return false.
    // As pinning gets more priority over nudge as its the user taken action
    if (getIsPinnedTimestamp(lastDeliveryOrRenewTimeStamp)) {
        return false;
    }

    // if row is nudged and not pinned, show it in nudge section
    return true;
}
