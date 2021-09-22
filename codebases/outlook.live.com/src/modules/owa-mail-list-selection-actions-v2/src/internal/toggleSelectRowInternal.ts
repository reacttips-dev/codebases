import setTableIsInCheckedMode from './mutators/setTableIsInCheckedMode';
import updateVirtualSelectAllExclusionList from './mutators/updateVirtualSelectAllExclusionList';
import type { TableView } from 'owa-mail-list-store';
import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import { setSelectionOnRow } from 'owa-mail-actions/lib/setSelectionOnRow';
import {
    endSelectMailItemDatapoint,
    addCustomDataToSelectMailItemDatapoint,
} from '../utils/selectMailItemDatapointUtils';

export default function toggleSelectRowInternal(
    tableView: TableView,
    rowKey: string,
    mailListItemSelectionSource: MailListItemSelectionSource
): void {
    const isCheckboxSelect =
        mailListItemSelectionSource === MailListItemSelectionSource.MailListItemCheckbox;
    const isTargetRowSelected = tableView.selectedRowKeys.has(rowKey);

    // If this was a checkbox select on an existing selected item and the table is not in checked mode,
    // just enter checked mode. No other selection state should change.
    if (isTargetRowSelected && !tableView.isInCheckedMode && isCheckboxSelect) {
        setTableIsInCheckedMode(tableView, true);
        return;
    }

    // Invalidate select mail item since there is no RP load if already in checked mode:
    if (tableView.isInCheckedMode) {
        endSelectMailItemDatapoint(true /* shouldInvalidate */);
    }

    // Add custom data to selectMailItem datapoint
    addCustomDataToSelectMailItemDatapoint(mailListItemSelectionSource, tableView, rowKey);

    // If the table currently has a single item selected (and non-checked) and we're clicking checkbox to select
    // another item, we want to unselect the existing selected item first.
    if (
        tableView.selectedRowKeys.size == 1 &&
        !tableView.isInCheckedMode &&
        !isTargetRowSelected &&
        isCheckboxSelect
    ) {
        setSelectionOnRow(
            [...tableView.selectedRowKeys.keys()][0],
            tableView.id,
            false /* shouldSelect */
        );
    }

    // Proceed with toggling selection on the target row
    const shouldSelect = !isTargetRowSelected;
    if (shouldSelect && !tableView.isInCheckedMode) {
        setTableIsInCheckedMode(tableView, true);
    }

    if (tableView.isInVirtualSelectAllMode) {
        updateVirtualSelectAllExclusionList(tableView, rowKey);
    } else {
        setSelectionOnRow(rowKey, tableView.id, shouldSelect /* shouldSelect */);
    }
}
